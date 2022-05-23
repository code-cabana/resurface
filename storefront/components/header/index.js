import { LogoLink, ButtonLink } from "../link";
import { useAuth } from "shared/hooks";
import { Button, LoadingStripes } from "shared/ui";
import styles from "./styles.module.css";

function AuthArea() {
  const { loading, customer, logout } = useAuth();
  const { isLoggedIn, name } = customer || {};

  return (
    <div className={styles.authArea}>
      {loading ? (
        <LoadingStripes />
      ) : isLoggedIn ? (
        <>
          <span className={styles.name}>Hi {name}</span>
          <Button onClick={logout}>Logout</Button>
        </>
      ) : (
        <ButtonLink label="Login" href="/account" />
      )}
    </div>
  );
}

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.navLinks}>
        <LogoLink />
      </div>
      <AuthArea />
    </header>
  );
}
