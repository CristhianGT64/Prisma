import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useApp } from "../../context/AppContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, usuarioActual } = useApp();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuarioActual) {
      navigate("/inicio", { replace: true });
    }
  }, [usuarioActual, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = await login(correo, password);
    setLoading(false);
    if (!success) {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F5F7F9]">
      <div className="bg-[#00BFA5] px-5 pt-10 pb-16 text-center relative">
        <Link
          to="/landing"
          className="absolute left-4 top-10 text-white/90 text-xs font-semibold flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Inicio
        </Link>
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h1 className="text-white text-2xl font-bold">Prisma</h1>
        <p className="text-white/80 text-sm mt-1">Espacios de trabajo para todos</p>
      </div>

      <div className="mx-4 -mt-8 bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-gray-800 font-bold text-lg mb-1">Iniciar sesión</h2>
        <p className="text-gray-400 text-sm mb-5">Ingresa tus credenciales para continuar</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Correo electrónico
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
              autoComplete="email"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA5] focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA5] focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00BFA5] hover:bg-[#00897B] text-white font-bold py-4 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-60 mt-2 shadow-md shadow-teal-200"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Ingresando...
              </span>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[11px] text-gray-400 font-semibold uppercase">o continúa con</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled
            title="Próximamente"
            className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-400 bg-gray-50 cursor-not-allowed opacity-80"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.3 12 2.3 6.9 2.3 2.8 6.4 2.8 11.5S6.9 20.7 12 20.7c6.9 0 8.5-4.8 8.5-7.3 0-.5 0-.9-.1-1.2H12z" />
            </svg>
            Google
          </button>
          <button
            type="button"
            disabled
            title="Próximamente"
            className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-400 bg-gray-50 cursor-not-allowed opacity-80"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#1877F2" d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.54-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.5 0-1.96.93-1.96 1.89v2.26h3.34l-.53 3.49h-2.81V24C19.61 23.09 24 18.1 24 12.07z" />
            </svg>
            Facebook
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-400 mt-2">Inicio social · Próximamente</p>

        <div className="mt-5 p-3 bg-[#F0FDF9] rounded-xl border border-[#CCFBEE]">
          <p className="text-xs font-bold text-[#00897B] mb-2">💡 Cuentas de prueba:</p>
          <div className="space-y-1.5">
            <div>
              <p className="text-xs text-gray-600 font-semibold">Arrendador (Persona):</p>
              <p className="text-xs text-gray-500">maria.gonzalez@example.com</p>
              <p className="text-xs text-gray-500">
                Contraseña: <span className="font-mono">securepass</span>
              </p>
            </div>
            <div className="border-t border-teal-100 pt-1.5">
              <p className="text-xs text-gray-600 font-semibold">Arrendador (Empresa):</p>
              <p className="text-xs text-gray-500">admin@innovatehub.com</p>
              <p className="text-xs text-gray-500">
                Contraseña: <span className="font-mono">password123</span>
              </p>
            </div>
            <div className="border-t border-teal-100 pt-1.5">
              <p className="text-xs text-gray-600 font-semibold">Arrendatario:</p>
              <p className="text-xs text-gray-500">juan.perez@example.com</p>
              <p className="text-xs text-gray-500">
                Contraseña: <span className="font-mono">password123</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-6 px-4 pb-8">
        <p className="text-sm text-gray-500">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-[#00BFA5] font-bold hover:text-[#00897B] transition-colors">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
}