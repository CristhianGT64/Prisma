import { useEffect, useState } from "react";
import { api } from "../../api/client";

interface ReservaArrendador {
  id: string;
  espacioId: string;
  espacioNombre?: string;
  fechaInicio: string;
  fechaFin: string;
  horaInicio?: string;
  horaFin?: string;
  estado: string;
  precioTotal: number;
  cantidadPersonas?: number;
  arrendatarioNombre?: string;
  espacio?: { nombre?: string };
  arrendatario?: { nombres?: string; apellidos?: string } | string;
}

export default function ArrendadorReservasPage() {
  const [reservas, setReservas] = useState<ReservaArrendador[]>([]);
  const [tab, setTab] = useState<"pendientes" | "activas" | "historial">("activas");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<ReservaArrendador[] | { reservas?: ReservaArrendador[]; items?: ReservaArrendador[] }>(
      "/arrendador/reservas"
    )
      .then((data) => {
        const list = Array.isArray(data) ? data : data.reservas ?? data.items ?? [];
        setReservas(
          list.map((r) => {
            const arrendatarioObj =
              r.arrendatario && typeof r.arrendatario === "object" ? r.arrendatario : null;
            const arrendatarioStr =
              typeof r.arrendatario === "string" ? r.arrendatario : undefined;
            return {
              ...r,
              espacioNombre: r.espacioNombre || r.espacio?.nombre || r.espacioId,
              arrendatarioNombre:
                r.arrendatarioNombre ||
                (arrendatarioObj
                  ? `${arrendatarioObj.nombres ?? ""} ${arrendatarioObj.apellidos ?? ""}`.trim()
                  : arrendatarioStr) ||
                "Arrendatario",
            };
          })
        );
      })
      .catch(() => setReservas([]))
      .finally(() => setLoading(false));
  }, []);

  const activas = reservas.filter((r) =>
    ["confirmada", "pendiente", "en_curso"].includes(r.estado)
  );
  const historial = reservas.filter((r) => ["completada", "cancelada"].includes(r.estado));
  const pendientes = reservas.filter((r) => r.estado === "pendiente");
  const lista = tab === "activas" ? activas : tab === "pendientes" ? pendientes : historial;

  const formatFecha = (f?: string) => {
    if (!f) return "";
    return new Date(f + "T12:00:00").toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const badge = (estado: string) => {
    const map: Record<string, string> = {
      confirmada: "bg-emerald-100 text-emerald-700",
      pendiente: "bg-amber-100 text-amber-700",
      completada: "bg-blue-100 text-blue-700",
      cancelada: "bg-red-100 text-red-600",
      en_curso: "bg-teal-100 text-teal-700",
    };
    return map[estado] ?? "bg-gray-100 text-gray-600";
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F5F7F9] pb-24">
      <div className="bg-[#FF9800] px-5 py-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-white font-bold text-lg text-center">Reservas recibidas</h1>
      </div>

      <div className="bg-white px-4 pt-3 border-b border-gray-100 flex gap-4 sticky top-[60px] z-10 overflow-x-auto">
        {(
          [
            ["activas", `Activas (${activas.length})`],
            ["pendientes", `Pendientes (${pendientes.length})`],
            ["historial", `Historial (${historial.length})`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`pb-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
              tab === key ? "border-[#FF9800] text-[#FF9800]" : "border-transparent text-gray-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="p-4 flex flex-col gap-3">
        {loading && <p className="text-center text-sm text-gray-400 py-10">Cargando...</p>}
        {!loading && lista.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-3xl mb-2">📅</p>
            <p className="text-sm font-medium">No hay reservas en esta sección</p>
          </div>
        )}
        {lista.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-extrabold text-sm text-gray-800">
                  {r.espacioNombre || r.espacioId}
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">{r.arrendatarioNombre}</p>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-full capitalize ${badge(r.estado)}`}
              >
                {r.estado.replace("_", " ")}
              </span>
            </div>
            <div className="text-[11px] text-gray-600 space-y-0.5">
              <p>
                {formatFecha(r.fechaInicio)}
                {r.horaInicio ? ` · ${r.horaInicio}${r.horaFin ? ` - ${r.horaFin}` : ""}` : ""}
              </p>
              {r.cantidadPersonas != null && <p>{r.cantidadPersonas} persona(s)</p>}
            </div>
            <p className="text-sm font-extrabold text-[#FF9800] mt-3">
              L. {Number(r.precioTotal || 0).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}