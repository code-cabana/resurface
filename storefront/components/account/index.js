import { useEffect, useState } from "react";
import { useAuth } from "shared/hooks";
import { Button, Checkbox, Email, FirstName, LastName } from "shared/ui";
import { resetPasswordPageRel } from "shared/config";
import { Subscription } from "./subscription";
import { TextLink } from "../link";
import styles from "./styles.module.css";

export function Account() {
  return (
    <>
      <h2>Account</h2>
      <Customer />
      <h2>Subscription</h2>
      <Subscription />
    </>
  );
}

function Customer() {
  const { customer, updateCustomer } = useAuth();
  const { email: _email = "", emailOptIn = true } = customer;
  const [email, setEmail] = useState(_email);
  const [optIn, setOptIn] = useState(emailOptIn);

  function resetFormState() {
    setEmail(_email);
    setOptIn(emailOptIn);
  }

  function onSubmit(event) {
    event.preventDefault();
    updateCustomer({ email, optIn });
  }

  useEffect(resetFormState, [_email, emailOptIn]);

  return (
    <>
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
          <Button type="submit">Save</Button>
        </div>
      </form>
    </>
  );
}
