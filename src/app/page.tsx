"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  color: string;
  size?: string;
  number?: string;
  selling_price: number;
  quantity: number;
  image_url: string;
  is_active: boolean;
  created_at?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [stars, setStars] = useState<{id: number; x: number; y: number; delay: number}[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
    const newStars = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setStars(newStars);
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  function toggleReveal(id: string) {
    setRevealedId(prev => prev === id ? null : id);
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#faf8f5] relative overflow-x-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute w-1 h-1 bg-[#22c55e] rounded-full animate-pulse hidden sm:block"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`,
            boxShadow: '0 0 6px #22c55e',
          }}
        />
      ))}

      <header className="relative bg-gradient-to-b from-[#064a3c] via-[#0a5c4a] to-[#0d6b56] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-white/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-16 right-16 w-28 h-28 sm:w-40 sm:h-40 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-6 sm:pt-8 pb-16 sm:pb-24 text-center relative z-10">
          <div className="flex justify-center mb-4 sm:mb-6 animate-fade-in">
            <div className="relative w-36 h-36 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-full overflow-hidden bg-gradient-to-br from-white/10 to-transparent shadow-2xl">
              <Image src="/logo.svg" alt="وافي" fill className="object-contain p-3 sm:p-4 drop-shadow-2xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine pointer-events-none" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>وافي</h1>
          <p className="text-sm sm:text-base md:text-lg opacity-90 animate-fade-in" style={{ animationDelay: '0.4s' }}>معرض المنتجات الفاخر</p>
        </div>
        <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 100L60 88C120 76 240 52 360 40C480 28 600 28 720 34C840 40 960 52 1080 58C1200 64 1320 64 1380 64L1440 64V100H0Z" fill="#faf8f5"/>
        </svg>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#064a3c]">تشكيلة المنتجات</h2>
          <div className="relative w-full sm:w-56 md:w-64">
            <input
              type="text"
              placeholder="بحث عن منتج..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#064a3c]/20 focus:border-[#064a3c] transition-all"
            />
          </div>
        </div>
        {loading ? <div className="text-center py-12 sm:py-16 text-gray-500">جاري التحميل...</div> : filtered.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-3xl"><p className="text-gray-500">لا توجد منتجات</p></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {filtered.map((product, i) => (
              <div key={product.id} className="bg-[#f5f0e8] rounded-2xl sm:rounded-3xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="relative h-36 sm:h-44 md:h-52 bg-white cursor-pointer" onClick={() => setLightbox(product.image_url)}>
                  <Image src={product.image_url || "/logo.svg"} alt={product.name} fill className="object-contain p-3 sm:p-4" />
                </div>
                <div className="p-3 sm:p-4 text-center">
                  <h3 className="font-bold text-sm sm:text-base mb-2 sm:mb-3 text-gray-800 line-clamp-2">{product.name}</h3>
                  <button onClick={() => toggleReveal(product.id)} className="w-full border-2 border-[#064a3c] text-[#064a3c] rounded-full py-2 sm:py-3 text-sm sm:text-base font-semibold hover:bg-[#064a3c] hover:text-white transition-colors">
                    {revealedId === product.id ? "إخفاء" : "عرض"}
                  </button>
                  {revealedId === product.id && (
                    <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-white rounded-xl text-xs sm:text-sm space-y-1">
                      <div className="flex justify-between"><span className="text-gray-500">اللون:</span><span className="font-medium">{product.color}</span></div>
                      {product.size && <div className="flex justify-between"><span className="text-gray-500">الحجم:</span><span className="font-medium">{product.size}</span></div>}
                      {product.number && <div className="flex justify-between"><span className="text-gray-500">النمرة:</span><span className="font-medium">{product.number}</span></div>}
                      <div className="flex justify-between"><span className="text-gray-500">الكمية:</span><span className="font-medium">{product.quantity}</span></div>
                      <div className="flex justify-between font-bold text-[#064a3c]"><span>السعر:</span><span>{product.selling_price} ₪</span></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-[#064a3c] text-white py-8 sm:py-10 text-center relative z-10">
        <svg className="absolute top-0 left-0 right-0 w-full -translate-y-full" viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L60 52C120 44 240 28 360 22C480 16 600 16 720 20C840 24 960 32 1080 36C1200 40 1320 40 1380 40L1440 40V60H0Z" fill="#064a3c"/>
        </svg>
        <Link href="/login" className="inline-block mb-3 sm:mb-4 hover:opacity-80 transition-opacity">
          <Image src="/logo.svg" alt="" width={32} height={32} className="mx-auto sm:w-10 sm:h-10" />
        </Link>
        <p className="text-xs sm:text-sm opacity-80 mb-1 sm:mb-2">معرض المنتجات الفاخر</p>
        <p className="text-[10px] sm:text-xs opacity-60 tracking-wider">جميع الحقوق محفوظة © {new Date().getFullYear()} وافي</p>
      </footer>

      {lightbox && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" />
        </div>
      )}
    </div>
  );
}
