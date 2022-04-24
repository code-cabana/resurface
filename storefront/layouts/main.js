import Header from "../components/header";
import Footer from "../components/footer";

export default function MainLayout({ children }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
