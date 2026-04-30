"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Lock, Eye, EyeOff } from "lucide-react";

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

const MicrosoftIcon = () => (
  <svg viewBox="0 0 21 21" className="w-5 h-5" aria-hidden="true">
    <rect x="1" y="1" width="9" height="9" fill="#F25022" />
    <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
    <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
    <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
  </svg>
);

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // TODO: implementar autenticación con Supabase
      // const { error } = await supabase.auth.signInWithPassword({ email: username, password });
      // if (error) throw error;
      // router.push("/dashboard");
    } catch {
      setError("Usuario o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // TODO: implementar OAuth con Google via Supabase
    // await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const handleOutlookLogin = async () => {
    // TODO: implementar OAuth con Microsoft/Outlook via Supabase
    // await supabase.auth.signInWithOAuth({ provider: "azure" });
  };

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-[#482E1D] mb-8">
          Login
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-[#895D2B] mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-[#A3966A]" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingrese su usuario"
                className="w-full pl-10 pr-4 py-3 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] focus:border-transparent text-[#482E1D] placeholder-gray-400 transition"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#895D2B] mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#A3966A]" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                className="w-full pl-10 pr-11 py-3 border border-[#A3966A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#895D2B] focus:border-transparent text-[#482E1D] placeholder-gray-400 transition"
                required
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
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-[#895D2B] hover:text-[#482E1D] hover:underline transition"
            >
              ¿Olvidó su contraseña?
            </Link>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#482E1D] text-[#F0DAAE] font-bold rounded-lg hover:bg-[#895D2B] active:bg-[#90553C] transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Ingresando..." : "Login"}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center mt-5 text-sm text-gray-600">
          ¿No tiene una cuenta?{" "}
          <Link
            href="/register"
            className="text-[#895D2B] font-bold hover:text-[#482E1D] hover:underline transition"
          >
            Regístrese
          </Link>
        </p>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-400">o continúa con</span>
          </div>
        </div>

        {/* Social login buttons */}
        <div className="flex justify-center gap-5">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-13 h-13 w-12 h-12 rounded-full bg-white border-2 border-[#F0DAAE] hover:border-[#895D2B] shadow-md hover:shadow-lg transition-all duration-200"
            title="Ingresar con Google"
            aria-label="Ingresar con Google"
          >
            <GoogleIcon />
          </button>

          <button
            type="button"
            onClick={handleOutlookLogin}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-[#F0DAAE] hover:border-[#895D2B] shadow-md hover:shadow-lg transition-all duration-200"
            title="Ingresar con Outlook"
            aria-label="Ingresar con Outlook / Microsoft"
          >
            <MicrosoftIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
