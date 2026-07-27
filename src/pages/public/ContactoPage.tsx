import { useState } from "react";
import { Link } from "react-router";
import { api } from "../../api/client";

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: "", correo: "", telefono: "", mensaje: "" });
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api("/contacto", { method: "POST", body: JSON.stringify(form) });
      setOk(true);
      setForm({ nombre: "", correo: "", telefono: "", mensaje: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="bg-[#00BFA5] px-5 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link to="/landing" className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-white font-bold text-lg">Contacto</h1>
      </div>
      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
        <p className="text-sm text-gray-500">¿Tienes dudas? Escríbenos y te respondemos pronto.</p>
        {ok && <div className="bg-green-50 text-green-700 text-sm rounded-xl p-3 border border-green-200">Mensaje enviado. ¡Gracias!</div>}
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 border border-red-200">{error}</div>}
        {[
          { name: "nombre", label: "Nombre", type: "text" },
          { name: "correo", label: "Correo", type: "email" },
          { name: "telefono", label: "Teléfono", type: "tel" },
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-[10px] font-extrabold text-gray-700 mb-1 uppercase">{f.label}</label>
            <input
              required={f.name !== "telefono"}
              type={f.type}
              value={(form as any)[f.name]}
              onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA5]"
            />
          </div>
        ))}
        <div>
          <label className="block text-[10px] font-extrabold text-gray-700 mb-1 uppercase">Mensaje</label>
          <textarea
            required
            rows={4}
            value={form.mensaje}
            onChange={(e) => setForm((p) => ({ ...p, mensaje: e.target.value }))}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BFA5] resize-none"
          />
        </div>
        <button disabled={loading} className="bg-[#FF9800] text-white font-bold py-3.5 rounded-xl disabled:opacity-60">
          {loading ? "Enviando..." : "Enviar mensaje"}
        </button>
      </form>
    </div>
  );
}
