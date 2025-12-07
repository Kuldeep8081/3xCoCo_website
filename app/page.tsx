import React from 'react';
import Hero from '@/components/Hero';
import Collections from '@/components/Collections';
import FeatureSection from '@/components/FeatureSection';

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {


  return (
    <div className="bg-coco-cream min-h-screen flex flex-col">
      {/* Hero Section (Banner) */}
      <Hero />

      {/* Collections (Categories like Dark, Milk, White) */}
      <Collections searchParams={searchParams}/>

      {/* Feature Section (Marketing/About) */}
      <FeatureSection />

    </div>
  );
}