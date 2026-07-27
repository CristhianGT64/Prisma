import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";

export default function MisTarjetasPage() {
    const navigate = useNavigate();
    const { usuarioActual, tarjetas, tarjetaSeleccionada, setTarjetaSeleccionada, eliminarTarjeta } = useApp();

    if (!usuarioActual) return null;

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await eliminarTarjeta(id);
        } catch {
            /* ignore */
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-white flex flex-col relative pb-24">
            {/* Header */}
            <div className="bg-[#00BFA5] px-5 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <button onClick={() => navigate(-1)} className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-white font-bold text-[17px]">Mis tarjetas</h1>
                <div className="w-6"></div> {/* Spacer */}
            </div>

            <div className="p-5 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[13px] font-extrabold text-gray-800">Seleccione una tarjeta</h3>
                    <button 
                        onClick={() => navigate("/perfil/tarjetas/nueva")}
                        className="text-[11px] font-bold text-[#00BFA5] border border-[#00BFA5] rounded-full px-3 py-1 hover:bg-[#F0FDF8] transition-colors"
                    >
                        Agregar tarjeta +
                    </button>
                </div>

                <div className="flex flex-col gap-4 mb-8">
                    {tarjetas.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-10">No tienes tarjetas guardadas.</p>
                    ) : (
                        tarjetas.map(tarjeta => {
                            const isSelected = tarjetaSeleccionada === tarjeta.id;
                            return (
                                <div 
                                    key={tarjeta.id}
                                    onClick={() => setTarjetaSeleccionada(tarjeta.id)}
                                    className={`relative rounded-[16px] p-5 cursor-pointer transition-all duration-200 border-2
                                        ${isSelected ? 'bg-[#FFF9E6] border-[#00BFA5]' : 'bg-[#FFF9E6] border-transparent'}
                                    `}
                                >
                                    <div className="flex flex-col">
                                        <p className="font-extrabold text-sm text-gray-800 tracking-widest mb-1">
                                            **** **** **** {tarjeta.last4}
                                        </p>
                                        <p className="text-[11px] font-medium text-gray-600 uppercase">
                                            {tarjeta.nombre}
                                        </p>
                                        <p className="text-[11px] font-bold text-gray-500 mt-1">
                                            {tarjeta.tipo}
                                        </p>
                                    </div>
                                    
                                    <button 
                                        onClick={(e) => handleDelete(tarjeta.id, e)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00BFA5] hover:text-red-500 transition-colors p-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="flex justify-center mt-2">
                    <button 
                        disabled={!tarjetaSeleccionada || tarjetas.length === 0}
                        onClick={() => navigate(-1)}
                        className="bg-[#FF9800] text-white font-bold text-[13px] px-10 py-2.5 rounded-[12px] shadow-md hover:bg-[#F57C00] transition-colors disabled:opacity-50"
                    >
                        Usar
                    </button>
                </div>
            </div>
        </div>
    );
}
