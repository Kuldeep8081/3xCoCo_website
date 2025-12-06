
import BackButton from '@/components/BackButton';
import { IndianRupee } from 'lucide-react';
import Image from 'next/image';
import React from 'react'

// 1. Make the component async
const Page = async ({
    searchParams
}: {
    // 2. Update the type to be a Promise
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {

    // 3. Await the promise to get the actual object
    const { name, description, image, price } = await searchParams;

    return (
        <div className='w-full min-h-screen flex flex-col items-center bg-amber-950'>
            <div className="my-15 p-6 bg-[#2b1b17] rounded-lg shadow-lg hover:shadow-amber-950 transition-shadow duration-300">
                <div className="flex items-center justify-center mb-6">
                    <Image src={image as string} alt={name as string} width={400} height={400} className='rounded-lg shadow-lg shadow-amber-950' />
                </div>
                <div className="m-3 space-y-4">
                <h1 className='font-bold' >{name}</h1>
                <p>{description}</p>
                <p className='flex items-center' ><IndianRupee size={14} />{price} </p>
                </div>
                <div className='flex  justify-between m-3' >
                <button className='px-6 py-2 bg-[#d4af37] text-[#2b1b17] tracking-widest text-xs uppercase hover:bg-white transition-colors' >Add to Cart</button>
                <BackButton />
                </div>
            </div>
        </div>
    )
}

export default Page