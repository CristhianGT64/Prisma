import { useEffect, useState } from "react";
import { api } from "../../api/client";

interface IngresoDetalle {
  id: string;
  fechaInicio: string;
  espacioNombre: string;
  arrendatario: string;
  estado: string;
  ingreso: number;
  comision: number;
  neto: number;
}

interface IngresosResponse {
  resumen: {
    ingresos: number;
    comisiones: number;
    neto: number;
    reservas: number;
    comisionPct: number;
  };
  detalle: IngresoDetalle[];
}

export default function HistorialIngresosPage() {
  const [data, setData] = useState<IngresosResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<IngresosResponse>("/arrendador/ingresos")
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const formatFecha = (f: string) =>
    new Date(f + "T12:00:00").toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="flex-1 overflow-y-auto bg-[#F5F7F9] pb-24">
      <div className="bg-[#FF9800] px-5 py-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-white font-bold text-lg text-center">Historial de ingresos</h1>
      </div>

      {loading && <p className="text-center text-sm text-gray-400 py-16">Cargando...</p>}

      {!loading && data && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm col-span-2">
              <p className="text-[10px] font-bold text-gray-500 uppercase">Neto recibido</p>
              <p className="text-2xl font-extrabold text-[#FF9800] mt-1">
                L. {data.resumen.neto.toFixed(2)}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                Comisión plataforma {data.resumen.comisionPct}%
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <p className="text-[10px] font-bold text-gray-500 uppercase">Bruto</p>
              <p className="text-lg font-extrabold text-gray-800 mt-1">
                L. {data.resumen.ingresos.toFixed(2)}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <p className="text-[10px] font-bold text-gray-500 uppercase">Comisiones</p>
              <p className="text-lg font-extrabold text-gray-800 mt-1">
                L. {data.resumen.comisiones.toFixed(2)}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-extrabold text-gray-700 uppercase tracking-widest mb-3">
              Detalle ({data.resumen.reservas})
            </h2>
            <div className="flex flex-col gap-3">
              {data.detalle.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">Aún no hay ingresos registrados</p>
              )}
              {data.detalle.map((d) => (
                <div key={d.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm text-gray-800">{d.espacioNombre}</h3>
                      <p className="text-[11px] text-gray-500 mt-0.5">{d.arrendatario}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{formatFecha(d.fechaInicio)}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
                      {d.estado}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase font-bold">Ingreso</p>
                      <p className="text-xs font-bold text-gray-700">L. {d.ingreso.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase font-bold">Comisión</p>
                      <p className="text-xs font-bold text-red-500">-L. {d.comision.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-400 uppercase font-bold">Neto</p>
                      <p className="text-xs font-extrabold text-[#FF9800]">L. {d.neto.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && !data && (
        <p className="text-center text-sm text-gray-400 py-16">No se pudieron cargar los ingresos</p>
      )}
    </div>
  );
}
