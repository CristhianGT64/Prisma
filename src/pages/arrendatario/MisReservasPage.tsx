import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";

export default function MisReservasPage() {
    const navigate = useNavigate();
    const { reservas, espacios, usuarioActual, cancelarReserva } = useApp();
    const [tabActiva, setTabActiva] = useState<"activas" | "historial">("activas");
    const [reservaACancelar, setReservaACancelar] = useState<string | null>(null);

    if (!usuarioActual) return null;

    // Filtrar reservas del usuario actual
    const misReservas = reservas.filter(r => r.usuarioArrendatarioId === usuarioActual.id);
    
    // Separar en activas (confirmadas) y historial (completadas/canceladas)
    const reservasActivas = misReservas.filter(r => r.estado === "confirmada");
    const reservasHistorial = misReservas.filter(r => r.estado === "completada" || r.estado === "cancelada");

    const reservasAMostrar = tabActiva === "activas" ? reservasActivas : reservasHistorial;

    const formatFecha = (fechaStr: string) => {
        if (!fechaStr) return "";
        const fecha = new Date(fechaStr + "T12:00:00");
        return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
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
        <div className="flex-1 overflow-y-auto bg-[#F5F7F9] pb-24 relative">
            {/* Header */}
            <div className="bg-[#00BFA5] px-5 py-4 sticky top-0 z-10 shadow-sm flex items-center justify-center">
                <h1 className="text-white font-bold text-lg">Mis reservas</h1>
            </div>

            {/* Tabs */}
            <div className="bg-white px-5 pt-3 border-b border-gray-200 flex gap-6 sticky top-[60px] z-10">
                <button 
                    onClick={() => setTabActiva("activas")}
                    className={`pb-3 text-sm font-bold transition-colors relative ${tabActiva === "activas" ? "text-[#FF9800]" : "text-gray-400"}`}
                >
                    Activas
                    {tabActiva === "activas" && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF9800] rounded-t-full"></div>
                    )}
                </button>
                <button 
                    onClick={() => setTabActiva("historial")}
                    className={`pb-3 text-sm font-bold transition-colors relative ${tabActiva === "historial" ? "text-[#FF9800]" : "text-gray-400"}`}
                >
                    Historial
                    {tabActiva === "historial" && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF9800] rounded-t-full"></div>
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col gap-4">
                {reservasAMostrar.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <p>No tienes reservas {tabActiva === "activas" ? "activas" : "en el historial"}.</p>
                    </div>
                ) : (
                    reservasAMostrar.map(reserva => {
                        const espacio = espacios.find(e => e.id === reserva.espacioId);
                        if (!espacio) return null;

                        return (
                            <div key={reserva.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{espacio.nombre}</h3>
                                        <p className="text-[10px] text-gray-500">{espacio.direccion}, {espacio.ciudad}</p>
                                    </div>
                                    <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                        reserva.estado === 'confirmada' ? 'bg-[#FFF3E0] text-[#FF9800]' : 
                                        reserva.estado === 'completada' ? 'bg-[#E0F2F1] text-[#00897B]' : 
                                        'bg-red-50 text-red-500'
                                    }`}>
                                        {reserva.estado === 'confirmada' ? 'Activa' : 
                                         reserva.estado === 'completada' ? 'Completado' : 'Cancelada'}
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-1.5 mb-4 text-xs font-medium text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#00BFA5]">📅</span>
                                        <span>
                                            {reserva.fechaInicio === reserva.fechaFin 
                                                ? formatFecha(reserva.fechaInicio)
                                                : `${formatFecha(reserva.fechaInicio)} - ${formatFecha(reserva.fechaFin)}`}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#00BFA5]">⏰</span>
                                        <span>{reserva.horaInicio} - {reserva.horaFin}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#00BFA5]">💰</span>
                                        <span>L. {reserva.precioTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                {tabActiva === "activas" ? (
                                    <button 
                                        onClick={() => setReservaACancelar(reserva.id)}
                                        className="w-full bg-[#B2DFDB] hover:bg-[#80CBC4] text-[#00695C] font-bold py-2.5 rounded-xl text-sm transition-colors"
                                    >
                                        Cancelar reserva
                                    </button>
                                ) : (
                                    reserva.estado === "completada" ? (
                                        reserva.resenaDejada ? (
                                            <div className="w-full text-center text-[#00BFA5] font-bold py-2 text-sm">
                                                ✓ Reseña enviada
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => navigate(`/reservas/${reserva.id}/resena`)}
                                                className="w-full border-2 border-[#FF9800] text-[#FF9800] hover:bg-[#FFF9E6] font-bold py-2 rounded-xl text-sm transition-colors"
                                            >
                                                Dejar Reseña
                                            </button>
                                        )
                                    ) : (
                                        <button 
                                            disabled
                                            className="w-full border-2 border-gray-300 text-gray-400 font-bold py-2 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Cancelada
                                        </button>
                                    )
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Custom Modal - Cancelar Reserva */}
            {reservaACancelar && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-5">
                    <div className="bg-white rounded-[24px] p-6 w-full max-w-[340px] shadow-2xl relative animate-fadeInScale">
                        <h2 className="text-[17px] font-extrabold text-gray-800 text-center mb-5 pr-2">
                            ¿Estás seguro que quieres cancelar tu reserva?
                        </h2>
                        
                        <div className="bg-[#FFF8E7] rounded-2xl p-4 mb-6">
                            <p className="text-xs text-gray-700 leading-relaxed mb-3 font-medium">
                                Si cancelas tu reserva antes de 3 días de la fecha que escogiste, todavía tienes derecho a reembolso.
                            </p>
                            <p className="text-xs text-gray-700 leading-relaxed font-medium">
                                Puedes contactarte con soporte si tienes alguna duda en soporte@prisma.com
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setReservaACancelar(null)}
                                className="flex-1 bg-white border-2 border-[#00BFA5] text-[#00BFA5] font-extrabold py-3 rounded-[14px] text-sm hover:bg-[#F0FDF8] transition-colors"
                            >
                                No estoy seguro
                            </button>
                            <button 
                                onClick={handleConfirmCancel}
                                className="flex-1 bg-[#FF9800] text-white font-extrabold py-3 rounded-[14px] text-sm hover:bg-[#F57C00] transition-colors"
                            >
                                Sí, estoy seguro
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
