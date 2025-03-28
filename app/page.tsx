import Amenities from "@/components/Amenities";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <Amenities />
      <Gallery />
      <Testimonials />
      <ContactUs />
      <Footer />
    </div>
  );
}
