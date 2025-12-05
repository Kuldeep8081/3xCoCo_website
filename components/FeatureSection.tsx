'use client';
import { Star, } from 'lucide-react';

const FeatureSection = () => {
  return (
    <section className="py-24 bg-[#241714] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {[
          { title: "Ethically Sourced", desc: "100% fair trade cocoa beans." },
          { title: "Master Craftsmanship", desc: "Handmade by Belgian artisans." },
          { title: "Eco-Friendly", desc: "Sustainable luxury packaging." }
        ].map((item, i) => (
          <div
            key={i}
            className="space-y-4 p-6 border border-white/5 hover:border-[#d4af37]/30 transition-colors duration-300"
          >
            <Star className="w-6 h-6 text-[#d4af37] mx-auto" />
            <h4 className="text-[#f5e6d3] font-serif text-lg">{item.title}</h4>
            <p className="text-[#8c7e7a] text-sm font-light">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;