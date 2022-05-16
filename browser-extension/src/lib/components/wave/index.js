import styles from "./styles.module.css";

export default function Wave() {
  return (
    <div className={styles.ocean}>
      <div className={styles.wave} />
      <div className={styles.wave} />
    </div>
  );
}
