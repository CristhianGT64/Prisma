import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import ServicioTag from "../../components/ui/ServicioTag";
import { serviciosIncluidos as todosServicios } from "../../Data/ServiciosIncluidosData";
import type { ServicioIncluido } from "../../interfaces/ServiciosIncluidos";

export default function AgregarEspacioPage() {
    const navigate = useNavigate();
    const { usuarioActual, agregarEspacio } = useApp();

    const [form, setForm] = useState({
        nombre: "",
        direccion: "",
        ciudad: "",
        descripcion: "",
        imagenUrl: "",
    });
    const [serviciosSeleccionados, setServiciosSeleccionados] = useState<ServicioIncluido[]>([]);
    const [loading, setLoading] = useState(false);
    const [previewImg, setPreviewImg] = useState("");

    if (!usuarioActual) {
        navigate("/login");
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const toggleServicio = (servicio: ServicioIncluido) => {
        setServiciosSeleccionados(prev =>
            prev.some(s => s.code === servicio.code)
                ? prev.filter(s => s.code !== servicio.code)
                : [...prev, servicio]
        );
    };

    const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, imagenUrl: e.target.value }));
        setPreviewImg(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await agregarEspacio({
                arrendadorId: usuarioActual.id,
                nombre: form.nombre,
                direccion: form.direccion,
                ciudad: form.ciudad,
                descripcion: form.descripcion,
                imagenes: form.imagenUrl ? [{ nombre: form.nombre, url: form.imagenUrl }] : [],
                serviciosIncluidos: serviciosSeleccionados,
                disponible: true,
            });
            navigate("/arrendador/espacios");
        } catch {
            /* ignore */
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto pb-28 bg-white">
            {/* Header */}
            <div className="bg-[#FF9800] flex items-center gap-3 px-5 py-4 sticky top-0 z-10 shadow-sm">
                <button onClick={() => navigate(-1)} className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-white font-bold text-lg">Agregar Espacio</h1>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-5 flex flex-col gap-5 max-w-md mx-auto w-full">
                {/* Imagen del espacio */}
                <div>
                    <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">
                        Imagen del espacio <span className="text-red-500">*</span>
                    </label>
                    {/* Preview con bordes naranjas punteados y diseño exacto */}
                    <div className="w-full h-44 bg-[#FFF8F0] rounded-2xl overflow-hidden border-2 border-dashed border-[#FF9800]/50 flex items-center justify-center mb-3 relative">
                        {previewImg ? (
                            <img src={previewImg} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-[#FF9800]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                                <span className="text-xs font-bold">Toca para seleccionar una imagen</span>
                            </div>
                        )}
                    </div>
                    <input
                        type="url"
                        name="imagenUrl"
                        value={form.imagenUrl}
                        onChange={handleImagenChange}
                        placeholder="URL de la imagen (opcional)"
                        className="w-full border border-[#FF9800]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9800] focus:border-transparent transition bg-gray-50/50"
                    />
                </div>

                {/* Nombre */}
                <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5 uppercase tracking-wide">
                        Nombre del espacio <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        placeholder="Ejm. Premium CoWorking Center"
                        required
                        className="w-full border border-[#FF9800]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9800] focus:border-transparent transition bg-gray-50/50 text-gray-800 placeholder:text-gray-400"
                    />
                </div>

                {/* Dirección */}
                <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5 uppercase tracking-wide">
                        Dirección <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="direccion"
                        value={form.direccion}
                        onChange={handleChange}
                        placeholder="Ejm. Av. Paseo de la Reforma 504"
                        required
                        className="w-full border border-[#FF9800]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9800] focus:border-transparent transition bg-gray-50/50 text-gray-800 placeholder:text-gray-400"
                    />
                </div>

                {/* Ciudad */}
                <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5 uppercase tracking-wide">
                        Ciudad <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="ciudad"
                        value={form.ciudad}
                        onChange={handleChange}
                        placeholder="Ejm. Comayaguela"
                        required
                        className="w-full border border-[#FF9800]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9800] focus:border-transparent transition bg-gray-50/50 text-gray-800 placeholder:text-gray-400"
                    />
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5 uppercase tracking-wide">
                        Descripción <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        placeholder="Describa las características principales del espacio..."
                        required
                        rows={4}
                        className="w-full border border-[#FF9800]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9800] focus:border-transparent transition resize-none bg-gray-50/50 text-gray-800 placeholder:text-gray-400"
                    />
                </div>

                {/* Servicios incluidos */}
                <div>
                    <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">
                        Servicios incluidos
                    </label>
                    <div className="flex flex-col gap-2">
                        {todosServicios.map(servicio => (
                            <ServicioTag
                                key={servicio.code}
                                servicio={servicio}
                                variant="selectable"
                                selected={serviciosSeleccionados.some(s => s.code === servicio.code)}
                                onClick={() => toggleServicio(servicio)}
                            />
                        ))}
                    </div>
                </div>

                {/* Botones (Cancelar en Verde Turquesa #00BFA5, Guardar en Naranja #FF9800) */}
                <div className="flex gap-3 mt-2">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex-1 py-3.5 rounded-xl bg-[#00BFA5] hover:bg-[#00A693] text-white font-bold text-sm transition-all duration-200 active:scale-95 shadow-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3.5 rounded-xl bg-[#FF9800] hover:bg-[#F57C00] text-white font-bold text-sm transition-all duration-200 active:scale-95 disabled:opacity-60 shadow-sm"
                    >
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </form>
        </div>
    );
}
