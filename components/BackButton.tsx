"use client"; // This makes it a Client Component

import React from 'react';
import { useRouter } from 'next/navigation';

const BackButton = () => {
  const router = useRouter();

  return (
    <button 
      className='px-6 py-2 bg-transparent border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#2b1b17] transition-all duration-300 uppercase tracking-widest text-xs' 
      onClick={() => router.back()} 
    >
      Go Back
    </button>
  );
};

export default BackButton;