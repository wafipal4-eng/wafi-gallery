"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [color, setColor] = useState("أسود");
  const [size, setSize] = useState("");
  const [number, setNumber] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("products").insert({
      name,
      color,
      size: size || null,
      number: number || null,
      selling_price: parseFloat(sellingPrice),
      cost_price: parseFloat(costPrice),
      quantity: parseInt(quantity),
      image_url: imageUrl,
      is_active: true,
    });
    setLoading(false);
    if (error) {
      alert("خطأ: " + error.message);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#064a3c]">إضافة منتج</h1>
          <a href="/admin" className="text-[#064a3c] text-sm">رجوع</a>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
          <input type="text" placeholder="اسم المنتج" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-xl px-4 py-3" required />
          <select value={color} onChange={(e) => setColor(e.target.value)} className="w-full border rounded-xl px-4 py-3">
            <option>أسود</option>
            <option>أبيض</option>
            <option>أحمر</option>
            <option>أزرق</option>
            <option>أخضر</option>
            <option>ذهبي</option>
            <option>فضي</option>
            <option>بلا</option>
          </select>
          <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full border rounded-xl px-4 py-3">
            <option value="">الحجم (اختياري)</option>
            <option>XS</option>
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
            <option>XXL</option>
          </select>
          <input type="text" placeholder="النمرة (اختياري)" value={number} onChange={(e) => setNumber(e.target.value)} className="w-full border rounded-xl px-4 py-3" />
          <input type="number" placeholder="سعر البيع" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} className="w-full border rounded-xl px-4 py-3" required />
          <input type="number" placeholder="سعر التكلفة" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} className="w-full border rounded-xl px-4 py-3" required />
          <input type="number" placeholder="الكمية" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full border rounded-xl px-4 py-3" required />
          <div>
            <label className="block text-sm text-gray-600 mb-2">رفع صورة من الهاتف</label>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full border rounded-xl px-4 py-3" />
          </div>
          {imageUrl && <img src={imageUrl} alt="" className="w-32 h-32 object-contain mx-auto rounded-lg" />}
          <button type="submit" disabled={loading} className="w-full bg-[#064a3c] text-white rounded-xl py-3 font-semibold hover:bg-[#053d32] disabled:opacity-50">
            {loading ? "جاري الحفظ..." : "إضافة المنتج"}
          </button>
        </form>
      </div>
    </div>
  );
}
