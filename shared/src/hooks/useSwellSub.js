import swell from "swell-js";
import { createContext, useContext, useEffect, useState } from "react";
import {
  SWELL_PRODUCT_ID,
  SWELL_STOREFRONT_ID,
  SWELL_STOREFRONT_PUBLIC_KEY,
} from "../config";
import { useAuth } from "./useAuth";

swell.init(SWELL_STOREFRONT_ID, SWELL_STOREFRONT_PUBLIC_KEY);

const SwellSubContext = createContext({});

export function SwellSubProvider({ logger = {}, children }) {
  const { customer } = useAuth();
  const { isLoggedIn } = customer;
  const [subscription, setSubscription] = useState([]);
  const [loading, setLoading] = useState(false);

  // Refetch and update state
  function refresh() {
    setLoading(true);
    fetchSubscription()
      .then(setSubscription)
      .catch(logger.error)
      .finally(() => setLoading(false));
  }

  function fetchSubscription() {
    return new Promise((resolve, reject) => {
      swell.subscriptions
        .list()
        .then((response) => {
          const foundSub = response?.results?.find(
            (sub) => sub.product_id === SWELL_PRODUCT_ID
          );
          const {
            id,
            plan_id: planId,
            active,
            status,
            paused,
            canceled,
            price,
            grand_total: grandTotal,
            currency,
            paid,
            unpaid,
            interval,
            date_period_end: datePeriodEnd,
          } = foundSub || {};

          resolve({
            id,
            planId,
            active,
            status,
            paused,
            canceled,
            paid,
            unpaid,
            grandTotal: grandTotal || price,
            currency,
            interval,
            datePeriodEnd,
          });
        })
        .catch(reject);
    });
  }

  function updateSubscription(subscriptionId, data) {
    return new Promise((resolve, reject) => {
      setLoading(true);
      swell.subscriptions
        .update(subscriptionId, data)
        .then(refresh)
        .then(resolve)
        .catch(reject);
    });
  }

  function pause() {
    if (!subscription?.id) return;
    return updateSubscription(subscription.id, { paused: true });
  }

  function unpause() {
    if (!subscription?.id) return;
    return updateSubscription(subscription.id, { paused: false });
  }

  function cancel() {
    if (!subscription?.id) return;
    return updateSubscription(subscription.id, { canceled: true });
  }

  useEffect(() => {
    if (!isLoggedIn) return;
    refresh();
  }, [isLoggedIn]);

  return (
    <SwellSubContext.Provider
      value={{ subscription, loading, refresh, pause, unpause, cancel }}
    >
      {children}
    </SwellSubContext.Provider>
  );
}

// Use swell subscriptions data
export function useSwellSub() {
  return useContext(SwellSubContext);
}
