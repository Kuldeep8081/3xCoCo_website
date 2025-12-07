"use client";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return alert("Passwords do not match");

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
    setLoading(false);

    if (res.ok) {
      alert("Password reset successfully! Login with your new password.");
      router.push("/login");
    } else {
      alert("Invalid or expired token.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#140909] via-[#221013] to-[#2f1717] flex items-center justify-center px-4 py-10 text-[#FFEBDC]">
      {/* Cocoa Background Blobs */}
      <div className="pointer-events-none fixed inset-0 opacity-25 mix-blend-multiply">
        <div className="absolute -top-10 right-0 w-52 h-52 rounded-full bg-[#4a201c]" />
        <div className="absolute bottom-0 left-8 w-64 h-64 rounded-full bg-[#703024]" />
      </div>

      <div className="relative w-full max-w-md">
        <Link
          href="/login"
          className="mb-4 inline-flex items-center gap-2 text-xs text-[#F6B56B]/80 hover:text-[#FFEBDC] transition"
        >
          <ArrowLeft size={14} /> Back to Login
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-[#271315]/95 backdrop-blur-md border border-[#4b2627] rounded-3xl shadow-2xl px-7 py-8 space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#3a1a1c] border border-[#5a3032] mb-1">
              <Lock size={22} className="text-[#F6B56B]" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#FFEBDC]">
              Reset Password
            </h1>
            <p className="text-xs text-[#d9afa0] max-w-xs mx-auto">
              Enter your new password below and secure your account again.
            </p>
          </div>

          {/* Input fields */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#F6B56B]">
                New Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full p-3 rounded-xl border border-[#54302f] bg-[#1a0e0f] text-sm text-[#FFEBDC] focus:outline-none focus:ring-2 focus:ring-[#F6B56B] placeholder:text-[#b58c7f] transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-[#F6B56B]">
                Confirm Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full p-3 rounded-xl border border-[#54302f] bg-[#1a0e0f] text-sm text-[#FFEBDC] focus:outline-none focus:ring-2 focus:ring-[#F6B56B] placeholder:text-[#b58c7f] transition"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            className="w-full py-3 rounded-full bg-linear-to-r from-[#F1784D] via-[#F6B56B] to-[#FBD27A] text-[#2b1513] font-semibold text-sm shadow-lg hover:shadow-xl hover:brightness-110 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting Password..." : "Set New Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
