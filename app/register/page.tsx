"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; // Nice loader icon

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();
  
  // FIX 1: Initial state should be false
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // FIX 2: Set loading true immediately
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Registration successful! Please login.");
        router.push("/login");
      } else {
        const data = await res.json();
        alert(data.error || "Error registering user.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      // FIX 3: Always turn off loading when done
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-coco-dark via-[#4b2e2b] to-coco-cream">
      {/* Background chocolate drips / circles */}
      <div className="pointer-events-none fixed inset-0 opacity-20 mix-blend-multiply">
        <div className="absolute -top-16 -left-10 w-48 h-48 rounded-full bg-[#3b241f]" />
        <div className="absolute top-24 right-10 w-64 h-64 rounded-full bg-[#5a362f]" />
        <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-[#7b4a34]" />
      </div>

      {/* Content */}
      <div className="relative flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-[#fdf7f2]/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-[#e5c7a1]/60 p-8 sm:p-10">
            
            {/* Logo / Title */}
            <div className="flex flex-col items-center gap-2 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-[#4b2e2b] to-[#7b4a34] shadow-md">
                <span className="text-xl font-extrabold text-coco-gold">3X</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3b241f] tracking-wide">
                Create Your Account
              </h1>
              <p className="text-xs sm:text-sm text-[#7a5b4b]">
                Join the <span className="font-semibold">3XCoCo</span> chocolate club.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div className="space-y-1 text-sm">
                <label htmlFor="name" className="block font-medium text-[#5c4033]">Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your sweet name"
                  required
                  disabled={loading} // Disable input while loading
                  className="w-full p-3 rounded-lg border border-[#e5c7a1] bg-[#fffaf5] text-[#3b241f] text-sm focus:outline-none focus:ring-2 focus:ring-[#c8924b] focus:border-transparent placeholder:text-[#c1a38a] transition disabled:opacity-60"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* Email */}
              <div className="space-y-1 text-sm">
                <label htmlFor="email" className="block font-medium text-[#5c4033]">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@cocoalover.com"
                  required
                  disabled={loading}
                  className="w-full p-3 rounded-lg border border-[#e5c7a1] bg-[#fffaf5] text-[#3b241f] text-sm focus:outline-none focus:ring-2 focus:ring-[#c8924b] focus:border-transparent placeholder:text-[#c1a38a] transition disabled:opacity-60"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              {/* Password */}
              <div className="space-y-1 text-sm">
                <label htmlFor="password" className="block font-medium text-[#5c4033]">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create your secret recipe"
                  required
                  disabled={loading}
                  className="w-full p-3 rounded-lg border border-[#e5c7a1] bg-[#fffaf5] text-[#3b241f] text-sm focus:outline-none focus:ring-2 focus:ring-[#c8924b] focus:border-transparent placeholder:text-[#c1a38a] transition disabled:opacity-60"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              {/* FIX 4: Single Button with Loading State */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-linear-to-r from-[#4b2e2b] via-[#6b3b2e] to-[#c8924b] text-white p-3 rounded-full font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl hover:brightness-105 transition transform hover:-translate-y-px flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Sign Up & Taste the Magic"
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-2 my-2">
                <span className="h-px flex-1 bg-[#e5c7a1]" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#a27855]">or</span>
                <span className="h-px flex-1 bg-[#e5c7a1]" />
              </div>

              {/* Login link */}
              <p className="text-center text-xs sm:text-sm text-[#7a5b4b]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#c8924b] hover:text-[#e3a95b] underline-offset-4 hover:underline"
                >
                  Login to your stash
                </Link>
              </p>
            </form>
          </div>

          {/* Tagline */}
          <p className="mt-4 text-center text-[11px] sm:text-xs text-[#f3e0c7]/90">
            One account for all your cocoa cravings.
          </p>
        </div>
      </div>
    </div>
  );
}