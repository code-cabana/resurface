import { forwardRef } from "react";
import { cssJoin } from "../../util";
import styles from "./styles.module.css";

// Button that looks like an avatar img
export function ImgButton({ img, className, ...rest }) {
  return (
    <button {...rest} className={cssJoin(styles.imgButton, className)}>
      <img {...img} />
    </button>
  );
}

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
export const ButtonLink = forwardRef(
  ({ label, children, className, ...args }, ref) => {
    return (
      <a className={cssJoin(styles.buttonLink, className)} {...args} ref={ref}>
        {label || children || "ButtonLink"}
      </a>
    );
  }
);

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
