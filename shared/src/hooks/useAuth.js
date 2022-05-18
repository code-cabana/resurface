import swell from "swell-js";
import { getCurrentSession } from "../util";
import { createContext, useContext, useEffect, useState } from "react";
import isEqual from "lodash.isequal";
import {
  SWELL_STOREFRONT_ID,
  SWELL_STOREFRONT_PUBLIC_KEY,
  SWELL_PRODUCT_ID,
  SWELL_PLAN_ID,
  resetPasswordKeyPage,
} from "../config";

swell.init(SWELL_STOREFRONT_ID, SWELL_STOREFRONT_PUBLIC_KEY);
const AuthContext = createContext({});

const customerInitialState = {
  name: null,
  isLoggedIn: false,
  ownsResurface: false,
  checkoutUrl: null,
  paidSession: null,
  currentSession: {},
  sessions: [],
};

export function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(customerInitialState);
  const [loading, setLoading] = useState(false);

  // https://swell.store/docs/js/account#log-in
  function login(email, password) {
    return new Promise((resolve, reject) => {
      setLoading(true);
      swell.account
        .login(email, password)
        .then((response) => {
          if (!response) throw "Invalid email or password";
          return enhanceCustomerData(response);
        })
        .then((customer) => {
          setCustomer(customer);
          resolve(customer);
        })
        .catch(reject)
        .finally(() => setLoading(false));
    });
  }

  // https://swell.store/docs/js/account#create-an-account
  function register(email, password, first_name, last_name, email_optin) {
    return new Promise((resolve, reject) => {
      setLoading(true);
      swell.account
        .create({
          email,
          first_name,
          last_name,
          email_optin,
          password,
        })
        .then((response) => {
          if (!response) throw "Empty registration response";
          if (response.email?.message === "Already exists")
            throw "That email is already registered";
          if (response.email?.message) throw response.email.message;
          return enhanceCustomerData(response);
        })
        .then((customer) => {
          setCustomer(customer);
          resolve(customer);
        })
        .catch(reject)
        .finally(() => setLoading(false));
    });
  }

  // https://swell.store/docs/js/account#log-out
  function logout() {
    return new Promise((resolve) => {
      setLoading(true);
      swell.account
        .logout()
        .then(() => {
          setCustomer(customerInitialState);
          resolve(customerInitialState);
        })
        .finally(() => setLoading(false));
    });
  }

  // https://swell.store/docs/js/account#get-logged-in-account
  function refresh() {
    return new Promise((resolve) => {
      setLoading(true);
      swell.account
        .get()
        .then(enhanceCustomerData)
        .then((customer) => {
          setCustomer(customer);
          resolve(customer);
        })
        .catch(() => {
          logout(); // Ignore any errors and logout
          resolve();
        })
        .finally(() => setLoading(false));
    });
  }

  // https://swell.store/docs/js/account#send-a-password-reset-email
  function sendResetPasswordEmail({ email, resetUrl }) {
    return new Promise((resolve, reject) => {
      setLoading(true);
      swell.account
        .recover({
          email,
          reset_url: resetUrl || resetPasswordKeyPage,
        })
        .then(resolve)
        .catch(reject)
        .finally(() => setLoading(false));
    });
  }

  // https://swell.store/docs/js/account#reset-an-account-password
  function resetPassword({ password, resetKey }) {
    return new Promise((resolve, reject) => {
      setLoading(true);
      swell.account
        .recover({
          password,
          reset_key: resetKey,
        })
        .then(resolve)
        .catch(reject)
        .finally(() => setLoading(false));
    });
  }

  // Adds the current session to the customer's swell account metadata
  // https://swell.store/docs/js/account#update-the-account-metadata
  function addCurrentSession() {
    return new Promise((resolve, reject) => {
      const { swellId: foundSwellId, userAgent: foundUserAgent } =
        getCurrentSession();

      if (!foundSwellId || !foundUserAgent) throw "Invalid session";
      const newSession = { swellId: foundSwellId, userAgent: foundUserAgent };

      swell.account
        .update({
          metadata: {
            sessions: [newSession],
          },
        })
        .then(refresh)
        .then(resolve)
        .catch(reject);
    });
  }

  // Adds extra data to the customer object
  async function enhanceCustomerData(customerObj) {
    const { first_name, last_name, name, metadata } = customerObj || {};
    const { sessions } = metadata || {};
    const isLoggedIn = Boolean(customerObj);
    const promises =
      isLoggedIn &&
      (await Promise.allSettled([fetchOwnsResurface(), fetchCheckoutUrl()]));
    const ownsResurface = isLoggedIn ? promises[0].value : false;
    const checkoutUrl = isLoggedIn ? promises[1].value : null;
    const currentSession = getCurrentSession();
    const paidSession =
      ownsResurface &&
      sessions &&
      sessions.some((session) => isEqual(currentSession, session));
    return {
      name: first_name || last_name || name || null,
      isLoggedIn,
      ownsResurface,
      checkoutUrl,
      paidSession,
      currentSession,
      sessions,
    };
  }

  // Detemine if the logged in customer is subscribed to Resurface
  function fetchOwnsResurface() {
    return new Promise((resolve, reject) => {
      swell.subscriptions
        .list()
        .then((response) => {
          const ownsResurface = response.results?.some(
            ({ active, plan_id, product_id }) => {
              const productMatches = product_id === SWELL_PRODUCT_ID;
              const planMatches = plan_id === SWELL_PLAN_ID;

              return active && productMatches && planMatches;
            }
          );
          resolve(ownsResurface);
        })
        .catch((error) => {
          if (error.code === "UNAUTHORIZED") resolve();
          else reject(error);
        });
    });
  }

  // Fetch the checkout url for the logged in customer
  function fetchCheckoutUrl() {
    return new Promise((resolve, reject) => {
      const product_id = SWELL_PRODUCT_ID;
      const plan = SWELL_PLAN_ID;
      swell.cart
        .setItems([
          {
            product_id,
            quantity: 1,
            purchase_option: {
              type: "subscription",
              plan,
            },
          },
        ])
        .then((response) => {
          const checkoutUrl = response?.checkout_url;
          if (!checkoutUrl) throw "Invalid response from Swell";
          resolve(checkoutUrl);
        })
        .catch((error) => {
          reject(
            `Could not add product: ${product_id} plan: ${plan} to cart`,
            error
          );
        });
    });
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        customer,
        loading,
        login,
        register,
        logout,
        refresh,
        addCurrentSession,
        sendResetPasswordEmail,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Use customer authentication data
export function useAuth() {
  return useContext(AuthContext);
}
