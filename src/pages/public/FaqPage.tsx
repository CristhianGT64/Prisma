import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "../../api/client";

interface Faq {
  id: string;
  pregunta: string;
  respuesta: string;
}

export default function FaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Faq[]>("/faqs")
      .then(setFaqs)
      .catch(() => setFaqs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="bg-[#00BFA5] px-5 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link to={-1 as any} onClick={(e) => { e.preventDefault(); history.back(); }} className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-white font-bold text-lg">Preguntas frecuentes</h1>
      </div>
      <div className="p-5 flex flex-col gap-2">
        {loading && <p className="text-sm text-gray-400 text-center py-8">Cargando...</p>}
        {!loading && faqs.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No hay preguntas disponibles</p>}
        {faqs.map((f) => (
          <button
            key={f.id}
            onClick={() => setOpen(open === f.id ? null : f.id)}
            className="text-left border border-gray-100 rounded-2xl p-4 shadow-sm"
          >
            <div className="flex justify-between gap-3 items-start">
              <span className="text-sm font-bold text-gray-800">{f.pregunta}</span>
              <span className="text-[#00BFA5] font-bold text-lg leading-none">{open === f.id ? "−" : "+"}</span>
            </div>
            {open === f.id && <p className="text-xs text-gray-500 mt-3 leading-relaxed">{f.respuesta}</p>}
          </button>
        ))}
      </div>
    </div>
  );
}
