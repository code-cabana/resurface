import { useSwellProduct } from "shared/hooks";
import { Button } from "shared/ui";
import { ButtonLink } from "../link";
import styles from "./styles.module.css";

export default function Pricing() {
  const { product } = useSwellProduct();
  const { price, currency, period: _period } = product || {};
  const period = _period === "monthly" ? "month" : "year";

  return (
    <>
      <h2>Pricing</h2>
      <div className={styles.pricing}>
        <div>
          <h3>Personal</h3>
          <div className={styles.price}>Free</div>
          <ul>
            <li>All features</li>
            <li>Personal use</li>
            <li>Watermark is displayed at the bottom of the editor window</li>
          </ul>
          <Button>Install now</Button>
        </div>
        <div>
          <h3>Business</h3>
          <div className={styles.price}>
            <span>
              ${price} {currency}
            </span>
            <span className={styles.subprice}>/ per {period}</span>
          </div>
          <ul>
            <li>All features</li>
            <li>Commercial use</li>
            <li>No watermark</li>
            <li>Cancel anytime</li>
          </ul>
          <ButtonLink label="Buy now" href="/subscribe" />
        </div>
      </div>
    </>
  );
}
