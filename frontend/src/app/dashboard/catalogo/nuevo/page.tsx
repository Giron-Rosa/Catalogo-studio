"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  ArrowLeft, ArrowRight, Check, Plus, Trash2, Upload, X,
  Building2, Phone, Mail, Globe, MapPin, UserRound,
} from "lucide-react";

const PLANTILLAS = [
  {
    id: "clasico",
    nombre: "Clásico",
    descripcion: "2 columnas · imagen y texto centrado",
  },
  {
    id: "moderno",
    nombre: "Moderno",
    descripcion: "3 columnas · estilo grid limpio",
  },
  {
    id: "elegante",
    nombre: "Elegante",
    descripcion: "Imagen grande · descripción lateral",
  },
  {
    id: "compacto",
    nombre: "Compacto",
    descripcion: "4 columnas · máximos productos",
  },
  {
    id: "editorial",
    nombre: "Editorial",
    descripcion: "Destacado grande · grilla mixta",
  },
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
        <div className={`${line} w-1/2`} />
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
          <div className={`flex-1 ${block}`} />
          <div className={`flex-1 ${block}`} />
        </div>
        <div className="flex gap-1 flex-1">
          <div className={`flex-1 ${block}`} />
          <div className={`flex-1 ${block}`} />
        </div>
      </div>
    </div>
  );
}

type Contacto = { telefono: string; email: string; web: string };
type Autor = {
  nombre: string;
  ciudad: string;
  descripcion: string;
  mensaje: string;
  foto: File | null;
  fotoPreview: string;
};
type Producto = {
  nombre: string;
  categoria: string;
  descripcion: string;
  precio: string;
  foto: File | null;
  fotoPreview: string;
};
type FormData = {
  nombreNegocio: string;
  logo: File | null;
  logoPreview: string;
  contacto: Contacto;
  nombreContacto: string;
  descripcionNegocio: string;
  ubicacion: string;
  fotoFinal: File | null;
  fotoFinalPreview: string;
  nombreCatalogo: string;
  colores: string[];
  plantillaId: string;
};

const EMPTY_PRODUCTO: Producto = {
  nombre: "", categoria: "", descripcion: "", precio: "", foto: null, fotoPreview: "",
};
const EMPTY_AUTOR: Autor = {
  nombre: "", ciudad: "", descripcion: "", mensaje: "", foto: null, fotoPreview: "",
};

const STEP_LABELS = ["Negocio", "Catálogo", "Productos"];

