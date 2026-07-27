import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";

export default function FavoritosPage() {
    const navigate = useNavigate();
    const { favoritos, espacios, usuarioActual } = useApp();

    if (!usuarioActual) return null;

    // Obtener los espacios favoritos del usuario actual
    const misFavoritos = favoritos
        .filter(f => f.usuarioId === usuarioActual.id)
        .map(f => espacios.find(e => e.id === f.espacioId))
        .filter(Boolean); // Filtrar posibles undefined

    return (
        <div className="flex-1 overflow-y-auto bg-white pb-24">
            {/* Header */}
            <div className="bg-[#00BFA5] px-5 py-4 sticky top-0 z-10 shadow-sm flex items-center justify-center">
                <h1 className="text-white font-bold text-lg">Favoritos</h1>
            </div>

            <div className="p-5 flex flex-col gap-6">
                {misFavoritos.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <p className="font-medium text-lg text-gray-500 mb-1">Aún no tienes favoritos</p>
                        <p className="text-sm">Explora espacios y guárdalos para verlos aquí.</p>
                        <button 
                            onClick={() => navigate("/inicio")}
                            className="mt-6 bg-[#FF9800] text-white px-6 py-2 rounded-full font-bold shadow-md shadow-orange-200"
                        >
                            Explorar espacios
                        </button>
                    </div>
                ) : (
                    misFavoritos.map(espacio => {
                        if (!espacio) return null;
                        return (
                            <div 
                                key={espacio.id} 
                                className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col relative"
                            >
                                <button 
                                    onClick={() => navigate(`/espacios/${espacio.id}`)}
                                    className="text-left w-full focus:outline-none"
                                >
                                    {espacio.imagenes[0] && (
                                        <img src={espacio.imagenes[0].url} alt={espacio.nombre} className="w-full h-44 object-cover" />
                                    )}
                                    <div className="p-4">
                                        <h3 className="font-bold text-[#00BFA5] text-lg leading-tight mb-1">{espacio.nombre}</h3>
                                        <p className="text-[10px] text-gray-500 mb-2">{espacio.direccion}, {espacio.ciudad}</p>
                                        {espacio.precioHora && (
                                            <p className="text-[#FF9800] font-bold text-sm">
                                                L. {espacio.precioHora.toFixed(2)}<span className="text-gray-400 font-medium text-xs">/hora</span>
                                            </p>
                                        )}
                                    </div>
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
