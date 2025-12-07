"use client";
import { useState, useEffect, useRef, Suspense } from "react"; // 1. Import Suspense
import { Search as SearchIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// 2. Rename the main logic to 'SearchContent'
function SearchContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [results, setResults] = useState<Array<{ _id: string; name: string; price: number; image: string }>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString()); // Fix: toString() for safety
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("query");
    replace(`${pathname}?${params.toString()}`);
  };

  // Debounce
  useEffect(() => {
    const delay = setTimeout(async () => {
      if (query.length > 0) {
        setLoading(true);
        try {
          const res = await fetch(`/api/search?query=${query}`);
          setResults(await res.json());
          setIsOpen(true);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto" ref={ref}>
      {/* Animated Search Bar */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div
          className={`flex items-center w-full bg-linear-to-r from-[#3B1E11] via-[#1C0D07] to-[#3B1E11] backdrop-blur-xl 
          border rounded-full px-4 py-2.5 shadow-md 
          transition-all duration-300
          ${query ? "animate-borderGlow border-[#FFB368]" : "border-[#3D2B21]"}`}
        >
          <SearchIcon size={18} className="text-[#FFB368]" />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            placeholder="Explore flavors, truffles, cocoa blends..."
            className="w-full bg-transparent text-sm text-[#FFEEDD] placeholder:text-[#B89C84] px-2 focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-1.5 text-[#D9A47E] hover:text-[#FFB368] transition"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {isOpen && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-[#2A1710]/95 backdrop-blur-lg border border-[#4B3329] rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
          {loading ? (
            <div className="p-4 text-center text-sm text-[#D9A47E] animate-pulse">
              🍫 Melting chocolate...
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              {results.map((p) => (
                <Link
                  href={`/product/${p._id}`}
                  key={p._id}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-3 hover:bg-[#3B251C] transition-colors group"
                >
                  <div className="relative w-12 h-14 rounded-lg overflow-hidden border border-[#4D342A] bg-[#2C1C14]">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-sm font-semibold text-[#FBE6D6] group-hover:text-[#FFB368] transition-colors line-clamp-1">
                      {p.name}
                    </h4>
                    <p className="text-xs text-[#C4A489] mt-1">₹{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-[#D9A47E]">
              No treats found 🍪
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 3. Export a Suspense-wrapped version
export default function Search() {
  return (
    <Suspense fallback={<div className="w-full max-w-md mx-auto h-12 bg-[#3B1E11]/50 rounded-full animate-pulse" />}>
      <SearchContent />
    </Suspense>
  );
}