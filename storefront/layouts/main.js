import Header from "../components/header";
import Footer from "../components/footer";
import { cssJoin } from "shared/util";
import styles from "./styles.module.css";
import Head from "next/head";

const defaultTitle = "Resurface by Code Cabana";
const defaultDescription =
  "Resurface is a browser extension that provides a sleek and improved code editor for Squarespace, Shopify, Wix and more!";

export default function MainLayout({
  title,
  description,
  noIndex,
  className,
  children,
}) {
  return (
    <>
      <Head>
        <title>{title || defaultTitle}</title>
        <meta name="description" content={description || defaultDescription} />
        {noIndex && <meta name="robots" content="noindex" />}
      </Head>
      <div className={cssJoin(styles.container, className)}>
        <div className={styles.body}>
          <Header />
          <main>{children}</main>
        </div>
        <Footer />
      </div>
    </>
  );
}
