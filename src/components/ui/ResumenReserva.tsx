import type { Espacio } from "../../interfaces/Espacio";
import type { ReservaEnCurso } from "../../context/AppContext";

interface ResumenReservaProps {
    espacio: Espacio;
    reserva: ReservaEnCurso;
}

export default function ResumenReserva({ espacio, reserva }: ResumenReservaProps) {
    const formatFecha = (fechaStr: string) => {
        if (!fechaStr) return "";
        const fecha = new Date(fechaStr + "T12:00:00");
        return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getFechasTexto = () => {
        if (!reserva.fechaInicio) return "Por seleccionar";
        if (reserva.fechaInicio === reserva.fechaFin) return formatFecha(reserva.fechaInicio);
        return `${formatFecha(reserva.fechaInicio)} - ${formatFecha(reserva.fechaFin)}`;
    };

    const getHorarioTexto = () => {
        if (!reserva.horaInicio || !reserva.horaFin) return "Por seleccionar";
        return `${reserva.horaInicio} - ${reserva.horaFin}`;
    };

    return (
        <div>
            <h3 className="font-bold text-gray-800 text-sm mb-3">Resumen de la reserva</h3>
            <div className="bg-[#E0F7F4] rounded-2xl p-4 border border-[#B2EBF2] shadow-sm flex flex-col gap-3">
                
                <div className="flex justify-between items-start text-sm">
                    <span className="font-semibold text-gray-600">Espacio:</span>
                    <span className="font-medium text-gray-800 text-right">{espacio.nombre}</span>
                </div>
                
                <div className="flex justify-between items-start text-sm border-t border-[#B2EBF2]/50 pt-2">
                    <span className="font-semibold text-gray-600">Fechas:</span>
                    <span className="font-medium text-gray-800">{getFechasTexto()}</span>
                </div>
                
                <div className="flex justify-between items-start text-sm border-t border-[#B2EBF2]/50 pt-2">
                    <span className="font-semibold text-gray-600">Horario:</span>
                    <span className="font-medium text-gray-800">{getHorarioTexto()}</span>
                </div>

                <div className="flex justify-between items-start text-sm border-t border-[#B2EBF2]/50 pt-2">
                    <span className="font-semibold text-gray-600">Precio/hora:</span>
                    <span className="font-medium text-gray-800">L. {espacio.precioHora?.toFixed(2) || "0.00"}</span>
                </div>

                <div className="flex justify-between items-end text-sm border-t-2 border-[#00BFA5] pt-3 mt-1">
                    <span className="font-bold text-gray-800 text-base">Total:</span>
                    <span className="font-bold text-[#FF9800] text-lg">L. {reserva.precioTotal?.toFixed(2) || "0.00"}</span>
                </div>

            </div>
        </div>
    );
}
