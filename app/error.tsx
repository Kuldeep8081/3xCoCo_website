"use client";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#120909] text-[#FCE9D9]">
      <h2 className="text-2xl font-bold mb-4">Something went wrong! 🍫</h2>
      <button onClick={() => reset()} className="px-4 py-2 bg-[#c8924b] text-white rounded">Try again</button>
    </div>
  );
}