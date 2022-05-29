import Img from "../img";
import { TextLink } from "../link";
import palmImg from "../../public/img/palm.png";
import styles from "./styles.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <TextLink href="/privacy">Privacy Policy</TextLink>
      <div className={styles.cc}>
        <TextLink href="https://codecabana.com.au">Code Cabana</TextLink>
        <Img
          src={palmImg}
          width={24}
          height={24}
          alt="palm tree"
          className={styles.img}
        />
      </div>
    </footer>
  );
}
