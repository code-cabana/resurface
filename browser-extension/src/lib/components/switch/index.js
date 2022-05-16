import { cssJoin } from "shared/util";
import styles from "./styles.module.css";

export function Switch({ label, description, value, setValue }) {
  const valid = !(!value && value !== false);
  return valid ? (
    <div className={styles.switchGroup}>
      <label className={styles.switch}>
        <input
          type="checkbox"
          checked={value}
          onChange={() => {
            setValue((oldValue) => !oldValue);
          }}
        />
        <span className={cssJoin(styles.slider, styles.round)}></span>
      </label>
      <span className={styles.label}>{label}</span>
      <p className={styles.description}>{description}</p>
    </div>
  ) : null;
}
