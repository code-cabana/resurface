import { ButtonLink, TextLink } from "../link";
import { useAuth } from "shared/hooks";
import { Button } from "shared/ui";
import styles from "./styles.module.css";

function AuthArea() {
  const { loading, customer, logout } = useAuth();
  const { isLoggedIn, name } = customer || {};

  return (
    <div>
      {loading ? (
        "Loading"
      ) : isLoggedIn ? (
        <>
          <span>{name}</span>
          <Button onClick={logout}>Logout</Button>
        </>
      ) : (
        <span>Not logged in</span>
      )}
    </div>
  );
}

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.navLinks}>
        <TextLink href="/" label="Home" />
        <ButtonLink label="Subscribe" href="/subscribe" />
      </div>
      <AuthArea />
    </header>
  );
}
