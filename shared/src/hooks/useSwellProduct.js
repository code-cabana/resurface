import swell from "swell-js";
import { createContext, useContext, useEffect, useState } from "react";
import {
  defaultDescription,
  SWELL_STOREFRONT_ID,
  SWELL_STOREFRONT_PUBLIC_KEY,
  SWELL_PRODUCT_ID,
} from "../config";

swell.init(SWELL_STOREFRONT_ID, SWELL_STOREFRONT_PUBLIC_KEY);

const SwellProductContext = createContext({});

const initialState = {
  name: "Resurface",
  description: defaultDescription,
  price: 5,
  currency: "USD",
  period: "monthly",
};

export function SwellProductProvider({ logger = {}, children }) {
  const [product, setProduct] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // Refetch and update state
  function refresh() {
    setLoading(true);
    fetchProductDetails()
      .then(setProduct)
      .catch(logger.error)
      .finally(() => setLoading(false));
  }

  // Fetch the price and period
  function fetchProductDetails() {
    return new Promise((resolve, reject) => {
      const productId = SWELL_PRODUCT_ID;
      swell.products
        .get()
        .then((response) => {
          const { name, description, currency, purchase_options } =
            response?.results[0] || {};
          const plan = purchase_options?.subscription?.plans?.[0];
          const { price } = plan || {};
          const period = plan?.billing_schedule?.interval;
          resolve({ name, description, price, currency, period });
        })
        .catch((error) => {
          reject(
            new Error(
              `Could not fetch product: ${productId} details. ${error.toString()}`
            )
          );
        });
    });
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SwellProductContext.Provider value={{ product, loading, refresh }}>
      {children}
    </SwellProductContext.Provider>
  );
}

// Use swell product data
export function useSwellProduct() {
  return useContext(SwellProductContext);
}
