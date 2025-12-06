'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, User, } from 'lucide-react';
import Link from 'next/link';

// --- COMPONENTS ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 w-full z-50 bg-[#2b1b17]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-serif text-[#d4af37] tracking-widest cursor-pointer">
          <Link href="/">3XCoCo</Link>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-[#f5e6d3] font-light tracking-wide text-sm md:items-center ">
          <a href="#" className="hover:text-[#d4af37] transition-colors">SHOP</a>
          <a href="collections" className="hover:text-[#d4af37] transition-colors">COLLECTIONS</a>
          <a href="#" className="hover:text-[#d4af37] transition-colors">OUR STORY</a>
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#1a100e] border border-white/10 rounded-full px-4 py-1 text-sm text-[#f5e6d3] placeholder-[#8c7e7a] focus:outline-none focus:border-[#d4af37]"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#8c7e7a] cursor-pointer">
              🔍
            </div>
          </div>
          <a href="#" className="hover:text-[#d4af37] transition-colors">ORDERS</a>
        </div>

        <div className="flex items-center space-x-6 text-[#f5e6d3]">
            <div className='flex gap-7'>
                <div className="relative flex items-center gap-2  cursor-pointer hover:text-[#d4af37] transition-colors">
                <ShoppingCart className="relative w-5 h-5" />
                <p className="absolute -top-2 left-3 text-sm bg-black text-red-600 border rounded-full h-4 w-4 text-center -z-10 ">1</p>
                </div>
                <div className=" cursor-pointer hover:text-[#d4af37] transition-colors">
                    <User className="w-6 h-6" />
                </div>
            </div>
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#2b1b17] border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col items-start py-8 space-y-6 ml-4 text-[#f5e6d3]">
              <a href="#" className="text-lg tracking-widest hover:text-[#d4af37] transition-colors">SHOP</a>
              <a href="collections" className="text-lg tracking-widest hover:text-[#d4af37] transition-colors">COLLECTIONS</a>
              <a href="#" className="text-lg tracking-widest hover:text-[#d4af37] transition-colors">OUR STORY</a>
              <a href="#" className="text-lg tracking-widest hover:text-[#d4af37] transition-colors">ORDERS</a>
              <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#1a100e] border border-white/10 rounded-full px-4 py-1 text-sm text-[#f5e6d3] placeholder-[#8c7e7a] focus:outline-none focus:border-[#d4af37]"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#8c7e7a] cursor-pointer">
              🔍
            </div>
          </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;