import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useApp } from "../../context/AppContext";

export default function RegisterPage() {
    const navigate = useNavigate();
    const { registrar } = useApp();

    const [form, setForm] = useState({
        nombres: "",
        apellidos: "",
        correo: "",
        telefono: "",
        password: "",
        confirmarPassword: "",
        rol: "arrendatario" as "arrendador" | "arrendatario",
        usuarios: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
        if (form.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setLoading(true);

        const { confirmarPassword, ...datos } = form;
        const success = await registrar({ ...datos, fotoPerfil: undefined });
        setLoading(false);

        if (success) {
            if (form.rol === "arrendador") navigate("/arrendador/espacios");
            else navigate("/inicio");
        } else {
            setError("Ya existe una cuenta con ese correo");
        }
    };

    return (
        <div className="flex-1 overflow-y-auto pb-6">
            {/* Header */}
            <div className="bg-[#00BFA5] flex items-center gap-3 px-5 py-4">
                <button onClick={() => navigate(-1)} className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-white font-bold text-lg">Registro de Cuenta</h1>
            </div>

            <div className="px-5 py-6 flex flex-col gap-5">
                {/* Avatar placeholder */}
                <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>

                <p className="text-center text-gray-600 font-medium text-sm">Complete sus datos para continuar</p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Rol */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Tipo de cuenta</label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                className="flex-1 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 bg-[#00BFA5] border-[#00BFA5] text-white"
                            >
                                Arrendatario
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/register/arrendador")}
                                className="flex-1 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                            >
                                Arrendador
                            </button>
                        </div>
                    </div>

                    {/* Nombre Completo */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Nombre Completo</label>
                        <input
                            name="nombres"
                            value={form.nombres}
                            onChange={handleChange}
                            placeholder="Ingresa tu nombre"
                            required
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA5] focus:border-transparent transition"
                        />
                    </div>

                    {/* Apellidos */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Apellidos</label>
                        <input
                            name="apellidos"
                            value={form.apellidos}
                            onChange={handleChange}
                            placeholder="Ingresa tus apellidos"
                            required
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA5] focus:border-transparent transition"
                        />
                    </div>

                    {/* Usuario */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Nombre de usuario</label>
                        <input
                            name="usuarios"
                            value={form.usuarios}
                            onChange={handleChange}
                            placeholder="@usuario"
                            required
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA5] focus:border-transparent transition"
                        />
                    </div>

                    {/* Correo */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Correo electrónico</label>
                        <input
                            type="email"
                            name="correo"
                            value={form.correo}
                            onChange={handleChange}
                            placeholder="correo@ejemplo.com"
                            required
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA5] focus:border-transparent transition"
                        />
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Teléfono</label>
                        <input
                            type="tel"
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            placeholder="+504 1234 5678"
                            required
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA5] focus:border-transparent transition"
                        />
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Contraseña</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA5] focus:border-transparent transition"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    {/* Confirmar Contraseña */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Confirmar contraseña</label>
                        <input
                            type="password"
                            name="confirmarPassword"
                            value={form.confirmarPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA5] focus:border-transparent transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00BFA5] hover:bg-[#00897B] text-white font-bold py-4 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-60 mt-2"
                    >
                        {loading ? "Registrando..." : "Registrarse"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="text-[#00BFA5] font-semibold">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}
