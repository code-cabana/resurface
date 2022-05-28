import { TextLink } from "../link";
import styles from "./styles.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <TextLink href="/privacy">Privacy Policy</TextLink>
      <div className={styles.cc}>
        <TextLink href="https://codecabana.com.au">Code Cabana</TextLink>
        <img src="/img/palm.png" width={24} />
      </div>
    </footer>
  );
}
