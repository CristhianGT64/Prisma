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
      <div className="flex-1 min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
        {/* === DECORACIONES SUPERIORES === */}
        {/* Esquina Superior Izquierda (Menta) */}
        <div className="absolute top-0 left-0 w-36 h-20 bg-[#A2D9CE] [clip-path:polygon(0_0,_100%_0,_65%_100%,_0_70%)]" />

        {/* Esquina Superior Derecha (Turquesa) */}
        <div className="absolute -top-4 -right-12 w-64 h-64 bg-[#00BFA5] [clip-path:polygon(30%_0,_100%_0,_100%_80%,_60%_100%)]" />

        {/* === LOGO CENTRAL (ISOTIPO PRISMA) === */}
        <div className="relative z-10 flex flex-col items-center justify-center animate-pulse">
          <div className="w-28 h-28 bg-[#FF8800] rounded-3xl p-5 shadow-2xl flex items-center justify-center">
            {/* Isotipo SVG blanco */}
            <svg viewBox="0 0 538 558" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <rect x="254" y="316" width="30" height="185" rx="15" fill="white"/>
              <rect x="254" y="50" width="30" height="147" rx="15" fill="white"/>
              <rect x="386" y="313" width="30" height="234" rx="15" transform="rotate(90 386 313)" fill="white"/>
              <rect x="458" y="168" width="30" height="340" rx="15" fill="white"/>
              <rect x="50" y="169" width="30" height="340" rx="15" fill="white"/>
              <rect x="356" y="409" width="30" height="131" rx="15" transform="rotate(-90 356 409)" fill="white"/>
              <rect x="386" y="492" width="30" height="113" rx="15" transform="rotate(180 386 492)" fill="white"/>
              <rect width="30" height="131" rx="15" transform="matrix(0 -1 -1 0 182 409)" fill="white"/>
              <rect width="30" height="116" rx="15" transform="matrix(1 0 0 -1 152 495)" fill="white"/>
              <rect x="51" y="508" width="30" height="437" rx="15" transform="rotate(-90 51 508)" fill="white"/>
              <path d="M251.679 160C259.377 146.667 278.623 146.667 286.321 160L316.631 212.5C324.329 225.833 314.707 242.5 299.311 242.5H238.689C223.293 242.5 213.671 225.833 221.369 212.5L251.679 160Z" fill="white"/>
              <rect x="75" y="398" width="85" height="85" fill="white"/>
              <rect x="386" y="397" width="87" height="87" fill="white"/>
              <rect x="250" y="70.9807" width="30" height="262" rx="15" transform="rotate(-60 250 70.9807)" fill="white"/>
              <rect width="30" height="262" rx="15" transform="matrix(-0.5 -0.866025 -0.866025 0.5 288.569 70.9808)" fill="white"/>
            </svg>
          </div>
        </div>

        {/* === DECORACIONES INFERIORES === */}
        {/* Esquina Inferior Izquierda (Amarillo) */}
        <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-[#FFC107] [clip-path:polygon(0_0,_90%_20%,_100%_100%,_0_100%)]" />

        {/* Esquina Inferior Derecha (Menta) */}
        <div className="absolute -bottom-4 -right-6 w-56 h-36 bg-[#A2D9CE] [clip-path:polygon(40%_25%,_100%_0,_100%_100%,_0_100%)]" />
      </div>
  );
}
