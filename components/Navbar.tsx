"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import Search from "./Search";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const user = await res.json();
          setIsLoggedIn(true);
          if (user.role === "admin") setIsAdmin(true);
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      } catch (e) {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsLoggedIn(false);
      setIsAdmin(false);
      router.push("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 w-full z-50 bg-[#2b1b17]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-serif text-[#d4af37] tracking-widest cursor-pointer"
          >
            3XCoCo
          </Link>
          <div className="flex-1 mx-8 justify-center">
            <Search />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  href="/orders"
                  className="hover:text-white transition flex items-center gap-2"
                >
                  <User size={18} /> My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-red-400 transition flex items-center gap-2"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="hover:text-white transition">
                Login
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="text-red-400 font-bold hover:text-red-300"
              >
                Admin Panel
              </Link>
            )}

            <Link
              href="/cart"
              className="flex items-center gap-2 hover:text-white relative"
            >
              <ShoppingCart size={20} />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button + Cart */}
          <div className="md:hidden flex items-center gap-4">
            <Link href="/cart" className="relative">
              <ShoppingCart size={22} />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="focus:outline-none"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-coco-light border-t border-coco-dark"
        >
          <div className="px-4 py-4 space-y-3 text-center">
            <Link
              href="/"
              className="block py-2 text-white hover:text-coco-gold transition"
              onClick={closeMenu}
            >
              Home
            </Link>

            {/* Cart in mobile menu */}
            <Link
              href="/cart"
              className="py-2 text-white hover:text-coco-gold transition flex items-center justify-center gap-2"
              onClick={closeMenu}
            >
              <div className="relative inline-flex items-center gap-2">
                <ShoppingCart size={18} />
                <span>Cart</span>
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-4 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </div>
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  href="/orders"
                  className="block py-2 text-white hover:text-coco-gold transition flex items-center justify-center gap-2"
                  onClick={closeMenu}
                >
                  <User size={18} /> <span>My Orders</span>
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="block py-2 text-red-300 hover:text-red-200 transition font-semibold"
                    onClick={closeMenu}
                  >
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="block w-full py-2 text-red-300 hover:text-red-200 transition flex items-center justify-center gap-2"
                >
                  <LogOut size={18} /> <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block py-2 text-white hover:text-coco-gold transition"
                onClick={closeMenu}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
