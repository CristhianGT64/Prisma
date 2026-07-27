import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";

export default function SplashPage() {
  const navigate = useNavigate();
  const { usuarioActual, bootstrapping } = useApp();

  useEffect(() => {
    if (bootstrapping) return;
    const t = setTimeout(() => {
      if (usuarioActual) {
        navigate(usuarioActual.rol === "arrendador" ? "/arrendador/espacios" : "/inicio", { replace: true });
      } else {
        navigate("/landing", { replace: true });
      }
    }, 1600);
    return () => clearTimeout(t);
  }, [bootstrapping, usuarioActual, navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#00BFA5] relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
      <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mb-6 shadow-lg backdrop-blur-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h1 className="text-white text-4xl font-extrabold tracking-tight">Prisma</h1>
      <p className="text-white/85 text-sm mt-2 font-medium">Espacios de trabajo en Honduras</p>
      <div className="mt-10 w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin" />
    </div>
  );
}
