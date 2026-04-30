"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { LogOut, User } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUserEmail(user.email ?? "");
      setUsername(user.user_metadata?.username ?? user.email ?? "");
      setLoading(false);
    };
    getUser();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0DAAE] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#895D2B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0DAAE]">
      <header className="bg-[#482E1D] text-[#F0DAAE] px-6 py-4 flex items-center justify-between shadow-md">
        <h1 className="text-xl font-bold tracking-wide">Catálogo Studio</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-[#A3966A]" />
            <span>{username}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#895D2B] hover:bg-[#90553C] text-white text-sm font-medium transition"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <div className="w-20 h-20 bg-[#F0DAAE] rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-[#895D2B]" />
          </div>
          <h2 className="text-2xl font-bold text-[#482E1D] mb-2">
            ¡Bienvenido, {username}!
          </h2>
          <p className="text-gray-500 text-sm mb-1">{userEmail}</p>
          <p className="text-[#A3966A] mt-4 text-sm">
            Tu panel de catálogos estará disponible pronto.
          </p>
        </div>
      </main>
    </div>
  );
}
