"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  ArrowLeft, ArrowRight, Check, Plus, Trash2, Upload, X,
  Building2, Phone, Mail, Globe,
} from "lucide-react";

const PLANTILLAS = [
  { id: "clasico", nombre: "Clásico", descripcion: "2 columnas · imagen y texto centrado" },
  { id: "moderno", nombre: "Moderno", descripcion: "3 columnas · estilo grid limpio" },
  { id: "elegante", nombre: "Elegante", descripcion: "Imagen grande · descripción lateral" },
  { id: "compacto", nombre: "Compacto", descripcion: "4 columnas · máximos productos" },
  { id: "editorial", nombre: "Editorial", descripcion: "Destacado grande · grilla mixta" },
];

function PlantillaPreview({ id, active }: { id: string; active: boolean }) {
  const bg = active ? "bg-[#F0DAAE]/50" : "bg-gray-50";
  const block = "bg-gray-300 rounded";
  const line = "h-1.5 bg-gray-200 rounded";
  if (id === "clasico") return (
    <div className={`w-full h-20 flex gap-2 p-2 ${bg}`}>
      {[0, 1].map(i => (
        <div key={i} className="flex-1 flex flex-col gap-1">
          <div className={`flex-1 ${block}`} />
          <div className={line} />
          <div className={`${line} w-2/3 mx-auto`} />
        </div>
      ))}
    </div>
  );
  if (id === "moderno") return (
    <div className={`w-full h-20 flex gap-1.5 p-2 ${bg}`}>
      {[0, 1, 2].map(i => (
        <div key={i} className="flex-1 flex flex-col gap-1">
          <div className={`flex-1 ${block}`} />
          <div className={line} />
        </div>
      ))}
    </div>
  );
  if (id === "elegante") return (
    <div className={`w-full h-20 flex gap-2 p-2 ${bg}`}>
      <div className={`w-1/2 ${block}`} />
      <div className="flex-1 flex flex-col gap-1 justify-center">
        <div className={`h-2 ${block}`} />
        <div className={line} />
        <div className={`${line} w-3/4`} />
      </div>
    </div>
  );
  if (id === "compacto") return (
    <div className={`w-full h-20 flex gap-1 p-2 ${bg}`}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="flex-1 flex flex-col gap-0.5">
          <div className={`flex-1 ${block}`} />
          <div className="h-1 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
  return (
    <div className={`w-full h-20 flex gap-1.5 p-2 ${bg}`}>
      <div className={`w-1/2 ${block}`} />
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex gap-1 flex-1">
          <div className={`flex-1 ${block}`} /><div className={`flex-1 ${block}`} />
        </div>
        <div className="flex gap-1 flex-1">
          <div className={`flex-1 ${block}`} /><div className={`flex-1 ${block}`} />
        </div>
      </div>
    </div>
  );
}

type Contacto = { telefono: string; email: string; web: string };
type ProductoEditable = {
  id?: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  precio: string;
  foto: File | null;
  fotoPreview: string;
  fotoUrl: string;
};
type FormData = {
  nombreNegocio: string;
  logo: File | null;
  logoPreview: string;
  logoUrl: string;
  contacto: Contacto;
  nombreCatalogo: string;
  colores: string[];
  plantillaId: string;
};

const STEP_LABELS = ["Negocio", "Catálogo", "Productos"];

export default function EditarCatalogoPage() {
  const router = useRouter();
  const params = useParams();
  const catalogoId = params.id as string;
  const logoRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [deletedProductIds, setDeletedProductIds] = useState<string[]>([]);

  const [form, setForm] = useState<FormData>({
    nombreNegocio: "",
    logo: null,
    logoPreview: "",
    logoUrl: "",
    contacto: { telefono: "", email: "", web: "" },
    nombreCatalogo: "",
    colores: ["#482E1D", "#895D2B", "#F0DAAE"],
    plantillaId: "clasico",
  });

  const [productos, setProductos] = useState<ProductoEditable[]>([
    { nombre: "", categoria: "", descripcion: "", precio: "", foto: null, fotoPreview: "", fotoUrl: "" },
  ]);

  useEffect(() => {
    const loadData = async () => {
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

      const contacto = cat.contacto as Contacto ?? { telefono: "", email: "", web: "" };
      setForm({
        nombreNegocio: cat.nombre_negocio ?? "",
        logo: null,
        logoPreview: cat.logo_url ?? "",
        logoUrl: cat.logo_url ?? "",
        contacto: {
          telefono: contacto.telefono ?? "",
          email: contacto.email ?? "",
          web: contacto.web ?? "",
        },
        nombreCatalogo: cat.nombre ?? "",
        colores: cat.colores ?? ["#482E1D", "#895D2B", "#F0DAAE"],
        plantillaId: cat.plantilla_id ?? "clasico",
      });

      const { data: prods } = await supabase
        .from("productos")
        .select("*")
        .eq("catalogo_id", catalogoId)
        .order("orden");

      if (prods && prods.length > 0) {
        setProductos(prods.map(p => ({
          id: p.id,
          nombre: p.nombre ?? "",
          categoria: p.categoria ?? "",
          descripcion: p.descripcion ?? "",
          precio: p.precio != null ? String(p.precio) : "",
          foto: null,
          fotoPreview: p.foto_url ?? "",
          fotoUrl: p.foto_url ?? "",
        })));
      }

      setLoadingData(false);
    };
    loadData();
  }, [catalogoId, router]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm({ ...form, logo: file, logoPreview: URL.createObjectURL(file) });
  };

  const handleColorChange = (index: number, value: string) => {
    const updated = [...form.colores];
    updated[index] = value;
    setForm({ ...form, colores: updated });
  };

  const addColor = () => {
    if (form.colores.length < 4) setForm({ ...form, colores: [...form.colores, "#A3966A"] });
  };

  const removeColor = (index: number) => {
    if (form.colores.length <= 1) return;
    setForm({ ...form, colores: form.colores.filter((_, i) => i !== index) });
  };

  const handleProductoChange = (index: number, field: keyof ProductoEditable, value: string) => {
    const updated = [...productos];
    updated[index] = { ...updated[index], [field]: value };
    setProductos(updated);
  };

  const handleProductoFoto = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const updated = [...productos];
    updated[index] = { ...updated[index], foto: file, fotoPreview: URL.createObjectURL(file) };
    setProductos(updated);
  };

  const addProducto = () => setProductos([
    ...productos,
    { nombre: "", categoria: "", descripcion: "", precio: "", foto: null, fotoPreview: "", fotoUrl: "" },
  ]);

  const removeProducto = (index: number) => {
    if (productos.length === 1) return;
    const prod = productos[index];
    if (prod.id) setDeletedProductIds([...deletedProductIds, prod.id]);
    setProductos(productos.filter((_, i) => i !== index));
  };

  const canNext = () => {
    if (step === 1) return form.nombreNegocio.trim() !== "";
    if (step === 2) return form.nombreCatalogo.trim() !== "";
    return true;
  };

  const uploadFile = async (
    supabase: ReturnType<typeof createClient>,
    file: File,
    path: string
  ): Promise<string> => {
    const { error } = await supabase.storage.from("catalogo-assets").upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("catalogo-assets").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      const uid = user.id;
      const ts = Date.now();

      let logoUrl = form.logoUrl;
      if (form.logo) {
        logoUrl = await uploadFile(supabase, form.logo, `${uid}/logos/logo_${ts}`);
      }

      const { error: catError } = await supabase
        .from("catalogos")
        .update({
          nombre: form.nombreCatalogo,
          nombre_negocio: form.nombreNegocio,
          logo_url: logoUrl || null,
          contacto: form.contacto,
          colores: form.colores,
          plantilla_id: form.plantillaId,
        })
        .eq("id", catalogoId)
        .eq("user_id", uid);

      if (catError) throw catError;

      if (deletedProductIds.length > 0) {
        await supabase.from("productos").delete().in("id", deletedProductIds);
      }

      const productosValidos = productos.filter(p => p.nombre.trim() !== "");
      for (let i = 0; i < productosValidos.length; i++) {
        const p = productosValidos[i];
        let fotoUrl = p.fotoUrl;
        if (p.foto) {
          fotoUrl = await uploadFile(supabase, p.foto, `${uid}/productos/${catalogoId}_${i}_${ts}`);
        }
        const productoData = {
          catalogo_id: catalogoId,
          user_id: uid,
          nombre: p.nombre,
          categoria: p.categoria || null,
          descripcion: p.descripcion || null,
          precio: p.precio ? parseFloat(p.precio) : null,
          foto_url: fotoUrl || null,
          orden: i,
        };
        if (p.id) {
          await supabase.from("productos").update(productoData).eq("id", p.id);
        } else {
          await supabase.from("productos").insert(productoData);
        }
      }

      router.push("/dashboard?seccion=catalogos");
    } catch (err: unknown) {
      console.error("Error al actualizar catálogo:", err);
      const msg = err instanceof Error ? err.message
        : (err as { message?: string })?.message ?? JSON.stringify(err);
      setError(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-[#F0DAAE] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#895D2B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0DAAE]">
      <header className="bg-[#482E1D] text-[#F0DAAE] px-6 py-4 flex items-center gap-4 shadow-md">
        <button onClick={() => router.push("/dashboard?seccion=catalogos")} className="hover:text-[#F0DAAE]/70 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold tracking-wide">Editar Catálogo</h1>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const done = step > n;
            const active = step === n;
            return (
              <div key={n} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  done ? "bg-green-500 text-white" : active ? "bg-[#895D2B] text-[#F0DAAE]" : "bg-white text-[#A3966A] border border-[#A3966A]"
                }`}>
                  {done ? <Check className="w-4 h-4" /> : n}
                </div>
                <span className={`text-sm font-medium ${active ? "text-[#482E1D]" : "text-[#A3966A]"}`}>{label}</span>
                {i < STEP_LABELS.length - 1 && <div className="w-8 h-px bg-[#A3966A] mx-1" />}
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-[#482E1D] mb-4">Información del negocio</h2>
              <div>
                <label className="block text-sm font-medium text-[#895D2B] mb-1">Nombre del negocio *</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3966A]" />
                  <input
                    type="text"
                    value={form.nombreNegocio}
                    onChange={e => setForm({ ...form, nombreNegocio: e.target.value })}
                    placeholder="Ej: Mi Tienda"
                    className="w-full pl-10 pr-4 py-3 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] text-[#482E1D] placeholder-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#895D2B] mb-1">
                  Logo <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <div
                  onClick={() => logoRef.current?.click()}
                  className="border-2 border-dashed border-[#A3966A] rounded-xl p-5 text-center cursor-pointer hover:border-[#895D2B] transition"
                >
                  {form.logoPreview ? (
                    <div className="flex items-center justify-center gap-3">
                      <img src={form.logoPreview} alt="Logo" className="h-16 object-contain rounded" />
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); setForm({ ...form, logo: null, logoPreview: "", logoUrl: "" }); }}
                        className="text-red-400 hover:text-red-600 transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-[#A3966A]">
                      <Upload className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-sm">Subir logo</p>
                    </div>
                  )}
                </div>
                <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3966A]" />
                  <input type="tel" value={form.contacto.telefono}
                    onChange={e => setForm({ ...form, contacto: { ...form.contacto, telefono: e.target.value } })}
                    placeholder="Teléfono (opcional)"
                    className="w-full pl-10 pr-4 py-3 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] text-[#482E1D] placeholder-gray-400"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3966A]" />
                  <input type="email" value={form.contacto.email}
                    onChange={e => setForm({ ...form, contacto: { ...form.contacto, email: e.target.value } })}
                    placeholder="Email (opcional)"
                    className="w-full pl-10 pr-4 py-3 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] text-[#482E1D] placeholder-gray-400"
                  />
                </div>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3966A]" />
                  <input type="text" value={form.contacto.web}
                    onChange={e => setForm({ ...form, contacto: { ...form.contacto, web: e.target.value } })}
                    placeholder="Instagram o web (opcional)"
                    className="w-full pl-10 pr-4 py-3 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] text-[#482E1D] placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#482E1D] mb-4">Configuración del catálogo</h2>
              <div>
                <label className="block text-sm font-medium text-[#895D2B] mb-1">Nombre del catálogo *</label>
                <input type="text" value={form.nombreCatalogo}
                  onChange={e => setForm({ ...form, nombreCatalogo: e.target.value })}
                  placeholder="Ej: Colección Verano 2025"
                  className="w-full px-4 py-3 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] text-[#482E1D] placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#895D2B] mb-2">
                  Paleta de colores <span className="text-gray-400 font-normal">(opcional · máx. 4)</span>
                </label>
                <div className="flex flex-wrap gap-3 items-center">
                  {form.colores.map((color, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5">
                      <input type="color" value={color}
                        onChange={e => handleColorChange(i, e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-xs text-gray-500 font-mono">{color}</span>
                      {form.colores.length > 1 && (
                        <button type="button" onClick={() => removeColor(i)} className="text-gray-400 hover:text-red-500 transition">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  {form.colores.length < 4 && (
                    <button type="button" onClick={addColor}
                      className="flex items-center gap-1 text-sm text-[#895D2B] hover:text-[#482E1D] border border-dashed border-[#A3966A] rounded-lg px-3 py-2 transition"
                    >
                      <Plus className="w-4 h-4" /> Agregar
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#895D2B] mb-3">Plantilla de diseño</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PLANTILLAS.map(p => (
                    <button key={p.id} type="button" onClick={() => setForm({ ...form, plantillaId: p.id })}
                      className={`text-left border-2 rounded-xl overflow-hidden transition-all ${
                        form.plantillaId === p.id ? "border-[#895D2B] shadow-md" : "border-gray-200 hover:border-[#A3966A]"
                      }`}
                    >
                      <PlantillaPreview id={p.id} active={form.plantillaId === p.id} />
                      <div className="px-3 py-2 border-t border-gray-100">
                        <p className="text-sm font-semibold text-[#482E1D]">{p.nombre}</p>
                        <p className="text-xs text-gray-400">{p.descripcion}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#482E1D]">Productos</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Solo el nombre es obligatorio</p>
                </div>
                <button type="button" onClick={addProducto}
                  className="flex items-center gap-2 px-4 py-2 bg-[#482E1D] text-[#F0DAAE] text-sm font-medium rounded-lg hover:bg-[#895D2B] transition"
                >
                  <Plus className="w-4 h-4" /> Agregar
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
              )}

              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                {productos.map((prod, i) => (
                  <ProductoItem
                    key={prod.id ?? `new-${i}`}
                    index={i}
                    producto={prod}
                    total={productos.length}
                    onChange={handleProductoChange}
                    onFoto={handleProductoFoto}
                    onRemove={removeProducto}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => step > 1 ? setStep(step - 1) : router.push("/dashboard?seccion=catalogos")}
              className="flex items-center gap-2 px-5 py-2.5 border border-[#A3966A] text-[#895D2B] rounded-lg hover:bg-[#F0DAAE] transition text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              {step === 1 ? "Cancelar" : "Atrás"}
            </button>

            {step < 3 ? (
              <button type="button" onClick={() => setStep(step + 1)} disabled={!canNext()}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#482E1D] text-[#F0DAAE] rounded-lg hover:bg-[#895D2B] transition text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#895D2B] text-[#F0DAAE] rounded-lg hover:bg-[#482E1D] transition text-sm font-bold disabled:opacity-60"
              >
                {loading ? "Guardando..." : <><Check className="w-4 h-4" /> Guardar cambios</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductoItem({
  index, producto, total, onChange, onFoto, onRemove,
}: {
  index: number;
  producto: ProductoEditable;
  total: number;
  onChange: (i: number, field: keyof ProductoEditable, value: string) => void;
  onFoto: (i: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (i: number) => void;
}) {
  const fotoRef = useRef<HTMLInputElement>(null);
  return (
    <div className="border border-[#F0DAAE] rounded-xl p-4 bg-[#FDFAF5]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-[#895D2B]">Producto {index + 1}</span>
        {total > 1 && (
          <button type="button" onClick={() => onRemove(index)} className="text-gray-400 hover:text-red-500 transition">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          onClick={() => fotoRef.current?.click()}
          className="sm:col-span-2 border-2 border-dashed border-[#A3966A] rounded-lg p-3 text-center cursor-pointer hover:border-[#895D2B] transition"
        >
          {producto.fotoPreview ? (
            <img src={producto.fotoPreview} alt="Foto" className="h-24 object-contain mx-auto rounded" />
          ) : (
            <div className="text-[#A3966A] py-2">
              <Upload className="w-5 h-5 mx-auto mb-0.5" />
              <p className="text-xs">Foto del producto (opcional)</p>
            </div>
          )}
        </div>
        <input ref={fotoRef} type="file" accept="image/*" className="hidden" onChange={e => onFoto(index, e)} />

        <input type="text" value={producto.nombre}
          onChange={e => onChange(index, "nombre", e.target.value)}
          placeholder="Nombre *"
          className="sm:col-span-2 w-full px-3 py-2.5 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] text-[#482E1D] placeholder-gray-400 text-sm"
        />
        <input type="text" value={producto.categoria}
          onChange={e => onChange(index, "categoria", e.target.value)}
          placeholder="Categoría (opcional)"
          className="w-full px-3 py-2.5 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] text-[#482E1D] placeholder-gray-400 text-sm"
        />
        <input type="number" value={producto.precio}
          onChange={e => onChange(index, "precio", e.target.value)}
          placeholder="Precio (opcional)"
          min="0"
          className="w-full px-3 py-2.5 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] text-[#482E1D] placeholder-gray-400 text-sm"
        />
        <textarea value={producto.descripcion}
          onChange={e => onChange(index, "descripcion", e.target.value)}
          placeholder="Descripción (opcional)"
          rows={2}
          className="sm:col-span-2 w-full px-3 py-2.5 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] text-[#482E1D] placeholder-gray-400 text-sm resize-none"
        />
      </div>
    </div>
  );
}
