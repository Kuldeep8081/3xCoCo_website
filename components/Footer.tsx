'use client';
const Footer = () => {
  return (
    <footer className="bg-[#1a100e] py-16 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center space-y-8">
        <div className="text-2xl font-serif text-[#d4af37] tracking-widest">
          3XCoCo
        </div>
        <p className="text-[#8c7e7a] text-sm max-w-md leading-relaxed">
          Crafting moments of pure bliss since 2025. Experience the darkness, taste the light.
        </p>
        <p className="text-[#8c7e7a] text-xs pt-8">
          © {new Date().getFullYear()} 3XCoCo Chocolatiers. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
export default Footer;