import { useEffect, useState } from "react";
import { Link } from "react-router";
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

  useEffect(() => {
    setLoading(true);
    api<Politica[]>(`/politicas?rol=${rol}`)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [rol]);

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="bg-[#00BFA5] px-5 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link to={-1 as any} onClick={(e) => { e.preventDefault(); history.back(); }} className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-white font-bold text-lg">Políticas</h1>
      </div>
      <div className="p-5">
        <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
          {(["arrendatario", "arrendador"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRol(r)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition ${
                rol === r ? "bg-white text-[#00897B] shadow-sm" : "text-gray-500"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        {loading && <p className="text-sm text-gray-400 text-center py-8">Cargando...</p>}
        <div className="flex flex-col gap-4">
          {items.map((p) => (
            <article key={p.id} className="border border-gray-100 rounded-2xl p-4 shadow-sm">
              <h2 className="font-extrabold text-sm text-gray-800 mb-2">{p.titulo}</h2>
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{p.contenido}</p>
            </article>
          ))}
          {!loading && items.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">Sin políticas para este rol</p>
          )}
        </div>
      </div>
    </div>
  );
}
