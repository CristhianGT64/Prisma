import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useApp } from "../../context/AppContext";
import ResumenReserva from "../../components/ui/ResumenReserva";

export default function ReservaFechaHoraPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { espacios, reservaEnCurso, setReservaEnCurso } = useApp();

    const espacio = espacios.find(e => e.id === id);

    // Initial state based on previous or defaults
    const [fechaInicio, setFechaInicio] = useState(reservaEnCurso?.fechaInicio || "");
    const [fechaFin, setFechaFin] = useState(reservaEnCurso?.fechaFin || "");
    const [horaInicio, setHoraInicio] = useState(reservaEnCurso?.horaInicio || "09:00 AM");
    const [horaFin, setHoraFin] = useState(reservaEnCurso?.horaFin || "12:00 PM");

    useEffect(() => {
        if (!espacio) {
            navigate("/inicio");
        }
    }, [espacio, navigate]);

    if (!espacio) return null;

    // Calcular resumen (simulado para el mockup)
    const precioHora = espacio.precioHora || 0;
    // Asumimos 3 horas para la demostración, o calcular real en un proyecto final
    const duracionHoras = 3; 
    const precioTotal = precioHora * duracionHoras;

    const currentReservaState = {
        espacioId: espacio.id,
        fechaInicio,
        fechaFin: fechaFin || fechaInicio,
        horaInicio,
        horaFin,
        cantidadPersonas: 1,
        precioTotal
    };

    const handleContinuar = () => {
        if (!fechaInicio) {
            alert("Por favor selecciona una fecha");
            return;
        }
        setReservaEnCurso(currentReservaState);
        navigate(`/espacios/${espacio.id}/reservar/paso-2`);
    };

    return (
        <div className="flex-1 overflow-y-auto bg-white flex flex-col relative pb-24">
            {/* Header */}
            <div className="bg-[#00BFA5] px-5 py-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
                <button onClick={() => navigate(-1)} className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-white font-bold text-lg">Reserva de espacio</h1>
            </div>

            <div className="p-5 flex flex-col gap-6">
                
                {/* Date Selection */}
                <div>
                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-3">Selecciona la fecha o fechas</h3>
                    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                        {/* Mockup Calendar Header */}
                        <div className="flex justify-between items-center mb-4">
                            <button className="text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                            <span className="font-bold text-gray-700 text-sm">Jun <span className="mx-1">|</span> 2026</span>
                            <button className="text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                        </div>
                        {/* Mockup Days */}
                        <div className="grid grid-cols-7 text-center mb-2">
                            {['Do','Lu','Ma','Mi','Ju','Vi','Sa'].map(d => (
                                <div key={d} className="text-[10px] font-bold text-gray-400">{d}</div>
                            ))}
                        </div>
                        {/* Dynamic Calendar Grid for current month (mocked as June 2026) */}
                        <div className="grid grid-cols-7 text-center gap-y-2 text-sm font-medium text-gray-600">
                            {/* Empty days before June 1st (Monday is 1, so Sunday 31 is from May) */}
                            <div className="py-1 text-gray-300">31</div>
                            {/* Days 1 to 30 */}
                            {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                                const dateStr = `2026-06-${day.toString().padStart(2, '0')}`;
                                
                                let isSelected = false;
                                let isStart = false;
                                let isEnd = false;
                                let isInRange = false;

                                if (fechaInicio) {
                                    if (dateStr === fechaInicio) { isSelected = true; isStart = true; }
                                    if (fechaFin && dateStr === fechaFin) { isSelected = true; isEnd = true; }
                                    if (fechaFin && dateStr > fechaInicio && dateStr < fechaFin) { isInRange = true; }
                                }

                                const isOnlyOneDay = isStart && isEnd;
                                const isStartWithoutEnd = isStart && !fechaFin;

                                let bgClass = "";
                                let textClass = "cursor-pointer hover:bg-gray-100 rounded-full";

                                if (isSelected) {
                                    bgClass = "bg-[#FF9800]";
                                    textClass = "text-white font-bold cursor-pointer";
                                    if (isOnlyOneDay || isStartWithoutEnd) bgClass += " rounded-full";
                                    else if (isStart) bgClass += " rounded-l-full";
                                    else if (isEnd) bgClass += " rounded-r-full";
                                } else if (isInRange) {
                                    bgClass = "bg-[#FFF9E6]";
                                    textClass = "text-[#FF9800] font-bold cursor-pointer";
                                }

                                const handleDateClick = () => {
                                    if (!fechaInicio || (fechaInicio && fechaFin)) {
                                        // Start new selection
                                        setFechaInicio(dateStr);
                                        setFechaFin("");
                                    } else {
                                        // Select end date
                                        if (dateStr < fechaInicio) {
                                            setFechaInicio(dateStr);
                                            setFechaFin(fechaInicio); // Swap
                                        } else {
                                            setFechaFin(dateStr);
                                        }
                                    }
                                };

                                return (
                                    <div key={day} className={`py-1 ${bgClass}`} onClick={handleDateClick}>
                                        <div className={`w-8 h-8 mx-auto flex items-center justify-center ${textClass}`}>
                                            {day}
                                        </div>
                                    </div>
                                );
                            })}
                            {/* Empty days after June 30 */}
                            <div className="py-1 text-gray-300">1</div><div className="py-1 text-gray-300">2</div><div className="py-1 text-gray-300">3</div><div className="py-1 text-gray-300">4</div>
                        </div>
                    </div>
                </div>

                {/* Time Selection */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-3">Hora de inicio</h3>
                        <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2">
                            <select value={horaInicio.split(" ")[0]} onChange={(e) => setHoraInicio(`${e.target.value} ${horaInicio.split(" ")[1]}`)} className="bg-transparent font-medium text-gray-700 outline-none appearance-none flex-1">
                                {Array.from({ length: 12 }, (_, i) => {
                                    const hour = (i + 1).toString().padStart(2, '0');
                                    return <option key={hour} value={`${hour}:00`}>{hour}:00</option>;
                                })}
                            </select>
                            <span className="text-[#FF9800] mr-2">▼</span>
                            <select value={horaInicio.split(" ")[1]} onChange={(e) => setHoraInicio(`${horaInicio.split(" ")[0]} ${e.target.value}`)} className="bg-transparent font-medium text-gray-700 outline-none appearance-none">
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                            <span className="text-[#FF9800]">▼</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-3">Hora de fin</h3>
                        <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2">
                            <select value={horaFin.split(" ")[0]} onChange={(e) => setHoraFin(`${e.target.value} ${horaFin.split(" ")[1]}`)} className="bg-transparent font-medium text-gray-700 outline-none appearance-none flex-1">
                                {Array.from({ length: 12 }, (_, i) => {
                                    const hour = (i + 1).toString().padStart(2, '0');
                                    return <option key={hour} value={`${hour}:00`}>{hour}:00</option>;
                                })}
                            </select>
                            <span className="text-[#FF9800] mr-2">▼</span>
                            <select value={horaFin.split(" ")[1]} onChange={(e) => setHoraFin(`${horaFin.split(" ")[0]} ${e.target.value}`)} className="bg-transparent font-medium text-gray-700 outline-none appearance-none">
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                            <span className="text-[#FF9800]">▼</span>
                        </div>
                    </div>
                </div>

                {/* Resumen */}
                <ResumenReserva espacio={espacio} reserva={currentReservaState} />
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 p-4 flex justify-center z-20">
                <button 
                    onClick={handleContinuar}
                    className="w-full bg-[#FF9800] text-white font-bold py-3.5 rounded-xl hover:bg-[#F57C00] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                >
                    Continuar
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
