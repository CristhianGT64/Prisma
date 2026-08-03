import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";

export default function RegistroEmpresaPage() {
    const navigate = useNavigate();
    const { registrar } = useApp();

    const [form, setForm] = useState({
        nombreComercial: "",
        razonSocial: "",
        rtnEmpresa: "",
        numeroRegistroMercantil: "",
        giroActividadEconomica: "",
        fechaConstitucion: "",
        representanteLegalNombre: "",
        representanteLegalIdentidad: "",
        representanteLegalCargo: "",
        representanteLegalCorreo: "",
        representanteLegalTelefono: "",
        departamento: "",
        municipio: "",
        direccionExacta: "",
        banco: "",
        tipoCuenta: "",
        numeroCuenta: "",
        nombreTitular: "",
        correoEmpresa: "",
        password: "",
        confirmarPassword: "",
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmarPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);

        const { confirmarPassword, ...datos } = form;
        
        const success = await registrar({
            nombres: datos.nombreComercial,
            apellidos: "", 
            correo: datos.correoEmpresa,
            password: datos.password,
            telefono: datos.representanteLegalTelefono,
            usuarios: datos.nombreComercial.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 100),
            rol: "arrendador",
            tipoArrendador: "empresa",
            nombreComercial: datos.nombreComercial,
            razonSocial: datos.razonSocial,
            rtnEmpresa: datos.rtnEmpresa,
            numeroRegistroMercantil: datos.numeroRegistroMercantil,
            giroActividadEconomica: datos.giroActividadEconomica,
            fechaConstitucion: datos.fechaConstitucion,
            representanteLegalNombre: datos.representanteLegalNombre,
            representanteLegalIdentidad: datos.representanteLegalIdentidad,
            representanteLegalCargo: datos.representanteLegalCargo,
            representanteLegalCorreo: datos.representanteLegalCorreo,
            representanteLegalTelefono: datos.representanteLegalTelefono,
            departamento: datos.departamento,
            municipio: datos.municipio,
            direccionExacta: datos.direccionExacta,
            banco: datos.banco,
            tipoCuenta: datos.tipoCuenta,
            numeroCuenta: datos.numeroCuenta,
            nombreTitular: datos.nombreTitular,
        });

        setLoading(false);

        if (success) {
            navigate("/arrendador/espacios");
        } else {
            setError("Error al registrar: El correo ya existe");
        }
    };

    const inputClasses = "w-full border border-[#00a896] rounded-2xl px-4 py-2.5 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00a896] focus:border-[#00a896] transition bg-white";
    const labelClasses = "block text-xs font-bold text-[#333333] mb-1.5";
    const sectionTitleClasses = "text-sm font-extrabold text-[#222222] mb-3 mt-6 uppercase tracking-tight";

    return (
        <div className="flex-1 overflow-y-auto bg-white flex flex-col relative pb-10">
            {/* Header */}
            <div className="bg-[#ff9100] px-5 py-3.5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <h1 className="text-white font-bold text-base">Registro de Arrendatario</h1>
                <button onClick={() => navigate(-1)} className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
            </div>

            <div className="flex flex-col px-6 pt-5 pb-8 relative z-10">
                <h2 className="text-base font-bold text-[#222222] text-center mb-6">
                    Registro para Empresa Constituida
                </h2>

                {/* Avatar upload */}
                <div className="relative mb-6 self-center">
                    <div className="w-24 h-24 rounded-full bg-[#f8dec3] flex items-center justify-center overflow-hidden">
                        <svg className="w-16 h-16 text-[#f3b200] mt-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <button type="button" className="absolute bottom-1 right-1 w-7 h-7 bg-[#00a896] rounded-full flex items-center justify-center border-2 border-white shadow">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="w-full bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full flex flex-col">
                    
                    <h3 className={sectionTitleClasses}>INFORMACIÓN DE LA EMPRESA</h3>
                    
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className={labelClasses}>Nombre comercial <span className="text-orange-500">*</span></label>
                            <input name="nombreComercial" value={form.nombreComercial} onChange={handleChange} required className={inputClasses} placeholder="Innovate Hub" />
                        </div>
                        <div>
                            <label className={labelClasses}>Razón social <span className="text-orange-500">*</span></label>
                            <input name="razonSocial" value={form.razonSocial} onChange={handleChange} required className={inputClasses} placeholder="Innovate Hub Centroamérica S. de R.L." />
                        </div>
                        <div>
                            <label className={labelClasses}>RTN de la empresa <span className="text-orange-500">*</span></label>
                            <input name="rtnEmpresa" value={form.rtnEmpresa} onChange={handleChange} required className={inputClasses} placeholder="0801-1999-1234-56" />
                        </div>
                        <div>
                            <label className={labelClasses}>Número de registro mercantil <span className="text-orange-500">*</span></label>
                            <input name="numeroRegistroMercantil" value={form.numeroRegistroMercantil} onChange={handleChange} required className={inputClasses} placeholder="RM-2024-005874" />
                        </div>
                        <div>
                            <label className={labelClasses}>Giro o actividad económica</label>
                            <input name="giroActividadEconomica" value={form.giroActividadEconomica} onChange={handleChange} className={inputClasses} placeholder="Alquiler de espacios de coworking y oficinas flexibles" />
                        </div>
                        <div>
                            <label className={labelClasses}>Fecha de constitución <span className="text-orange-500">*</span></label>
                            <input type="text" name="fechaConstitucion" value={form.fechaConstitucion} onChange={handleChange} required className={inputClasses} placeholder="15/03/2020" />
                        </div>
                    </div>

                    <h3 className={sectionTitleClasses}>REPRESENTANTE LEGAL</h3>
                    
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className={labelClasses}>Nombre completo <span className="text-orange-500">*</span></label>
                            <input name="representanteLegalNombre" value={form.representanteLegalNombre} onChange={handleChange} required className={inputClasses} placeholder="María Fernanda Rodríguez" />
                        </div>
                        <div>
                            <label className={labelClasses}>Número de identidad <span className="text-orange-500">*</span></label>
                            <input name="representanteLegalIdentidad" value={form.representanteLegalIdentidad} onChange={handleChange} required className={inputClasses} placeholder="0801-1990-12345" />
                        </div>
                        <div>
                            <label className={labelClasses}>Cargo <span className="text-orange-500">*</span></label>
                            <input name="representanteLegalCargo" value={form.representanteLegalCargo} onChange={handleChange} required className={inputClasses} placeholder="Gerente General" />
                        </div>
                        <div>
                            <label className={labelClasses}>Correo electrónico <span className="text-orange-500">*</span></label>
                            <input type="email" name="representanteLegalCorreo" value={form.representanteLegalCorreo} onChange={handleChange} required className={inputClasses} placeholder="mrodriguez@innovatehub.com" />
                        </div>
                        <div>
                            <label className={labelClasses}>Teléfono <span className="text-orange-500">*</span></label>
                            <input type="tel" name="representanteLegalTelefono" value={form.representanteLegalTelefono} onChange={handleChange} required className={inputClasses} placeholder="+504 9876-5432" />
                        </div>
                    </div>

                    <h3 className={sectionTitleClasses}>DIRECCIÓN DE LA EMPRESA</h3>
                    
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
                            <label className={labelClasses}>Dirección exacta <span className="text-orange-500">*</span></label>
                            <input name="direccionExacta" value={form.direccionExacta} onChange={handleChange} required className={inputClasses} placeholder="Torre Corporativa Altia, Nivel 8, Boulevard Morazán." />
                        </div>
                    </div>

                    <h3 className={sectionTitleClasses}>INFORMACIÓN BANCARIA</h3>
                    
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
                            <label className={labelClasses}>Número de cuenta <span className="text-orange-500">*</span></label>
                            <input name="numeroCuenta" value={form.numeroCuenta} onChange={handleChange} required className={inputClasses} placeholder="123456789012" />
                        </div>
                        <div>
                            <label className={labelClasses}>Nombre del titular <span className="text-orange-500">*</span></label>
                            <input name="nombreTitular" value={form.nombreTitular} onChange={handleChange} required className={inputClasses} placeholder="Innovate Hub Centroamérica S. de R.L." />
                        </div>
                    </div>

                    <h3 className={sectionTitleClasses}>DOCUMENTOS</h3>
                    
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col items-center">
                            <label className="block text-xs font-bold text-[#333333] mb-2 text-center">
                                Fotografía de Escritura o documento de constitución <span className="text-orange-500">*</span>
                            </label>
                            <button type="button" className="bg-[#00a896] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm hover:bg-[#00897b] transition">
                                Subir Archivo
                            </button>
                        </div>

                        <div className="flex flex-col items-center">
                            <label className="block text-xs font-bold text-[#333333] mb-2 text-center">
                                Fotografía de RTN de la empresa <span className="text-orange-500">*</span>
                            </label>
                            <button type="button" className="bg-[#00a896] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm hover:bg-[#00897b] transition">
                                Subir Archivo
                            </button>
                        </div>

                        <div className="flex flex-col items-center">
                            <label className="block text-xs font-bold text-[#333333] mb-2 text-center">
                                Fotografía de DNI del representante legal <span className="text-orange-500">*</span>
                            </label>
                            <button type="button" className="bg-[#00a896] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm hover:bg-[#00897b] transition">
                                Subir Archivo
                            </button>
                        </div>
                    </div>

                    <h3 className={sectionTitleClasses}>SEGURIDAD</h3>
                    
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className={labelClasses}>Correo electrónico de la empresa <span className="text-orange-500">*</span></label>
                            <input type="email" name="correoEmpresa" value={form.correoEmpresa} onChange={handleChange} required className={inputClasses} placeholder="admin@innovatehub.com" />
                        </div>
                        <div>
                            <label className={labelClasses}>Contraseña <span className="text-orange-500">*</span></label>
                            <input type="password" name="password" value={form.password} onChange={handleChange} required className={inputClasses} placeholder="*******************" />
                        </div>
                        <div>
                            <label className={labelClasses}>Confirmar contraseña <span className="text-orange-500">*</span></label>
                            <input type="password" name="confirmarPassword" value={form.confirmarPassword} onChange={handleChange} required className={inputClasses} placeholder="*******************" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00a896] text-white font-bold text-sm py-3 rounded-xl hover:bg-[#00897b] transition-all active:scale-[0.98] mt-8 shadow-md disabled:opacity-50"
                    >
                        {loading ? "Creando..." : "Crear cuenta"}
                    </button>
                </form>
            </div>
        </div>
    );
}