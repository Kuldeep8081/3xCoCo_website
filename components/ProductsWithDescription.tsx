import { IndianRupee } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
const products = [
    {
        name: "Dark Chocolate Truffle",
        description: "Rich and velvety dark chocolate with a hint of espresso.",
        price: "25.00",
        image: "/cal1.png"
    },
    {
        name: "Milk Chocolate Hazelnut",
        description: "Creamy milk chocolate blended with roasted hazelnuts.",
        price: "22.00",
        image: "/cal2.png"
    },
    {
        name: "White Chocolate Raspberry",
        description: "Smooth white chocolate infused with fresh raspberry flavor.",
        price: "24.00",
        image: "/cal3.png"
    }
]
const ProductsWithDescription = () => {
    return (
        <section className="max-w-7xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-serif text-[#d4af37] mb-8">Our Exquisite Chocolate Collection</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {products.map((product, index) => (
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
                        <div className=" p-6 bg-[#2b1b17] rounded-lg shadow-lg hover:shadow-amber-950 transition-shadow duration-300"
                        >
                            <div className="relative h-64 w-full mb-4">
                                <Image
                                    width={"160"}
                                    height={"160"}
                                    src={product.image}
                                    alt={product.name}
                                    className="object-cover w-full h-full rounded-lg hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <h3 className="text-xl font-serif text-[#f5e6d3] mb-2">{product.name}</h3>
                            <p className="text-[#8c7e7a] text-sm font-light mb-4">{product.description}</p>
                            <p className="text-[#d4af37] font-medium flex items-center"><IndianRupee size={14} /> {product.price}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default ProductsWithDescription