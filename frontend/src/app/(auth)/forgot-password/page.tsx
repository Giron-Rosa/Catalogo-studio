"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch {
      setError("No se pudo enviar el correo. Verifica que el email sea correcto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-center text-[#482E1D] mb-2">
          Recuperar contraseña
        </h1>
        <p className="text-center text-gray-500 text-sm mb-7">
          Ingresa tu correo y te enviaremos las instrucciones para restablecer tu contraseña.
        </p>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-[#F0DAAE] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-9 h-9 text-[#895D2B]" />
            </div>
            <p className="text-[#482E1D] font-semibold mb-2">¡Correo enviado!</p>
            <p className="text-gray-500 text-sm mb-6">
              Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 text-[#895D2B] font-medium hover:text-[#482E1D] hover:underline transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                {error}
              </div>
            )}

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ingrese su correo"
                  className="w-full pl-10 pr-4 py-3 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] focus:border-transparent text-[#482E1D] placeholder-gray-400 transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#482E1D] text-[#F0DAAE] font-bold rounded-lg hover:bg-[#895D2B] active:bg-[#90553C] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : "Enviar instrucciones"}
            </button>

            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-[#895D2B] text-sm font-medium hover:text-[#482E1D] hover:underline transition mt-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
