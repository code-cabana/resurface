import { cssJoin } from "../../util";
import styles from "./styles.module.css";

export function LoadingStripes({ overlay, children, ...props }) {
  return (
    <div
      className={cssJoin(styles.container, overlay && styles.overlay)}
      {...props}
    >
      {children}
      <div className={styles.bg} />
    </div>
  );
}
