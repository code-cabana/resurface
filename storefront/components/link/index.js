import Link from "next/link";
import { ButtonLink as _ButtonLink } from "shared/ui";
import { cssJoin } from "shared/util";
import styles from "./styles.module.css";

// Regular internal link
export function TextLink({ label, href, className, ...args }) {
  return (
    <Link href={href} className={cssJoin(styles.textLink, className)} {...args}>
      {label}
    </Link>
  );
}

export function ButtonLink({ href, className, ...args }) {
  return (
    <Link href={href} passHref>
      <_ButtonLink
        {...args}
        className={cssJoin(styles.buttonLink, className)}
      />
    </Link>
  );
}

export function LogoLink({ href = "/", className, ...args }) {
  return (
    <Link href={href}>
      <a className={cssJoin(styles.logo, className)} {...args}>
        <img src="/logo.png" alt="Resurface" />
      </a>
    </Link>
  );
}
