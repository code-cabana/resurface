import Link from "next/link";
import { cssJoin } from "shared/util";
import styles from "./styles.module.css";

// Internal link that looks like a button
export function ButtonLink({ label, href, className, ...args }) {
  return (
    <Link
      href={href}
      className={cssJoin(styles.buttonLink, className)}
      {...args}
    >
      {label}
    </Link>
  );
}

// Regular internal link
export function TextLink({ label, href, ...args }) {
  return (
    <Link href={href} {...args}>
      {label}
    </Link>
  );
}
