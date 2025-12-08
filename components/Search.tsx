"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { Search as SearchIcon, X, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

function SearchContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [results, setResults] = useState<Array<{ _id: string; name: string; price: number; image: string }>>([]);
  const [loading, setLoading] = useState(false);
  
  // UI States
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const desktopRef = useRef<HTMLDivElement>(null);

  // --- SEARCH LOGIC ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl(query);
    setIsMobileOpen(false); // Explicitly close mobile view on submit
    setIsDesktopOpen(false);
  };

  const updateUrl = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) params.set("query", term);
    else params.delete("query");
    replace(`${pathname}?${params.toString()}`);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    updateUrl("");
  };

  // Fetch Data
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (query.length > 0) {
        setLoading(true);
        try {
          const res = await fetch(`/api/search?query=${query}`);
          setResults(await res.json());
          if (!isMobileOpen) setIsDesktopOpen(true);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setIsDesktopOpen(false);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [query, isMobileOpen]);

  // Click Outside (Desktop)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (desktopRef.current && !desktopRef.current.contains(e.target as Node)) {
        setIsDesktopOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // --- RESULTS COMPONENT ---
  const ResultsList = () => (
    <>
      {loading ? (
        <div className="p-6 text-center text-sm text-[#D9A47E] animate-pulse">
          🍫 Melting chocolate...
        </div>
      ) : results.length > 0 ? (
        <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
          {results.map((p) => (
            <Link
              href={`/product/${p._id}`}
              key={p._id}
              onClick={() => { setIsDesktopOpen(false); setIsMobileOpen(false); }}
              className="flex items-center gap-4 p-4 hover:bg-[#3B251C] transition-colors group border-b border-[#3d2326] last:border-0"
            >
              <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-[#4D342A] bg-[#2C1C14] shrink-0">
                <Image src={p.image} alt={p.name} fill className="object-cover" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-base font-semibold text-[#FBE6D6] group-hover:text-[#FFB368] line-clamp-1">{p.name}</h4>
                <p className="text-sm text-[#C4A489]">₹{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-sm text-[#D9A47E]">No treats found 🍪</div>
      )}
    </>
  );

  return (
    <>
      {/* 1. MOBILE ICON (Always Visible on Mobile) */}
      <div className="md:hidden flex items-center justify-center">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-[#FFB368] hover:bg-[#3B1E11] rounded-full transition-colors active:scale-95"
          aria-label="Open Search"
        >
          <SearchIcon size={24} />
        </button>
      </div>

      {/* 2. DESKTOP SEARCH BAR (Hidden on Mobile) */}
      <div className="hidden md:block relative w-full max-w-md mx-auto" ref={desktopRef}>
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <div className={`flex items-center w-full bg-linear-to-r from-[#3B1E11] via-[#1C0D07] to-[#3B1E11] backdrop-blur-xl border rounded-full px-4 py-2.5 shadow-md transition-all duration-300 ${query ? "border-[#FFB368]" : "border-[#3D2B21]"}`}>
            <SearchIcon size={18} className="text-[#FFB368]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setIsDesktopOpen(true)}
              placeholder="Search chocolates..."
              className="w-full bg-transparent text-sm text-[#FFEEDD] placeholder:text-[#B89C84] px-2 focus:outline-none"
            />
            {query && <button type="button" onClick={clearSearch} className="text-[#D9A47E]"><X size={16} /></button>}
          </div>
        </form>
        {isDesktopOpen && query.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-3 bg-[#2A1710]/95 backdrop-blur-lg border border-[#4B3329] rounded-2xl shadow-2xl z-50 overflow-hidden">
            <ResultsList />
          </div>
        )}
      </div>

      {/* 3. MOBILE FULL SCREEN OVERLAY */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-9999 bg-[#120909] flex flex-col md:hidden animate-in fade-in duration-200">
          <div className="flex items-center gap-2 p-4 border-b border-[#3d2326] bg-[#1a0e0f]">
            <button onClick={() => setIsMobileOpen(false)} className="p-2 -ml-2 text-[#FFB368] rounded-full">
              <ArrowLeft size={24} />
            </button>
            <form onSubmit={handleSubmit} className="flex-1 relative">
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-[#2a1710] text-[#FFEEDD] placeholder:text-[#8a705e] px-4 py-3 rounded-xl border border-[#4B3329] focus:outline-none focus:border-[#FFB368] text-base"
              />
               {query && (
                <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D9A47E]">
                  <X size={18} />
                </button>
              )}
            </form>
          </div>
          <div className="flex-1 overflow-y-auto bg-[#120909]">
             {query.length > 0 && <ResultsList />}
             {query.length === 0 && <div className="p-8 text-center text-[#5c4033] text-sm">Type to find your favorite chocolates...</div>}
          </div>
        </div>
      )}
    </>
  );
}

export default function Search() {
  return (
    <Suspense fallback={<div className="w-8 h-8 rounded-full bg-[#3B1E11]/50 animate-pulse" />}>
      <SearchContent />
    </Suspense>
  );
}