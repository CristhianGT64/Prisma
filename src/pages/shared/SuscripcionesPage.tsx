import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../api/client";
import { useApp } from "../../context/AppContext";

interface Plan {
  id: string;
  nombre: string;
  descripcion?: string;
  tipo: string;
  precioMensual: number;
  precioAnual?: number;
  duracion?: string;
  beneficios: string[];
  comisionPct?: number;
}

interface MiSuscripcion {
  id: string;
  suscripcionId: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  plan: Plan;
}

export default function SuscripcionesPage() {
  const navigate = useNavigate();
  const { usuarioActual } = useApp();
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [mia, setMia] = useState<MiSuscripcion | null>(null);
  const [loading, setLoading] = useState(true);
  const [contratando, setContratando] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState("");

  const rol = usuarioActual?.rol === "arrendador" ? "arrendador" : "arrendatario";
  const accent = rol === "arrendador" ? "#FF9800" : "#00BFA5";

  const load = async () => {
    setLoading(true);
    try {
      const [p, m] = await Promise.all([
        api<Plan[]>(`/suscripciones?tipo=${rol}`),
        api<MiSuscripcion | null>("/suscripciones/mia"),
      ]);
      setPlanes(p);
      setMia(m);
    } catch {
      setPlanes([]);
      setMia(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [rol]);

  const contratar = async (planId: string) => {
    setContratando(planId);
    setMensaje("");
    try {
      await api("/suscripciones/contratar", {
        method: "POST",
        body: JSON.stringify({ suscripcionId: planId }),
      });
      setMensaje("Suscripción actualizada correctamente");
      await load();
    } catch (e) {
      setMensaje(e instanceof Error ? e.message : "No se pudo contratar el plan");
    } finally {
      setContratando(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white flex flex-col relative pb-24">
      <div className="px-5 py-4 flex items-center sticky top-0 z-10 shadow-sm" style={{ backgroundColor: accent }}>
        <button onClick={() => navigate(-1)} className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white font-bold text-lg flex-1 text-center pr-6">Suscripciones</h1>
      </div>

      <div className="p-5 flex flex-col items-center gap-4">
        <h2 className="text-[13px] font-extrabold text-gray-800 text-center w-full">
          {rol === "arrendador" ? "Planes para arrendadores" : "Descubre nuestras suscripciones disponibles"}
        </h2>

        {mensaje && (
          <div className="w-full max-w-[340px] text-xs font-medium rounded-xl px-3 py-2 bg-[#E0F7F4] text-[#00695C] border border-[#B2DFDB]">
            {mensaje}
          </div>
        )}

        {mia?.plan && (
          <div className="w-full max-w-[340px] rounded-2xl border-2 p-4" style={{ borderColor: accent }}>
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-gray-500 mb-1">Plan actual</p>
            <h3 className="font-extrabold text-sm text-gray-800">{mia.plan.nombre}</h3>
            <p className="text-[11px] text-gray-500 mt-1">
              Vigente hasta {mia.fechaFin}
              {mia.plan.comisionPct != null ? ` · Comisión ${mia.plan.comisionPct}%` : ""}
            </p>
          </div>
        )}

        {loading && <p className="text-sm text-gray-400 py-8">Cargando planes...</p>}

        {!loading && planes.map((plan) => {
          const activo = mia?.suscripcionId === plan.id;
          return (
            <div key={plan.id} className="w-full max-w-[340px] bg-white border rounded-[24px] p-6 shadow-sm flex flex-col items-center" style={{ borderColor: activo ? accent : "#FFB300" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-4" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <h3 className="text-sm font-extrabold text-gray-800 mb-2 text-center">{plan.nombre}</h3>
              {plan.descripcion && <p className="text-[11px] text-gray-500 text-center mb-3">{plan.descripcion}</p>}
              <div className="w-full text-left mb-5">
                <p className="text-xs font-bold text-gray-800 mb-2">Incluye:</p>
                <ul className="text-[11px] text-gray-600 space-y-1.5 list-disc pl-4 font-medium leading-tight">
                  {(plan.beneficios || []).map((b) => (<li key={b}>{b}</li>))}
                  {plan.comisionPct != null && <li>Comisión por reserva: {plan.comisionPct}%</li>}
                </ul>
              </div>
              <p className="text-[11px] font-extrabold mb-5 text-center" style={{ color: accent }}>
                {plan.precioMensual <= 0 ? "Gratis" : `Desde L. ${plan.precioMensual}/mensuales${plan.precioAnual ? ` o L. ${plan.precioAnual}/al año` : ""}`}
              </p>
              <button disabled={activo || contratando === plan.id} onClick={() => void contratar(plan.id)} className="text-white font-bold text-[13px] px-8 py-2 rounded-full shadow-md transition-colors disabled:opacity-60" style={{ backgroundColor: accent }}>
                {activo ? "Plan activo" : contratando === plan.id ? "Procesando..." : "Suscribirse"}
              </button>
            </div>
          );
        })}

        {!loading && planes.length === 0 && <p className="text-sm text-gray-400 py-8">No hay planes disponibles</p>}
      </div>
    </div>
  );
}