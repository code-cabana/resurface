import { useSwellProduct } from "shared/hooks";
import { ButtonLink } from "../link";
import { getResurfaceLink } from "shared/config";
import { cssJoin } from "shared/util";
import styles from "./styles.module.css";

function Column({ title, price, points, cta, className }) {
  return (
    <>
      <div className={cssJoin(styles.column, className)}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <div className={styles.price}>{price}</div>
        </div>
        <ul>
          {points.map((point, index) => {
            const { label, icon } =
              (typeof point === "string" ? { label: point } : point) || {};
            return (
              <li key={index} className={styles.point}>
                {icon && <img src={`/img/${icon}.png`} />}
                {label}
              </li>
            );
          })}
        </ul>
        {cta}
      </div>
    </>
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
          points={[
            { icon: "check", label: "All features" },
            { icon: "scale", label: "Personal use" },
            { icon: "droplets", label: "Watermarked" },
          ]}
          cta={
            <ButtonLink
              label="Install now"
              href={getResurfaceLink}
              className={styles.button}
            />
          }
          className={styles.personal}
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
            { icon: "check", label: "All features" },
            { icon: "scale", label: "Business use" },
            { icon: "droplets", label: "No watermark" },
            { icon: "bye", label: "Cancel anytime" },
          ]}
          cta={
            <ButtonLink
              label="Subscribe"
              href="/account"
              className={styles.button}
            />
          }
          className={styles.business}
        />
      </div>
    </>
  );
}
