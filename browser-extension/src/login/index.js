import {
  Button,
  ButtonLink,
  AuthForm,
  LoadingStripes,
  Checkbox,
} from "shared/ui";
import { useEffect } from "preact/hooks";
import { useAuth } from "shared/hooks";
import { homePage, accountPage } from "shared/config";
import { sentryInit, sentryError } from "../lib/sentry";
import { getPath } from "../lib/util";
import renderWithProviders from "../lib/render/page";
import styles from "./styles.module.css";

sentryInit();

function LoginPage() {
  const { customer } = useAuth();
  const { isLoggedIn } = customer || {};
  return isLoggedIn ? <Authenticated /> : <UnAuthenticated />;
}

function UnAuthenticated() {
  const { loading } = useAuth();
  return (
    <div className={styles.unAuthenticated}>
      <div className={styles.container}>
        {loading && <LoadingStripes overlay />}
        <AuthForm logger={{ error: sentryError }} disabled={loading} />
      </div>
    </div>
  );
}

function Authenticated() {
  const { loading } = useAuth();
  const { customer, logout, addCurrentSession } = useAuth();
  const { name, ownsResurface, isVip, paidSession, checkoutUrl } = customer;
  useEffect(addCurrentSession, []);

  return (
    <div className={styles.authenticated}>
      {loading && <LoadingStripes overlay />}

      <div className={styles.header}>
        <a href={homePage} target="_blank">
          <img
            src={getPath("/assets/resurface-logo-128-dark-transparent.png")}
            alt="Resurface"
            className={styles.logo}
          />
        </a>
        <Button onClick={logout} className={styles.logout}>
          Logout
        </Button>
      </div>

      <p>
        Hey {name} 👋
        {(ownsResurface || isVip) && (
          <>
            <br />
            {isVip
              ? "You're a VIP 😎"
              : "Thank you for subscribing to Resurface!"}
          </>
        )}
      </p>
      {!ownsResurface && !isVip && (
        <p>
          You aren't subscribed to Resurface yet.
          <br />
          Subscribe now to remove the watermark that appears in Resurface
          editors.
        </p>
      )}

      {ownsResurface || isVip ? (
        paidSession ? (
          <p className={styles.paidSession}>Watermark is hidden ✔️</p>
        ) : (
          <p>Watermark is visible</p>
        )
      ) : null}

      <div className={styles.buttons}>
        {(ownsResurface || isVip) && !paidSession && (
          <Button onClick={addCurrentSession}>Disable editor watermark</Button>
        )}
        {!ownsResurface && !isVip && (
          <ButtonLink href={checkoutUrl} target="_blank">
            Subscribe to Resurface
          </ButtonLink>
        )}
        <ButtonLink href={accountPage} target="_blank">
          {ownsResurface ? "Manage your subscription" : "Manage your account"}
        </ButtonLink>
      </div>
    </div>
  );
}

renderWithProviders(LoginPage, "login");
