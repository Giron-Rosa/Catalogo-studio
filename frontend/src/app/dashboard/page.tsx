"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { LogOut, User, Home, BookOpen, Package } from "lucide-react";

type Section = "inicio" | "catalogos" | "productos";

const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "inicio", label: "Inicio", icon: <Home className="w-5 h-5" /> },
  { id: "catalogos", label: "Catálogos", icon: <BookOpen className="w-5 h-5" /> },
  { id: "productos", label: "Productos", icon: <Package className="w-5 h-5" /> },
];

function SectionInicio({ username }: { username: string }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#482E1D] mb-1">
        ¡Bienvenido, {username}!
      </h2>
      <p className="text-gray-500 text-sm mb-8">¿Qué deseas hacer hoy?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-[#F0DAAE] hover:shadow-lg transition cursor-pointer">
          <div className="w-12 h-12 bg-[#F0DAAE] rounded-xl flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-[#895D2B]" />
          </div>
          <h3 className="font-bold text-[#482E1D] mb-1">Crear catálogo</h3>
          <p className="text-gray-400 text-sm">Diseña un nuevo catálogo desde cero.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 border border-[#F0DAAE] hover:shadow-lg transition cursor-pointer">
          <div className="w-12 h-12 bg-[#F0DAAE] rounded-xl flex items-center justify-center mb-4">
            <Package className="w-6 h-6 text-[#895D2B]" />
          </div>
          <h3 className="font-bold text-[#482E1D] mb-1">Agregar productos</h3>
          <p className="text-gray-400 text-sm">Administra tu biblioteca de productos.</p>
        </div>
      </div>
    </div>
  );
}

function SectionCatalogos() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#482E1D] mb-1">Catálogos</h2>
      <p className="text-gray-500 text-sm mb-8">Tus catálogos creados y listos para descargar.</p>
      <div className="bg-white rounded-2xl shadow-md p-12 border border-[#F0DAAE] text-center">
        <div className="w-16 h-16 bg-[#F0DAAE] rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-[#A3966A]" />
        </div>
        <p className="text-[#482E1D] font-semibold mb-1">Sin catálogos aún</p>
        <p className="text-gray-400 text-sm">Crea tu primer catálogo desde la sección Inicio.</p>
      </div>
    </div>
  );
}

function SectionProductos() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#482E1D] mb-1">Productos</h2>
      <p className="text-gray-500 text-sm mb-8">Biblioteca de productos para tus catálogos.</p>
      <div className="bg-white rounded-2xl shadow-md p-12 border border-[#F0DAAE] text-center">
        <div className="w-16 h-16 bg-[#F0DAAE] rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-[#A3966A]" />
        </div>
        <p className="text-[#482E1D] font-semibold mb-1">Sin productos aún</p>
        <p className="text-gray-400 text-sm">Agrega productos para usarlos en tus catálogos.</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<Section>("inicio");

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
    <div className="min-h-screen bg-[#F0DAAE] flex flex-col">
      {/* Header */}
      <header className="bg-[#482E1D] text-[#F0DAAE] px-6 py-4 flex items-center justify-between shadow-md z-10">
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

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 bg-[#482E1D] flex flex-col py-6 gap-1 shadow-xl shrink-0">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-3 mx-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeSection === item.id
                  ? "bg-[#895D2B] text-[#F0DAAE]"
                  : "text-[#A3966A] hover:bg-[#895D2B]/30 hover:text-[#F0DAAE]"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-8">
          {activeSection === "inicio" && <SectionInicio username={username} />}
          {activeSection === "catalogos" && <SectionCatalogos />}
          {activeSection === "productos" && <SectionProductos />}
        </main>
      </div>
    </div>
  );
}
