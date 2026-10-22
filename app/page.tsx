import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Offerings from "@/components/Offerings";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MobileActionBar from "@/components/MobileActionBar";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const catalog = await getCatalog();
  const eggs = catalog.products.find(
    (product) => product.id === "eggs-crate" && product.visible,
  );

  return (
    <>
      <Header />
      <main id="main">
        <Hero eggs={eggs} />
        <Offerings
          products={catalog.products}
          notice={catalog.notice}
          updatedAt={catalog.updatedAt}
        />
        <About />
        <Contact />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
