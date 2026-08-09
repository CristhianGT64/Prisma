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
        precioHora: espacio?.precioHora?.toString() ?? "",
        precioDia: espacio?.precioDia?.toString() ?? "",
    });
    const [imagenesUrls, setImagenesUrls] = useState<string[]>(
        espacio?.imagenes?.length ? espacio.imagenes.map(img => img.url) : [""]
    );
    const [serviciosSeleccionados, setServiciosSeleccionados] = useState<ServicioIncluido[]>(
        espacio?.serviciosIncluidos ?? []
    );
    const [loading, setLoading] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(0);

    useEffect(() => {
        if (espacio) {
            setForm({
                nombre: espacio.nombre,
                direccion: espacio.direccion,
                ciudad: espacio.ciudad,
                descripcion: espacio.descripcion,
                precioHora: espacio.precioHora?.toString() ?? "",
                precioDia: espacio.precioDia?.toString() ?? "",
            });
            setImagenesUrls(espacio.imagenes?.length ? espacio.imagenes.map(img => img.url) : [""]);
            setServiciosSeleccionados(espacio.serviciosIncluidos);
            setPreviewIndex(0);
        }
    }, [espacio]);

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

    const handleImagenChange = (index: number, value: string) => {
        setImagenesUrls(prev => prev.map((url, i) => (i === index ? value : url)));
    };

    const agregarCampoImagen = () => {
        setImagenesUrls(prev => [...prev, ""]);
    };

    const eliminarCampoImagen = (index: number) => {
        setImagenesUrls(prev => {
            if (prev.length === 1) return prev;
            const updated = prev.filter((_, i) => i !== index);
            if (previewIndex >= updated.length) {
                setPreviewIndex(Math.max(0, updated.length - 1));
            }
            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const imagenesLimpias = imagenesUrls
            .map(url => url.trim())
            .filter(url => url.length > 0)
            .map((url, idx) => ({ nombre: `${form.nombre || "Espacio"} ${idx + 1}`, url }));

        try {
            await actualizarEspacio(id!, {
                nombre: form.nombre,
                direccion: form.direccion,
                ciudad: form.ciudad,
                descripcion: form.descripcion,
                imagenes: imagenesLimpias,
                serviciosIncluidos: serviciosSeleccionados,
                precioHora: Number(form.precioHora) || 0,
                precioDia: Number(form.precioDia) || 0,
            });
            navigate("/arrendador/espacios");
        } catch {
            /* ignore */
        } finally {
            setLoading(false);
        }
    };

    const imagenesConValor = imagenesUrls.filter(url => url.trim().length > 0);
    const previewImg = imagenesConValor[previewIndex] || imagenesConValor[0] || "";

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
                            Imágenes del espacio
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

                        {imagenesConValor.length > 1 && (
                            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                                {imagenesConValor.map((img, idx) => (
                                    <button
                                        key={`${img}-${idx}`}
                                        type="button"
                                        onClick={() => setPreviewIndex(idx)}
                                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 ${previewImg === img ? "border-[#F58220]" : "border-transparent"}`}
                                    >
                                        <img src={img} alt={`thumb-${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            {imagenesUrls.map((url, index) => (
                                <div key={`url-${index}`} className="flex items-center gap-2">
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => handleImagenChange(index, e.target.value)}
                                        placeholder={`URL de imagen ${index + 1}`}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F58220] focus:border-transparent transition bg-gray-50/50"
                                    />
                                    {imagenesUrls.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => eliminarCampoImagen(index)}
                                            className="w-10 h-10 rounded-xl bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition"
                                            aria-label={`Eliminar imagen ${index + 1}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={agregarCampoImagen}
                            className="mt-3 text-xs font-bold text-[#F58220] hover:underline"
                        >
                            + Agregar otra imagen
                        </button>
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

                    {/* Precios */}
                    <div className="bg-[#FFF8F0] border border-[#F58220]/30 rounded-2xl p-4">
                        <label className="block text-xs font-bold text-gray-800 mb-3 uppercase tracking-wide">
                            Precios del espacio <span className="text-[#F58220]">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Precio por Hora (L)</label>
                                <input
                                    type="number"
                                    name="precioHora"
                                    value={form.precioHora}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F58220] focus:border-transparent transition bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Precio por Día (L)</label>
                                <input
                                    type="number"
                                    name="precioDia"
                                    value={form.precioDia}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F58220] focus:border-transparent transition bg-white"
                                />
                            </div>
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
