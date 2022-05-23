import Header from "../components/header";
import Footer from "../components/footer";

export default function MainLayout({ className, children }) {
  return (
    <div className={className}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
