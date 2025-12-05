
import Hero from '@/components/Hero';
import ProductSection from '@/components/ProductSection';
import FeatureSection from '@/components/FeatureSection';
import Footer from '@/components/Footer';
import ProductsWithDescription from '@/components/ProductsWithDescription';


// --- MAIN PAGE ---
export default function Home() {
  return (
    <main className="min-h-screen bg-[#2b1b17] selection:bg-[#d4af37] selection:text-[#2b1b17]">
      <Hero />
      <ProductSection />
      <FeatureSection />
      <Footer />
    </main>
  );
}
