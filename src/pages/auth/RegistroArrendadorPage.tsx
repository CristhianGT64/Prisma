import { useState } from "react";
import { useNavigate } from "react-router";

export default function RegistroArrendadorPage() {
    const navigate = useNavigate();
    const [tipoSeleccionado, setTipoSeleccionado] = useState<"persona_natural" | "empresa" | null>(null);

    const handleContinuar = () => {
        if (tipoSeleccionado === "persona_natural") {
            navigate("/register/arrendador/persona-natural");
        } else if (tipoSeleccionado === "empresa") {
            navigate("/register/arrendador/empresa");
        }
    };

    return (
        <div className="flex-1 overflow-y-auto bg-white flex flex-col relative">
            {/* Decorative background shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00BFA5]/10 rounded-bl-[80px] -z-0"></div>
            <div className="absolute top-20 left-0 w-20 h-20 bg-[#FF9800]/10 rounded-r-full -z-0"></div>
            <div className="absolute bottom-32 right-0 w-24 h-24 bg-[#00BFA5]/10 rounded-l-full -z-0"></div>

            <div className="flex flex-col items-center px-6 pt-10 pb-8 relative z-10">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-10 h-10 bg-[#FF9800] rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                    <span className="text-xl font-extrabold text-gray-800">PRISMA</span>
                </div>

                <h1 className="text-lg font-extrabold text-gray-800 text-center mb-2">
                    Registra tu cuenta de arrendador
                </h1>
                <p className="text-xs text-gray-500 text-center mb-8">
                    ¿Cómo deseas administrar tus espacios?
                </p>

                {/* Selection Cards */}
                <div className="flex gap-4 w-full mb-6">
                    {/* Persona Natural */}
                    <button
                        onClick={() => setTipoSeleccionado("persona_natural")}
                        className={`flex-1 rounded-2xl p-5 flex flex-col items-center gap-3 transition-all duration-200 border-2 ${
                            tipoSeleccionado === "persona_natural"
                                ? "bg-[#FFF3E0] border-[#FF9800] shadow-md"
                                : "bg-[#FFF9E6] border-transparent"
                        }`}
                    >
                        <div className="w-14 h-14 bg-white/60 rounded-xl flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#FF9800]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <span className="text-xs font-extrabold text-gray-800 uppercase">Persona Natural</span>
                        <p className="text-[10px] text-gray-500 text-center leading-tight">
                            Alquilo espacios a título personal
                        </p>
                    </button>

                    {/* Empresa */}
                    <button
                        onClick={() => setTipoSeleccionado("empresa")}
                        className={`flex-1 rounded-2xl p-5 flex flex-col items-center gap-3 transition-all duration-200 border-2 ${
                            tipoSeleccionado === "empresa"
                                ? "bg-[#FFF3E0] border-[#FF9800] shadow-md"
                                : "bg-[#FFF9E6] border-transparent"
                        }`}
                    >
                        <div className="w-14 h-14 bg-white/60 rounded-xl flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#FF9800]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <span className="text-xs font-extrabold text-gray-800 uppercase">Empresa</span>
                        <p className="text-[10px] text-gray-500 text-center leading-tight">
                            Represento una empresa constituida
                        </p>
                    </button>
                </div>

                <p className="text-xs text-gray-400 mb-6">Selecciona una de las opciones</p>

                <button
                    onClick={handleContinuar}
                    disabled={!tipoSeleccionado}
                    className="w-full bg-[#00BFA5] text-white font-bold py-3 rounded-xl hover:bg-[#00897B] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continuar
                </button>
            </div>
        </div>
    );
}
