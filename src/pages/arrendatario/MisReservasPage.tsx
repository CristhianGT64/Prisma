import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import BottomNav from "../../components/layout/BottomNav";

export default function MisReservasPage() {
  const navigate = useNavigate();
  const { reservas, espacios, usuarioActual, cancelarReserva } = useApp();
  const [tabActiva, setTabActiva] = useState<"activas" | "historial">("activas");
  const [reservaACancelar, setReservaACancelar] = useState<string | null>(null);

  if (!usuarioActual) return null;

  // Filtrar reservas del usuario actual
  const misReservas = reservas.filter(
    (r) => r.usuarioArrendatarioId === usuarioActual.id
  );

  // Separar en activas (confirmadas) e historial (completadas/canceladas)
  const reservasActivas = misReservas.filter((r) => r.estado === "confirmada");
  const reservasHistorial = misReservas.filter(
    (r) => r.estado === "completada" || r.estado === "cancelada"
  );

  const reservasAMostrar =
    tabActiva === "activas" ? reservasActivas : reservasHistorial;

  const formatFecha = (fechaStr: string) => {
    if (!fechaStr) return "";
    const fecha = new Date(fechaStr + "T12:00:00");
    return fecha.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleConfirmCancel = async () => {
    if (reservaACancelar) {
      try {
        await cancelarReserva(reservaACancelar);
      } catch {
        /* ignore */
      }
      setReservaACancelar(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans relative">
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Header */}
        <div className="bg-[#079FA0] px-5 py-4 sticky top-0 z-10 text-center text-white shadow-sm">
          <h1 className="font-bold text-lg">Mis reservas</h1>
        </div>

        {/* Tabs */}
        <div className="bg-white px-6 pt-4 border-b border-gray-100 flex gap-8 sticky top-[56px] z-10 max-w-md mx-auto">
          <button
            onClick={() => setTabActiva("activas")}
            className={`pb-2 text-sm font-bold transition-colors ${
              tabActiva === "activas" ? "text-[#F58220]" : "text-[#079FA0]"
            }`}
          >
            Activas
          </button>
          <button
            onClick={() => setTabActiva("historial")}
            className={`pb-2 text-sm font-bold transition-colors ${
              tabActiva === "historial" ? "text-[#F58220]" : "text-[#079FA0]"
            }`}
          >
            Historial
          </button>
        </div>

        {/* Lista de reservas */}
        <div className="p-5 max-w-md mx-auto flex flex-col gap-5">
          {reservasAMostrar.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm">
                No tienes reservas{" "}
                {tabActiva === "activas" ? "activas" : "en el historial"}.
              </p>
            </div>
          ) : (
            reservasAMostrar.map((reserva) => {
              const espacio = espacios.find((e) => e.id === reserva.espacioId);
              if (!espacio) return null;

              return (
                <div
                  key={reserva.id}
                  className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col justify-between"
                >
                  {/* Encabezado de la tarjeta */}
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm text-gray-800 pr-2">
                      {espacio.nombre}
                    </h3>

                    {/* Status Badge */}
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        reserva.estado === "confirmada"
                          ? "bg-[#FDF0D5] text-[#F58220]"
                          : reserva.estado === "completada"
                          ? "bg-[#079FA0] text-white"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {reserva.estado === "confirmada"
                        ? "Activa"
                        : reserva.estado === "completada"
                        ? "Completado"
                        : "Cancelada"}
                    </span>
                  </div>

                  {/* Dirección */}
                  <p className="text-[11px] text-gray-500 mb-3">
                    {espacio.direccion}, {espacio.ciudad}
                  </p>

                  {/* Detalles con Íconos */}
                  <div className="flex flex-col gap-1.5 mb-5 text-xs text-gray-600 font-medium">
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-[#079FA0]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        {reserva.fechaInicio === reserva.fechaFin
                          ? formatFecha(reserva.fechaInicio)
                          : `${formatFecha(reserva.fechaInicio)} - ${formatFecha(
                              reserva.fechaFin
                            )}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-[#079FA0]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        {reserva.horaInicio} - {reserva.horaFin}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 text-[#079FA0]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>L.{reserva.precioTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Acciones de la tarjeta */}
                  {tabActiva === "activas" ? (
                    <button
                      onClick={() => setReservaACancelar(reserva.id)}
                      className="w-full bg-[#A2E0D3] hover:bg-[#82CEBE] text-white font-bold py-2.5 rounded-2xl text-xs transition-colors cursor-pointer"
                    >
                      Cancelar reserva
                    </button>
                  ) : reserva.estado === "completada" ? (
                    reserva.resenaDejada ? (
                      <div className="w-full text-center text-[#079FA0] font-bold py-2 text-xs">
                        ✓ Reseña enviada
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          navigate(`/reservas/${reserva.id}/resena`)
                        }
                        className="w-full border-2 border-[#F58220] text-[#F58220] hover:bg-[#FFF8E7] font-bold py-2 rounded-full text-xs transition-colors cursor-pointer"
                      >
                        Dejar Reseña
                      </button>
                    )
                  ) : (
                    <button
                      disabled
                      className="w-full border border-gray-200 text-gray-400 font-bold py-2 rounded-full text-xs cursor-not-allowed opacity-60"
                    >
                      Cancelada
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal - Cancelar Reserva */}
      {reservaACancelar && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-5">
          <div className="bg-white rounded-3xl p-6 w-full max-w-[340px] shadow-2xl relative">
            <h2 className="text-base font-bold text-gray-800 text-center mb-4">
              ¿Estás seguro que quieres cancelar tu reserva?
            </h2>

            <div className="bg-[#FFF8E7] rounded-2xl p-4 mb-5">
              <p className="text-xs text-gray-700 leading-relaxed mb-2 font-medium">
                Si cancelas tu reserva antes de 3 días de la fecha que escogiste,
                todavía tienes derecho a reembolso.
              </p>
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                Puedes contactarte con soporte si tienes alguna duda en{" "}
                <span className="underline">soporte@prisma.com</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setReservaACancelar(null)}
                className="flex-1 bg-white border-2 border-[#079FA0] text-[#079FA0] font-bold py-2.5 rounded-full text-xs hover:bg-teal-50 transition-colors"
              >
                No estoy seguro
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 bg-[#F58220] text-white font-bold py-2.5 rounded-full text-xs hover:bg-[#e0731a] transition-colors"
              >
                Sí, estoy seguro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BottomNav */}
      <BottomNav />
    </div>
  );
}