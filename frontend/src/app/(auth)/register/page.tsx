"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, KeyRound, Copy, Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestedPassword, setSuggestedPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generateSecurePassword = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "@#$%&*!?";
    const all = upper + lower + numbers + symbols;
    let password = [
      upper[Math.floor(Math.random() * upper.length)],
      lower[Math.floor(Math.random() * lower.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
    ];
    for (let i = 4; i < 14; i++) {
      password.push(all[Math.floor(Math.random() * all.length)]);
    }
    return password.sort(() => Math.random() - 0.5).join("");
  };

  const handleShowSuggestion = () => {
    setSuggestedPassword(generateSecurePassword());
    setShowSuggestion(true);
  };

  const handleUsePassword = () => {
    setFormData({ ...formData, password: suggestedPassword });
    setShowPassword(true);
    setShowSuggestion(false);
  };

  const handleCopySuggestion = () => {
    navigator.clipboard.writeText(suggestedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // TODO: implementar registro con Supabase
      // const { error } = await supabase.auth.signUp({
      //   email: formData.email,
      //   password: formData.password,
      //   options: { data: { username: formData.username } },
      // });
      // if (error) throw error;
      router.push("/login");
    } catch {
      setError("Error al crear la cuenta. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-[#482E1D] mb-8">
          Crear cuenta
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-[#895D2B] mb-1">
              Nombre de usuario
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-[#A3966A]" />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Ingrese su usuario"
                className="w-full pl-10 pr-4 py-3 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] focus:border-transparent text-[#482E1D] placeholder-gray-400 transition"
                required
                minLength={3}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#895D2B] mb-1">
              Correo electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-[#A3966A]" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ingrese su correo"
                className="w-full pl-10 pr-4 py-3 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] focus:border-transparent text-[#482E1D] placeholder-gray-400 transition"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#895D2B] mb-1">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#A3966A]" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingrese su contraseña"
                className="w-full pl-10 pr-11 py-3 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] focus:border-transparent text-[#482E1D] placeholder-gray-400 transition"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-[#A3966A] hover:text-[#895D2B] transition"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={handleShowSuggestion}
                className="mt-2 flex items-center gap-2 text-sm text-[#895D2B] hover:text-[#482E1D] transition font-medium"
              >
                <KeyRound className="h-4 w-4" />
                Usar contraseña segura
              </button>

              {showSuggestion && (
                <div className="mt-2 p-3 bg-[#F0DAAE] border border-[#A3966A] rounded-lg">
                  <p className="text-xs text-[#895D2B] font-medium mb-1">Contraseña sugerida:</p>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-sm text-[#482E1D] font-mono break-all flex-1">
                      {suggestedPassword}
                    </code>
                    <div className="flex gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={handleCopySuggestion}
                        className="p-1.5 rounded hover:bg-[#895D2B] hover:text-white text-[#895D2B] transition"
                        title="Copiar"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={handleUsePassword}
                      className="flex-1 py-1.5 text-xs bg-[#482E1D] text-[#F0DAAE] font-bold rounded hover:bg-[#895D2B] transition"
                    >
                      Usar esta contraseña
                    </button>
                    <button
                      type="button"
                      onClick={() => setSuggestedPassword(generateSecurePassword())}
                      className="flex-1 py-1.5 text-xs border border-[#895D2B] text-[#895D2B] font-medium rounded hover:bg-[#895D2B] hover:text-white transition"
                    >
                      Generar otra
                    </button>
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1 ml-1">Mínimo 6 caracteres</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#482E1D] text-[#F0DAAE] font-bold rounded-lg hover:bg-[#895D2B] active:bg-[#90553C] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Creando cuenta..." : "Crear"}
          </button>
        </form>

        <p className="text-center mt-5 text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="text-[#895D2B] font-bold hover:text-[#482E1D] hover:underline transition"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
