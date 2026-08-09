import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { useApp } from "../../context/AppContext";
import BottomNav from "../../components/layout/BottomNav";

interface ReservaArrendador {
  id: string;
  espacioId: string;
  espacioNombre?: string;
  fechaInicio: string;
  fechaFin: string;
  horaInicio?: string;
  horaFin?: string;
  estado: string;
  precioTotal: number;
  cantidadPersonas?: number;
  arrendatarioNombre?: string;
  arrendatarioEmail?: string;
  espacio?: { nombre?: string; imagenes?: { url: string }[]; direccion?: string; ciudad?: string };
  arrendatario?: { nombres?: string; apellidos?: string; email?: string } | string;
}

export default function ArrendadorReservasPage() {
  const { usuarioActual, obtenerEspaciosPorArrendador } = useApp();
  const [espacioSeleccionado, setEspacioSeleccionado] = useState<string | null>(null);
  const [vistaCalendario, setVistaCalendario] = useState(false);
  const [reservas, setReservas] = useState<ReservaArrendador[]>([]);
  const [tab, setTab] = useState<"todas" | "proximas" | "completadas" | "canceladas">("todas");
  const [loading, setLoading] = useState(true);
  const [modoBloqueo, setModoBloqueo] = useState(false);
  const [fechasBloqueadas, setFechasBloqueadas] = useState<string[]>([]);
  const [draftFechasBloqueadas, setDraftFechasBloqueadas] = useState<string[]>([]);
  const [cargandoBloqueos, setCargandoBloqueos] = useState(false);
  const [guardandoBloqueos, setGuardandoBloqueos] = useState(false);

  // Estados para el manejo del mes en el calendario
  const [fechaActualCalendario, setFechaActualCalendario] = useState(new Date());
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string | null>(null);

  const misEspacios = usuarioActual ? obtenerEspaciosPorArrendador(usuarioActual.id) : [];

  useEffect(() => {
    if (!espacioSeleccionado) {
      setFechasBloqueadas([]);
      setDraftFechasBloqueadas([]);
      return;
    }

    setCargandoBloqueos(true);
    api<{ fechas?: string[] }>(`/espacios/${espacioSeleccionado}/fechas-bloqueadas`)
      .then((data) => {
        const fechas = Array.isArray(data?.fechas) ? data.fechas : [];
        setFechasBloqueadas(fechas);
        setDraftFechasBloqueadas(fechas);
      })
      .catch(() => {
        setFechasBloqueadas([]);
        setDraftFechasBloqueadas([]);
      })
      .finally(() => setCargandoBloqueos(false));
  }, [espacioSeleccionado]);

  useEffect(() => {
    api<ReservaArrendador[] | { reservas?: ReservaArrendador[]; items?: ReservaArrendador[] }>(
      "/arrendador/reservas"
    )
      .then((data) => {
        const list = Array.isArray(data) ? data : data.reservas ?? data.items ?? [];
        setReservas(
          list.map((r) => {
            const arrendatarioObj =
              r.arrendatario && typeof r.arrendatario === "object" ? r.arrendatario : null;
            const arrendatarioStr =
              typeof r.arrendatario === "string" ? r.arrendatario : undefined;
            return {
              ...r,
              espacioId: r.espacioId || (r as any).espacio?._id || "",
              espacioNombre: r.espacioNombre || r.espacio?.nombre || r.espacioId,
              arrendatarioNombre:
                r.arrendatarioNombre ||
                (arrendatarioObj
                  ? `${arrendatarioObj.nombres ?? ""} ${arrendatarioObj.apellidos ?? ""}`.trim()
                  : arrendatarioStr) ||
                "Arrendatario",
              arrendatarioEmail:
                (arrendatarioObj && "email" in arrendatarioObj ? arrendatarioObj.email : undefined) ||
                (r as any).arrendatarioEmail ||
                "arrendatario@empresa.com",
            };
          })
        );
      })
      .catch(() => setReservas([]))
      .finally(() => setLoading(false));
  }, []);

  const espacioActualObj = misEspacios.find((e) => e.id === espacioSeleccionado);

  const reservasDelEspacio = espacioSeleccionado
    ? reservas.filter((r) => r.espacioId === espacioSeleccionado)
    : [];

  const todasCount = reservasDelEspacio.length;
  const proximasCount = reservasDelEspacio.filter((r) =>
    ["confirmada", "pendiente", "en_curso"].includes(r.estado)
  ).length;
  const completadasCount = reservasDelEspacio.filter((r) => r.estado === "completada").length;
  const canceladasCount = reservasDelEspacio.filter((r) => r.estado === "cancelada").length;

  const listaFiltrada = reservasDelEspacio.filter((r) => {
    if (tab === "proximas") return ["confirmada", "pendiente", "en_curso"].includes(r.estado);
    if (tab === "completadas") return r.estado === "completada";
    if (tab === "canceladas") return r.estado === "cancelada";
    return true;
  });

  const formatFechaDia = (f?: string) => {
    if (!f) return { dia: "", mes: "", anio: "" };
    const date = new Date(f + "T12:00:00");
    const mes = date.toLocaleDateString("es-ES", { month: "short" }).toUpperCase();
    const dia = date.getDate();
    const anio = date.getFullYear();
    return { dia, mes, anio };
  };

  const badgeConfig = (estado: string) => {
    switch (estado) {
      case "confirmada":
      case "en_curso":
        return { label: "Próxima", bg: "bg-[#F58220] text-white" };
      case "pendiente":
        return { label: "Pendiente", bg: "bg-amber-100 text-amber-700" };
      case "completada":
        return { label: "Completada", bg: "bg-blue-100 text-blue-700" };
      case "cancelada":
        return { label: "Cancelado", bg: "bg-[#00BFA5] text-white" };
      default:
        return { label: estado, bg: "bg-gray-100 text-gray-600" };
    }
  };

  // Lógica del Calendario Visual
  const anioActual = fechaActualCalendario.getFullYear();
  const mesActual = fechaActualCalendario.getMonth();

  const nombreMes = fechaActualCalendario.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const primerDiaMes = new Date(anioActual, mesActual, 1).getDay();
  // Ajuste para que la semana empiece en Lunes (0 = Lunes, 6 = Domingo)
  const primerDiaIndex = primerDiaMes === 0 ? 6 : primerDiaMes - 1;
  const totalDiasMes = new Date(anioActual, mesActual + 1, 0).getDate();

  const cambiarMes = (direccion: number) => {
    setFechaActualCalendario(new Date(anioActual, mesActual + direccion, 1));
    setFechaSeleccionada(null);
  };

  const toggleFechaBloqueada = (fecha: string) => {
    setDraftFechasBloqueadas((prev) =>
      prev.includes(fecha) ? prev.filter((f) => f !== fecha) : [...prev, fecha].sort()
    );
  };

  const guardarBloqueos = async () => {
    if (!espacioSeleccionado || guardandoBloqueos) return;

    setGuardandoBloqueos(true);
    try {
      const data = await api<{ fechas?: string[] }>(
        `/arrendador/espacios/${espacioSeleccionado}/fechas-bloqueadas`,
        {
          method: "PUT",
          body: JSON.stringify({ fechas: draftFechasBloqueadas }),
        }
      );
      const fechasGuardadas = Array.isArray(data?.fechas) ? data.fechas : [];
      setFechasBloqueadas(fechasGuardadas);
      setDraftFechasBloqueadas(fechasGuardadas);
    } catch {
      alert("No se pudieron guardar los bloqueos de fechas");
    } finally {
      setGuardandoBloqueos(false);
    }
  };

  const formatoFechaVisual = (fechaIso: string) => {
    const [y, m, d] = fechaIso.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const bloqueosDelMes = draftFechasBloqueadas.filter((fecha) => {
    const [y, m] = fecha.split("-").map(Number);
    return y === anioActual && m - 1 === mesActual;
  });

  const cambiosBloqueosPendientes =
    draftFechasBloqueadas.join("|") !== fechasBloqueadas.join("|");

  // Obtener las reservas del día seleccionado (o todas las del mes si no hay día seleccionado)
  const reservasEnCalendario = reservasDelEspacio.filter((r) => {
    if (!r.fechaInicio) return false;
    const [y, m] = r.fechaInicio.split("-").map(Number);
    if (fechaSeleccionada) {
      return r.fechaInicio === fechaSeleccionada;
    }
    return y === anioActual && m - 1 === mesActual;
  });

  // Vista 1: Listado de espacios del arrendador
  if (!espacioSeleccionado) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans relative">
        <div className="flex-1 overflow-y-auto pb-28">
          <div className="bg-[#F58220] px-5 py-6 shadow-md text-center">
            <h1 className="text-white font-bold text-xl">Reservas de mi espacio</h1>
            <p className="text-white/90 text-sm mt-1">Gestiona todas las reservas de tu espacio</p>
          </div>

          <div className="px-4 pt-5 max-w-md mx-auto w-full">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-3">
              Selecciona un espacio para ver sus reservas:
            </h2>

            {loading && <p className="text-center text-sm text-gray-400 py-10">Cargando espacios...</p>}

            {!loading && misEspacios.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <p className="text-3xl mb-2">🏢</p>
                <p className="text-sm font-medium">No tienes espacios registrados</p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {misEspacios.map((espacio) => {
                const countEspacio = reservas.filter((r) => r.espacioId === espacio.id).length;
                const imgUrl = espacio.imagenes[0]?.url;

                return (
                  <div
                    key={espacio.id}
                    onClick={() => {
                      setEspacioSeleccionado(espacio.id);
                      setVistaCalendario(false);
                      setModoBloqueo(false);
                      setFechaSeleccionada(null);
                    }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 active:scale-[0.98]"
                  >
                    {imgUrl && (
                      <img src={imgUrl} alt={espacio.nombre} className="w-full h-40 object-cover" />
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-800 text-base">{espacio.nombre}</h3>
                        <span className="text-xs font-bold bg-[#F58220]/10 text-[#F58220] px-2.5 py-1 rounded-full">
                          {countEspacio} reserva{countEspacio !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {espacio.direccion}, {espacio.ciudad}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans relative">
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Header Superior */}
        <div className="bg-[#F58220] px-5 py-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
          <button
            onClick={() => {
              setEspacioSeleccionado(null);
              setVistaCalendario(false);
              setModoBloqueo(false);
            }}
            className="text-white hover:opacity-80 transition flex items-center gap-1 text-sm font-bold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-white font-bold text-base">Reservas de mi espacio</h1>
          <button
            onClick={() => {
              setVistaCalendario(!vistaCalendario);
              setFechaSeleccionada(null);
            }}
            className="bg-[#00BFA5] text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm flex items-center gap-1.5 hover:bg-gray-50 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {vistaCalendario ? "Lista" : "Calendario"}
          </button>
        </div>

        {/* Tarjeta resumen del espacio seleccionado */}
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

        {/* ================= VISTA CALENDARIO ================= */}
        {vistaCalendario ? (
          <div className="p-4 max-w-md mx-auto w-full flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              {/* Controles de Mes */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800 capitalize text-base">{nombreMes}</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => cambiarMes(-1)}
                    className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => cambiarMes(1)}
                    className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setModoBloqueo(false)}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                    !modoBloqueo ? "bg-white text-[#F58220] shadow-sm" : "text-gray-500"
                  }`}
                >
                  Ver reservas
                </button>
                <button
                  onClick={() => {
                    setModoBloqueo(true);
                    setFechaSeleccionada(null);
                  }}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                    modoBloqueo ? "bg-white text-[#00BFA5] shadow-sm" : "text-gray-500"
                  }`}
                >
                  Bloquear fechas
                </button>
              </div>

              {modoBloqueo && (
                <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <p className="text-[11px] font-medium text-gray-600">
                    Toca los días para bloquear o desbloquear. Los días bloqueados se muestran en gris y no se podrán reservar.
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-gray-500">
                      Bloqueadas: <strong className="text-gray-700">{draftFechasBloqueadas.length}</strong>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDraftFechasBloqueadas(fechasBloqueadas)}
                        disabled={!cambiosBloqueosPendientes || guardandoBloqueos}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-gray-600 bg-white border border-gray-200 disabled:opacity-50"
                      >
                        Restablecer
                      </button>
                      <button
                        onClick={() => void guardarBloqueos()}
                        disabled={!cambiosBloqueosPendientes || guardandoBloqueos}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-[#00BFA5] hover:bg-[#00897B] disabled:opacity-50"
                      >
                        {guardandoBloqueos ? "Guardando..." : "Guardar"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {cargandoBloqueos && (
                <p className="text-[11px] text-gray-400 mb-3">Cargando fechas bloqueadas...</p>
              )}

              {/* Días de la semana */}
              <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-400 mb-2">
                <span>Lu</span>
                <span>Ma</span>
                <span>Mi</span>
                <span>Ju</span>
                <span>Vi</span>
                <span>Sá</span>
                <span>Do</span>
              </div>

              {/* Cuadrícula de días */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Espacios vacíos iniciales */}
                {Array.from({ length: primerDiaIndex }).map((_, index) => (
                  <div key={`empty-${index}`} />
                ))}

                {/* Días del mes */}
                {Array.from({ length: totalDiasMes }).map((_, index) => {
                  const diaNum = index + 1;
                  const mesStr = String(mesActual + 1).padStart(2, "0");
                  const diaStr = String(diaNum).padStart(2, "0");
                  const fechaString = `${anioActual}-${mesStr}-${diaStr}`;

                  // Ver si hay reservas en este día
                  const reservasDelDia = reservasDelEspacio.filter((r) => r.fechaInicio === fechaString);
                  const tieneReservas = reservasDelDia.length > 0;
                  const esSeleccionado = fechaSeleccionada === fechaString;
                  const esBloqueado = draftFechasBloqueadas.includes(fechaString);

                  return (
                    <button
                      key={fechaString}
                      onClick={() => {
                        if (modoBloqueo) {
                          toggleFechaBloqueada(fechaString);
                          return;
                        }
                        if (esBloqueado) return;
                        setFechaSeleccionada(esSeleccionado ? null : fechaString);
                      }}
                      className={`h-10 rounded-xl flex flex-col items-center justify-center relative transition-all text-xs font-bold ${
                        esSeleccionado
                          ? "bg-[#F58220] text-white shadow-md scale-105"
                          : esBloqueado
                          ? "bg-gray-200 text-gray-500"
                          : tieneReservas
                          ? "bg-[#FFF8F0] text-[#F58220] border border-[#F58220]/30 hover:bg-[#F58220]/10"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span>{diaNum}</span>
                      {esBloqueado && !esSeleccionado && (
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full absolute bottom-1.5" />
                      )}
                      {tieneReservas && !esSeleccionado && !esBloqueado && (
                        <span className="w-1.5 h-1.5 bg-[#F58220] rounded-full absolute bottom-1.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {fechaSeleccionada && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                  <span className="text-gray-500">Mostrando fecha: <strong className="text-gray-800">{fechaSeleccionada}</strong></span>
                  <button
                    onClick={() => setFechaSeleccionada(null)}
                    className="text-[#F58220] font-bold hover:underline"
                  >
                    Ver todo el mes
                  </button>
                </div>
              )}
            </div>

            {/* Listado filtrado por el calendario */}
            <div className="flex flex-col gap-3">
              {modoBloqueo ? (
                <>
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                    Fechas bloqueadas de {nombreMes} ({bloqueosDelMes.length})
                  </h4>

                  {bloqueosDelMes.length === 0 && (
                    <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm border border-gray-100">
                      <p className="text-2xl mb-1">🛑</p>
                      <p className="text-xs font-medium">No hay fechas bloqueadas en este mes</p>
                    </div>
                  )}

                  {bloqueosDelMes.map((fecha) => (
                    <div
                      key={fecha}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-bold text-gray-800">{formatoFechaVisual(fecha)}</p>
                        <p className="text-[11px] text-gray-500">No disponible para nuevas reservas</p>
                      </div>
                      <button
                        onClick={() => toggleFechaBloqueada(fecha)}
                        className="text-xs font-bold text-[#F58220] bg-[#FFF8F0] border border-[#F58220]/20 px-3 py-1.5 rounded-xl"
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                    {fechaSeleccionada ? `Reservas para el ${fechaSeleccionada}` : `Reservas de ${nombreMes}`} ({reservasEnCalendario.length})
                  </h4>

                  {reservasEnCalendario.length === 0 && (
                    <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm border border-gray-100">
                      <p className="text-2xl mb-1">📅</p>
                      <p className="text-xs font-medium">No hay reservas programadas para este periodo</p>
                    </div>
                  )}

                  {reservasEnCalendario.map((r) => {
                    const { dia, mes, anio } = formatFechaDia(r.fechaInicio);
                    const badgeInfo = badgeConfig(r.estado);

                    return (
                      <div
                        key={r.id}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 relative"
                      >
                        <div className="bg-[#FFF8F0] border border-[#F58220]/20 rounded-xl px-3 py-2.5 text-center min-w-[70px] flex flex-col justify-center">
                          <span className="text-[10px] font-bold text-[#F58220] uppercase">{mes}</span>
                          <span className="text-xl font-black text-gray-800 leading-tight">{dia}</span>
                          <span className="text-[10px] text-gray-400">{anio}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-bold text-gray-800">
                              {r.horaInicio ? `${r.horaInicio}${r.horaFin ? ` - ${r.horaFin}` : ""}` : "Todo el día"}
                            </p>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${badgeInfo.bg}`}>
                              {badgeInfo.label}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-gray-800 truncate">{r.arrendatarioNombre}</h4>
                          <p className="text-[11px] text-gray-400 truncate">{r.arrendatarioEmail}</p>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                            <span className="text-[11px] text-gray-500 font-medium">
                              {r.cantidadPersonas != null ? `${r.cantidadPersonas} personas` : ""}
                            </span>
                            <span className="text-xs font-bold text-[#F58220]">
                              Reservación #{r.id.slice(-4)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        ) : (
          /* ================= VISTA LISTA / TABS ================= */
          <>
            {/* Tabs de Filtro */}
            <div className="bg-white px-4 pt-3 mt-3 border-b border-gray-100 flex justify-around sticky top-[60px] z-10">
              {(
                [
                  ["todas", `Todas (${todasCount})`],
                  ["proximas", `Próximas (${proximasCount})`],
                  ["completadas", `Completadas (${completadasCount})`],
                  ["canceladas", `Canceladas (${canceladasCount})`],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`pb-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
                    tab === key ? "border-[#F58220] text-[#F58220]" : "border-transparent text-gray-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Listado de Reservas */}
            <div className="p-4 max-w-md mx-auto w-full flex flex-col gap-3">
              {loading && <p className="text-center text-sm text-gray-400 py-10">Cargando reservas...</p>}

              {!loading && listaFiltrada.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-3xl mb-2">📅</p>
                  <p className="text-sm font-medium">No hay reservas en esta sección</p>
                </div>
              )}

              {!loading &&
                listaFiltrada.map((r) => {
                  const { dia, mes, anio } = formatFechaDia(r.fechaInicio);
                  const badgeInfo = badgeConfig(r.estado);

                  return (
                    <div
                      key={r.id}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 relative"
                    >
                      {/* Fecha Estilo Calendario */}
                      <div className="bg-[#FFF8F0] border border-[#F58220]/20 rounded-xl px-3 py-2.5 text-center min-w-[70px] flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-[#F58220] uppercase">{mes}</span>
                        <span className="text-xl font-black text-gray-800 leading-tight">{dia}</span>
                        <span className="text-[10px] text-gray-400">{anio}</span>
                      </div>

                      {/* Información Central */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-bold text-gray-800">
                            {r.horaInicio ? `${r.horaInicio}${r.horaFin ? ` - ${r.horaFin}` : ""}` : "Todo el día"}
                          </p>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${badgeInfo.bg}`}>
                            {badgeInfo.label}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-gray-800 truncate">{r.arrendatarioNombre}</h4>
                        <p className="text-[11px] text-gray-400 truncate">{r.arrendatarioEmail}</p>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                          <span className="text-[11px] text-gray-500 font-medium">
                            {r.cantidadPersonas != null ? `${r.cantidadPersonas} personas` : ""}
                          </span>
                          <span className="text-xs font-bold text-[#F58220]">
                            Reservación #{r.id.slice(-4)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}