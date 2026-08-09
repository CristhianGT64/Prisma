import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useApp } from "../../context/AppContext";
import BottomNav from "../../components/layout/BottomNav";
import { api } from "../../api/client";

type ReservaOcupada = {
  fechaInicio: string;
  fechaFin: string;
};

export default function ReservaFechaHoraPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { espacios, setReservaEnCurso } = useApp();

  const espacio = espacios.find((e) => e.id === id);

  // Control de fecha y calendario
  const [selectedMonth, setSelectedMonth] = useState(5); // 0 = Ene, 5 = Jun
  const [selectedYear, setSelectedYear] = useState(2026);
  

  const [reservasOcupadas, setReservasOcupadas] = useState<ReservaOcupada[]>([]);
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [startDay, setStartDay] = useState<number | null>(null);
  const [endDay, setEndDay] = useState<number | null>(null);
  const [fechasBloqueadas, setFechasBloqueadas] = useState<string[]>([]);

  // Control de horas de inicio y fin (Formato 12 hrs)
  const [horaInicioNum, setHoraInicioNum] = useState("09");
  const [minInicioNum, setMinInicioNum] = useState("00");
  const [ampmInicio, setAmpmInicio] = useState("AM");

  const [horaFinNum, setHoraFinNum] = useState("12");
  const [minFinNum, setMinFinNum] = useState("00");
  const [ampmFin, setAmpmFin] = useState("PM");

  useEffect(() => {
    if (!espacio) {
      navigate("/inicio");
    }
  }, [espacio, navigate]);

  useEffect(() => {
    if (!espacio) return;

    let cancelled = false;

    (async () => {
      try {
        setLoadingReservas(true);
        const data = await api<ReservaOcupada[]>(`/espacios/${espacio.id}/reservas`);
        if (!cancelled) setReservasOcupadas(data);
      } catch {
        if (!cancelled) setReservasOcupadas([]);
      } finally {
        if (!cancelled) setLoadingReservas(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [espacio]);

  useEffect(() => {
    if (!id) return;
    api<{ fechas?: string[] }>(`/espacios/${id}/fechas-bloqueadas`)
      .then((data) => {
        setFechasBloqueadas(Array.isArray(data?.fechas) ? data.fechas : []);
      })
      .catch(() => setFechasBloqueadas([]));
  }, [id]);

  if (!espacio) return null;

  // Nombres de meses y días
  const meses = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun", 
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
  ];

  const toDateKey = (day: number) =>
    `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

  const parseDateKey = (dateKey: string) => new Date(`${dateKey}T12:00:00`);

  const isDateOccupied = (dateKey: string) =>
    reservasOcupadas.some((reserva) => {
      if (!reserva.fechaInicio || !reserva.fechaFin) return false;
      const fecha = parseDateKey(dateKey).getTime();
      const inicio = parseDateKey(reserva.fechaInicio).getTime();
      const fin = parseDateKey(reserva.fechaFin).getTime();
      return fecha >= inicio && fecha <= fin;
    });

  const isRangeOccupied = (start: number, end: number) => {
    const from = Math.min(start, end);
    const to = Math.max(start, end);
    for (let day = from; day <= to; day += 1) {
      if (isDateOccupied(toDateKey(day))) return true;
    }
    return false;
  };

  // Cálculo de días en el mes seleccionado
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay(); // 0 = Dom

  const fechaIso = (day: number) =>
    `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;

  const isBloqueada = (day: number) => fechasBloqueadas.includes(fechaIso(day));

  const rangoIncluyeBloqueadas = (desde: number, hasta: number) => {
    const inicio = Math.min(desde, hasta);
    const fin = Math.max(desde, hasta);
    for (let d = inicio; d <= fin; d += 1) {
      if (isBloqueada(d)) return true;
    }
    return false;
  };

  // Manejo de clicks en los días del calendario
  const handleDayClick = (day: number) => {
    if (isDateOccupied(toDateKey(day))) return;

    if (isBloqueada(day)) return;

    if (!startDay || (startDay && endDay)) {
      setStartDay(day);
      setEndDay(null);
    } else if (startDay && !endDay) {
      if (rangoIncluyeBloqueadas(startDay, day)) {
        alert("No puedes seleccionar un rango con fechas bloqueadas por el arrendador");
        return;
      }
      if (day < startDay) {
        if (isRangeOccupied(day, startDay)) return;
        setEndDay(startDay);
        setStartDay(day);
      } else {
        if (isRangeOccupied(startDay, day)) return;
        setEndDay(day);
      }
    }
  };

  // Convertir hora 12h a formato 24h para cálculos de duración
  const convertTo24Hour = (hourStr: string, minStr: string, ampm: string) => {
    let hour = parseInt(hourStr, 10);
    const min = parseInt(minStr, 10);
    if (ampm === "PM" && hour < 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    return hour + min / 60;
  };

  // Cálculo dinámico de horas por día y días totales
  const startHour24 = convertTo24Hour(horaInicioNum, minInicioNum, ampmInicio);
  const endHour24 = convertTo24Hour(horaFinNum, minFinNum, ampmFin);
  const hoursPerDay = Math.max(0, endHour24 - startHour24);

  const totalDaysSelected = startDay && endDay 
    ? (endDay - startDay + 1) 
    : startDay 
      ? 1 
      : 0;

  const selectionIsOccupied = startDay
    ? endDay
      ? isRangeOccupied(startDay, endDay)
      : isDateOccupied(toDateKey(startDay))
    : false;

  const duracionHorasTotal = hoursPerDay * (totalDaysSelected || 1);
  const precioHora = espacio.precioHora || 75;
  const precioTotal = precioHora * duracionHorasTotal;

  // Formato para mostrar rango de fechas en el resumen
  const fechaTextoResumen = startDay
    ? endDay && endDay !== startDay
      ? `${startDay} - ${endDay} de ${meses[selectedMonth].toLowerCase()}o, ${selectedYear}`
      : `${startDay} de ${meses[selectedMonth].toLowerCase()}o, ${selectedYear}`
    : "Sin fecha seleccionada";

  const handleContinuar = () => {
    if (!startDay) {
      alert("Por favor selecciona al menos una fecha en el calendario");
      return;
    }
    if (selectionIsOccupied) {
      alert("La selección actual incluye fechas no disponibles. Elige otro rango.");
      return;
    }

    if (endDay && rangoIncluyeBloqueadas(startDay, endDay)) {
      alert("El rango seleccionado incluye fechas bloqueadas. Elige otras fechas.");
      return;
    }
    
    const fechaInicio = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, "0")}-${startDay.toString().padStart(2, "0")}`;
    const fechaFin = endDay 
      ? `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, "0")}-${endDay.toString().padStart(2, "0")}` 
      : fechaInicio;

    const currentReservaState = {
      espacioId: espacio.id,
      fechaInicio,
      fechaFin,
      horaInicio: `${horaInicioNum}:${minInicioNum} ${ampmInicio}`,
      horaFin: `${horaFinNum}:${minFinNum} ${ampmFin}`,
      cantidadPersonas: 1,
      precioTotal,
    };

    setReservaEnCurso(currentReservaState);
    navigate(`/espacios/${espacio.id}/reservar/paso-2`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans relative">
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Header */}
        <div className="bg-[#079FA0] px-5 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm text-white">
          <h1 className="font-bold text-lg">Reserva de espacio</h1>
          <button
            onClick={() => navigate(-1)}
            aria-label="Volver"
            className="hover:opacity-80 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
        </div>

        <div className="p-5 max-w-md mx-auto flex flex-col gap-6">
          {/* Calendario Interactivo */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-3">
              Seleccione la fecha o fechas
            </h3>
            <div className="bg-white rounded-3xl border border-gray-300 p-5 shadow-sm">
              {loadingReservas && (
                <p className="mb-3 text-xs text-gray-400">Cargando disponibilidad...</p>
              )}
              {/* Controles de Mes y Año */}
              <div className="flex justify-between items-center mb-5 px-2">
                <button
                  onClick={() => {
                    if (selectedMonth === 0) {
                      setSelectedMonth(11);
                      setSelectedYear(selectedYear - 1);
                    } else {
                      setSelectedMonth(selectedMonth - 1);
                    }
                  }}
                  className="text-[#F58220] font-bold p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex gap-2">
                  <div className="relative">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                      className="appearance-none border border-[#F58220] rounded-xl px-4 py-1 pr-8 text-sm font-semibold text-gray-700 bg-white outline-none cursor-pointer"
                    >
                      {meses.map((mes, idx) => (
                        <option key={mes} value={idx}>{mes}</option>
                      ))}
                    </select>
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#F58220] text-xs pointer-events-none">▼</span>
                  </div>

                  <div className="relative">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="appearance-none border border-[#F58220] rounded-xl px-4 py-1 pr-8 text-sm font-semibold text-gray-700 bg-white outline-none cursor-pointer"
                    >
                      {[2025, 2026, 2027].map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#F58220] text-xs pointer-events-none">▼</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (selectedMonth === 11) {
                      setSelectedMonth(0);
                      setSelectedYear(selectedYear + 1);
                    } else {
                      setSelectedMonth(selectedMonth + 1);
                    }
                  }}
                  className="text-[#F58220] font-bold p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Días de la semana */}
              <div className="grid grid-cols-7 text-center mb-3">
                {["Do", "Lun", "Ma", "Mi", "Ju", "Vi", "Sa"].map((d) => (
                  <div key={d} className="text-xs font-semibold text-gray-500">
                    {d}
                  </div>
                ))}
              </div>

              {/* Días del mes */}
              <div className="grid grid-cols-7 text-center gap-y-2 text-sm font-medium text-gray-700">
                {/* Espacios vacíos al inicio del mes */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="py-1"></div>
                ))}

                {/* Generación interactiva de días */}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const dateKey = toDateKey(day);
                  const occupied = isDateOccupied(dateKey);
                  const isStart = day === startDay;
                  const isEnd = day === endDay;
                  const isInRange = startDay && endDay && day >= startDay && day <= endDay;
                  const bloqueada = isBloqueada(day);

                  let cellBg = "";
                  let textStyle = "text-gray-800 hover:bg-gray-100 rounded-xl";

                  if (occupied) {
                    cellBg = "bg-gray-200";
                    textStyle = "text-gray-400 font-semibold cursor-not-allowed";
                  } else if (bloqueada) {
                    cellBg = "bg-gray-200 rounded-xl";
                    textStyle = "text-gray-500 font-semibold";
                  } else if (isInRange) {
                    cellBg = "bg-[#F58220]";
                    textStyle = "text-white font-bold";
                    if (isStart) cellBg += " rounded-l-xl";
                    if (isEnd) cellBg += " rounded-r-xl";
                  } else if (isStart && !endDay) {
                    cellBg = "bg-[#F58220] rounded-xl";
                    textStyle = "text-white font-bold";
                  }

                  return (
                    <div
                      key={day}
                      className={`py-1 flex items-center justify-center select-none transition-all ${cellBg} ${
                        occupied || bloqueada ? "" : "cursor-pointer"
                      }`}
                      onClick={() => handleDayClick(day)}
                    >
                      <span className={`w-7 h-7 flex items-center justify-center ${textStyle}`}>
                        {day}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-2 text-[11px] text-gray-500">
                <span className="w-3 h-3 rounded-sm bg-gray-200 border border-gray-300" />
                <span>Fechas no disponibles por bloqueo del arrendador</span>
              </div>
            </div>
          </div>

          {/* Selector interactivo: Hora de entrada */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-2">
              Seleccione la hora de entrada
            </h3>
            <div className="flex items-center gap-2">
              {/* Horas */}
              <div className="relative">
                <select
                  value={horaInicioNum}
                  onChange={(e) => setHoraInicioNum(e.target.value)}
                  className="appearance-none border border-[#F58220] rounded-xl px-4 py-1.5 pr-8 text-sm font-medium text-gray-700 bg-white outline-none cursor-pointer"
                >
                  {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0")).map((h) => (
                    <option key={h} value={h}>{parseInt(h, 10)}</option>
                  ))}
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#F58220] text-xs pointer-events-none">▼</span>
              </div>

              <span className="text-gray-700 font-bold">:</span>

              {/* Minutos */}
              <div className="relative">
                <select
                  value={minInicioNum}
                  onChange={(e) => setMinInicioNum(e.target.value)}
                  className="appearance-none border border-[#F58220] rounded-xl px-4 py-1.5 pr-8 text-sm font-medium text-gray-700 bg-white outline-none cursor-pointer"
                >
                  <option value="00">00</option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#F58220] text-xs pointer-events-none">▼</span>
              </div>

              {/* AM / PM */}
              <div className="relative">
                <select
                  value={ampmInicio}
                  onChange={(e) => setAmpmInicio(e.target.value)}
                  className="appearance-none border border-[#F58220] rounded-xl px-4 py-1.5 pr-8 text-sm font-medium text-gray-700 bg-white outline-none cursor-pointer"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#F58220] text-xs pointer-events-none">▼</span>
              </div>
            </div>
          </div>

          {/* Selector interactivo: Hora de salida */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-2">
              Seleccione la hora de salida
            </h3>
            <div className="flex items-center gap-2">
              {/* Horas */}
              <div className="relative">
                <select
                  value={horaFinNum}
                  onChange={(e) => setHoraFinNum(e.target.value)}
                  className="appearance-none border border-[#F58220] rounded-xl px-4 py-1.5 pr-8 text-sm font-medium text-gray-700 bg-white outline-none cursor-pointer"
                >
                  {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0")).map((h) => (
                    <option key={h} value={h}>{parseInt(h, 10)}</option>
                  ))}
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#F58220] text-xs pointer-events-none">▼</span>
              </div>

              <span className="text-gray-700 font-bold">:</span>

              {/* Minutos */}
              <div className="relative">
                <select
                  value={minFinNum}
                  onChange={(e) => setMinFinNum(e.target.value)}
                  className="appearance-none border border-[#F58220] rounded-xl px-4 py-1.5 pr-8 text-sm font-medium text-gray-700 bg-white outline-none cursor-pointer"
                >
                  <option value="00">00</option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#F58220] text-xs pointer-events-none">▼</span>
              </div>

              {/* AM / PM */}
              <div className="relative">
                <select
                  value={ampmFin}
                  onChange={(e) => setAmpmFin(e.target.value)}
                  className="appearance-none border border-[#F58220] rounded-xl px-4 py-1.5 pr-8 text-sm font-medium text-gray-700 bg-white outline-none cursor-pointer"
                >
                  <option value="PM">PM</option>
                  <option value="AM">AM</option>
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#F58220] text-xs pointer-events-none">▼</span>
              </div>
            </div>
          </div>

          {/* Resumen dinámico */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-3">
              Resumen de la reserva
            </h3>
            <div className="bg-[#A2E0D3] rounded-3xl p-5 text-gray-800 flex flex-col gap-3">
              <div className="flex justify-between items-center pb-2 border-b border-[#82CEBE]">
                <span className="text-sm font-bold text-gray-700">Espacio:</span>
                <span className="text-sm font-medium text-gray-800">
                  {espacio.nombre || "Premium Coworking"}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-[#82CEBE]">
                <span className="text-sm font-bold text-gray-700">Fechas:</span>
                <span className="text-sm font-medium text-gray-800">
                  {fechaTextoResumen}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-[#82CEBE]">
                <span className="text-sm font-bold text-gray-700">Horario:</span>
                <span className="text-sm font-medium text-gray-800">
                  {parseInt(horaInicioNum, 10)}:{minInicioNum} {ampmInicio} - {parseInt(horaFinNum, 10)}:{minFinNum} {ampmFin}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-[#82CEBE]">
                <span className="text-sm font-bold text-gray-700">Duración:</span>
                <span className="text-sm font-medium text-gray-800">
                  {duracionHorasTotal} horas
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-[#82CEBE]">
                <span className="text-sm font-bold text-gray-700">Precio/hora:</span>
                <span className="text-sm font-medium text-gray-800">
                  L. {precioHora.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-base font-bold text-gray-800">Total:</span>
                <span className="text-base font-extrabold text-[#F58220]">
                  L. {precioTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Botón Continuar */}
          <div className="flex justify-end mt-2">
            <button
              onClick={handleContinuar}
              disabled={loadingReservas || !startDay || selectionIsOccupied}
              className="bg-[#F58220] hover:bg-[#e0731a] active:scale-95 text-white font-bold px-7 py-2.5 rounded-full shadow-md flex items-center gap-2 text-sm transition-all cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
            >
              Continuar
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Navegación Inferior */}
      <BottomNav />
    </div>
  );
}