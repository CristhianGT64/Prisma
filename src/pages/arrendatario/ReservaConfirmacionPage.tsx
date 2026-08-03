import { useNavigate, useParams } from "react-router";
import { useApp } from "../../context/AppContext";
import BottomNav from "../../components/layout/BottomNav";

export default function ReservaConfirmacionPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { reservas, espacios } = useApp();

  const reserva = reservas.find((r) => r.id === id);
  const espacio = espacios.find((e) => e.id === reserva?.espacioId);

  if (!reserva || !espacio) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F58220]"></div>
      </div>
    );
  }

  const formatFecha = (fechaStr: string) => {
    if (!fechaStr) return "";
    const fecha = new Date(fechaStr + "T12:00:00");
    return fecha.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getFechasTexto = () => {
    if (reserva.fechaInicio === reserva.fechaFin)
      return formatFecha(reserva.fechaInicio);
    return `${formatFecha(reserva.fechaInicio)} - ${formatFecha(
      reserva.fechaFin
    )}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans relative">
      {/* Header decorativo teal */}
      <div className="w-full h-14 bg-[#079FA0] sticky top-0 z-10"></div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto pb-28 px-6 pt-10 flex flex-col items-center justify-center text-center max-w-md mx-auto w-full">
        <h1 className="text-base font-bold text-gray-800 mb-6">
          ¡Reserva confirmada!
        </h1>

        {/* Ícono de check circular amarillo */}
        <div className="w-16 h-16 rounded-full border-4 border-[#F58220] flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-[#F58220]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <p className="text-xs text-gray-700 mb-4 max-w-[280px] leading-relaxed">
          Tu espacio ha sido reservado exitosamente
          <br />
          El código de reserva es:
        </p>

        {/* Código de reserva */}
        <div className="mb-4">
          <span className="font-extrabold text-base text-[#F58220]">
            {reserva.id || "RES-009-12345"}
          </span>
        </div>

        <p className="text-xs text-gray-700 mb-8 max-w-[280px] leading-relaxed">
          Preséntalo al momento de llegar al lugar
          <br />
          para verificar tu identidad
        </p>

        {/* Resumen simplificado (Tarjeta verde menta) */}
        <div className="w-full bg-[#A2E0D3] rounded-3xl p-5 text-gray-800 flex flex-col gap-3 mb-8 text-left">
          <div className="flex justify-between items-center pb-2 border-b border-[#82CEBE]">
            <span className="text-xs font-bold text-gray-700">Espacio:</span>
            <span className="text-xs font-medium text-gray-800">
              {espacio.nombre}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-[#82CEBE]">
            <span className="text-xs font-bold text-gray-700">Fechas:</span>
            <span className="text-xs font-medium text-gray-800">
              {getFechasTexto()}
            </span>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-xs font-bold text-gray-700">Horario:</span>
            <span className="text-xs font-medium text-gray-800">
              {reserva.horaInicio} - {reserva.horaFin}
            </span>
          </div>
        </div>

        {/* Botón "Ver mis reservas" estilo Pill */}
        <button
          onClick={() => navigate("/reservas")}
          className="bg-[#F58220] text-white font-bold text-xs px-8 py-2.5 rounded-full shadow-md hover:bg-[#e0731a] active:scale-95 transition-all cursor-pointer"
        >
          Ver mis reservas
        </button>
      </div>

      {/* Navegación Inferior */}
      <BottomNav />
    </div>
  );
}