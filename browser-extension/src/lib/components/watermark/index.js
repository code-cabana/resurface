import Wave from "../wave";
import { goToPage } from "../../util";
import { accountPage } from "shared/config";
import { ButtonLink, LinkButton } from "shared/ui";
import { useSwellProduct } from "shared/hooks";
import styles from "./styles.module.css";

export default function Watermark({ visible }) {
  const { loading, product } = useSwellProduct();
  const { price } = product || {};
  const style = visible
    ? { opacity: 1 }
    : { opacity: 0, "pointer-events": "none" };

  return (
    <div disabled={!visible} className={styles.container} style={style}>
      <span className={styles.text}>
        Please support Code Cabana to remove this watermark
      </span>
      <ButtonLink
        href={accountPage}
        target="_blank"
        disabled={!visible}
        className={styles.buyButton}
        style={style}
      >
        {loading ? "Buy Resurface" : `Buy Resurface now for $${price} USD`}
      </ButtonLink>
      <span className={styles.text}>
        Already subscribed?{" "}
        <LinkButton
          onClick={() => goToPage("assets/login.html")}
          disabled={!visible}
          className={styles.loginButton}
          style={style}
        >
          Login
        </LinkButton>
      </span>
      <Wave />
    </div>
  );
}
