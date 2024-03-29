import Img from "../img";
import { Button } from "shared/ui";
import { useSwellProduct } from "shared/hooks";
import { getResurfaceLink } from "shared/config";
import { cssJoin } from "shared/util";
import styles from "./styles.module.css";

function Column({ title, href, price, points, cta, className }) {
  return (
    <>
      <a href={href} className={cssJoin(styles.column, className)}>
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
                {icon && (
                  <Img
                    src={`/img/${icon}.png`}
                    width={32}
                    height={32}
                    alt=""
                    className={styles.icon}
                  />
                )}
                {label}
              </li>
            );
          })}
        </ul>
        {cta}
      </a>
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
          href={getResurfaceLink}
          price="Free"
          points={[
            { icon: "check", label: "All features" },
            { icon: "scale", label: "Personal use" },
            { icon: "droplets", label: "Watermarked" },
          ]}
          cta={<Button label="Install now" className={styles.button} />}
          className={styles.personal}
        />
        <Column
          title="Business"
          href="/account"
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
          cta={<Button label="Subscribe" className={styles.button} />}
          className={styles.business}
        />
      </div>
    </>
  );
}
