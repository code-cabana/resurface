import { cssJoin, isEmptyStr } from "../../util";
import { useState } from "react";
import { useAuth } from "../../hooks";
import { Button } from "../button";
import { Email, Password } from "../input";
import styles from "./styles.module.css";

// Sends an email to the given email address with a link to reset the account password
export function SendResetPasswordEmailForm({ className }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { sendResetPasswordEmail } = useAuth();

  function onSubmit(event) {
    event.preventDefault();
    setMessage("");
    sendResetPasswordEmail({ email })
      .then(() =>
        setMessage("A reset password email has been sent to your inbox")
      )
      .catch((error) => {
        console.error(error); // TODO logging
        setError("Resetting password failed, please try again later");
      });
  }

  return (
    <form className={cssJoin(styles.form, className)} onSubmit={onSubmit}>
      <h1>Reset password</h1>
      {message && <span className={styles.message}>{message}</span>}
      <Email required value={email} setValue={setEmail} />
      <Button label="Send email" type="submit" className={styles.button} />
    </form>
  );
}

// Resets the password for the account attached to a given reset_key
export function ResetPasswordForm({ resetKey, className }) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [succeeded, setSucceeded] = useState(false);
  const { resetPassword } = useAuth();

  function onSubmit(event) {
    event.preventDefault();
    if (isEmptyStr(password)) return setError("Please enter a new password");
    setError("");
    resetPassword({ password, resetKey })
      .then(() => {
        setMessage("Success. You have changed your password");
        setSucceeded(true);
      })
      .catch((error) => {
        console.error(error); // TODO logging
        setError(
          "Resetting password failed, please re-attempt with a new link"
        );
      });
  }

  return (
    <form className={cssJoin(styles.form, className)} onSubmit={onSubmit}>
      <h1>Change password</h1>
      {message && <span className={styles.message}>{message}</span>}
      {error && <span className={styles.errorMessage}>{error}</span>}
      {!succeeded && (
        <>
          <Password
            autoComplete="new-password"
            value={password}
            setValue={setPassword}
          />
          <Button
            label="Change password"
            type="submit"
            className={styles.button}
          />{" "}
        </>
      )}
    </form>
  );
}
