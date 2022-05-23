import Hero from "../components/hero";
import HowDoesItWork from "../components/how";
import Features from "../components/features";
import Pricing from "../components/pricing";
import FAQ from "../components/faq";
import MainLayout from "../layouts/main";
import styles from "../styles/home.module.css";

export default function Home() {
  return (
    <MainLayout className={styles.layout}>
      <Hero />
      <HowDoesItWork />
      <Pricing />
      <Features />
      <FAQ />
    </MainLayout>
  );
}
