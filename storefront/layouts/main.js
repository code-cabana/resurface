import Header from "../components/header";
import Footer from "../components/footer";
import { cssJoin } from "shared/util";
import styles from "./styles.module.css";

export default function MainLayout({ className, children }) {
  return (
    <div className={cssJoin(styles.container, className)}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
