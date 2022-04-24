import { cssJoin } from "../../util";
import styles from "./styles.module.css";

// Button that looks like a link
export function LinkButton({
  label,
  children,
  className,
  type = "button",
  ...args
}) {
  return (
    <button
      type={type}
      className={cssJoin(styles.linkButton, className)}
      {...args}
    >
      {label || children || "LinkButton"}
    </button>
  );
}

// Link that looks like a button
export function ButtonLink({ label, children, className, ...args }) {
  return (
    <a className={cssJoin(styles.buttonLink, className)} {...args}>
      {label || children || "ButtonLink"}
    </a>
  );
}

// Regular button
export function Button({
  label,
  children,
  className,
  type = "button",
  ...args
}) {
  return (
    <button type={type} className={cssJoin(styles.button, className)} {...args}>
      {label || children || "Button"}
    </button>
  );
}
