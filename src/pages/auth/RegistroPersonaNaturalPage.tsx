import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";

export default function RegistroPersonaNaturalPage() {
    const navigate = useNavigate();
    const { registrar } = useApp();

    const [form, setForm] = useState({
        nombres: "",
        numeroIdentidad: "",
        fechaNacimiento: "",
        correo: "",
        telefono: "",
        departamento: "",
        municipio: "",
        direccionExacta: "",
        banco: "",
        tipoCuenta: "",
        numeroCuenta: "",
        nombreTitular: "",
        rtn: "",
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
            nombres: datos.nombres,
            apellidos: "", // Mapeado en nombre completo en el form
            correo: datos.correo,
            password: datos.password,
            telefono: datos.telefono,
            usuarios: datos.nombres.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 100),
            rol: "arrendador",
            tipoArrendador: "persona_natural",
            numeroIdentidad: datos.numeroIdentidad,
            fechaNacimiento: datos.fechaNacimiento,
            departamento: datos.departamento,
            municipio: datos.municipio,
            direccionExacta: datos.direccionExacta,
            banco: datos.banco,
            tipoCuenta: datos.tipoCuenta,
            numeroCuenta: datos.numeroCuenta,
            nombreTitular: datos.nombreTitular,
            rtn: datos.rtn,
        });

        setLoading(false);

        if (success) {
            navigate("/arrendador/espacios");
        } else {
            setError("Error al registrar: El correo ya existe");
        }
    };

    const inputClasses = "w-full border border-[#00BFA5] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#00BFA5] focus:border-[#00BFA5] transition bg-white";
    const labelClasses = "block text-[10px] font-extrabold text-gray-800 mb-1 ml-1 uppercase";
    const sectionTitleClasses = "text-sm font-extrabold text-gray-800 mb-4 mt-6 uppercase tracking-wider";

    return (
        <div className="flex-1 overflow-y-auto bg-white flex flex-col relative pb-10">
            {/* Header */}
            <div className="bg-[#FF9800] px-5 py-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
                <button onClick={() => navigate(-1)} className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-white font-bold text-sm">Registro de Arrendador</h1>
            </div>

            <div className="flex flex-col items-center px-6 pt-5 pb-8 relative z-10">
                <h2 className="text-sm font-extrabold text-gray-800 text-center mb-6">
                    Registro para Persona Natural
                </h2>

                {/* Avatar upload */}
                <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-[#FFD54F] flex items-center justify-center overflow-hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white mt-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <button type="button" className="absolute bottom-0 right-0 w-7 h-7 bg-[#00BFA5] rounded-full flex items-center justify-center border-2 border-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="w-full bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full flex flex-col">
                    
                    <h3 className={sectionTitleClasses}>Información Personal</h3>
                    
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className={labelClasses}>Nombre Completo *</label>
                            <input name="nombres" value={form.nombres} onChange={handleChange} required className={inputClasses} placeholder="Juan Alberto Gómez Pérez" />
                        </div>
                        <div>
                            <label className={labelClasses}>Número de identidad *</label>
                            <input name="numeroIdentidad" value={form.numeroIdentidad} onChange={handleChange} required className={inputClasses} placeholder="0801-1234-5678" />
                        </div>
                        <div>
                            <label className={labelClasses}>Fecha de nacimiento</label>
                            <input type="text" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} className={inputClasses} placeholder="16/05/200" />
                        </div>
                        <div>
                            <label className={labelClasses}>Correo electrónico *</label>
                            <input type="email" name="correo" value={form.correo} onChange={handleChange} required className={inputClasses} placeholder="Juan_Perez@correo.com" />
                        </div>
                        <div>
                            <label className={labelClasses}>Número de teléfono *</label>
                            <input type="tel" name="telefono" value={form.telefono} onChange={handleChange} required className={inputClasses} placeholder="+504 1234-5678" />
                        </div>
                        
                        <div className="mt-2 mb-2">
                            <label className="block text-[10px] font-extrabold text-gray-800 mb-2">Fotografía del documento de identidad (frente y reverso) *</label>
                            <div className="flex justify-center">
                                <button type="button" className="bg-[#00BFA5] text-white font-bold text-xs px-6 py-2 rounded-lg">
                                    Subir Archivo
                                </button>
                            </div>
                        </div>
                    </div>

                    <h3 className={sectionTitleClasses}>Dirección</h3>
                    
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
                            <input name="direccionExacta" value={form.direccionExacta} onChange={handleChange} required className={inputClasses} placeholder="Dirección completa" />
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
                            <input name="tipoCuenta" value={form.tipoCuenta} onChange={handleChange} className={inputClasses} placeholder="Crédito / Ahorro" />
                        </div>
                        <div>
                            <label className={labelClasses}>Número de cuenta</label>
                            <input name="numeroCuenta" value={form.numeroCuenta} onChange={handleChange} className={inputClasses} placeholder="1234-5678-9101-1213" />
                        </div>
                        <div>
                            <label className={labelClasses}>Nombre del titular *</label>
                            <input name="nombreTitular" value={form.nombreTitular} onChange={handleChange} required className={inputClasses} placeholder="Juan Alberto Gómez Pérez" />
                        </div>
                        <div>
                            <label className={labelClasses}>RTN (si posee)</label>
                            <input name="rtn" value={form.rtn} onChange={handleChange} className={inputClasses} placeholder="0801-1234-56789" />
                        </div>
                    </div>

                    <h3 className={sectionTitleClasses}>Seguridad</h3>
                    
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className={labelClasses}>Contraseña *</label>
                            <input type="password" name="password" value={form.password} onChange={handleChange} required className={inputClasses} placeholder="••••••••••••" />
                        </div>
                        <div>
                            <label className={labelClasses}>Confirmar contraseña *</label>
                            <input type="password" name="confirmarPassword" value={form.confirmarPassword} onChange={handleChange} required className={inputClasses} placeholder="••••••••••••" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00BFA5] text-white font-bold py-3.5 rounded-xl hover:bg-[#00897B] transition-all active:scale-[0.98] mt-8 disabled:opacity-50"
                    >
                        {loading ? "Creando..." : "Crear cuenta"}
                    </button>
                </form>
            </div>
        </div>
    );
}
