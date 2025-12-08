"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X, User, LogOut, ShieldCheck } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import Search from "@/components/Search"; // Ensure correct import path
import NotificationDropdown from "./NotificationDropdown";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  // 1. Check Auth & Admin Status on Mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const user = await res.json();
          setIsLoggedIn(true);
          // Check for admin role
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
      window.location.reload(); // Force refresh to clear cookies/state
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="sticky top-0 w-full z-50 bg-[#1a0e0f] border-b border-[#3d2326] shadow-xl text-[#FFB368]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">

          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-serif text-[#d4af37] tracking-widest cursor-pointer"
          >
            3XCoCo
          </Link>

          {/* Search Bar (Responsive) */}
          <div className="flex-1 flex justify-end md:justify-center items-center min-w-0">
            <Search />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center shrink-0">
            <Link href="/" className="hover:text-[#FFECDC] transition">
              Home
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  href="/orders"
                  className="hover:text-[#FFECDC] transition flex items-center gap-2"
                >
                  <User size={18} /> My Orders
                </Link>

                {/* Admin Link (Desktop) */}
                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="text-red-400 font-bold hover:text-red-300 flex items-center gap-1"
                  >
                    <ShieldCheck size={18} /> Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="hover:text-red-400 transition flex items-center gap-2"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="hover:text-[#FFECDC] transition">
                Login
              </Link>
            )}

            {isLoggedIn && (
              // Add Notification Bell Here
              <NotificationDropdown />
            )}

            <Link
              href="/cart"
              className="flex items-center gap-2 hover:text-[#FFECDC] relative"
            >
              <ShoppingCart size={20} />
              <span>Cart</span>
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {items.length}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Buttons */}
          <div className="md:hidden flex items-center gap-5 shrink-0">

            <Link href="/cart" className="relative text-[#FFB368] hover:text-[#FFECDC]">
              <ShoppingCart size={22} />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {items.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="focus:outline-none text-[#FFB368] hover:text-[#FFECDC]"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {isLoggedIn && <NotificationDropdown />}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#1a0e0f] border-t border-[#3d2326] shadow-2xl absolute w-full left-0">
          <div className="px-4 py-4 space-y-2 text-center">
            <Link
              href="/"
              className="block py-3 text-[#FFECDC] hover:bg-[#3B1E11] transition"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  href="/orders"
                  className="block py-3 text-[#FFECDC] hover:bg-[#3B1E11] transition"
                  onClick={() => setIsOpen(false)}
                >
                  My Orders
                </Link>

                {/* Admin Link (Mobile) */}
                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="block py-3 text-red-400 font-bold hover:bg-[#3B1E11] transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full py-3 text-red-400 hover:bg-[#3B1E11] transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block py-3 text-[#FFECDC] hover:bg-[#3B1E11] transition"
                onClick={() => setIsOpen(false)}
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