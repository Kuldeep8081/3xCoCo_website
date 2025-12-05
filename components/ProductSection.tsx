'use client';
import { motion } from 'framer-motion';
import { ArrowRight, IndianRupee } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ProductsWithDescription from './ProductsWithDescription';

// --- MOCK DATA ---
const products = [
    {
        id: 1,
        name: "Midnight Truffle",
        price: "24.00",
        description: "85% Dark Cocoa with a hint of sea salt.",
        image: "/cat1.png",
        tag: "Best Seller"
    },
    {
        id: 2,
        name: "Hazelnut Praline",
        price: "28.00",
        description: "Roasted hazelnuts wrapped in velvet milk chocolate.",
        image: "/cat2.png",
        tag: "New"
    },
    {
        id: 3,
        name: "Ruby Raspberry",
        price: "32.00",
        description: "Rare ruby beans infused with fresh raspberry essence.",
        image: "/cat3.png",
        tag: "Limited"
    }
];


const ProductCard = ({ product, index }: { product: any; index: number }) => {
    return (
        <Link
            href={
                {
                    pathname: "/productdetails",
                    query: {
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        image: product.image
                    }

                }
            }
            key={index}
            className="block"
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="group relative cursor-pointer"
            >
                <div className="relative h-[400px] w-full overflow-hidden bg-[#1a100e]">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover rounded-xl shadow-lg transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button className="px-6 py-2 bg-[#f5e6d3] text-[#2b1b17] tracking-widest text-xs uppercase hover:bg-white transition-colors">
                            Quick View
                        </button>
                    </div>
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-[#d4af37] text-[#2b1b17] text-[10px] uppercase tracking-wider font-bold">
                            {product.tag}
                        </span>
                    </div>
                </div>

                <div className="mt-6 text-center space-y-2">
                    <h3 className="text-xl font-serif text-[#f5e6d3]">{product.name}</h3>
                    <p className="text-[#8c7e7a] text-sm font-light">{product.description}</p>
                    <p className="text-[#d4af37] font-medium pt-2 flex items-center"><IndianRupee size={14} /> {product.price}</p>
                </div>
            </motion.div>
        </Link>
    );
};

const ProductSection = () => {
    return (
        <section className="py-24 bg-[#2b1b17] px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-16 border-b border-white/5 pb-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-serif text-[#f5e6d3] mb-2">Signature Selections</h2>
                        <p className="text-[#8c7e7a] font-light">Curated for the refined palate.</p>
                    </div>
                    <button className="hidden md:flex items-center gap-2 text-[#d4af37] hover:text-[#f5e6d3] transition-colors text-sm uppercase tracking-widest">
                        View All <ArrowRight size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {products.map((product, index) => (

                        <ProductCard key={product.id} product={product} index={index} />
                    ))}
                </div>
            </div>
            <ProductsWithDescription/>
        </section>
    );
};

export default ProductSection;