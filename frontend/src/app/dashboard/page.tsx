"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { LogOut, User, Home, BookOpen, Package, Eye, Pencil, Download, X } from "lucide-react";

type Section = "inicio" | "catalogos" | "productos";

const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "inicio", label: "Inicio", icon: <Home className="w-5 h-5" /> },
  { id: "catalogos", label: "Catálogos", icon: <BookOpen className="w-5 h-5" /> },
  { id: "productos", label: "Productos", icon: <Package className="w-5 h-5" /> },
];

function SectionInicio({ username }: { username: string }) {
  const router = useRouter();
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#482E1D] mb-1">
        ¡Bienvenido, {username}!
      </h2>
      <p className="text-gray-500 text-sm mb-8">¿Qué deseas hacer hoy?</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div
          onClick={() => router.push("/dashboard/catalogo/nuevo")}
          className="bg-white rounded-2xl shadow-md p-6 border border-[#F0DAAE] hover:shadow-lg hover:border-[#895D2B] transition cursor-pointer"
        >
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

type ProductoVista = {
  id: string;
  nombre: string;
  categoria: string | null;
  descripcion: string | null;
  precio: number | null;
  foto_url: string | null;
  orden: number;
};

type Catalogo = {
  id: string;
  nombre: string;
  nombre_negocio: string;
  plantilla_id: string;
  colores: string[];
  estado: string;
  created_at: string;
};

function SectionCatalogos() {
  const router = useRouter();
  const [catalogos, setCatalogos] = useState<Catalogo[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [viewingCatalog, setViewingCatalog] = useState<Catalogo | null>(null);
  const [modalProductos, setModalProductos] = useState<ProductoVista[]>([]);
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    const fetchCatalogos = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("catalogos")
        .select("id, nombre, nombre_negocio, plantilla_id, colores, estado, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setCatalogos(data ?? []);
      setLoadingCats(false);
    };
    fetchCatalogos();
  }, []);

  const openModal = async (cat: Catalogo) => {
    setViewingCatalog(cat);
    setLoadingModal(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("productos")
      .select("id, nombre, categoria, descripcion, precio, foto_url, orden")
      .eq("catalogo_id", cat.id)
      .order("orden");
    setModalProductos(data ?? []);
    setLoadingModal(false);
  };

  const closeModal = () => setViewingCatalog(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-2xl font-bold text-[#482E1D]">Catálogos</h2>
        <button
          onClick={() => router.push("/dashboard/catalogo/nuevo")}
          className="flex items-center gap-2 px-4 py-2 bg-[#482E1D] text-[#F0DAAE] text-sm font-medium rounded-lg hover:bg-[#895D2B] transition"
        >
          <span className="text-lg leading-none">+</span> Nuevo catálogo
        </button>
      </div>
      <p className="text-gray-500 text-sm mb-6">Tus catálogos creados y listos para descargar.</p>

      {loadingCats ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-[#895D2B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : catalogos.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 border border-[#F0DAAE] text-center">
          <div className="w-16 h-16 bg-[#F0DAAE] rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-[#A3966A]" />
          </div>
          <p className="text-[#482E1D] font-semibold mb-1">Sin catálogos aún</p>
          <p className="text-gray-400 text-sm">Crea tu primer catálogo desde la sección Inicio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {catalogos.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl shadow-md border border-[#F0DAAE] overflow-hidden hover:shadow-lg transition flex flex-col"
            >
              <div
                className="h-3 cursor-pointer"
                style={{ background: cat.colores?.[0] ?? "#895D2B" }}
                onClick={() => openModal(cat)}
              />
              <div className="p-5 flex flex-col flex-1">
                <div
                  className="flex items-start justify-between gap-2 mb-1 cursor-pointer"
                  onClick={() => openModal(cat)}
                >
                  <p className="font-bold text-[#482E1D] text-base leading-tight">{cat.nombre}</p>
                  <span className="text-xs px-2 py-0.5 bg-[#F0DAAE] text-[#895D2B] rounded-full font-medium shrink-0">
                    {cat.estado}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3 cursor-pointer" onClick={() => openModal(cat)}>
                  {cat.nombre_negocio}
                </p>
                <div className="flex items-center gap-1.5 mb-2">
                  {cat.colores?.slice(0, 4).map((c, i) => (
                    <div key={i} className="w-5 h-5 rounded-full border border-white shadow-sm" style={{ background: c }} />
                  ))}
                </div>
                <p className="text-xs text-gray-300 mb-4">
                  {new Date(cat.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                  <button
                    onClick={() => openModal(cat)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-[#895D2B] border border-[#A3966A] rounded-lg hover:bg-[#F0DAAE] transition"
                  >
                    <Eye className="w-3.5 h-3.5" /> Ver
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/catalogo/${cat.id}/editar`)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-[#482E1D] border border-[#A3966A] rounded-lg hover:bg-[#F0DAAE] transition"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Editar
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-white bg-[#895D2B] rounded-lg hover:bg-[#482E1D] transition"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {viewingCatalog && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div
              className="p-6 text-white relative"
              style={{
                background: `linear-gradient(135deg, ${viewingCatalog.colores?.[0] ?? "#895D2B"}, ${viewingCatalog.colores?.[1] ?? "#482E1D"})`,
              }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); closeModal(); }}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition z-10"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="text-sm opacity-80 mb-1">{viewingCatalog.nombre_negocio}</p>
              <h2 className="text-2xl font-bold">{viewingCatalog.nombre}</h2>
              <div className="flex gap-2 mt-3">
                {viewingCatalog.colores?.map((c, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white/50" style={{ background: c }} />
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loadingModal ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-[#895D2B] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : modalProductos.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Este catálogo no tiene productos.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {modalProductos.map(p => (
                    <div key={p.id} className="bg-[#FDFAF5] border border-[#F0DAAE] rounded-xl overflow-hidden">
                      {p.foto_url ? (
                        <img src={p.foto_url} alt={p.nombre} className="w-full h-36 object-cover" />
                      ) : (
                        <div className="w-full h-36 bg-[#F0DAAE] flex items-center justify-center">
                          <Package className="w-8 h-8 text-[#A3966A]" />
                        </div>
                      )}
                      <div className="p-3">
                        <p className="font-semibold text-[#482E1D] text-sm">{p.nombre}</p>
                        {p.categoria && <p className="text-xs text-[#895D2B] mb-0.5">{p.categoria}</p>}
                        {p.precio != null && (
                          <p className="text-sm font-bold text-[#482E1D]">${p.precio.toLocaleString("es-MX")}</p>
                        )}
                        {p.descripcion && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.descripcion}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button
                onClick={() => { closeModal(); router.push(`/dashboard/catalogo/${viewingCatalog.id}/editar`); }}
                className="flex items-center gap-2 px-4 py-2 border border-[#A3966A] text-[#895D2B] rounded-lg hover:bg-[#F0DAAE] transition text-sm"
              >
                <Pencil className="w-4 h-4" /> Editar catálogo
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-[#895D2B] text-white rounded-lg hover:bg-[#482E1D] transition text-sm"
              >
                <Download className="w-4 h-4" /> Descargar PDF
              </button>
            </div>
          </div>
        </div>
      )}
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
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState<Section>(
    (searchParams.get("seccion") as Section) ?? "inicio"
  );
  const catalogoCreado = searchParams.get("created") === "true";

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
          {catalogoCreado && activeSection === "catalogos" && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm text-center">
              ¡Catálogo creado exitosamente!
            </div>
          )}
          {activeSection === "inicio" && <SectionInicio username={username} />}
          {activeSection === "catalogos" && <SectionCatalogos />}
          {activeSection === "productos" && <SectionProductos />}
        </main>
      </div>
    </div>
  );
}
