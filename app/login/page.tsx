"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      window.location.href = "/";
    } else {
      alert("Invalid credentials");
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
                Welcome Back
              </h1>
              <p className="text-xs sm:text-sm text-[#7a5b4b]">
                Sign in to continue your <span className="font-semibold">chocolate journey</span>.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1 text-sm">
                <label
                  htmlFor="email"
                  className="block font-medium text-[#5c4033]"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@cocoalover.com"
                  required
                  className="w-full p-3 rounded-lg border border-[#e5c7a1] bg-[#fffaf5] text-[#3b241f] text-sm focus:outline-none focus:ring-2 focus:ring-[#c8924b] focus:border-transparent placeholder:text-[#c1a38a] transition"
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>

              {/* Password */}
              <div className="space-y-1 text-sm">
                <label
                  htmlFor="password"
                  className="block font-medium text-[#5c4033]"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your secret recipe"
                  required
                  className="w-full p-3 rounded-lg border border-[#e5c7a1] bg-[#fffaf5] text-[#3b241f] text-sm focus:outline-none focus:ring-2 focus:ring-[#c8924b] focus:border-transparent placeholder:text-[#c1a38a] transition"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>

              {/* Small row: remember / forgot */}
              <div className="flex items-center justify-between text-xs sm:text-sm text-[#7a5b4b]">
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-3 w-3 sm:h-4 sm:w-4 rounded border-[#d5b18a] text-[#4b2e2b]"
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <button
                  type="button"
                  className="hover:underline hover:text-[#c8924b]"
                  onClick={() => window.location.href = '/forgot-password'}
                >
                  Forgot password?
                </button>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full mt-1 bg-linear-to-r from-[#4b2e2b] via-[#6b3b2e] to-[#c8924b] text-white p-3 rounded-full font-semibold text-sm tracking-wide shadow-lg hover:shadow-xl hover:brightness-105 transition transform hover:-translate-y-[1px]"
              >
                Login to 3XCoCo
              </button>

              {/* Divider */}
              <div className="flex items-center gap-2 my-2">
                <span className="h-px flex-1 bg-[#e5c7a1]" />
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#a27855]">
                  or
                </span>
                <span className="h-px flex-1 bg-[#e5c7a1]" />
              </div>

              {/* Register link */}
              <p className="text-center text-xs sm:text-sm text-[#7a5b4b]">
                New here?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-[#c8924b] hover:text-[#e3a95b] underline-offset-4 hover:underline"
                >
                  Create a sweet account
                </Link>
              </p>
            </form>
          </div>

          {/* Little tagline under card */}
          <p className="mt-4 text-center text-[11px] sm:text-xs text-[#f3e0c7]/90">
            Crafted with love, cocoa, and a pinch of code.
          </p>
        </div>
      </div>
    </div>
  );
}
