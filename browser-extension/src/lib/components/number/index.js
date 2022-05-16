import styles from "./styles.module.css";

export default function NumberInput({ label, value, setValue }) {
  return (
    <label className={styles.number}>
      {label}
      <input
        type="number"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </label>
  );
}

export function NumberGroup({ label, description, children }) {
  return (
    <div className={styles.numberGroup}>
      <div>
        <span className={styles.label}>{label}</span>
        <p className={styles.description}>{description}</p>
      </div>
      {children}
    </div>
  );
}
