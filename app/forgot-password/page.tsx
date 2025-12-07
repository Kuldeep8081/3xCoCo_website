"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react"; // Added Icons

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false); // New state to show success message

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Good practice to add header
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSent(true); // Switch UI to success state
        setEmail("");  // Clear input
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#140909] via-[#221013] to-[#2f1717] flex items-center justify-center px-4 py-10 text-[#FFEBDC]">
      {/* Chocolate blobs */}
      <div className="pointer-events-none fixed inset-0 opacity-25 mix-blend-multiply">
        <div className="absolute -top-16 right-0 w-56 h-56 rounded-full bg-[#4a201c]" />
        <div className="absolute bottom-0 left-4 w-60 h-60 rounded-full bg-[#703024]" />
      </div>

      <div className="relative w-full max-w-md">
        <Link
          href="/login"
          className="mb-4 inline-flex items-center gap-2 text-xs text-[#F6B56B]/80 hover:text-[#FFEBDC] transition"
        >
          <ArrowLeft size={14} />
          Back to login
        </Link>

        {/* Dynamic UI: Show Form OR Success Message */}
        {sent ? (
          <div className="bg-[#271315]/95 backdrop-blur-md border border-[#4b2627] rounded-3xl shadow-2xl px-7 py-12 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/30 border border-green-800 text-green-500 mb-2">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#FFEBDC]">Email Sent!</h2>
            <p className="text-sm text-[#d9afa0]">
              If an account exists for <span className="text-[#F6B56B]">that email</span>, 
              we have sent password reset instructions.
            </p>
            <button 
               onClick={() => setSent(false)}
               className="mt-4 text-xs text-[#F6B56B] hover:underline"
            >
              Try another email
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-[#271315]/95 backdrop-blur-md border border-[#4b2627] rounded-3xl shadow-2xl px-7 py-8 space-y-5"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#3a1a1c] border border-[#5a3032] mb-1">
                <Mail size={22} className="text-[#F6B56B]" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-[#FFEBDC]">
                Forgot Password?
              </h1>
              <p className="text-xs text-[#d9afa0] max-w-xs mx-auto">
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </p>
            </div>

            {/* Email input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#F6B56B]">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full p-3 rounded-xl border border-[#54302f] bg-[#1a0e0f] text-sm text-[#FFEBDC] focus:outline-none focus:ring-2 focus:ring-[#F6B56B] focus:border-transparent placeholder:text-[#b58c7f] transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Button */}
            <button
              disabled={loading}
              className="w-full py-3 rounded-full bg-linear-to-r from-[#F1784D] via-[#F6B56B] to-[#FBD27A] text-[#2b1513] font-semibold text-sm shadow-lg hover:shadow-xl hover:brightness-110 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            {/* Footer link */}
            <div className="text-center text-xs text-[#d9afa0]">
              Remembered your password?{" "}
              <Link
                href="/login"
                className="text-[#F6B56B] hover:text-[#FFEBDC] underline underline-offset-2"
              >
                Sign in again
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}