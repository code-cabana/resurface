import { cssJoin } from "../../util";
import styles from "./styles.module.css";

export function Row({ label, value, className, ...props }) {
  return (
    <div {...props} className={cssJoin(styles.row, className)}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export function Table({ rows, children, className, ...props }) {
  return (
    <div {...props} className={cssJoin(styles.table, className)}>
      {rows || children}
    </div>
  );
}
