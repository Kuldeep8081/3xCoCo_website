import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Truck, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fdf7f2] text-[#3b241f] py-12 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        
        {/* Back Button */}
        <Link 
          href="/cart" 
          className="inline-flex items-center gap-2 text-[#c8924b] hover:text-[#3b241f] transition mb-8 font-semibold text-sm"
        >
          <ArrowLeft size={16} /> Back to Cart
        </Link>

        <h1 className="text-4xl font-serif font-bold mb-2">Terms & Conditions</h1>
        <p className="text-[#a67c52] mb-10">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-8">
          
          {/* Section 1: Shipping & Melting */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-[#e5c7a1]/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-700">
                <Truck size={24} />
              </div>
              <h2 className="text-xl font-bold">1. Shipping & Delivery</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              We take extreme care in packaging our chocolates. Orders are shipped in insulated thermal packaging with ice packs during warmer months. However, <strong>3XCoCo is not responsible for melting</strong> if the package is left outdoors after delivery. Please ensure someone is available to receive the package.
            </p>
          </section>

          {/* Section 2: Returns */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-[#e5c7a1]/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg text-red-700">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-xl font-bold">2. Returns & Refunds</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Due to the perishable nature of our products, <strong>we do not accept returns</strong>. If your order arrives damaged or incorrect, please contact us within 24 hours with photos, and we will issue a replacement or refund at our discretion.
            </p>
          </section>

          {/* Section 3: Privacy */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-[#e5c7a1]/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg text-green-700">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-xl font-bold">3. Privacy Policy</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              We respect your privacy. Your personal information is only used for order processing and delivery. We do not sell your data to third parties. Payments are securely processed via Razorpay.
            </p>
          </section>

        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Questions? Contact us at <a href="mailto:support@3xcoco.com" className="text-[#c8924b] underline">support@3xcoco.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}