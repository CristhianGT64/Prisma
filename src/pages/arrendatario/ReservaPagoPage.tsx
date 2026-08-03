import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useApp } from "../../context/AppContext";
import BottomNav from "../../components/layout/BottomNav";

export default function ReservaPagoPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    espacios,
    reservaEnCurso,
    agregarReserva,
    usuarioActual,
    setReservaEnCurso,
    setUltimaReservaId,
    tarjetas,
    tarjetaSeleccionada,
  } = useApp();

  const [aceptaPoliticas, setAceptaPoliticas] = useState(false);

  const espacio = espacios.find((e) => e.id === id);
  const tarjetaSeleccionadaObj = tarjetas.find(
    (t) => t.id === tarjetaSeleccionada
  );

  if (!espacio || !reservaEnCurso || !usuarioActual) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F5F7F9]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F58220]"></div>
      </div>
    );
  }

  // Cálculos dinámicos basados en la información real guardada en `reservaEnCurso`
  const precioHora = espacio.precioHora || 75;
  const precioTotal = reservaEnCurso.precioTotal || 0;
  
  // Calcular duración en horas si está disponible, o estimarla a partir del precio total y precio/hora
  const duracionHorasTotal = precioHora > 0 ? Math.round(precioTotal / precioHora) : 0;

  const handleConfirmar = async () => {
    if (!aceptaPoliticas) return;

    try {
      const reservaId = await agregarReserva({
        espacioId: espacio.id,
        usuarioArrendatarioId: usuarioActual.id,
        usuarioArrendadorId: espacio.arrendadorId,
        fechaInicio: reservaEnCurso.fechaInicio,
        fechaFin: reservaEnCurso.fechaFin,
        estado: "confirmada",
        precioTotal: reservaEnCurso.precioTotal,
        cantidadPersonas: reservaEnCurso.cantidadPersonas,
        horaInicio: reservaEnCurso.horaInicio,
        horaFin: reservaEnCurso.horaFin,
      });

      setUltimaReservaId(reservaId);
      setReservaEnCurso(null);
      navigate(`/reservas/${reservaId}/confirmacion`);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans relative">
      {/* Contenedor principal con scroll */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Header con botón regresar a la derecha */}
        <div className="bg-[#079FA0] px-5 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm text-white">
          <h1 className="font-bold text-lg">Método de pago</h1>
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

        <div className="p-5 max-w-md mx-auto flex flex-col gap-6">
          {/* Seleccionar método de pago */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-3">
              Seleccione el método de pago
            </h3>

            <div
              onClick={() => navigate("/perfil/tarjetas")}
              className="bg-white border-2 border-[#F58220] rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer"
            >
              <div className="flex gap-3 items-center">
                <div className="w-10 h-6 bg-gray-200 rounded text-[8px] font-bold text-gray-400 flex items-center justify-center">
                  VISA
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    Tarjeta de Crédito / Débito
                  </p>
                  {tarjetaSeleccionadaObj ? (
                    <>
                      <p className="text-xs text-gray-500 font-mono tracking-widest mt-0.5">
                        **** **** **** {tarjetaSeleccionadaObj.last4}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5 uppercase">
                        {tarjetaSeleccionadaObj.nombre}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-gray-500 mt-0.5">
                      Ninguna tarjeta seleccionada
                    </p>
                  )}
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-[#F58220]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          {/* Resumen de la reserva */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-3">
              Resumen de la reserva
            </h3>
            <div className="bg-[#A2E0D3] rounded-3xl p-5 text-gray-800 flex flex-col gap-3">
              <div className="flex justify-between items-center pb-2 border-b border-[#82CEBE]">
                <span className="text-sm font-bold text-gray-700">Espacio:</span>
                <span className="text-sm font-medium text-gray-800">
                  {espacio.nombre || "Premium Coworking"}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-[#82CEBE]">
                <span className="text-sm font-bold text-gray-700">Fechas:</span>
                <span className="text-sm font-medium text-gray-800">
                  {reservaEnCurso.fechaInicio} {reservaEnCurso.fechaFin && reservaEnCurso.fechaFin !== reservaEnCurso.fechaInicio ? `- ${reservaEnCurso.fechaFin}` : ""}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-[#82CEBE]">
                <span className="text-sm font-bold text-gray-700">Horario:</span>
                <span className="text-sm font-medium text-gray-800">
                  {reservaEnCurso.horaInicio} - {reservaEnCurso.horaFin}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-[#82CEBE]">
                <span className="text-sm font-bold text-gray-700">Duración:</span>
                <span className="text-sm font-medium text-gray-800">
                  {duracionHorasTotal} horas
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-[#82CEBE]">
                <span className="text-sm font-bold text-gray-700">
                  Precio/hora:
                </span>
                <span className="text-sm font-medium text-gray-800">
                  L. {precioHora.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-base font-bold text-gray-800">Total:</span>
                <span className="text-base font-extrabold text-[#F58220]">
                  L. {precioTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Políticas y Checkbox */}
          <div className="mt-2 text-xs text-gray-600 leading-relaxed flex flex-col gap-4">
            <p>
              Puedes cancelar tu reserva hasta 3 días antes del dia reservado,
              en caso de cancelarla después de este tiempo, no se te hará
              efectivo el reembolso
            </p>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-[#F58220] checked:border-[#F58220] transition-colors cursor-pointer"
                  checked={aceptaPoliticas}
                  onChange={(e) => setAceptaPoliticas(e.target.checked)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute w-3.5 h-3.5 left-0.5 top-0.5 pointer-events-none text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="font-medium text-gray-700 text-xs">
                Acepto las políticas de cancelación de reservas
              </span>
            </label>
          </div>

          {/* Botón Confirmar Pago */}
          <div className="flex justify-center mt-2">
            <button
              onClick={handleConfirmar}
              disabled={!aceptaPoliticas}
              className={`font-bold px-8 py-2.5 rounded-full shadow-md text-sm text-white transition-all duration-200 active:scale-95
                ${
                  aceptaPoliticas
                    ? "bg-[#F58220] hover:bg-[#e0731a] cursor-pointer"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              Confirmar pago
            </button>
          </div>
        </div>
      </div>

      {/* Navegación Inferior */}
      <BottomNav />
    </div>
  );
}