import Wave from "../wave";
import { goToPage } from "../../util";
import { accountPage } from "shared/config";
import { ButtonLink, LinkButton } from "shared/ui";
import { useSwellProduct } from "shared/hooks";
import styles from "./styles.module.css";

export default function Watermark({ opacity }) {
  const { loading, product } = useSwellProduct();
  const { price } = product || {};

  return (
    <div className={styles.container} style={{ opacity }}>
      <span className={styles.text}>
        Please support Code Cabana to remove this watermark
      </span>
      <ButtonLink
        href={accountPage}
        target="_blank"
        className={styles.buyButton}
      >
        {loading ? "Buy Resurface" : `Buy Resurface now for $${price} USD`}
      </ButtonLink>
      <span className={styles.text}>
        Already subscribed?{" "}
        <LinkButton
          onClick={() => goToPage("assets/login.html")}
          className={styles.loginButton}
        >
          Login
        </LinkButton>
      </span>
      <Wave />
    </div>
  );
}
