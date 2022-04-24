import Hero from "../components/hero";
import HowDoesItWork from "../components/how";
import Features from "../components/features";
import Pricing from "../components/pricing";
import FAQ from "../components/faq";
import MainLayout from "../layouts/main";

export default function Home() {
  return (
    <MainLayout>
      <Hero />
      <HowDoesItWork />
      <Features />
      <Pricing />
      <FAQ />
    </MainLayout>
  );
}
