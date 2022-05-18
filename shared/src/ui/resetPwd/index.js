import { useState } from "react";
import { cssJoin } from "../../util";
import { useAuth } from "../../hooks";
import { Button } from "../button";
import { Email, Password } from "../input";
import styles from "./styles.module.css";

// Sends an email to the given email address with a link to reset the account password
export function SendResetPasswordEmailForm({ className }) {
  const [email, setEmail] = useState("");
  const { sendResetPasswordEmail } = useAuth();

  function onSubmit(event) {
    event.preventDefault();
    sendResetPasswordEmail({ email });
  }

  return (
    <form className={cssJoin(styles.form, className)} onSubmit={onSubmit}>
      <h1>Reset password</h1>
      <Email value={email} setValue={setEmail} />
      <Button label="Send email" type="submit" className={styles.button} />
    </form>
  );
}

// Resets the password for the account attached to a given reset_key
export function ResetPasswordForm({ resetKey, className }) {
  const [password, setPassword] = useState("");
  const { resetPassword } = useAuth();

  function onSubmit(event) {
    event.preventDefault();
    resetPassword({ password, resetKey });
  }

  return (
    <form className={cssJoin(styles.form, className)} onSubmit={onSubmit}>
      <h1>Change password</h1>
      <Password
        autoComplete="new-password"
        value={password}
        setValue={setPassword}
      />
      <Button label="Change password" type="submit" className={styles.button} />
    </form>
  );
}
