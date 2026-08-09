import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";

export default function EditarPerfilEmpresa() {
    const navigate = useNavigate();
    const { usuarioActual, actualizarPerfil } = useApp();

    const [form, setForm] = useState({
        nombreComercial: usuarioActual?.nombreComercial ?? "",
        razonSocial: usuarioActual?.razonSocial ?? "",
        rtnEmpresa: usuarioActual?.rtnEmpresa ?? "",
        numeroRegistroMercantil: usuarioActual?.numeroRegistroMercantil ?? "",
        giroActividadEconomica: usuarioActual?.giroActividadEconomica ?? "",
        fechaConstitucion: usuarioActual?.fechaConstitucion ?? "",
        representanteLegalNombre: usuarioActual?.representanteLegalNombre ?? "",
        representanteLegalIdentidad: usuarioActual?.representanteLegalIdentidad ?? "",
        representanteLegalCargo: usuarioActual?.representanteLegalCargo ?? "",
        representanteLegalCorreo: usuarioActual?.representanteLegalCorreo ?? "",
        representanteLegalTelefono: usuarioActual?.representanteLegalTelefono ?? "",
        departamento: usuarioActual?.departamento ?? "",
        municipio: usuarioActual?.municipio ?? "",
        direccionExacta: usuarioActual?.direccionExacta ?? "",
        banco: usuarioActual?.banco ?? "",
        tipoCuenta: usuarioActual?.tipoCuenta ?? "",
        numeroCuenta: usuarioActual?.numeroCuenta ?? "",
        nombreTitular: usuarioActual?.nombreTitular ?? "",
        correoEmpresa: usuarioActual?.correo ?? "",
        fotoPerfil: usuarioActual?.fotoPerfil ?? "",
        password: "",
        confirmarPassword: "",
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showFotoModal, setShowFotoModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const iniciales = `${usuarioActual?.nombres?.charAt(0) ?? ""}${usuarioActual?.apellidos?.charAt(0) ?? ""}`.toUpperCase();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (form.password && form.password !== form.confirmarPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        
        const datosAActualizar = { ...form };
        if (!datosAActualizar.password) {
            delete (datosAActualizar as any).password;
        }
        delete (datosAActualizar as any).confirmarPassword;

        try {
            await actualizarPerfil({
                ...datosAActualizar,
                correo: form.correoEmpresa,
                nombres: form.nombreComercial
            });
            navigate(-1);
        } catch {
            /* ignore */
        } finally {
            setLoading(false);
        }
    };

    const handleElegirFoto = () => {
        fileInputRef.current?.click();
    };

    const handleArchivoFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = typeof reader.result === "string" ? reader.result : "";
            if (dataUrl) {
                setForm(prev => ({ ...prev, fotoPerfil: dataUrl }));
            }
        };
        reader.readAsDataURL(file);
        setShowFotoModal(false);
        e.target.value = "";
    };

    const handleEliminarFoto = () => {
        setForm(prev => ({ ...prev, fotoPerfil: "" }));
        setShowFotoModal(false);
    };

    const inputClasses = "w-full border border-[#00BFA5] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#00BFA5] focus:border-[#00BFA5] transition bg-[#F5F7F9]";
    const labelClasses = "block text-[10px] font-extrabold text-gray-800 mb-1 ml-1 uppercase";
    const sectionTitleClasses = "text-sm font-extrabold text-gray-800 mb-4 mt-6 uppercase tracking-wider";

    return (
        <div className="flex-1 overflow-y-auto bg-white pb-24 relative">
            {/* Header */}
            <div className="bg-[#FF9800] px-5 py-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
                <button onClick={() => navigate(-1)} className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-white font-bold text-lg">Registro de Arrendatario</h1>
            </div>

            <div className="flex flex-col items-center px-6 pt-5 py-5">
                <p className="text-xs text-gray-500 mb-6 text-center">Actualiza tu información personal y de contacto</p>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleArchivoFoto}
                    className="hidden"
                />

                {/* Avatar with initials and edit badge */}
                <div className="relative mb-8">
                    <div className="w-24 h-24 rounded-full bg-[#FFD54F] flex items-center justify-center shadow-md">
                        {form.fotoPerfil ? (
                            <img src={form.fotoPerfil} alt="Foto de perfil" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <span className="text-white text-3xl font-extrabold">{iniciales || "EM"}</span>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowFotoModal(true)}
                        className="absolute bottom-0 right-0 w-8 h-8 bg-[#FF9800] rounded-full flex items-center justify-center shadow-md border-2 border-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="w-full bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="w-full flex flex-col">
                    <h3 className="text-sm font-extrabold text-gray-800 mb-4 uppercase tracking-wider">Información de la empresa</h3>
                    
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className={labelClasses}>Razón social *</label>
                            <input name="razonSocial" value={form.razonSocial} onChange={handleChange} required className={inputClasses} placeholder="Innovate Hub Centroamérica S. de R.L." />
                        </div>
                        <div>
                            <label className={labelClasses}>Giro o actividad económica</label>
                            <input name="giroActividadEconomica" value={form.giroActividadEconomica} onChange={handleChange} className={inputClasses} placeholder="Alquiler de espacios de coworking..." />
                        </div>
                    </div>

                    <h3 className={sectionTitleClasses}>Representante Legal</h3>
                    
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className={labelClasses}>Nombre completo *</label>
                            <input name="representanteLegalNombre" value={form.representanteLegalNombre} onChange={handleChange} required className={inputClasses} placeholder="María Fernanda Rodríguez" />
                        </div>
                        <div>
                            <label className={labelClasses}>Cargo *</label>
                            <input name="representanteLegalCargo" value={form.representanteLegalCargo} onChange={handleChange} required className={inputClasses} placeholder="Gerente General" />
                        </div>
                        <div>
                            <label className={labelClasses}>Correo electrónico *</label>
                            <input type="email" name="representanteLegalCorreo" value={form.representanteLegalCorreo} onChange={handleChange} required className={inputClasses} placeholder="mrodriguez@innovatehub.com" />
                        </div>
                        <div>
                            <label className={labelClasses}>Teléfono *</label>
                            <input type="tel" name="representanteLegalTelefono" value={form.representanteLegalTelefono} onChange={handleChange} required className={inputClasses} placeholder="+504 9876-5432" />
                        </div>
                    </div>

                    <h3 className={sectionTitleClasses}>Dirección de la empresa</h3>
                    
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className={labelClasses}>Departamento</label>
                            <input name="departamento" value={form.departamento} onChange={handleChange} className={inputClasses} placeholder="Francisco Morazán" />
                        </div>
                        <div>
                            <label className={labelClasses}>Municipio</label>
                            <input name="municipio" value={form.municipio} onChange={handleChange} className={inputClasses} placeholder="Distrito Central" />
                        </div>
                        <div>
                            <label className={labelClasses}>Dirección exacta *</label>
                            <input name="direccionExacta" value={form.direccionExacta} onChange={handleChange} required className={inputClasses} placeholder="Torre Corporativa Atria..." />
                        </div>
                    </div>

                    <h3 className={sectionTitleClasses}>Información Bancaria</h3>
                    
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className={labelClasses}>Banco</label>
                            <input name="banco" value={form.banco} onChange={handleChange} className={inputClasses} placeholder="BAC Credomatic" />
                        </div>
                        <div>
                            <label className={labelClasses}>Tipo de cuenta</label>
                            <input name="tipoCuenta" value={form.tipoCuenta} onChange={handleChange} className={inputClasses} placeholder="Cuenta de Ahorro Empresarial" />
                        </div>
                        <div>
                            <label className={labelClasses}>Número de cuenta</label>
                            <input name="numeroCuenta" value={form.numeroCuenta} onChange={handleChange} className={inputClasses} placeholder="123456789012" />
                        </div>
                        <div>
                            <label className={labelClasses}>Nombre del titular *</label>
                            <input name="nombreTitular" value={form.nombreTitular} onChange={handleChange} required className={inputClasses} placeholder="Innovate Hub Centroamérica S. de R.L." />
                        </div>
                    </div>

                    <h3 className={sectionTitleClasses}>Seguridad</h3>
                    
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className={labelClasses}>Correo electrónico de la empresa *</label>
                            <input type="email" name="correoEmpresa" value={form.correoEmpresa} onChange={handleChange} required className={inputClasses} placeholder="admin@innovatehub.com" />
                        </div>
                        <div>
                            <label className={labelClasses}>Contraseña</label>
                            <input type="password" name="password" value={form.password} onChange={handleChange} className={inputClasses} placeholder="••••••••••••" />
                        </div>
                        <div>
                            <label className={labelClasses}>Confirmar contraseña</label>
                            <input type="password" name="confirmarPassword" value={form.confirmarPassword} onChange={handleChange} className={inputClasses} placeholder="••••••••••••" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#FF9800] text-white font-bold py-3.5 rounded-xl hover:bg-[#F57C00] transition-all active:scale-[0.98] mt-8 flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        {loading ? "Guardando..." : "Guardar cambios"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-full bg-[#00BFA5] text-white font-bold py-3.5 rounded-xl hover:bg-[#00897B] transition-all active:scale-[0.98] mt-3"
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
                                type="button"
                                onClick={handleElegirFoto}
                                className="flex items-center gap-3 text-xs font-bold text-gray-800 hover:bg-[#A5D6A7] rounded-xl py-3 px-2 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Elegir de la biblioteca
                            </button>

                            <button
                                type="button"
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