export default function NuevoCatalogoPage() {
  const router = useRouter();
  const logoRef = useRef<HTMLInputElement>(null);
  const fotoFinalRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormData>({
    nombreNegocio: "",
    logo: null,
    logoPreview: "",
    contacto: { telefono: "", email: "", web: "" },
    nombreContacto: "",
    descripcionNegocio: "",
    ubicacion: "",
    fotoFinal: null,
    fotoFinalPreview: "",
    nombreCatalogo: "",
    colores: ["#482E1D", "#895D2B", "#F0DAAE"],
    plantillaId: "clasico",
  });

  const [productos, setProductos] = useState<Producto[]>([{ ...EMPTY_PRODUCTO }]);
  const [autores, setAutores] = useState<Autor[]>([]);

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

  const handleProductoChange = (index: number, field: keyof Producto, value: string) => {
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

  const addProducto = () => setProductos([...productos, { ...EMPTY_PRODUCTO }]);
  const removeProducto = (index: number) => {
    if (productos.length === 1) return;
    setProductos(productos.filter((_, i) => i !== index));
  };

  const handleFotoFinalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(f => ({ ...f, fotoFinal: file, fotoFinalPreview: URL.createObjectURL(file) }));
  };

  const addAutor = () => setAutores(a => [...a, { ...EMPTY_AUTOR }]);
  const removeAutor = (index: number) => setAutores(a => a.filter((_, i) => i !== index));
  const updateAutor = (index: number, field: keyof Omit<Autor, "foto" | "fotoPreview">, value: string) => {
    setAutores(a => a.map((au, i) => i === index ? { ...au, [field]: value } : au));
  };
  const handleAutorFoto = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAutores(a => a.map((au, i) => i === index ? { ...au, foto: file, fotoPreview: URL.createObjectURL(file) } : au));
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

      let logoUrl: string | null = null;
      if (form.logo) {
        logoUrl = await uploadFile(supabase, form.logo, `${uid}/logos/logo_${ts}`);
      }

      let fotoFinalUrl: string | null = null;
      if (form.fotoFinal) {
        fotoFinalUrl = await uploadFile(supabase, form.fotoFinal, `${uid}/final/foto_final_${ts}`);
      }

      const autoresData = await Promise.all(autores.map(async (a, i) => {
        let fotoUrl: string | null = null;
        if (a.foto) {
          fotoUrl = await uploadFile(supabase, a.foto, `${uid}/autores/autor_${i}_${ts}`);
        }
        return { nombre: a.nombre, ciudad: a.ciudad, descripcion: a.descripcion, mensaje: a.mensaje, foto_url: fotoUrl };
      }));

      const { data: catalogo, error: catError } = await supabase
        .from("catalogos")
        .insert({
          user_id: uid,
          nombre: form.nombreCatalogo,
          nombre_negocio: form.nombreNegocio,
          logo_url: logoUrl,
          contacto: form.contacto,
          nombre_contacto: form.nombreContacto || null,
          descripcion: form.descripcionNegocio || null,
          ubicacion: form.ubicacion || null,
          foto_final_url: fotoFinalUrl,
          autores: autoresData,
          colores: form.colores,
          plantilla_id: form.plantillaId,
          estado: "borrador",
        })
        .select()
        .single();

      if (catError) throw catError;

      const productosValidos = productos.filter(p => p.nombre.trim() !== "");
      for (let i = 0; i < productosValidos.length; i++) {
        const p = productosValidos[i];
        let fotoUrl: string | null = null;
        if (p.foto) {
          fotoUrl = await uploadFile(supabase, p.foto, `${uid}/productos/${catalogo.id}_${i}_${ts}`);
        }
        await supabase.from("productos").insert({
          catalogo_id: catalogo.id,
          user_id: uid,
          nombre: p.nombre,
          categoria: p.categoria || null,
          descripcion: p.descripcion || null,
          precio: p.precio ? parseFloat(p.precio) : null,
          foto_url: fotoUrl,
          orden: i,
        });
      }

      router.push("/dashboard?seccion=catalogos&created=true");
    } catch (err: unknown) {
      console.error("Error al guardar catálogo:", err);
      const msg = err instanceof Error ? err.message
        : (err as { message?: string })?.message ?? JSON.stringify(err);
      setError(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0DAAE]">
      <header className="bg-[#482E1D] text-[#F0DAAE] px-6 py-4 flex items-center gap-4 shadow-md">
        <button onClick={() => router.push("/dashboard")} className="hover:text-[#F0DAAE]/70 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold tracking-wide">Nuevo Catálogo</h1>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Step indicator */}
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
            <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
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
                        onClick={e => { e.stopPropagation(); setForm({ ...form, logo: null, logoPreview: "" }); }}
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

              <div>
                <label className="block text-sm font-medium text-[#895D2B] mb-1">Nombre del contacto <span className="text-gray-400 font-normal">(opcional)</span></label>
                <div className="relative">
                  <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3966A]" />
                  <input
                    type="text"
                    value={form.nombreContacto}
                    onChange={e => setForm({ ...form, nombreContacto: e.target.value })}
                    placeholder="Ej: Andrea Lurita"
                    className="w-full pl-10 pr-4 py-3 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] text-[#482E1D] placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#895D2B] mb-1">Descripción breve <span className="text-gray-400 font-normal">(opcional)</span></label>
                <textarea
                  value={form.descripcionNegocio}
                  onChange={e => setForm({ ...form, descripcionNegocio: e.target.value })}
                  placeholder="Describe brevemente tu empresa o negocio..."
                  rows={3}
                  className="w-full px-4 py-3 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] text-[#482E1D] placeholder-gray-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#895D2B] mb-1">Ubicación <span className="text-gray-400 font-normal">(opcional)</span></label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3966A]" />
                  <input
                    type="text"
                    value={form.ubicacion}
                    onChange={e => setForm({ ...form, ubicacion: e.target.value })}
                    placeholder="Ej: Lima, Perú · SJL-Lima, Perú"
                    className="w-full pl-10 pr-4 py-3 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] text-[#482E1D] placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3966A]" />
                  <input
                    type="tel"
                    value={form.contacto.telefono}
                    onChange={e => setForm({ ...form, contacto: { ...form.contacto, telefono: e.target.value } })}
                    placeholder="Teléfono (opcional)"
                    className="w-full pl-10 pr-4 py-3 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] text-[#482E1D] placeholder-gray-400"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3966A]" />
                  <input
                    type="email"
                    value={form.contacto.email}
                    onChange={e => setForm({ ...form, contacto: { ...form.contacto, email: e.target.value } })}
                    placeholder="Email (opcional)"
                    className="w-full pl-10 pr-4 py-3 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] text-[#482E1D] placeholder-gray-400"
                  />
                </div>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3966A]" />
                  <input
                    type="text"
                    value={form.contacto.web}
                    onChange={e => setForm({ ...form, contacto: { ...form.contacto, web: e.target.value } })}
                    placeholder="Instagram o web (opcional)"
                    className="w-full pl-10 pr-4 py-3 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] text-[#482E1D] placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#895D2B] mb-1">
                  Foto para el final del catálogo <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <div
                  onClick={() => fotoFinalRef.current?.click()}
                  className="border-2 border-dashed border-[#A3966A] rounded-xl p-5 text-center cursor-pointer hover:border-[#895D2B] transition"
                >
                  {form.fotoFinalPreview ? (
                    <div className="flex items-center justify-center gap-3">
                      <img src={form.fotoFinalPreview} alt="Foto final" className="h-20 object-contain rounded" />
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); setForm({ ...form, fotoFinal: null, fotoFinalPreview: "" }); }}
                        className="text-red-400 hover:text-red-600 transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-[#A3966A]">
                      <Upload className="w-6 h-6 mx-auto mb-1" />
                      <p className="text-sm">Imagen de producto destacado o de la empresa</p>
                    </div>
                  )}
                </div>
                <input ref={fotoFinalRef} type="file" accept="image/*" className="hidden" onChange={handleFotoFinalChange} />
              </div>

              <div className="border-t border-[#F0DAAE] pt-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-[#482E1D]">Autores / Colaboradores</p>
                    <p className="text-xs text-gray-400">Aparecen al final del catálogo</p>
                  </div>
                  <button
                    type="button"
                    onClick={addAutor}
                    className="flex items-center gap-2 px-3 py-2 bg-[#482E1D] text-[#F0DAAE] text-xs font-bold rounded-lg hover:bg-[#895D2B] transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar Autor
                  </button>
                </div>
                {autores.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-3 border border-dashed border-gray-200 rounded-lg">
                    Sin autores. Haz clic en "Agregar Autor" para añadir.
                  </p>
                )}
                <div className="space-y-4">
                  {autores.map((autor, i) => (
                    <AutorItem
                      key={i}
                      index={i}
                      autor={autor}
                      onUpdate={updateAutor}
                      onFoto={handleAutorFoto}
                      onRemove={removeAutor}
                    />
                  ))}
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
                <input
                  type="text"
                  value={form.nombreCatalogo}
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
                      <input
                        type="color"
                        value={color}
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
                    <button
                      type="button"
                      onClick={addColor}
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
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setForm({ ...form, plantillaId: p.id })}
                      className={`text-left border-2 rounded-xl overflow-hidden transition-all ${
                        form.plantillaId === p.id
                          ? "border-[#895D2B] shadow-md"
                          : "border-gray-200 hover:border-[#A3966A]"
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
                <button
                  type="button"
                  onClick={addProducto}
                  className="flex items-center gap-2 px-4 py-2 bg-[#482E1D] text-[#F0DAAE] text-sm font-medium rounded-lg hover:bg-[#895D2B] transition"
                >
                  <Plus className="w-4 h-4" /> Agregar
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                {productos.map((prod, i) => (
                  <ProductoItem
                    key={i}
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

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => step > 1 ? setStep(step - 1) : router.push("/dashboard")}
              className="flex items-center gap-2 px-5 py-2.5 border border-[#A3966A] text-[#895D2B] rounded-lg hover:bg-[#F0DAAE] transition text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              {step === 1 ? "Cancelar" : "Atrás"}
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!canNext()}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#482E1D] text-[#F0DAAE] rounded-lg hover:bg-[#895D2B] transition text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#895D2B] text-[#F0DAAE] rounded-lg hover:bg-[#482E1D] transition text-sm font-bold disabled:opacity-60"
              >
                {loading ? "Guardando..." : <><Check className="w-4 h-4" /> Crear catálogo</>}
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
  producto: Producto;
  total: number;
  onChange: (i: number, field: keyof Producto, value: string) => void;
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

        <input
          type="text"
          value={producto.nombre}
          onChange={e => onChange(index, "nombre", e.target.value)}
          placeholder="Nombre *"
          className="sm:col-span-2 w-full px-3 py-2.5 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] text-[#482E1D] placeholder-gray-400 text-sm"
        />

        <input
          type="text"
          value={producto.categoria}
          onChange={e => onChange(index, "categoria", e.target.value)}
          placeholder="Categoría (opcional)"
          className="w-full px-3 py-2.5 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] text-[#482E1D] placeholder-gray-400 text-sm"
        />

        <input
          type="number"
          value={producto.precio}
          onChange={e => onChange(index, "precio", e.target.value)}
          placeholder="Precio (opcional)"
          className="w-full px-3 py-2.5 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] text-[#482E1D] placeholder-gray-400 text-sm"
          min="0"
        />

        <textarea
          value={producto.descripcion}
          onChange={e => onChange(index, "descripcion", e.target.value)}
          placeholder="Descripción (opcional)"
          rows={2}
          className="sm:col-span-2 w-full px-3 py-2.5 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] text-[#482E1D] placeholder-gray-400 text-sm resize-none"
        />
      </div>
    </div>
  );
}

function AutorItem({
  index, autor, onUpdate, onFoto, onRemove,
}: {
  index: number;
  autor: Autor;
  onUpdate: (i: number, field: keyof Omit<Autor, "foto" | "fotoPreview">, value: string) => void;
  onFoto: (i: number, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (i: number) => void;
}) {
  const fotoRef = useRef<HTMLInputElement>(null);
  return (
    <div className="border border-[#F0DAAE] rounded-xl p-4 bg-[#FDFAF5]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-[#895D2B]">Autor {index + 1}</span>
        <button type="button" onClick={() => onRemove(index)} className="text-gray-400 hover:text-red-500 transition">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div
          onClick={() => fotoRef.current?.click()}
          className="sm:col-span-2 border-2 border-dashed border-[#A3966A] rounded-lg p-3 text-center cursor-pointer hover:border-[#895D2B] transition"
        >
          {autor.fotoPreview ? (
            <img src={autor.fotoPreview} alt="Foto" className="h-20 object-cover mx-auto rounded-full aspect-square" />
          ) : (
            <div className="text-[#A3966A] py-1">
              <Upload className="w-5 h-5 mx-auto mb-0.5" />
              <p className="text-xs">Foto del autor (opcional)</p>
            </div>
          )}
        </div>
        <input ref={fotoRef} type="file" accept="image/*" className="hidden" onChange={e => onFoto(index, e)} />
        <input
          type="text"
          value={autor.nombre}
          onChange={e => onUpdate(index, "nombre", e.target.value)}
          placeholder="Nombre del autor"
          className="sm:col-span-2 w-full px-3 py-2.5 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] text-[#482E1D] placeholder-gray-400 text-sm"
        />
        <input
          type="text"
          value={autor.ciudad}
          onChange={e => onUpdate(index, "ciudad", e.target.value)}
          placeholder="Ciudad de origen (Ej: Lima, Perú)"
          className="sm:col-span-2 w-full px-3 py-2.5 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] text-[#482E1D] placeholder-gray-400 text-sm"
        />
        <textarea
          value={autor.descripcion}
          onChange={e => onUpdate(index, "descripcion", e.target.value)}
          placeholder="Descripción breve del autor"
          rows={2}
          className="sm:col-span-2 w-full px-3 py-2.5 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] text-[#482E1D] placeholder-gray-400 text-sm resize-none"
        />
        <input
          type="text"
          value={autor.mensaje}
          onChange={e => onUpdate(index, "mensaje", e.target.value)}
          placeholder='Mensaje corto (Ej: "Artesana de corazón")'
          className="sm:col-span-2 w-full px-3 py-2.5 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] text-[#482E1D] placeholder-gray-400 text-sm"
        />
      </div>
    </div>
  );
}
