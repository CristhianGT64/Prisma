import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";

export default function AgregarTarjetaPage() {
    const navigate = useNavigate();
    const { agregarTarjeta } = useApp();
    const [numero, setNumero] = useState("");
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [fecha, setFecha] = useState("");
    
    // Auto-format card number
    const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, "");
        if (val.length > 16) val = val.slice(0, 16);
        const parts = val.match(/.{1,4}/g);
        setNumero(parts ? parts.join(" ") : "");
    };

    const handleFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, "");
        if (val.length > 4) val = val.slice(0, 4);
        if (val.length > 2) {
            setFecha(`${val.slice(0, 2)}/${val.slice(2)}`);
        } else {
            setFecha(val);
        }
    };

    const isFormValid = numero.length === 19 && nombres.length > 0 && apellidos.length > 0 && fecha.length === 5;

    const nombreCompleto = `${nombres} ${apellidos}`.trim();

    return (
        <div className="flex-1 overflow-y-auto bg-white flex flex-col relative pb-24">
            {/* Header */}
            <div className="bg-[#00BFA5] px-5 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <button onClick={() => navigate(-1)} className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-white font-bold text-[17px]">Agregar tarjeta</h1>
                <div className="w-6"></div> {/* Spacer */}
            </div>

            <div className="p-5 flex flex-col items-center">
                
                {/* Visual Card Mock */}
                <div className="w-full max-w-[320px] bg-[#FFF3B0] rounded-[20px] p-5 shadow-sm mb-6 flex flex-col justify-between h-[180px]">
                    <div className="w-12 h-8 bg-[#E69138] rounded-sm opacity-80"></div>
                    <div className="flex flex-col gap-3">
                        <p className="font-mono text-[#00BFA5] text-lg tracking-widest font-bold">
                            {numero || "XXXX XXXX XXXX XXXX"}
                        </p>
                        <div className="flex justify-between items-end">
                            <p className="text-[#00BFA5] text-xs font-bold uppercase truncate max-w-[180px]">
                                {nombreCompleto || "Nombre y apellidos"}
                            </p>
                            <p className="text-[#00BFA5] text-xs font-bold">
                                {fecha || "MM/AA"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info block */}
                <div className="w-full max-w-[320px] bg-[#E0F2F1] rounded-[12px] p-3 flex gap-3 items-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#00BFA5] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="text-[10px] text-gray-500 font-medium leading-tight">
                        No te preocupes. Los datos de tu tarjeta son guardados de manera cifrada y segura
                    </p>
                </div>

                {/* Form */}
                <div className="w-full max-w-[320px] flex flex-col gap-4">
                    <div>
                        <label className="text-[11px] font-extrabold text-gray-800 mb-1.5 block">Número de la tarjeta</label>
                        <input 
                            type="text" 
                            placeholder="XXXX XXXX XXXX XXXX" 
                            value={numero}
                            onChange={handleNumeroChange}
                            className="w-full border-2 border-[#00BFA5]/20 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#00BFA5] transition-colors font-mono"
                        />
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-[11px] font-extrabold text-gray-800 mb-1.5 block">Nombres</label>
                            <input 
                                type="text" 
                                placeholder="Nombres" 
                                value={nombres}
                                onChange={(e) => setNombres(e.target.value)}
                                className="w-full border-2 border-[#00BFA5]/20 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#00BFA5] transition-colors"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-[11px] font-extrabold text-gray-800 mb-1.5 block">Apellidos</label>
                            <input 
                                type="text" 
                                placeholder="Apellidos" 
                                value={apellidos}
                                onChange={(e) => setApellidos(e.target.value)}
                                className="w-full border-2 border-[#00BFA5]/20 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#00BFA5] transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-[11px] font-extrabold text-gray-800 mb-1.5 block">Fecha de vencimiento</label>
                            <input 
                                type="text" 
                                placeholder="MM/AA" 
                                value={fecha}
                                onChange={handleFechaChange}
                                className="w-full border-2 border-[#00BFA5]/20 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#00BFA5] transition-colors text-center"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-[11px] font-extrabold text-gray-800 mb-1.5 block">CVV</label>
                            <input 
                                type="password" 
                                placeholder="000" 
                                maxLength={4}
                                className="w-full border-2 border-[#00BFA5]/20 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#00BFA5] transition-colors text-center"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 mb-4">
                    <button 
                        disabled={!isFormValid}
                        onClick={async () => {
                            try {
                                await agregarTarjeta({
                                    last4: numero.slice(-4),
                                    nombre: nombreCompleto,
                                    tipo: "Crédito"
                                });
                                navigate(-1);
                            } catch {
                                /* ignore */
                            }
                        }}
                        className="bg-[#FF9800] text-white font-bold text-[13px] px-10 py-2.5 rounded-[12px] shadow-md hover:bg-[#F57C00] transition-colors disabled:opacity-50"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
