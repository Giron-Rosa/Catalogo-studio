"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { ArrowLeft, Printer } from "lucide-react";

type Contacto = { telefono?: string; email?: string; web?: string };
type Catalogo = {
  id: string;
  nombre: string;
  nombre_negocio: string;
  logo_url: string | null;
  contacto: Contacto | null;
  colores: string[];
  plantilla_id: string;
  estado: string;
};
type Producto = {
  id: string;
  nombre: string;
  categoria: string | null;
  descripcion: string | null;
  precio: number | null;
  foto_url: string | null;
  orden: number;
};

export default function VerCatalogoPage() {
  const router = useRouter();
  const params = useParams();
  const catalogoId = params.id as string;

  const [catalogo, setCatalogo] = useState<Catalogo | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: cat } = await supabase
        .from("catalogos")
        .select("*")
        .eq("id", catalogoId)
        .eq("user_id", user.id)
        .single();

      if (!cat) { router.push("/dashboard?seccion=catalogos"); return; }

      const { data: prods } = await supabase
        .from("productos")
        .select("id, nombre, categoria, descripcion, precio, foto_url, orden")
        .eq("catalogo_id", catalogoId)
        .order("orden");

      setCatalogo(cat as Catalogo);
      setProductos(prods ?? []);
      setLoading(false);
    };
    load();
  }, [catalogoId, router]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#895D2B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!catalogo) return null;

  const primary = catalogo.colores?.[0] ?? "#895D2B";
  const secondary = catalogo.colores?.[1] ?? "#482E1D";
  const accent = catalogo.colores?.[2] ?? "#F0DAAE";
  const template = catalogo.plantilla_id ?? "clasico";

  const gridClass: Record<string, string> = {
    clasico: "grid-cols-2",
    moderno: "grid-cols-3",
    elegante: "grid-cols-2",
    compacto: "grid-cols-4",
    editorial: "grid-cols-3",
  };

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
          .catalog-page { box-shadow: none !important; }
        }
        @page {
          size: A4;
          margin: 0;
        }
      `}</style>

      {/* Toolbar (hidden on print) */}
      <div className="no-print fixed top-0 left-0 right-0 z-50 bg-[#482E1D] text-[#F0DAAE] px-6 py-3 flex items-center justify-between shadow-lg">
        <button
          onClick={() => router.push("/dashboard?seccion=catalogos")}
          className="flex items-center gap-2 text-sm hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        <span className="text-sm font-medium opacity-70">Vista previa · {catalogo.nombre}</span>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-[#895D2B] hover:bg-[#90553C] text-white text-sm font-bold rounded-lg transition"
        >
          <Printer className="w-4 h-4" />
          Imprimir / Guardar PDF
        </button>
      </div>

      {/* Catalog content */}
      <div className="min-h-screen bg-gray-100 pt-16 pb-12 no-print-padding">
        <div
          className="catalog-page bg-white max-w-4xl mx-auto shadow-2xl"
          style={{ minHeight: "297mm" }}
        >
          {/* Header */}
          <div
            className="relative px-12 py-10"
            style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}
          >
            <div className="flex items-center justify-between">
              <div className="text-white">
                {catalogo.logo_url && (
                  <img
                    src={catalogo.logo_url}
                    alt="Logo"
                    className="h-16 object-contain mb-4 rounded"
                  />
                )}
                <p className="text-sm uppercase tracking-widest opacity-70 mb-1">
                  {catalogo.nombre_negocio}
                </p>
                <h1 className="text-4xl font-bold leading-tight">{catalogo.nombre}</h1>
              </div>
              <div className="flex flex-col gap-2 items-end text-white/80 text-sm">
                {catalogo.contacto?.telefono && <p>📞 {catalogo.contacto.telefono}</p>}
                {catalogo.contacto?.email && <p>✉ {catalogo.contacto.email}</p>}
                {catalogo.contacto?.web && <p>🌐 {catalogo.contacto.web}</p>}
              </div>
            </div>
            {/* Color palette strip */}
            <div className="flex gap-1 mt-6">
              {catalogo.colores?.map((c, i) => (
                <div key={i} className="h-1 flex-1 rounded-full opacity-60" style={{ background: c }} />
              ))}
            </div>
          </div>

          {/* Products section */}
          <div className="px-10 py-8">
            {productos.length === 0 ? (
              <p className="text-center text-gray-400 py-16">Este catálogo no tiene productos.</p>
            ) : template === "elegante" ? (
              /* Elegant: alternating image/text */
              <div className="space-y-8">
                {productos.map((p, i) => (
                  <div
                    key={p.id}
                    className={`flex gap-6 items-center ${i % 2 === 1 ? "flex-row-reverse" : ""}`}
                  >
                    <div className="w-1/2 shrink-0">
                      {p.foto_url ? (
                        <img
                          src={p.foto_url}
                          alt={p.nombre}
                          className="w-full h-56 object-cover rounded-xl"
                        />
                      ) : (
                        <div
                          className="w-full h-56 rounded-xl flex items-center justify-center text-4xl"
                          style={{ background: accent }}
                        >
                          📦
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      {p.categoria && (
                        <p className="text-xs uppercase tracking-wider mb-1" style={{ color: primary }}>
                          {p.categoria}
                        </p>
                      )}
                      <h3 className="text-xl font-bold mb-2" style={{ color: secondary }}>{p.nombre}</h3>
                      {p.descripcion && (
                        <p className="text-gray-500 text-sm leading-relaxed mb-3">{p.descripcion}</p>
                      )}
                      {p.precio != null && (
                        <p className="text-2xl font-bold" style={{ color: primary }}>
                          ${p.precio.toLocaleString("es-MX")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Grid templates: clasico, moderno, compacto, editorial */
              <div className={`grid ${gridClass[template] ?? "grid-cols-2"} gap-5`}>
                {productos.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-xl overflow-hidden border"
                    style={{ borderColor: accent }}
                  >
                    {p.foto_url ? (
                      <img
                        src={p.foto_url}
                        alt={p.nombre}
                        className={`w-full object-cover ${
                          template === "compacto" ? "h-24" : "h-44"
                        }`}
                      />
                    ) : (
                      <div
                        className={`w-full flex items-center justify-center text-3xl ${
                          template === "compacto" ? "h-24" : "h-44"
                        }`}
                        style={{ background: accent }}
                      >
                        📦
                      </div>
                    )}
                    <div className="p-3">
                      {p.categoria && (
                        <p
                          className="text-xs uppercase tracking-wide mb-0.5"
                          style={{ color: primary }}
                        >
                          {p.categoria}
                        </p>
                      )}
                      <p className="font-bold text-sm" style={{ color: secondary }}>{p.nombre}</p>
                      {p.descripcion && template !== "compacto" && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.descripcion}</p>
                      )}
                      {p.precio != null && (
                        <p className="text-base font-bold mt-1" style={{ color: primary }}>
                          ${p.precio.toLocaleString("es-MX")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="px-12 py-4 flex items-center justify-between text-white text-xs"
            style={{ background: secondary }}
          >
            <span>{catalogo.nombre_negocio}</span>
            <div className="flex gap-1">
              {catalogo.colores?.map((c, i) => (
                <div key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <span>{catalogo.nombre}</span>
          </div>
        </div>
      </div>
    </>
  );
}
