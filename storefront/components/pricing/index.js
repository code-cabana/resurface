import { useSwellProduct } from "shared/hooks";
import { ButtonLink } from "../link";
import { getPageRel } from "shared/config";
import styles from "./styles.module.css";

function Column({ title, price, points, cta }) {
  return (
    <div>
      <h3>{title}</h3>
      <div className={styles.price}>{price}</div>
      <ul>
        {points.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
      {cta}
    </div>
  );
}

export default function Pricing() {
  const { product } = useSwellProduct();
  const { price, currency, period: _period } = product || {};
  const period = _period === "monthly" ? "month" : "year";

  return (
    <>
      <h2>Pricing</h2>
      <div className={styles.pricing}>
        <Column
          title="Personal"
          price="Free"
          points={["All features", "Personal use", "Watermarked"]}
          cta={<ButtonLink label="Get Resurface" href={getPageRel} />}
        />
        <Column
          title="Business"
          price={
            <>
              <span>
                ${price} {currency}
              </span>
              <span className={styles.subprice}>/ per {period}</span>
            </>
          }
          points={[
            "All features",
            "Commercial use",
            "No watermark",
            "Cancel anytime",
          ]}
          cta={<ButtonLink label="Subscribe" href="/account" />}
        />
      </div>
    </>
  );
}
