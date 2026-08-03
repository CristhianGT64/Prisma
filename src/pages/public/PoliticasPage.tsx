import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../api/client";
import { useApp } from "../../context/AppContext";

interface Politica {
  id: string;
  rol: string;
  titulo: string;
  contenido: string;
}

export default function PoliticasPage() {
  const { usuarioActual } = useApp();
  const [rol, setRol] = useState<"arrendatario" | "arrendador">(
    usuarioActual?.rol === "arrendador" ? "arrendador" : "arrendatario"
  );
  const [items, setItems] = useState<Politica[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api<Politica[]>(`/politicas?rol=${rol}`)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [rol]);

  return (
    <div className="flex-1 overflow-y-auto bg-white min-h-screen font-sans flex flex-col justify-between">
      <div>
        {/* Header Top Bar */}
        <div className="bg-[#079FA0] px-6 py-3.5 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-white font-bold text-lg">Políticas</h1>
          <button 
            onClick={() => navigate(-1)} 
            className="text-white hover:opacity-80 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        <div className="p-6 max-w-md mx-auto w-full">
          {/* Ilustración / Icono superior de Políticas */}
          <div className="flex justify-center my-4">
            {/* AGREGAR AQUÍ TU ILUSTRACIÓN O SVG DE POLÍTICAS/TÉRMINOS */}
          </div>

          {/* Selector de Rol (Arrendatario / Arrendador) */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {(["arrendatario", "arrendador"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRol(r)}
                className={`flex-1 py-2 rounded-lg text-xs font-extrabold capitalize transition ${
                  rol === r 
                    ? "bg-[#079FA0] text-white shadow-sm" 
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Estado de Carga y Vacío */}
          {loading && (
            <p className="text-sm text-gray-400 text-center py-8">Cargando políticas...</p>
          )}
          {!loading && items.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">Sin políticas para este rol</p>
          )}

          {/* Lista de Tarjetas de Políticas */}
          <div className="space-y-5 my-2">
            {items.map((p) => (
              <div key={p.id} className="flex flex-col">
                <h2 className="font-extrabold text-gray-900 text-base mb-2">
                  {p.titulo}
                </h2>
                
                {/* Tarjeta en estilo amarillo suave */}
                <article className="bg-[#FFF3C4] border border-[#FDE68A] rounded-2xl p-4 shadow-sm">
                  <p className="text-gray-800 text-sm leading-relaxed font-normal whitespace-pre-line">
                    {p.contenido}
                  </p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}