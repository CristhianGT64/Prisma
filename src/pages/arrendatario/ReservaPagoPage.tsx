import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useApp } from "../../context/AppContext";
import ResumenReserva from "../../components/ui/ResumenReserva";

export default function ReservaPagoPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { espacios, reservaEnCurso, agregarReserva, usuarioActual, setReservaEnCurso, setUltimaReservaId, tarjetas, tarjetaSeleccionada } = useApp();
    const [aceptaPoliticas, setAceptaPoliticas] = useState(false);

    const espacio = espacios.find(e => e.id === id);
    const tarjetaSeleccionadaObj = tarjetas.find(t => t.id === tarjetaSeleccionada);

    // We don't use aggressive useEffect redirect here to avoid race conditions when clearing state
    if (!espacio || !reservaEnCurso || !usuarioActual) {
        return (
            <div className="flex-1 flex items-center justify-center bg-[#F5F7F9]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9800]"></div>
            </div>
        );
    }



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
        <div className="flex-1 overflow-y-auto bg-white flex flex-col relative pb-24">
            {/* Header */}
            <div className="bg-[#00BFA5] px-5 py-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
                <button onClick={() => navigate(-1)} className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-white font-bold text-lg">Método de pago</h1>
            </div>

            <div className="p-5 flex flex-col gap-6">
                
                {/* Metodo de Pago */}
                <div>
                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-3">Selecciona el método de pago</h3>
                    
                    <div 
                        onClick={() => navigate('/perfil/tarjetas')}
                        className="bg-white border-2 border-[#FF9800] rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer"
                    >
                        <div className="flex gap-3 items-center">
                            <div className="w-10 h-6 bg-gray-200 rounded text-[8px] font-bold text-gray-400 flex items-center justify-center">VISA</div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">Tarjeta de Crédito / Débito</p>
                                {tarjetaSeleccionadaObj ? (
                                    <>
                                        <p className="text-xs text-gray-500 font-mono tracking-widest mt-0.5">**** **** **** {tarjetaSeleccionadaObj.last4}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5 uppercase">{tarjetaSeleccionadaObj.nombre}</p>
                                    </>
                                ) : (
                                    <p className="text-xs text-gray-500 mt-0.5">Ninguna tarjeta seleccionada</p>
                                )}
                            </div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#FF9800]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>

                {/* Resumen */}
                <ResumenReserva espacio={espacio} reserva={reservaEnCurso} />

                {/* Politicas */}
                <div className="mt-2 text-xs text-gray-500 leading-relaxed">
                    <p className="mb-3">Puedes cancelar la reserva hasta 3 días antes del día reservado, en caso de cancelarla después de este tiempo, no se te hará efectivo el reembolso.</p>
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center mt-0.5">
                            <input 
                                type="checkbox" 
                                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded checked:bg-[#FF9800] checked:border-[#FF9800] transition-colors cursor-pointer"
                                checked={aceptaPoliticas}
                                onChange={(e) => setAceptaPoliticas(e.target.checked)}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute w-3.5 h-3.5 left-0.5 top-0.5 pointer-events-none text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Acepto las políticas de cancelación de reservas</span>
                    </label>
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 p-4 flex justify-center z-20">
                <button 
                    onClick={handleConfirmar}
                    disabled={!aceptaPoliticas}
                    className={`w-full py-3.5 rounded-xl font-bold text-white transition-all duration-200 active:scale-[0.98]
                        ${aceptaPoliticas ? 'bg-[#FF9800] hover:bg-[#F57C00] shadow-md shadow-orange-200' : 'bg-gray-300 cursor-not-allowed'}`}
                >
                    Confirmar pago
                </button>
            </div>
        </div>
    );
}
