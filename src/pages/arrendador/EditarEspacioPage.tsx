import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useApp } from "../../context/AppContext";
import ServicioTag from "../../components/ui/ServicioTag";
import BottomNav from "../../components/layout/BottomNav";
import { serviciosIncluidos as todosServicios } from "../../Data/ServiciosIncluidosData";
import type { ServicioIncluido } from "../../interfaces/ServiciosIncluidos";

export default function EditarEspacioPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { usuarioActual, espacios, actualizarEspacio } = useApp();

    const espacio = espacios.find(e => e.id === id);

    const [form, setForm] = useState({
        nombre: espacio?.nombre ?? "",
        direccion: espacio?.direccion ?? "",
        ciudad: espacio?.ciudad ?? "",
        descripcion: espacio?.descripcion ?? "",
        imagenUrl: espacio?.imagenes[0]?.url ?? "",
    });
    const [serviciosSeleccionados, setServiciosSeleccionados] = useState<ServicioIncluido[]>(
        espacio?.serviciosIncluidos ?? []
    );
    const [loading, setLoading] = useState(false);
    const [previewImg, setPreviewImg] = useState(espacio?.imagenes[0]?.url ?? "");

    useEffect(() => {
        if (espacio) {
            setForm({
                nombre: espacio.nombre,
                direccion: espacio.direccion,
                ciudad: espacio.ciudad,
                descripcion: espacio.descripcion,
                imagenUrl: espacio.imagenes[0]?.url ?? "",
            });
            setServiciosSeleccionados(espacio.serviciosIncluidos);
            setPreviewImg(espacio.imagenes[0]?.url ?? "");
        }
    }, [id]);

    if (!usuarioActual) { navigate("/login"); return null; }
    if (!espacio) { navigate("/arrendador/espacios"); return null; }

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
            await actualizarEspacio(id!, {
                nombre: form.nombre,
                direccion: form.direccion,
                ciudad: form.ciudad,
                descripcion: form.descripcion,
                imagenes: form.imagenUrl ? [{ nombre: form.nombre, url: form.imagenUrl }] : espacio.imagenes,
                serviciosIncluidos: serviciosSeleccionados,
            });
            navigate("/arrendador/espacios");
        } catch {
            /* ignore */
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans relative">
            <div className="flex-1 overflow-y-auto pb-28">
                {/* Header */}
                <div className="bg-[#F58220] flex items-center justify-between px-5 py-4 sticky top-0 z-10 shadow-md text-white">
                    <h1 className="font-bold text-lg">Actualizar Espacio</h1>
                    <button onClick={() => navigate(-1)} aria-label="Volver" className="hover:opacity-80 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 max-w-md mx-auto w-full flex flex-col gap-5">
                    {/* Imagen del espacio */}
                    <div>
                        <label className="block text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">
                            Imagen del espacio <span className="text-[#F58220]">*</span>
                        </label>
                        <div className="w-full h-44 bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 mb-3 shadow-sm">
                            {previewImg ? (
                                <img src={previewImg} alt="preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <input
                            type="url"
                            name="imagenUrl"
                            value={form.imagenUrl}
                            onChange={handleImagenChange}
                            placeholder="https://..."
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F58220] focus:border-transparent transition bg-gray-50/50"
                        />
                    </div>

                    {/* Nombre */}
                    <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5 uppercase tracking-wide">
                            Nombre del espacio <span className="text-[#F58220]">*</span>
                        </label>
                        <input
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            placeholder="Ejm. Premium CoWorking Center"
                            required
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F58220] focus:border-transparent transition bg-gray-50/50"
                        />
                    </div>

                    {/* Dirección */}
                    <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5 uppercase tracking-wide">
                            Dirección <span className="text-[#F58220]">*</span>
                        </label>
                        <input
                            name="direccion"
                            value={form.direccion}
                            onChange={handleChange}
                            placeholder="Ejm. Av. Paseo de la Reforma 501"
                            required
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F58220] focus:border-transparent transition bg-gray-50/50"
                        />
                    </div>

                    {/* Ciudad */}
                    <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5 uppercase tracking-wide">
                            Ciudad <span className="text-[#F58220]">*</span>
                        </label>
                        <input
                            name="ciudad"
                            value={form.ciudad}
                            onChange={handleChange}
                            placeholder="Ejm. Comayagua"
                            required
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F58220] focus:border-transparent transition bg-gray-50/50"
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1.5 uppercase tracking-wide">
                            Descripción <span className="text-[#F58220]">*</span>
                        </label>
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            placeholder="Describe las características principales del espacio..."
                            required
                            rows={4}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F58220] focus:border-transparent transition resize-none bg-gray-50/50"
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

                    {/* Botones */}
                    <div className="flex gap-3 mt-2">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 py-3.5 rounded-xl border border-[#00BFA5] text-[#00BFA5] font-bold text-sm hover:bg-[#00BFA5]/5 transition-all duration-200 active:scale-95"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3.5 rounded-xl bg-[#F58220] hover:bg-[#e0731a] text-white font-bold text-sm shadow-md transition-all duration-200 active:scale-95 disabled:opacity-60 cursor-pointer"
                        >
                            {loading ? "Actualizando..." : "Actualizar"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Navegación Inferior */}
            <BottomNav />
        </div>
    );
}
