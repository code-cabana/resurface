import { useEffect, useState } from "react";
import { Button, LinkButton } from "../button";
import { useAuth } from "../../hooks";
import { cssJoin } from "../../util";
import { resetPasswordPage } from "../../config";
import { Input as _Input, Checkbox as _Checkbox } from "../input";
import styles from "./styles.module.css";

export function AuthForm({ disabled }) {
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

  function onSubmit(event) {
    event.preventDefault();
    setError("");
    const handleError = (error) => {
      setError(error || "Incorrect email or password");
    };

    if (lcAction === "login") {
      login(email, password).catch(handleError);
    } else if (lcAction === "register") {
      register(email, password, firstName, lastName, emailOptIn).catch(
        handleError
      );
    }
  }

  useEffect(() => setError(""), [action]);

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
            <>
              <Input
                label="Email"
                type="email"
                value={email}
                setValue={setEmail}
                disabled={disabled}
              />
              <Input
                label="Password"
                type="password"
                value={password}
                setValue={setPassword}
                disabled={disabled}
              />
            </>
          ) : lcAction === "register" ? (
            <>
              <div className={styles.firstLast}>
                <Input
                  label="First name"
                  name="fname"
                  value={firstName}
                  setValue={setFirstName}
                  disabled={disabled}
                />
                <Input
                  label="Last name"
                  name="lname"
                  value={lastName}
                  setValue={setLastName}
                  disabled={disabled}
                />
              </div>
              <Input
                label="Email"
                type="email"
                value={email}
                setValue={setEmail}
                disabled={disabled}
              />
              <Input
                label="Password"
                type="password"
                value={password}
                setValue={setPassword}
                disabled={disabled}
              />
            </>
          ) : null}
        </div>
      </div>

      {error && <div className={styles.errorMessage}>{error.toString()}</div>}

      <div className={styles.footer}>
        {lcAction === "login" && (
          <div>
            <a
              href={resetPasswordPage}
              target="_blank"
              className={styles.resetPassword}
            >
              I forgot my password
            </a>
          </div>
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

function Input(props) {
  return <_Input className={styles.input} {...props} />;
}

function Checkbox(props) {
  return <_Checkbox className={styles.checkbox} {...props} />;
}
