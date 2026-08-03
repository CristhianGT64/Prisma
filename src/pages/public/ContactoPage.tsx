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
    <div className="flex-1 overflow-y-auto bg-white min-h-screen font-sans flex flex-col">
      {/* Top Bar Header */}
      <div className="bg-[#079FA0] px-6 py-3.5 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-white font-bold text-lg">Contáctanos</h1>
        <Link to="/landing" className="text-white hover:opacity-80 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </Link>
      </div>

      <div className="p-6 max-w-md mx-auto w-full flex-1 flex flex-col">
        {/* Icono Envelope Centrado */}
        <div className="flex justify-center mt-2 mb-3">
          <svg className="w-20 h-20 text-[#079FA0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>

        {/* Título de la Sección */}
        <h2 className="text-center font-black text-[#F58B01] text-2xl tracking-wide uppercase mb-3">
          CONTÁCTANOS
        </h2>

        {/* Subtítulo / Descripción */}
        <div className="text-gray-800 text-sm leading-snug text-left mb-6">
          <p>Déjanos tu mensaje y te responderemos pronto.</p>
          <p>En Prisma nos importa brindarte una experiencia rápida, clara y eficiente.</p>
        </div>

        {/* Notificaciones Feedback */}
        {ok && (
          <div className="bg-green-50 text-green-700 text-sm rounded-xl p-3 border border-green-200 mb-4 text-center font-medium">
            Mensaje enviado. ¡Gracias!
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 border border-red-200 mb-4 text-center font-medium">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Nombre Completo */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                Nombre Completo
              </label>
              <input
                required
                type="text"
                placeholder="Pedro Ramón López Avila"
                value={form.nombre}
                onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
                className="w-full border-2 border-[#079FA0] rounded-xl px-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#079FA0]/50"
              />
            </div>

            {/* Correo electrónico */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                Correo electrónico
              </label>
              <input
                required
                type="email"
                placeholder="pedro.lopez@gmail.com"
                value={form.correo}
                onChange={(e) => setForm((p) => ({ ...p, correo: e.target.value }))}
                className="w-full border-2 border-[#079FA0] rounded-xl px-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#079FA0]/50"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                Teléfono
              </label>
              <input
                type="tel"
                placeholder="9899-3343"
                value={form.telefono}
                onChange={(e) => setForm((p) => ({ ...p, telefono: e.target.value }))}
                className="w-full border-2 border-[#079FA0] rounded-xl px-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#079FA0]/50"
              />
            </div>

            {/* Mensaje */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                ¿En qué podemos ayudarte?
              </label>
              <textarea
                required
                rows={5}
                placeholder="Mensaje"
                value={form.mensaje}
                onChange={(e) => setForm((p) => ({ ...p, mensaje: e.target.value }))}
                className="w-full border-2 border-[#079FA0] rounded-xl p-4 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#079FA0]/50 resize-none"
              />
            </div>
          </div>

          {/* Botón Enviar */}
          <div className="flex justify-center pt-4 pb-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#F58B01] hover:bg-[#e07e00] text-white font-extrabold text-base py-2.5 px-10 rounded-2xl shadow-md transition-colors disabled:opacity-60 min-w-[160px]"
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
