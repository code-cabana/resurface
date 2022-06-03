import { useEffect, useState } from "react";
import { useAuth } from "shared/hooks";
import { cssJoin } from "shared/util";
import { Button, Checkbox, Email } from "shared/ui";
import { resetPasswordPageRel } from "shared/config";
import { Subscription } from "./subscription";
import { TextLink } from "../link";
import logger from "../../lib/logger";
import styles from "./styles.module.css";

export function Account() {
  return (
    <>
      <h2>Account</h2>
      <Customer />
      <hr className={styles.hr} />
      <h2>Subscription</h2>
      <Subscription />
    </>
  );
}

function Customer() {
  const { loading, customer, updateCustomer } = useAuth();
  const { email: _email = "", emailOptIn = true } = customer;
  const [email, setEmail] = useState(_email);
  const [optIn, setOptIn] = useState(emailOptIn);
  const [error, setError] = useState("");
  const [synced, setSynced] = useState(true);

  function resetFormState() {
    setEmail(_email);
    setOptIn(emailOptIn);
    setSynced(true);
  }

  function onSubmit(event) {
    event.preventDefault();
    updateCustomer({ email, optIn }).catch((error) => {
      logger.error(new Error(error));
      setError("Could not save details, please try again");
      setSynced(false);
    });
  }

  useEffect(() => setSynced(false), [email, optIn]);
  useEffect(resetFormState, [_email, emailOptIn]);

  return (
    <>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <form className={styles.form} onSubmit={onSubmit}>
        <Email required value={email} setValue={setEmail} />
        <Checkbox
          label="Email me occasionally"
          value={optIn}
          setValue={setOptIn}
        />
        <div className={styles.lastRow}>
          <TextLink
            label="Reset password"
            href={resetPasswordPageRel}
            className={styles.resetPass}
          />
          <Button
            type="submit"
            disabled={loading}
            className={cssJoin(styles.saveButton, synced && styles.synced)}
          >
            {loading ? "Saving..." : synced ? "Saved" : "Save"}
          </Button>
        </div>
      </form>
    </>
  );
}
