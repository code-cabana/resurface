import { cssJoin } from "../../util";
import styles from "./styles.module.css";

export function LoadingStripes({ overlay, children, className, ...props }) {
  return (
    <div
      className={cssJoin(
        styles.container,
        className,
        overlay && styles.overlay
      )}
      {...props}
    >
      {children}
      <div className={styles.bg} />
    </div>
  );
}
