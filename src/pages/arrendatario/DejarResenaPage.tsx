import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useApp } from "../../context/AppContext";

const RATING_TEXTS = {
    1: "Muy mala",
    2: "Mala",
    3: "Regular",
    4: "Buena",
    5: "Muy buena",
};

const OPCIONES = [
    "Limpieza",
    "Comodidad",
    "Equipamiento",
    "Iluminación",
    "Conectividad",
    "Atención"
];

export default function DejarResenaPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { reservas, espacios, guardarResena } = useApp();
    
    const [rating, setRating] = useState(0);
    const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState<string[]>([]);
    const [comentario, setComentario] = useState("");

    const reserva = reservas.find(r => r.id === id);
    const espacio = espacios.find(e => e.id === reserva?.espacioId);

    if (!reserva || !espacio) return null;

    const toggleOpcion = (opcion: string) => {
        setOpcionesSeleccionadas(prev => 
            prev.includes(opcion) 
                ? prev.filter(o => o !== opcion)
                : [...prev, opcion]
        );
    };

    const handlePublicar = async () => {
        if (rating === 0) return;
        try {
            await guardarResena(reserva.id, {
                calificacion: rating,
                comentario,
                tiposEtiquetas: opcionesSeleccionadas,
            });
            navigate('/reservas', { replace: true });
        } catch {
            /* ignore */
        }
    };

    const formatFecha = (fechaStr: string) => {
        const fecha = new Date(fechaStr + "T12:00:00");
        return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="flex-1 overflow-y-auto bg-white flex flex-col relative">
            {/* Header */}
            <div className="bg-[#00BFA5] px-5 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <button onClick={() => navigate(-1)} className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-white font-bold text-[17px]">Dejar una reseña</h1>
                <div className="w-6"></div>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <p className="text-[11px] font-bold text-center text-gray-800 mb-4">
                    Tu reserva ha finalizado. ¡Cuéntanos tu experiencia!
                </p>

                {/* Status Banner */}
                <div className="bg-[#FFF9E6] rounded-xl p-4 flex items-center gap-4 mb-6 shadow-sm border border-[#FFE0B2]">
                    <div className="w-8 h-8 rounded-full bg-[#FF9800] flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-[13px] font-extrabold text-gray-800">Reserva completada</h3>
                        <p className="text-xs text-gray-600 font-medium mt-0.5">Gracias por usar Prisma.</p>
                    </div>
                </div>

                {/* Resumen Espacio */}
                <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden mb-6 flex flex-col">
                    <div className="h-28 bg-gray-200 w-full relative">
                        {espacio.imagenes[0] && (
                            <img src={espacio.imagenes[0].url} alt={espacio.nombre} className="w-full h-full object-cover" />
                        )}
                    </div>
                    <div className="p-4 relative">
                        <div className="absolute right-4 top-4 bg-[#B2DFDB] text-[#00695C] px-3 py-1 rounded-full text-[10px] font-bold">
                            Completado
                        </div>
                        <h3 className="font-extrabold text-sm text-gray-800 mb-1 pr-20 truncate">{espacio.nombre}</h3>
                        <p className="text-[10px] text-gray-500 font-medium mb-1">{espacio.direccion}, {espacio.ciudad}</p>
                        <p className="text-[10px] text-gray-500 font-medium mb-1">{formatFecha(reserva.fechaInicio)}</p>
                        <p className="text-[10px] text-gray-500 font-medium mb-2">{reserva.horaInicio} - {reserva.horaFin}</p>
                        <p className="text-[11px] font-extrabold text-[#FF9800]">L. {espacio.precioHora}/hora</p>
                    </div>
                </div>

                {/* Rating */}
                <div className="flex flex-col items-center mb-6">
                    <h2 className="text-[13px] font-extrabold text-gray-800 mb-1">¿Cómo fue tu experiencia?</h2>
                    <p className="text-[11px] text-gray-500 font-medium mb-4 text-center">Tu opinión ayuda a otros miembros de la comunidad.</p>
                    
                    <div className="flex gap-2 mb-3">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform active:scale-90">
                                <svg xmlns="http://www.w3.org/2000/svg" 
                                    className="w-10 h-10"
                                    fill={rating >= star ? "#FF9800" : "none"} 
                                    viewBox="0 0 24 24" 
                                    stroke={rating >= star ? "#FF9800" : "#FF9800"} 
                                    strokeWidth={rating >= star ? 0 : 1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                </svg>
                            </button>
                        ))}
                    </div>
                    
                    <div className="h-4">
                        {rating > 0 && (
                            <p className="text-sm font-extrabold text-gray-800">{RATING_TEXTS[rating as keyof typeof RATING_TEXTS]}</p>
                        )}
                    </div>
                    <div className="w-full h-px bg-gray-200 mt-4"></div>
                </div>

                {/* Seleccionables */}
                <div className="mb-6 flex flex-col items-center">
                    <h2 className="text-[13px] font-extrabold text-gray-800 mb-1">¿Qué te gustó de este espacio?</h2>
                    <p className="text-[11px] text-gray-500 font-medium mb-4">Selecciona todas las opciones que apliquen.</p>
                    
                    <div className="flex flex-wrap gap-2 justify-center">
                        {OPCIONES.map(opcion => {
                            const isSelected = opcionesSeleccionadas.includes(opcion);
                            return (
                                <button
                                    key={opcion}
                                    onClick={() => toggleOpcion(opcion)}
                                    className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-colors ${
                                        isSelected 
                                        ? "bg-[#B2DFDB] text-[#00695C] border border-[#80CBC4]" 
                                        : "bg-[#E0F2F1] text-[#00897B] border border-transparent"
                                    }`}
                                >
                                    {opcion}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Comentarios */}
                <div className="mb-8 w-full">
                    <h2 className="text-[13px] font-extrabold text-gray-800 mb-3 text-left">
                        Comentarios adicionales <span className="text-[10px] text-gray-400 font-normal">(Opcional)</span>
                    </h2>
                    <div className="relative">
                        <textarea
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            maxLength={500}
                            placeholder="Cuéntanos más sobre tu experiencia en este espacio..."
                            className="w-full h-28 border-2 border-gray-200 rounded-xl p-3 text-xs text-gray-700 resize-none outline-none focus:border-[#00BFA5] transition-colors"
                        ></textarea>
                        <span className="absolute bottom-3 right-3 text-[10px] text-gray-400">
                            {comentario.length}/500
                        </span>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-auto flex flex-col gap-3 pb-6">
                    <button 
                        onClick={handlePublicar}
                        disabled={rating === 0}
                        className="w-full bg-[#FF9800] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-[#F57C00] transition-colors disabled:opacity-50"
                    >
                        Publicar reseña
                    </button>
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-full bg-white border border-[#00BFA5] text-[#00BFA5] font-bold py-3.5 rounded-xl hover:bg-[#F0FDF8] transition-colors"
                    >
                        Ahora no
                    </button>
                </div>
            </div>
        </div>
    );
}
