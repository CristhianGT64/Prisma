import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { useApp } from "../../context/AppContext";
import BottomNav from "../../components/layout/BottomNav";

interface IngresoDetalle {
  id: string;
  espacioId?: string;
  fechaInicio: string;
  espacioNombre: string;
  arrendatario: string;
  estado: string;
  ingreso: number;
  comision: number;
  neto: number;
}

interface IngresosResponse {
  resumen: {
    ingresos: number;
    comisiones: number;
    neto: number;
    reservas: number;
    comisionPct: number;
  };
  detalle: IngresoDetalle[];
}

export default function HistorialIngresosPage() {
  const { usuarioActual, obtenerEspaciosPorArrendador } = useApp();
  const [data, setData] = useState<IngresosResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [espacioSeleccionado, setEspacioSeleccionado] = useState<string | null>(null);

  const misEspacios = usuarioActual ? obtenerEspaciosPorArrendador(usuarioActual.id) : [];

  useEffect(() => {
    api<IngresosResponse>("/arrendador/ingresos")
      .then((res) => {
        if (res && res.detalle) {
          // Asegurar que cada detalle tenga la comisión calculada al 7% si no viene de la API
          const detalleConComision = res.detalle.map((d) => {
            const ingreso = Number(d.ingreso || 0);
            const comision = d.comision ?? ingreso * 0.07;
            const neto = d.neto ?? ingreso - comision;
            return {
              ...d,
              ingreso,
              comision,
              neto,
            };
          });

          const totalIngresos = detalleConComision.reduce((acc, curr) => acc + curr.ingreso, 0);
          const totalComisiones = detalleConComision.reduce((acc, curr) => acc + curr.comision, 0);
          const totalNeto = detalleConComision.reduce((acc, curr) => acc + curr.neto, 0);

          setData({
            resumen: {
              ingresos: totalIngresos,
              comisiones: totalComisiones,
              neto: totalNeto,
              reservas: detalleConComision.length,
              comisionPct: 7,
            },
            detalle: detalleConComision,
          });
        } else {
          setData(res);
        }
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const formatFecha = (f: string) => {
    if (!f) return "";
    return new Date(f + "T12:00:00").toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const badgeEstado = (estado: string) => {
    const map: Record<string, { label: string; bg: string }> = {
      completada: { label: "Completada", bg: "bg-blue-100 text-blue-700" },
      confirmada: { label: "Confirmada", bg: "bg-emerald-100 text-emerald-700" },
      pendiente: { label: "Pendiente", bg: "bg-amber-100 text-amber-700" },
      cancelada: { label: "Cancelado", bg: "bg-red-100 text-red-600" },
      en_curso: { label: "En curso", bg: "bg-teal-100 text-teal-700" },
    };
    return map[estado] ?? { label: estado, bg: "bg-gray-100 text-gray-600" };
  };

  const espacioActualObj = misEspacios.find((e) => e.id === espacioSeleccionado);

  const detalleDelEspacio = espacioSeleccionado
    ? data?.detalle.filter((d) => d.espacioId === espacioSeleccionado || d.espacioNombre === espacioActualObj?.nombre)
    : [];

  const resumenDelEspacio = espacioSeleccionado && detalleDelEspacio ? {
    ingresos: detalleDelEspacio.reduce((acc, curr) => acc + curr.ingreso, 0),
    comisiones: detalleDelEspacio.reduce((acc, curr) => acc + curr.comision, 0),
    neto: detalleDelEspacio.reduce((acc, curr) => acc + curr.neto, 0),
    reservas: detalleDelEspacio.length,
  } : null;

  // Vista 2: Desglose del espacio seleccionado
  if (espacioSeleccionado) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F7F9] font-sans relative">
        <div className="flex-1 overflow-y-auto pb-28">
          <div className="bg-[#FF9800] px-5 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
            <button
              onClick={() => setEspacioSeleccionado(null)}
              className="text-white hover:opacity-80 transition flex items-center gap-1 text-sm font-bold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
            <h1 className="text-white font-bold text-base truncate max-w-[200px]">
              {espacioActualObj?.nombre || "Desglose de Ingresos"}
            </h1>
            <div className="w-12" />
          </div>

          {espacioActualObj && (
            <div className="bg-white mx-4 mt-4 rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-3 items-center">
              {espacioActualObj.imagenes[0]?.url && (
                <img
                  src={espacioActualObj.imagenes[0].url}
                  alt={espacioActualObj.nombre}
                  className="w-16 h-16 rounded-xl object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-gray-800 text-sm truncate">{espacioActualObj.nombre}</h2>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {espacioActualObj.direccion}, {espacioActualObj.ciudad}
                </p>
              </div>
            </div>
          )}

          {resumenDelEspacio && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm col-span-2">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Neto recibido</p>
                  <p className="text-2xl font-extrabold text-[#FF9800] mt-1">
                    L. {resumenDelEspacio.neto.toFixed(2)}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Comisión plataforma 7%
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Bruto</p>
                  <p className="text-lg font-extrabold text-gray-800 mt-1">
                    L. {resumenDelEspacio.ingresos.toFixed(2)}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Comisiones (7%)</p>
                  <p className="text-lg font-extrabold text-red-500 mt-1">
                    -L. {resumenDelEspacio.comisiones.toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-3">
                  Transacciones ({resumenDelEspacio.reservas})
                </h2>
                <div className="flex flex-col gap-3">
                  {detalleDelEspacio?.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-8">No hay transacciones para este espacio</p>
                  )}
                  {detalleDelEspacio?.map((d) => {
                    const badge = badgeEstado(d.estado);
                    return (
                      <div key={d.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-bold text-gray-800">{d.arrendatario}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{formatFecha(d.fechaInicio)}</p>
                          </div>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2 text-center pt-2 border-t border-gray-50">
                          <div>
                            <p className="text-[9px] text-gray-400 uppercase font-bold">Ingreso</p>
                            <p className="text-xs font-bold text-gray-700">L. {d.ingreso.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-gray-400 uppercase font-bold">Comisión (7%)</p>
                            <p className="text-xs font-bold text-red-500">-L. {d.comision.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-gray-400 uppercase font-bold">Neto</p>
                            <p className="text-xs font-extrabold text-[#FF9800]">L. {d.neto.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
        <BottomNav />
      </div>
    );
  }

  // Vista 1: Listado de espacios agrupados con totales generales
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7F9] font-sans relative">
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="bg-[#FF9800] px-5 py-6 sticky top-0 z-10 shadow-sm text-center">
          <h1 className="text-white font-bold text-xl">Historial de ingresos</h1>
          <p className="text-white/90 text-sm mt-1">Gestiona los ingresos por cada espacio</p>
        </div>

        {loading && <p className="text-center text-sm text-gray-400 py-16">Cargando...</p>}

        {!loading && data && (
          <div className="p-4 space-y-4 max-w-md mx-auto w-full">
            {/* Resumen Global */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm col-span-2">
                <p className="text-[10px] font-bold text-gray-500 uppercase">Neto Total Recibido</p>
                <p className="text-2xl font-extrabold text-[#FF9800] mt-1">
                  L. {data.resumen.neto.toFixed(2)}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Comisión plataforma 7%
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-500 uppercase">Bruto Total</p>
                <p className="text-lg font-extrabold text-gray-800 mt-1">
                  L. {data.resumen.ingresos.toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-500 uppercase">Comisiones (7%)</p>
                <p className="text-lg font-extrabold text-red-500 mt-1">
                  -L. {data.resumen.comisiones.toFixed(2)}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-3">
                Mis Espacios ({misEspacios.length})
              </h2>

              {misEspacios.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-3xl mb-2">🏢</p>
                  <p className="text-sm font-medium">No tienes espacios registrados</p>
                </div>
              )}

              <div className="flex flex-col gap-4">
                {misEspacios.map((espacio) => {
                  const transaccionesEspacio = data.detalle.filter(
                    (d) => d.espacioId === espacio.id || d.espacioNombre === espacio.nombre
                  );
                  const brutoEspacio = transaccionesEspacio.reduce((acc, curr) => acc + curr.ingreso, 0);
                  const comisionEspacio = transaccionesEspacio.reduce((acc, curr) => acc + curr.comision, 0);
                  const netoEspacio = transaccionesEspacio.reduce((acc, curr) => acc + curr.neto, 0);
                  const imgUrl = espacio.imagenes[0]?.url;

                  return (
                    <div
                      key={espacio.id}
                      onClick={() => setEspacioSeleccionado(espacio.id)}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 active:scale-[0.98]"
                    >
                      {imgUrl && (
                        <img src={imgUrl} alt={espacio.nombre} className="w-full h-36 object-cover" />
                      )}
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-800 text-base">{espacio.nombre}</h3>
                          <span className="text-xs font-bold bg-[#FF9800]/10 text-[#FF9800] px-2.5 py-1 rounded-full">
                            {transaccionesEspacio.length} reserva{transaccionesEspacio.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {espacio.direccion}, {espacio.ciudad}
                        </p>

                        <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-[9px] text-gray-400 uppercase font-bold">Bruto</p>
                            <p className="text-xs font-bold text-gray-700">L. {brutoEspacio.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-gray-400 uppercase font-bold">Comisión (7%)</p>
                            <p className="text-xs font-bold text-red-500">-L. {comisionEspacio.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-gray-400 uppercase font-bold">Neto</p>
                            <p className="text-xs font-extrabold text-[#FF9800]">L. {netoEspacio.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {!loading && !data && (
          <p className="text-center text-sm text-gray-400 py-16">No se pudieron cargar los ingresos</p>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
