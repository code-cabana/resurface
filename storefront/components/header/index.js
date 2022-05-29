import { LogoLink, TextLink, ButtonLink } from "../link";
import { useAuth } from "shared/hooks";
import { Button, LinkButton, LoadingStripes, Dropdown } from "shared/ui";
import { ReactSVG } from "react-svg";
import styles from "./styles.module.css";

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

function AuthArea() {
  const { loading, customer, logout } = useAuth();
  const { isLoggedIn, name } = customer || {};

  return (
    <div className={styles.authArea}>
      {loading ? (
        <LoadingStripes className={styles.stripes} />
      ) : isLoggedIn ? (
        <>
          <Dropdown
            button={
              <Button
                aria-label="my account menu"
                className={styles.dropdownButton}
              >
                <span>{name}</span>
                <ReactSVG src="/img/person.svg" className={styles.avatar} />
              </Button>
            }
            items={[
              {
                children: (
                  <TextLink
                    label="Account"
                    href="/account"
                    className={styles.item}
                  />
                ),
              },
              {
                children: (
                  <LinkButton onClick={logout} className={styles.item}>
                    Logout
                  </LinkButton>
                ),
              },
            ]}
            className={styles.dropdown}
          />
        </>
      ) : (
        <ButtonLink
          label="Login"
          href="/account"
          className={styles.loginButton}
        />
      )}
    </div>
  );
}
