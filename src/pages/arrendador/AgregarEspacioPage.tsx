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
        <div className="flex-1 overflow-y-auto pb-8">
            {/* Header */}
            <div className="bg-[#00BFA5] flex items-center gap-3 px-5 py-4 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-white font-bold text-lg">Agregar Espacio</h1>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-5 flex flex-col gap-5">
                {/* Imagen del espacio */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                        Imagen del espacio <span className="text-red-400">*</span>
                    </label>
                    {/* Preview */}
                    <div className="w-full h-44 bg-gray-100 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center mb-3 relative">
                        {previewImg ? (
                            <img src={previewImg} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                                <span className="text-sm">Toca para seleccionar una imagen</span>
                            </div>
                        )}
                    </div>
                    <input
                        type="url"
                        name="imagenUrl"
                        value={form.imagenUrl}
                        onChange={handleImagenChange}
                        placeholder="URL de la imagen (opcional)"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA5] focus:border-transparent transition"
                    />
                </div>

                {/* Nombre */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                        Nombre del espacio <span className="text-red-400">*</span>
                    </label>
                    <input
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        placeholder="Ejm. Premium CoWorking Center"
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA5] focus:border-transparent transition"
                    />
                </div>

                {/* Dirección */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                        Dirección <span className="text-red-400">*</span>
                    </label>
                    <input
                        name="direccion"
                        value={form.direccion}
                        onChange={handleChange}
                        placeholder="Ejm. Av. Paseo de la Reforma 501"
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA5] focus:border-transparent transition"
                    />
                </div>

                {/* Ciudad */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                        Ciudad <span className="text-red-400">*</span>
                    </label>
                    <input
                        name="ciudad"
                        value={form.ciudad}
                        onChange={handleChange}
                        placeholder="Ejm. Comayagua"
                        required
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA5] focus:border-transparent transition"
                    />
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                        Descripción <span className="text-red-400">*</span>
                    </label>
                    <textarea
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        placeholder="Describe los características principales del espacio..."
                        required
                        rows={4}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA5] focus:border-transparent transition resize-none"
                    />
                </div>

                {/* Servicios incluidos */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
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

                {/* Botones */}
                <div className="flex gap-3 mt-2">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex-1 py-3.5 rounded-xl border border-gray-300 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all duration-200 active:scale-95"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3.5 rounded-xl bg-[#FF9800] hover:bg-[#F57C00] text-white font-semibold text-sm transition-all duration-200 active:scale-95 disabled:opacity-60"
                    >
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </form>
        </div>
    );
}
