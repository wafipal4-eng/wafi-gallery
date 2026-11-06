"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const storedPass = localStorage.getItem("admin_pass") || "wafi2026";
    if (username === "admin" && password === storedPass) {
      localStorage.setItem("admin", "true");
      router.push("/admin");
    } else {
      setError("بيانات الدخول غير صحيحة");
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <Image src="/logo.svg" alt="وافي" width={80} height={80} />
        </div>
        <h1 className="text-2xl font-bold text-[#064a3c] text-center mb-6">تسجيل الدخول</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="text" placeholder="اسم المستخدم" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-base" required />
          <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-base" required />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full bg-[#064a3c] text-white rounded-xl py-3 font-semibold hover:bg-[#053d32] transition-colors">دخول</button>
        </form>
      </div>
    </div>
  );
}
