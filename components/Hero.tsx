'use client';

import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background with Overlay */}
            <div className="absolute inset-0 z-0 h-full w-full overflow-hidden pointer-events-none">
                <video
                    className="object-cover w-full h-full"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                >
                    {/* OPTION 1: Use a local file (Recommended) */}
                    {/* Make sure the video is in your 'public' folder */}
                    <source src="/GIF_Generation_Failed.mp4" type="video/mp4" />
                    
                    {/* OPTION 2: If you must host externally, use a real CDN (Cloudinary, AWS S3, etc.) */}
                </video>

                {/* Gradient Overlay - Fixed typo 'bg-linear' to 'bg-gradient' */}
                <div className="absolute inset-0 bg-linear-to-b from-[#2b1b17]/60 via-[#2b1b17]/40 to-[#2b1b17]" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-[#d4af37] tracking-[0.4em] text-sm md:text-base mb-6 uppercase"
                >
                    Est. 2025 • Belgium
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="text-5xl md:text-8xl font-serif text-[#f5e6d3] mb-8 leading-tight"
                >
                    The Art of <br />
                    <span className="italic text-[#d4af37]">Indulgence</span>
                </motion.h1>
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="group relative px-8 py-3 bg-transparent border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#2b1b17] transition-all duration-300 uppercase tracking-widest text-xs md:text-sm"
                    onClick={()=>{ window.location.href = 'collections'; }}
                >
                    Discover Collection
                </motion.button>
            </div>
        </section>
    );
};
export default Hero;