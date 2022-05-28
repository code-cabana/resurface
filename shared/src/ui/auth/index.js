import {
  Email as _Email,
  Password as _Password,
  FirstName as _FirstName,
  LastName as _LastName,
  Checkbox as _Checkbox,
} from "../input";
import { useEffect, useState } from "react";
import { Button, LinkButton } from "../button";
import { useAuth } from "../../hooks";
import { cssJoin } from "../../util";
import { resetPasswordPage } from "../../config";
import styles from "./styles.module.css";

export function AuthForm({ resetPasswordLink: _resetPasswordLink, disabled }) {
  const [action, setAction] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [error, setError] = useState("");
  const lcAction = action.toLowerCase();
  const { login, register } = useAuth();

  function switchAction(event) {
    event.preventDefault();
    setAction((prevAction) =>
      prevAction === "Register" ? "Login" : "Register"
    );
  }

  function handleError(error) {
    console.error(error); // TODO logging
    setError(error || "Incorrect email or password");
  }

  function onSubmit(event) {
    event.preventDefault();
    setError("");

    if (lcAction === "login") {
      login(email, password).catch(handleError);
    } else if (lcAction === "register") {
      register(email, password, firstName, lastName, emailOptIn).catch(
        handleError
      );
    }
  }

  useEffect(() => setError(""), [action]);

  const emailAndPassword = (
    <>
      <Email required value={email} setValue={setEmail} disabled={disabled} />
      <Password
        required
        value={password}
        setValue={setPassword}
        disabled={disabled}
      />
    </>
  );

  const resetPasswordLink = _resetPasswordLink || (
    <a href={resetPasswordPage} target="_blank">
      I forgot my password
    </a>
  );

  return (
    <form
      className={cssJoin(styles.form, disabled && styles.disabled)}
      onSubmit={onSubmit}
    >
      <div className={styles.body}>
        <h2>{action}</h2>
        <p className={styles.switchAction}>
          {lcAction === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <LinkButton onClick={switchAction}>
            {lcAction === "login" ? "Register" : "Login"}
          </LinkButton>
        </p>
        <div className={styles.fields}>
          {lcAction === "login" ? (
            emailAndPassword
          ) : lcAction === "register" ? (
            <>
              <div className={styles.firstLast}>
                <FirstName
                  required
                  value={firstName}
                  setValue={setFirstName}
                  disabled={disabled}
                />
                <LastName
                  required
                  value={lastName}
                  setValue={setLastName}
                  disabled={disabled}
                />
              </div>
              {emailAndPassword}
            </>
          ) : null}
        </div>
      </div>

      {error && <div className={styles.errorMessage}>{error.toString()}</div>}

      <div className={styles.footer}>
        {lcAction === "login" && (
          <div className={styles.resetPassword}>{resetPasswordLink}</div>
        )}

        {lcAction === "register" && (
          <Checkbox
            label="Email me occasionally"
            labelPos="end"
            value={emailOptIn}
            setValue={setEmailOptIn}
            className={styles.checkbox}
          />
        )}
        <Button type="submit" className={styles.button}>
          {action}
        </Button>
      </div>
    </form>
  );
}

const Email = (args) => <_Email className={styles.input} {...args} />;
const Password = (args) => <_Password className={styles.input} {...args} />;
const FirstName = (args) => <_FirstName className={styles.input} {...args} />;
const LastName = (args) => <_LastName className={styles.input} {...args} />;
const Checkbox = (args) => <_Checkbox className={styles.checkbox} {...args} />;
