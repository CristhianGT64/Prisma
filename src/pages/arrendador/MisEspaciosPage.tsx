import { useNavigate } from "react-router";
import { useState } from "react";
import { useApp } from "../../context/AppContext";
import ServicioTag from "../../components/ui/ServicioTag";
import BottomNav from "../../components/layout/BottomNav";
import type { Espacio } from "../../interfaces/Espacio";

interface EspacioCardArrendadorProps {
    espacio: Espacio;
    onEditar: (id: string) => void;
    onEliminar: (id: string) => void;
}

function EspacioCardArrendador({ espacio, onEditar, onEliminar }: EspacioCardArrendadorProps) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 mb-4">
            {espacio.imagenes[0] && (
                <img
                    src={espacio.imagenes[0].url}
                    alt={espacio.nombre}
                    className="w-full h-44 object-cover"
                />
            )}
            <div className="p-4">
                <h3 className="font-bold text-[#00897B] text-base">{espacio.nombre}</h3>
                <div className="flex items-center gap-1 mt-1 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#F58220]" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-gray-500">{espacio.direccion}, {espacio.ciudad}</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{espacio.descripcion}</p>

                {/* Servicios */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {espacio.serviciosIncluidos.slice(0, 4).map(s => (
                        <ServicioTag key={s.code} servicio={s} />
                    ))}
                </div>

                {/* Botones */}
                <div className="flex gap-3">
                    <button
                        onClick={() => onEditar(espacio.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#00BFA5] text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-[#00897B] transition-all duration-200 active:scale-95 shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Editar
                    </button>
                    <button
                        onClick={() => onEliminar(espacio.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#FF3B30] text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-red-600 transition-all duration-200 active:scale-95 shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function MisEspaciosPage() {
    const navigate = useNavigate();
    const { usuarioActual, obtenerEspaciosPorArrendador, eliminarEspacio } = useApp();
    const [espacioAEliminar, setEspacioAEliminar] = useState<Espacio | null>(null);
    const [eliminando, setEliminando] = useState(false);

    if (!usuarioActual) {
        navigate("/login");
        return null;
    }

    const mis_espacios = obtenerEspaciosPorArrendador(usuarioActual.id);

    const handleSolicitarEliminar = (id: string) => {
        const espacio = mis_espacios.find((item) => item.id === id) || null;
        setEspacioAEliminar(espacio);
    };

    const handleConfirmarEliminar = async () => {
        if (!espacioAEliminar || eliminando) return;

        setEliminando(true);
        try {
            await eliminarEspacio(espacioAEliminar.id);
            setEspacioAEliminar(null);
        } catch {
            /* ignore */
        } finally {
            setEliminando(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans relative">
            <div className="flex-1 overflow-y-auto pb-28">
                {/* Header */}
                <div className="bg-[#F58220] px-5 py-5 flex items-center justify-between shadow-md">
                    <div>
                        <h1 className="text-white font-bold text-xl">
                            Mis Espacios: {mis_espacios.length}
                        </h1>
                        <p className="text-white/90 text-sm capitalize">{usuarioActual.rol}</p>
                    </div>
                    <button
                        onClick={() => navigate("/arrendador/espacios/nuevo")}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 text-[#F58220]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                <div className="px-4 pt-5 max-w-md mx-auto w-full">
                    {mis_espacios.length === 0 ? (
                        /* Estado vacío */
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <p className="text-gray-400 font-medium">No hay espacios registrados</p>
                            <button
                                onClick={() => navigate("/arrendador/espacios/nuevo")}
                                className="bg-[#F58220] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#e0731a] transition-all duration-200 active:scale-95 shadow-md"
                            >
                                Agregar primer espacio
                            </button>
                        </div>
                    ) : (
                        /* Lista de espacios */
                        mis_espacios.map(espacio => (
                            <EspacioCardArrendador
                                key={espacio.id}
                                espacio={espacio}
                                onEditar={(id) => navigate(`/arrendador/espacios/${id}/editar`)}
                                onEliminar={handleSolicitarEliminar}
                            />
                        ))
                    )}
                </div>
            </div>

            {espacioAEliminar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <button
                        type="button"
                        aria-label="Cerrar modal"
                        className="absolute inset-0 bg-black/35 backdrop-blur-[1.5px]"
                        onClick={() => !eliminando && setEspacioAEliminar(null)}
                    />

                    <div className="relative w-full max-w-xs rounded-2xl bg-white shadow-2xl border border-orange-100 overflow-hidden animate-[fadeIn_.2s_ease-out]">
                        <div className="h-1.5 bg-gradient-to-r from-[#F58220] via-[#FF9C49] to-[#F58220]" />
                        <div className="p-5">
                            <div className="w-11 h-11 rounded-full bg-red-50 text-[#FF3B30] mx-auto mb-3 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>

                            <h3 className="text-center text-base font-bold text-gray-800">Confirmar eliminación</h3>
                            <p className="text-center text-sm text-gray-500 mt-2 leading-relaxed">
                                ¿Estás seguro de eliminar
                                <span className="font-semibold text-gray-700"> "{espacioAEliminar.nombre}"</span>?
                            </p>

                            <div className="mt-5 grid grid-cols-2 gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setEspacioAEliminar(null)}
                                    disabled={eliminando}
                                    className="py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-60"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmarEliminar}
                                    disabled={eliminando}
                                    className="py-2.5 rounded-xl text-sm font-semibold text-white bg-[#FF3B30] hover:bg-red-600 transition-colors disabled:opacity-70"
                                >
                                    {eliminando ? "Eliminando..." : "Eliminar"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Navegación Inferior */}
            <BottomNav />
        </div>
    );
}