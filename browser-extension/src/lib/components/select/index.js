import styles from "./styles.module.css";

export function Select({ label, options = [], value, setValue }) {
  return (
    <div className={styles.select}>
      <div className={styles.label}>{label}</div>
      <select value={value} onChange={(event) => setValue(event.target.value)}>
        {options.map(({ label, value }, index) => {
          return (
            <option key={index} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
