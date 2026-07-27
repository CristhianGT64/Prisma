import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import CategoriaTag from "../../components/ui/CategoriaTag";

export default function InicioPage() {
    const navigate = useNavigate();
    const { espacios } = useApp();
    const [categoriaActiva, setCategoriaActiva] = useState("Todo");

    const categorias = ["Todo", "Oficina", "Salas", "Escritorios", "Eventos"];

    const espaciosDisponibles = espacios.filter(e => e.disponible);
    
    // Filtro simple
    const espaciosFiltrados = categoriaActiva === "Todo" 
        ? espaciosDisponibles 
        : espaciosDisponibles.filter(e => e.categoriaId === "CAT001"); // En un caso real usaría nombre o ID real

    return (
        <div className="flex-1 overflow-y-auto pb-24 bg-white">
            {/* Header / Top bar */}
            <div className="bg-[#00BFA5] px-5 py-4 sticky top-0 z-10 shadow-sm flex items-center justify-center">
                <h1 className="text-white font-bold text-lg">Espacio de Trabajo</h1>
            </div>

            <div className="px-5 py-4">
                {/* Barra de búsqueda */}
                <div className="relative mb-5 shadow-sm">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#00BFA5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar espacio..."
                        className="w-full bg-[#FFF9E6] border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF9800] transition"
                    />
                </div>

                {/* Banner Promocional */}
                <div className="bg-[#FF9800] rounded-2xl p-5 mb-6 text-white shadow-md relative overflow-hidden">
                    {/* Decorative circle */}
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
                    <span className="inline-block bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider mb-2 uppercase">Promoción</span>
                    <h2 className="text-xl font-extrabold leading-tight mb-1">20% descuento</h2>
                    <p className="text-xs font-medium text-white/90">En tu primera reserva. Código: <span className="bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold tracking-widest text-white">WELCOME20</span></p>
                </div>

                {/* Categorías */}
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-3">Categorías</h3>
                    <div className="flex overflow-x-auto gap-3 pb-2 -mx-5 px-5 hide-scrollbar">
                        {categorias.map(cat => (
                            <CategoriaTag 
                                key={cat} 
                                label={cat} 
                                isActive={categoriaActiva === cat} 
                                onClick={() => setCategoriaActiva(cat)} 
                            />
                        ))}
                    </div>
                </div>

                {/* Espacios Recomendados */}
                <div>
                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-3">Espacios Recomendados</h3>
                    <div className="flex flex-col gap-5">
                        {espaciosFiltrados.map(espacio => (
                            <button 
                                key={espacio.id} 
                                onClick={() => navigate(`/espacios/${espacio.id}`)}
                                className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col text-left transition-transform active:scale-[0.98]"
                            >
                                <div className="relative">
                                    {espacio.imagenes[0] && (
                                        <img src={espacio.imagenes[0].url} alt={espacio.nombre} className="w-full h-44 object-cover" />
                                    )}
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-[#FF9800] shadow-sm">
                                        ★ {espacio.calificacion || "N/A"}
                                    </div>
                                    <div className="absolute -bottom-5 right-4 w-12 h-12 bg-gray-200 rounded-full border-4 border-white shadow-sm overflow-hidden flex items-center justify-center">
                                         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="p-4 pr-16">
                                    <h4 className="font-bold text-gray-800 text-[15px] leading-tight mb-1.5">{espacio.nombre}</h4>
                                    <p className="text-xs text-gray-500 mb-2">{espacio.direccion}, {espacio.ciudad}</p>
                                    {espacio.precioHora && (
                                        <p className="text-[#FF9800] font-bold text-sm">
                                            L. {espacio.precioHora.toFixed(2)}<span className="text-gray-400 font-medium text-xs">/hora</span>
                                        </p>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* QA Button Mockup (bottom right floating) */}
            <div className="fixed bottom-20 right-4 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center cursor-pointer z-40 text-[#FF9800] font-bold text-lg">
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
                QA
            </div>
        </div>
    );
}
