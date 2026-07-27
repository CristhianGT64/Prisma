import { useNavigate, useParams } from "react-router";
import { useApp } from "../../context/AppContext";

export default function ReservaConfirmacionPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { reservas, espacios } = useApp();

    const reserva = reservas.find(r => r.id === id);
    const espacio = espacios.find(e => e.id === reserva?.espacioId);

    if (!reserva || !espacio) {
        return (
            <div className="flex-1 flex items-center justify-center bg-white text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9800]"></div>
            </div>
        );
    }

    const formatFecha = (fechaStr: string) => {
        if (!fechaStr) return "";
        const fecha = new Date(fechaStr + "T12:00:00");
        return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const getFechasTexto = () => {
        if (reserva.fechaInicio === reserva.fechaFin) return formatFecha(reserva.fechaInicio);
        return `${formatFecha(reserva.fechaInicio)} - ${formatFecha(reserva.fechaFin)}`;
    };

    return (
        <div className="flex-1 overflow-y-auto bg-white flex flex-col items-center justify-center p-5 pt-16 text-center relative pb-24">
            
            {/* Header decorativo superior vacío (como en la imagen) */}
            <div className="absolute top-0 left-0 w-full h-14 bg-[#00BFA5]"></div>

            <h1 className="text-sm font-extrabold text-gray-800 mb-6 mt-8">¡Reserva confirmada!</h1>

            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-[#FFB300]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            
            <p className="text-xs text-gray-600 mb-1 max-w-[250px] leading-relaxed">
                Tu espacio ha sido reservado exitosamente<br/>
                El código de reserva es:
            </p>

            <div className="mb-6">
                <span className="font-extrabold text-lg text-[#FF9800] tracking-widest">{reserva.id}</span>
            </div>

            <p className="text-xs text-gray-600 mb-8 max-w-[220px] leading-relaxed">
                Preséntalo al momento de llegar al lugar para verificar tu identidad
            </p>

            {/* Resumen simplificado (Tarjeta verde menta) */}
            <div className="w-full bg-[#A5D6A7] rounded-3xl p-5 shadow-sm flex flex-col gap-3 text-left mb-8 mx-4 max-w-[320px]">
                <div className="flex justify-between items-start text-[11px]">
                    <span className="font-extrabold text-gray-800">Espacio:</span>
                    <span className="font-medium text-gray-700 text-right">{espacio.nombre}</span>
                </div>
                <div className="flex justify-between items-start text-[11px] border-t border-black/10 pt-3">
                    <span className="font-extrabold text-gray-800">Fechas:</span>
                    <span className="font-medium text-gray-700">{getFechasTexto()}</span>
                </div>
                <div className="flex justify-between items-start text-[11px] border-t border-black/10 pt-3">
                    <span className="font-extrabold text-gray-800">Horario:</span>
                    <span className="font-medium text-gray-700">{reserva.horaInicio} - {reserva.horaFin}</span>
                </div>
            </div>

            {/* Botón naranja */}
            <button 
                onClick={() => navigate("/reservas")}
                className="bg-[#FF9800] text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-[#F57C00] active:scale-[0.98] transition-all shadow-md"
            >
                Ver mis reservas
            </button>
        </div>
    );
}
