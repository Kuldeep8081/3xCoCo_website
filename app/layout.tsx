import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotificationButton from "@/components/NotificationButton";
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })
const lato = Lato({ weight: ['300', '400'], subsets: ['latin'], variable: '--font-sans' })


export const metadata: Metadata = {
  title: "3XCoCo | Luxury Handcrafted Chocolates",
  description: "Experience the finest dark, milk, and truffle chocolates. Handcrafted with love and delivered to your doorstep.",
  icons: {
    icon: '/favicon.ico', // Make sure you add a chocolate icon to your public folder!
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`}>
      <body className="font-sans">
        <Navbar />
        {children}
        <NotificationButton />
        <Footer/>
        </body>
    </html>
  );
}
