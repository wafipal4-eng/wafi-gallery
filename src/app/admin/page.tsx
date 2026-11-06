"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  color: string;
  size?: string;
  number?: string;
  selling_price: number;
  cost_price: number;
  quantity: number;
  image_url: string;
  is_active: boolean;
  created_at?: string;
}

export default function Admin() {
  const [ok, setOk] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "hidden">("all");
  const [search, setSearch] = useState("");
  const [newPass, setNewPass] = useState("");
  const [showInventory, setShowInventory] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("admin") === "true") {
      setOk(true);
      fetchProducts();
    } else {
      router.push("/login");
    }
  }, [router]);

  async function fetchProducts() {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  async function toggleActive(id: string, current: boolean) {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !current } : p));
    await supabase.from("products").update({ is_active: !current }).eq("id", id);
  }

  async function deleteProduct(id: string) {
    if (confirm("هل تريد حذف هذا المنتج؟")) {
      setProducts(prev => prev.filter(p => p.id !== id));
      await supabase.from("products").delete().eq("id", id);
    }
  }

  function changePassword() {
    if (newPass.length < 4) {
      alert("كلمة المرور يجب أن تكون 4 أحرف على الأقل");
      return;
    }
    localStorage.setItem("admin_pass", newPass);
    alert("تم تغيير كلمة المرور");
    setNewPass("");
    setShowPassword(false);
  }

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "active" ? p.is_active : !p.is_active);
    return matchesSearch && matchesFilter;
  });

  const totalCapital = products.reduce((s, p) => s + (p.cost_price * (p.quantity || 0)), 0);
  const totalProfit = products.reduce((s, p) => s + ((p.selling_price - p.cost_price) * (p.quantity || 0)), 0);
  const totalStock = products.reduce((s, p) => s + (p.quantity || 0), 0);

  if (!ok) return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-[#faf8f5] p-3 sm:p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Image src="/logo.svg" alt="وافي" width={32} height={32} className="sm:w-10 sm:h-10" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#064a3c]">لوحة التحكم</h1>
          </div>
          <button onClick={() => { localStorage.removeItem("admin"); router.push("/"); }} className="text-red-600 text-xs sm:text-sm">تسجيل الخروج</button>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow mb-3 sm:mb-4 overflow-hidden">
          <button onClick={() => setShowInventory(!showInventory)} className="w-full p-3 sm:p-4 flex justify-between items-center text-right">
            <span className="font-bold text-[#064a3c] text-sm sm:text-base">المخزون والأرباح</span>
            <span className="text-gray-400">{showInventory ? "▲" : "▼"}</span>
          </button>
          {showInventory && (
            <div className="px-3 sm:px-4 pb-3 sm:pb-4 grid grid-cols-3 gap-2 sm:gap-4">
              <div className="text-center">
                <p className="text-lg sm:text-2xl font-bold text-[#064a3c]">{totalCapital.toFixed(0)}</p>
                <p className="text-xs sm:text-sm text-gray-500">رأس المال</p>
              </div>
              <div className="text-center">
                <p className="text-lg sm:text-2xl font-bold text-[#064a3c]">{totalProfit.toFixed(0)}</p>
                <p className="text-xs sm:text-sm text-gray-500">الأرباح</p>
              </div>
              <div className="text-center">
                <p className="text-lg sm:text-2xl font-bold text-[#064a3c]">{totalStock}</p>
                <p className="text-xs sm:text-sm text-gray-500">المخزون</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow mb-3 sm:mb-4 overflow-hidden">
          <button onClick={() => setShowPassword(!showPassword)} className="w-full p-3 sm:p-4 flex justify-between items-center text-right">
            <span className="font-bold text-[#064a3c] text-sm sm:text-base">تغيير كلمة المرور</span>
            <span className="text-gray-400">{showPassword ? "▲" : "▼"}</span>
          </button>
          {showPassword && (
            <div className="px-3 sm:px-4 pb-3 sm:pb-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input type="password" placeholder="كلمة المرور الجديدة" value={newPass} onChange={(e) => setNewPass(e.target.value)} className="flex-1 border rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm" />
              <button onClick={changePassword} className="bg-[#064a3c] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm">تغيير</button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow overflow-hidden">
          <div className="p-3 sm:p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="font-bold text-[#064a3c] text-sm sm:text-base">المنتجات</h2>
            <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
              <input
                type="text"
                placeholder="بحث..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-36 md:w-48 border border-gray-200 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#064a3c]/20"
              />
              <div className="flex gap-1 sm:gap-2">
                <button onClick={() => setFilter("all")} className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs ${filter === "all" ? "bg-[#064a3c] text-white" : "bg-gray-100"}`}>الكل</button>
                <button onClick={() => setFilter("active")} className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs ${filter === "active" ? "bg-[#064a3c] text-white" : "bg-gray-100"}`}>متوفر</button>
                <button onClick={() => setFilter("hidden")} className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs ${filter === "hidden" ? "bg-[#064a3c] text-white" : "bg-gray-100"}`}>مخفي</button>
              </div>
            </div>
            <a href="/admin/add" className="bg-[#064a3c] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm whitespace-nowrap">إضافة منتج</a>
          </div>
          {loading ? <div className="p-6 sm:p-8 text-center text-gray-500 text-sm">جاري التحميل...</div> : filtered.length === 0 ? (
            <div className="p-6 sm:p-8 text-center text-gray-500 text-sm">لا توجد منتجات</div>
          ) : (
            <div className="divide-y">
              {filtered.map((p) => (
                <div key={p.id} className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <img 
                      src={p.image_url || "/logo.svg"} 
                      alt="" 
                      className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-lg bg-gray-50 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => p.image_url && setLightbox(p.image_url)}
                    />
                    <div className="flex-1 sm:hidden">
                      <p className="font-semibold text-sm">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.color}{p.size ? ` • ${p.size}` : ''}{p.number ? ` • ${p.number}` : ''}</p>
                    </div>
                  </div>
                  <div className="hidden sm:block flex-1">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-gray-500">{p.color}{p.size ? ` • ${p.size}` : ''}{p.number ? ` • ${p.number}` : ''}</p>
                  </div>
                  <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm w-full sm:w-auto justify-between sm:justify-start">
                    <div className="text-center">
                      <p className="text-gray-500">التكلفة</p>
                      <p className="font-medium">{p.cost_price} ₪</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500">البيع</p>
                      <p className="font-medium text-[#064a3c]">{p.selling_price} ₪</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500">الكمية</p>
                      <p className="font-medium">{p.quantity}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3 items-center w-full sm:w-auto justify-end">
                    <a href={`/admin/edit?id=${p.id}`} className="text-blue-600 text-xs sm:text-sm">تعديل</a>
                    <button onClick={() => toggleActive(p.id, p.is_active)} className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.is_active ? 'نشط' : 'مخفي'}
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="text-red-500 text-xs sm:text-sm">حذف</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" />
        </div>
      )}
    </div>
  );
}
