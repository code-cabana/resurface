import { Row, Table, Button } from "shared/ui";
import { useAuth, useSwellSub } from "shared/hooks";
import styles from "./styles.module.css";

export function Subscription() {
  const { customer } = useAuth();
  const { ownsResurface, checkoutUrl } = customer;

  const { subscription, pause, unpause, cancel } = useSwellSub();
  const {
    active,
    status,
    paused,
    canceled,
    price,
    currency,
    interval,
    datePeriodEnd,
  } = subscription || {};

  const priceAsString =
    price && currency && interval && `$${price} ${currency} ${interval}`;

  return (
    <>
      {ownsResurface ? (
        <>
          <p>Your Resurface subscription is active ✔️</p>
          <Table className={styles.table}>
            <Row label="Status" value={status} />
            <Row label="Price" value={priceAsString} />
            <Row
              label={active ? "Next payment" : "Expires on"}
              value={datePeriodEnd}
            />
          </Table>
          {!canceled && (
            <div className={styles.buttons}>
              {paused ? (
                <Button onClick={unpause} className={styles.resume}>
                  Resume subscription
                </Button>
              ) : (
                <Button onClick={pause} className={styles.pause}>
                  Pause subscription
                </Button>
              )}
              <Button onClick={cancel} className={styles.terminate}>
                Terminate subscription
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          <p>You are not yet subscribed to Resurface ❌</p>
          <a href={checkoutUrl}>Continue to checkout</a>
        </>
      )}
    </>
  );
}
