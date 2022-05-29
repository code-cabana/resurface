import Link from "next/link";
import Img from "../img";
import logoImg from "../../public/img/logo.png";
import { ButtonLink as _ButtonLink } from "shared/ui";
import { cssJoin } from "shared/util";
import styles from "./styles.module.css";

// Regular internal link
export function TextLink({ label, href, children, className, ...args }) {
  return (
    <Link href={href} passHref>
      <a className={cssJoin(styles.textLink, className)} {...args}>
        {label || children}
      </a>
    </Link>
  );
}

// Link that looks like a button
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
        <Img
          src={logoImg}
          width={128}
          height={128}
          alt="Resurface"
          className={styles.img}
        />
      </a>
    </Link>
  );
}
