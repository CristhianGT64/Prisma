import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";

export default function EditarPerfilArrendatario() {
    const navigate = useNavigate();
    const { usuarioActual, actualizarPerfil } = useApp();

    const [form, setForm] = useState({
        nombres: usuarioActual?.nombres ?? "",
        apellidos: usuarioActual?.apellidos ?? "",
        usuarios: usuarioActual?.usuarios ?? "",
        correo: usuarioActual?.correo ?? "",
        telefono: usuarioActual?.telefono ?? "",
        fotoPerfil: usuarioActual?.fotoPerfil ?? "",
    });
    const [loading, setLoading] = useState(false);
    const [showFotoModal, setShowFotoModal] = useState(false);

    const iniciales = `${form.nombres?.charAt(0) ?? ""}${form.apellidos?.charAt(0) ?? ""}`.toUpperCase();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await actualizarPerfil({ ...form });
            navigate(-1);
        } catch {
            /* ignore */
        } finally {
            setLoading(false);
        }
    };

    const handleEliminarFoto = () => {
        setForm(prev => ({ ...prev, fotoPerfil: "" }));
        setShowFotoModal(false);
    };

    return (
        <div className="flex-1 overflow-y-auto bg-white pb-24 relative">
            {/* Header */}
            <div className="bg-[#00BFA5] px-5 py-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
                <button onClick={() => navigate(-1)} className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-white font-bold text-lg">Editar perfil</h1>
            </div>

            <div className="flex flex-col items-center px-5 py-5">
                <p className="text-xs text-gray-500 mb-5 text-center">Actualiza tu información personal y de contacto</p>

                {/* Avatar with initials and edit badge */}
                <div className="relative mb-2">
                    <div className="w-20 h-20 rounded-full bg-[#FF9800] flex items-center justify-center shadow-md">
                        <span className="text-white text-3xl font-extrabold">{iniciales}</span>
                    </div>
                    <button
                        onClick={() => setShowFotoModal(true)}
                        className="absolute bottom-0 right-0 w-7 h-7 bg-[#00BFA5] rounded-full flex items-center justify-center shadow-md border-2 border-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                </div>

                <button
                    onClick={() => setShowFotoModal(true)}
                    className="text-xs font-bold text-[#00BFA5] mb-6 hover:underline"
                >
                    Editar foto de perfil
                </button>

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                    <div className="bg-[#F5F7F9] rounded-2xl p-5 flex flex-col gap-4">
                        <p className="text-sm font-extrabold text-gray-800 mb-1">Datos personales</p>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Nombres</label>
                            <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2.5 gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <input
                                    name="nombres"
                                    value={form.nombres}
                                    onChange={handleChange}
                                    placeholder="Nombres"
                                    className="w-full bg-transparent text-sm text-gray-700 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Apellidos</label>
                            <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2.5 gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <input
                                    name="apellidos"
                                    value={form.apellidos}
                                    onChange={handleChange}
                                    placeholder="Apellidos"
                                    className="w-full bg-transparent text-sm text-gray-700 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Usuario</label>
                            <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2.5 gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <input
                                    name="usuarios"
                                    value={form.usuarios}
                                    onChange={handleChange}
                                    placeholder="Usuario"
                                    className="w-full bg-transparent text-sm text-gray-700 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Correo electrónico</label>
                            <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2.5 gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <input
                                    name="correo"
                                    type="email"
                                    value={form.correo}
                                    onChange={handleChange}
                                    placeholder="correo@email.com"
                                    className="w-full bg-transparent text-sm text-gray-700 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Número de teléfono</label>
                            <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2.5 gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <input
                                    name="telefono"
                                    type="tel"
                                    value={form.telefono}
                                    onChange={handleChange}
                                    placeholder="+504 12345678"
                                    className="w-full bg-transparent text-sm text-gray-700 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#FF9800] text-white font-bold py-3 rounded-xl hover:bg-[#F57C00] transition-all active:scale-[0.98] disabled:opacity-60 mt-4"
                    >
                        {loading ? "Guardando..." : "Guardar cambios"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-full bg-[#00BFA5] text-white font-bold py-3 rounded-xl hover:bg-[#00897B] transition-all active:scale-[0.98]"
                    >
                        Cancelar
                    </button>
                </form>
            </div>

            {/* Bottom Sheet - Editar foto de perfil */}
            {showFotoModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={() => setShowFotoModal(false)}>
                    <div
                        className="bg-[#C8E6C9] w-full max-w-[430px] rounded-t-[24px] p-6 pb-8 relative animate-slideUp border-t border-[#A5D6A7]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowFotoModal(false)}
                            className="absolute top-4 right-4 w-7 h-7 bg-transparent border-2 border-gray-600 rounded-full flex items-center justify-center text-gray-600 shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h3 className="text-sm font-extrabold text-gray-800 text-center mb-6">Editar foto de perfil</h3>
                        <div className="w-full border-t border-gray-400 mb-4"></div>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => setShowFotoModal(false)}
                                className="flex items-center gap-3 text-xs font-bold text-gray-800 hover:bg-[#A5D6A7] rounded-xl py-3 px-2 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Elegir de la biblioteca
                            </button>

                            <button
                                onClick={handleEliminarFoto}
                                className="flex items-center gap-3 text-xs font-bold text-gray-800 hover:bg-[#A5D6A7] rounded-xl py-3 px-2 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Eliminar foto actual
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
