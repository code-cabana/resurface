import { Row, Table, Button, Modal, LoadingStripes } from "shared/ui";
import { useAuth, useSwellSub } from "shared/hooks";
import styles from "./styles.module.css";

export function Subscription() {
  const { customer, refresh: refreshAuth } = useAuth();
  const { ownsResurface, checkoutUrl } = customer;

  const { loading, subscription, pause, unpause, cancel } = useSwellSub();
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

  function cancelSubscription() {
    cancel().finally(refreshAuth);
  }

  return (
    <div className={styles.container}>
      {loading && <LoadingStripes overlay />}
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
              <Modal
                heading="Terminate subscription"
                button={{
                  label: "Terminate subscription",
                  className: styles.terminate,
                }}
                content={({ closeModalAnd }) => (
                  <>
                    <p>Are you sure you want to terminate your subscription?</p>
                    <p>
                      If you change your mind later you will need to complete
                      another checkout process.
                      {!paused && (
                        <>
                          <br />
                          Pause your subscription (forever) instead to preserve
                          your subscription information.
                        </>
                      )}
                    </p>
                    <div className={styles.modalButtons}>
                      {!paused && (
                        <Button
                          label="Pause instead"
                          onClick={closeModalAnd(pause)}
                          className={styles.pause}
                        />
                      )}
                      <Button
                        label="Terminate"
                        onClick={closeModalAnd(cancelSubscription)}
                        className={styles.terminate}
                      />
                    </div>
                  </>
                )}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <p>You are not subscribed to Resurface ❌</p>
          <a href={checkoutUrl}>Continue to checkout</a>
        </>
      )}
    </div>
  );
}
