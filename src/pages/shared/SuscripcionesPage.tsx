import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../api/client";
import { useApp } from "../../context/AppContext";
import BottomNav from "../../components/layout/BottomNav";

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

// Datos por defecto (fallback) para Arrendatario
const PLANES_ARRENDATARIO: Plan[] = [
  {
    id: "pro",
    nombre: "Plan Pro (Full-time)",
    tipo: "arrendatario",
    precioMensual: 2800,
    beneficios: [
      "Acceso ilimitado a la red de espacios aliados.",
      "Uso de escritorios compartidos sin límite de horas.",
      "Prioridad en reservas.",
      "Acceso a todos los espacios disponibles.",
      "Eventos y beneficios exclusivos.",
    ],
  },
  {
    id: "freelance",
    nombre: "Plan Freelance (Part-time)",
    tipo: "arrendatario",
    precioMensual: 1200,
    beneficios: [
      "Acceso a la red de espacios aliados.",
      "Hasta 40 horas de uso al mes (aprox. 10 horas por semana).",
      "Reserva de escritorios compartidos según disponibilidad.",
      "Acceso a eventos y networking de la comunidad.",
    ],
  },
];

// Datos por defecto (fallback) para Arrendador
const PLANES_ARRENDADOR: Plan[] = [
  {
    id: "premium",
    nombre: "Plan Premium",
    tipo: "arrendador",
    precioMensual: 1500,
    comisionPct: 5,
    beneficios: [
      "Publicación ilimitada.",
      "Espacios destacados.",
      "Estadísticas de ocupación.",
      "Reportes financieros.",
      "Soporte prioritario.",
      "Comisión reducida al 5%.",
    ],
  },
  {
    id: "basico",
    nombre: "Plan básico",
    tipo: "arrendador",
    precioMensual: 0,
    comisionPct: 7,
    beneficios: [
      "Publicar hasta 5 escritorios.",
      "Gestión básica de reservas.",
      "Perfil público.",
      "Comisión del 7% por reserva.",
    ],
  },
];

export default function SuscripcionesPage() {
  const navigate = useNavigate();
  const { usuarioActual } = useApp();
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [mia, setMia] = useState<MiSuscripcion | null>(null);
  const [loading, setLoading] = useState(true);
  const [contratando, setContratando] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState("");

  const rol = usuarioActual?.rol === "arrendador" ? "arrendador" : "arrendatario";
  const isArrendador = rol === "arrendador";

  // Esquema de colores según la imagen y el rol
  const headerColor = isArrendador ? "#F58220" : "#079FA0";
  const cardBorderColor = isArrendador ? "#82CEBE" : "#F58220";
  const priceTextColor = isArrendador ? "#079FA0" : "#F58220";
  const buttonBgColor = isArrendador ? "#079FA0" : "#F58220";

  const load = async () => {
    setLoading(true);
    const defaultPlanes = isArrendador ? PLANES_ARRENDADOR : PLANES_ARRENDATARIO;
    try {
      const [p, m] = await Promise.all([
        api<Plan[]>(`/suscripciones?tipo=${rol}`),
        api<MiSuscripcion | null>("/suscripciones/mia"),
      ]);
      setPlanes(p && p.length > 0 ? p : defaultPlanes);
      setMia(m);
    } catch {
      setPlanes(defaultPlanes);
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
    <div className="min-h-screen flex flex-col bg-white font-sans relative">
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm text-white"
          style={{ backgroundColor: headerColor }}
        >
          <h1 className="font-bold text-lg">
            {isArrendador ? "Planes" : "Suscripciones"}
          </h1>
          <button
            onClick={() => navigate(-1)}
            aria-label="Volver"
            className="hover:opacity-80 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
        </div>

        <div className="p-5 max-w-md mx-auto flex flex-col items-center gap-5">
          {/* Subtítulo */}
          <h2 className="text-sm font-bold text-gray-800 text-center w-full my-1">
            {isArrendador
              ? "Descubre nuestros planes disponibles"
              : "Descubre nuestras suscripciones disponibles"}
          </h2>

          {mensaje && (
            <div className="w-full text-xs font-medium rounded-xl px-4 py-2 bg-[#E0F7F4] text-[#00695C] border border-[#B2DFDB]">
              {mensaje}
            </div>
          )}

          {mia?.plan && (
            <div
              className="w-full rounded-2xl border-2 p-4"
              style={{ borderColor: cardBorderColor }}
            >
              <p className="text-[10px] font-extrabold uppercase tracking-wide text-gray-500 mb-1">
                Plan actual
              </p>
              <h3 className="font-extrabold text-sm text-gray-800">
                {mia.plan.nombre}
              </h3>
              <p className="text-[11px] text-gray-500 mt-1">
                Vigente hasta {mia.fechaFin}
                {mia.plan.comisionPct != null
                  ? ` · Comisión ${mia.plan.comisionPct}%`
                  : ""}
              </p>
            </div>
          )}

          {loading && (
            <p className="text-sm text-gray-400 py-8">Cargando opciones...</p>
          )}

          {!loading &&
            planes.map((plan) => {
              const activo = mia?.suscripcionId === plan.id;
              const isFree = plan.precioMensual <= 0;

              return (
                <div
                  key={plan.id}
                  className="w-full bg-white border-2 rounded-3xl p-6 shadow-sm flex flex-col items-center relative"
                  style={{ borderColor: cardBorderColor }}
                >
                  {/* Ícono superior */}
                  <div className="mb-3">
                    {isFree ? (
                      <div className="w-16 h-10 bg-[#A2E0D3] rounded-2xl flex items-center justify-center text-white font-extrabold text-xs tracking-wider">
                        FREE
                      </div>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-10 h-10"
                        style={{ color: isArrendador ? "#82CEBE" : "#F58220" }}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                      </svg>
                    )}
                  </div>

                  {/* Título del plan */}
                  <h3 className="text-base font-extrabold text-gray-800 mb-3 text-center">
                    {plan.nombre}
                  </h3>

                  {/* Lista de Beneficios */}
                  <div className="w-full text-left mb-4">
                    <p className="text-xs font-bold text-gray-800 mb-2">
                      Incluye:
                    </p>
                    <ul className="text-xs text-gray-600 space-y-2 pl-2 font-medium leading-relaxed">
                      {(plan.beneficios || []).map((b) => (
                        <li key={b} className="flex items-start gap-1.5">
                          <span className="text-gray-400 font-bold">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Precio */}
                  <p
                    className="text-sm font-extrabold mb-5 text-center"
                    style={{ color: priceTextColor }}
                  >
                    {isFree
                      ? "Gratis"
                      : `Desde L. ${plan.precioMensual.toLocaleString("es-HN")}.00  mensuales`}
                  </p>

                  {/* Botón de acción */}
                  <button
                    disabled={activo || contratando === plan.id}
                    onClick={() => void contratar(plan.id)}
                    className="text-white font-bold text-xs px-7 py-2.5 rounded-full shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-60"
                    style={{ backgroundColor: buttonBgColor }}
                  >
                    {activo
                      ? "Plan activo"
                      : contratando === plan.id
                      ? "Procesando..."
                      : isArrendador
                      ? "Obtener plan"
                      : "Suscribirse"}
                  </button>
                </div>
              );
            })}

          {!loading && planes.length === 0 && (
            <p className="text-sm text-gray-400 py-8">
              No hay planes disponibles
            </p>
          )}
        </div>
      </div>

      {/* Navegación Inferior */}
      <BottomNav />
    </div>
  );
}