import { Link } from "react-router";

export default function NosotrosPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="bg-[#00BFA5] px-5 py-4 flex items-center gap-3 sticky top-0 z-10">
        <Link to="/landing" className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-white font-bold text-lg">Nosotros</h1>
      </div>
      <div className="p-5 space-y-5">
        <div className="bg-[#E0F7F4] rounded-2xl p-5">
          <h2 className="font-extrabold text-[#00695C] text-lg mb-2">Nuestra misión</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Conectar personas y empresas con espacios de trabajo flexibles en Honduras, facilitando productividad, networking y crecimiento.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-gray-800 mb-2">Qué hacemos</h3>
          <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
            <li>Marketplace de oficinas, salas y escritorios</li>
            <li>Reservas por hora o día con confirmación inmediata</li>
            <li>Herramientas para arrendadores: espacios, reservas e ingresos</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-gray-800 mb-2">Valores</h3>
          <div className="grid grid-cols-2 gap-3">
            {["Confianza", "Flexibilidad", "Comunidad", "Transparencia"].map((v) => (
              <div key={v} className="rounded-xl border border-[#B2DFDB] bg-[#F0FDF9] px-3 py-3 text-center text-sm font-bold text-[#00897B]">
                {v}
              </div>
            ))}
          </div>
        </div>
        <Link to="/contacto" className="block text-center bg-[#FF9800] text-white font-bold py-3 rounded-xl">
          Contáctanos
        </Link>
      </div>
    </div>
  );
}
