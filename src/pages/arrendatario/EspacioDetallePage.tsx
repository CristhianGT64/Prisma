import { useNavigate, useParams } from "react-router";
import { useApp } from "../../context/AppContext";

export default function EspacioDetallePage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { espacios, usuarios, toggleFavorito, esFavorito } = useApp();

    const espacio = espacios.find(e => e.id === id);
    if (!espacio) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-white p-5 text-center">
                <p className="text-gray-500 font-medium">Espacio no encontrado</p>
                <button onClick={() => navigate(-1)} className="mt-4 text-[#00BFA5] font-bold">Volver</button>
            </div>
        );
    }

    const arrendador = usuarios.find(u => u.id === espacio.arrendadorId);
    const isFav = esFavorito(espacio.id);

    return (
        <div className="flex-1 overflow-y-auto bg-white flex flex-col relative">
            {/* Image Header */}
            <div className="relative h-64 bg-gray-200">
                {espacio.imagenes[0] && (
                    <img src={espacio.imagenes[0].url} alt={espacio.nombre} className="w-full h-full object-cover" />
                )}
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white z-10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            <div className="px-5 py-6 pb-28">
                <h1 className="text-xl font-bold text-[#00897B] mb-4">{espacio.nombre}</h1>

                {/* Arrendador Info */}
                {arrendador && (
                    <div className="flex items-center gap-3 border border-[#00BFA5]/20 rounded-2xl p-3 mb-6">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-[#00BFA5] flex-shrink-0 flex items-center justify-center font-bold text-[#00BFA5]">
                            {arrendador.fotoPerfil ? (
                                <img src={arrendador.fotoPerfil} alt={arrendador.nombres} className="w-full h-full object-cover" />
                            ) : (
                                arrendador.nombres.charAt(0) + arrendador.apellidos.charAt(0)
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-800">{arrendador.nombres} {arrendador.apellidos}</p>
                            <p className="text-[10px] text-gray-500 font-medium">Arrendador desde {new Date(arrendador.fechaRegistro || "").getFullYear()} | {espacio.totalResenas || 0} reseñas</p>
                        </div>
                    </div>
                )}

                {/* Descripción */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-2">Descripción</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{espacio.descripcion}</p>
                </div>

                {/* Ubicación */}
                <div className="mb-6 flex justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-gray-800 mb-2">Ubicación</h3>
                        <div className="flex items-start gap-2 mt-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#00BFA5] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p className="text-xs text-gray-600 font-medium">{espacio.direccion}, {espacio.ciudad}</p>
                        </div>
                    </div>
                    <div className="w-[120px] h-[120px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200 pointer-events-none">
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight={0}
                            marginWidth={0}
                            src="https://www.openstreetmap.org/export/embed.html?bbox=-122.45%2C37.75%2C-122.39%2C37.79&layer=mapnik&marker=37.77%2C-122.42"
                            style={{ border: 0 }}
                        ></iframe>
                    </div>
                </div>

                {/* Servicios Incluidos */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-3">Servicios incluidos</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {espacio.serviciosIncluidos.map(s => (
                            <div key={s.code} className="flex items-center gap-2 bg-[#FFF9E6] px-3 py-2 rounded-xl border border-[#FFE0B2]">
                                <span className="text-sm">{s.code === 'wifi' ? '📶' : s.code === 'estacionamiento' ? '🚗' : s.code === 'aire_acondicionado' ? '❄️' : '💡'}</span>
                                <span className="text-[11px] font-semibold text-gray-700 truncate">{s.nombre}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Precios */}
                <div className="mb-4">
                    <h3 className="text-sm font-bold text-gray-800 mb-3">Precios</h3>
                    <div className="flex gap-3">
                        {espacio.precioHora && (
                            <div className="flex-1 bg-[#FFF9E6] rounded-xl p-3 border border-[#FFE0B2] text-center">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Por hora</p>
                                <p className="text-lg font-bold text-[#FF9800]">L. {espacio.precioHora.toFixed(2)}</p>
                            </div>
                        )}
                        {espacio.precioDia && (
                            <div className="flex-1 bg-[#FFF9E6] rounded-xl p-3 border border-[#FFE0B2] text-center">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Día completo</p>
                                <p className="text-lg font-bold text-[#FF9800]">L. {espacio.precioDia.toFixed(2)}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 p-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-4 w-full">
                    <button
                        onClick={() => { void toggleFavorito(espacio.id); }}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isFav ? 'bg-[#FFEBEE] text-[#EF5350]' : 'bg-gray-100 text-gray-400'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill={isFav ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => navigate(`/espacios/${espacio.id}/reservar/paso-1`)}
                        className="flex-1 bg-[#FF9800] text-white font-bold py-3.5 rounded-xl hover:bg-[#F57C00] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Reserva ahora
                    </button>
                </div>
            </div>
        </div>
    );
}
