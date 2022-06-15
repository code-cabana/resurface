import { Row, Table, Button, Modal, LoadingStripes } from "shared/ui";
import { useAuth, useSwellSub } from "shared/hooks";
import { DateTime } from "luxon";
import capitalize from "lodash.capitalize";
import styles from "./styles.module.css";

export function Subscription() {
  const { customer, refresh: refreshAuth } = useAuth();
  const { ownsResurface, isVip, checkoutUrl } = customer;
  const { loading, subscription, pause, unpause, cancel } = useSwellSub();
  const {
    active,
    status,
    paused,
    canceled,
    grandTotal,
    currency,
    interval,
    datePeriodEnd,
  } = subscription || {};

  const priceAsString = paused
    ? "N/A"
    : grandTotal &&
      currency &&
      interval &&
      `$${grandTotal} ${currency} ${interval}`;

  function cancelSubscription() {
    cancel().finally(refreshAuth);
  }

  return (
    <div className={styles.container}>
      {loading && <LoadingStripes overlay />}
      {ownsResurface ? (
        <>
          <div className={styles.blurb}>
            {paused ? (
              <>
                <p>Your Resurface subscription is paused 🏝️</p>
                <p>Watermark will appear after expiry date</p>
              </>
            ) : (
              <p>Your Resurface subscription is active ✔️</p>
            )}
          </div>
          <Table className={styles.table}>
            <Row label="Status" value={capitalize(status)} />
            <Row label="Price" value={priceAsString} />
            <Row
              label={active && !paused ? "Next payment" : "Expires on"}
              value={DateTime.fromISO(datePeriodEnd).toLocaleString(
                DateTime.DATE_MED
              )}
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
      ) : isVip ? (
        <>
          <div>You&apos;re a VIP 😎</div>
          <p>
            No watermark will appear in Resurface editors, and subscription is
            not necessary ✔️
          </p>
        </>
      ) : (
        <>
          <p>You&apos;re not subscribed to Resurface ❌</p>
          <a href={checkoutUrl}>Continue to checkout</a>
        </>
      )}
    </div>
  );
}
