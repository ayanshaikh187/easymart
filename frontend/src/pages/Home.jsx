import Categories from "../components/home/Categories";
import Features from "../components/home/Features";
import Hero from "../components/home/Hero";
import OfferSection from "../components/home/OfferSection";
import Navbar from "../components/layout/Navbar";
import Products from "../components/home/Products";
import BestSelling from "../components/home/BestSelling";
import OfferBanner from "../components/home/OfferBanner";
import Brands from "../components/home/BrandSection";
import Newsletter from "../components/home/Newsletter";
import Footer from "../components/home/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <Features />
      <OfferSection />
      <Products />
      <BestSelling />
      <OfferBanner />
      <Brands />
      <Newsletter />
      <Footer />
    </>
  );
}

export default Home;