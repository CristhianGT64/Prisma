import { useNavigate, useParams } from "react-router";
import { useApp } from "../../context/AppContext";
import BottomNav from "../../components/layout/BottomNav";

export default function EspacioDetallePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { espacios, usuarios, toggleFavorito, esFavorito } = useApp();

  const espacio = espacios.find((e) => e.id === id);

  if (!espacio) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white p-5 text-center min-h-screen">
        <p className="text-gray-500 font-medium">Espacio no encontrado</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-[#00BFA5] font-bold">
          Volver
        </button>
      </div>
    );
  }

  const arrendador = usuarios.find((u) => u.id === espacio.arrendadorId);
  const isFav = esFavorito(espacio.id);

  return (
    <div className="flex flex-col h-screen bg-white relative max-w-[430px] mx-auto shadow-2xl border-x border-gray-100">
      {/* Scroll View */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Banner de Imagen */}
        <div className="relative h-64 bg-gray-200">
          {espacio.imagenes[0] && (
            <img
              src={espacio.imagenes[0].url}
              alt={espacio.nombre}
              className="w-full h-full object-cover"
            />
          )}

          {/* Botón para regresar */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-9 h-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-700 shadow-sm z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Botón de Favorito en imagen */}
          <button
            onClick={() => {
              void toggleFavorito(espacio.id);
            }}
            className="absolute top-4 right-4 w-9 h-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-[#EF5350] shadow-sm z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill={isFav ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        <div className="px-5 py-5 flex flex-col gap-5">
          {/* Título Principal */}
          <h1 className="text-xl font-bold text-[#00897B] leading-tight">
            {espacio.nombre}
          </h1>

          {/* Info del Arrendador / Anfitrión */}
          {arrendador && (
            <div className="flex items-center gap-3 border border-[#FFE082] rounded-2xl p-3 bg-white">
              <div className="w-10 h-10 rounded-full bg-[#FF9800] text-white flex-shrink-0 flex items-center justify-center font-bold text-sm shadow-sm">
                {arrendador.fotoPerfil ? (
                  <img
                    src={arrendador.fotoPerfil}
                    alt={arrendador.nombres}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  `${arrendador.nombres.charAt(0)}${arrendador.apellidos.charAt(0)}`
                )}
              </div>
              <div className="text-xs">
                <p className="font-bold text-gray-800">
                  {arrendador.nombres} {arrendador.apellidos}
                </p>
                <p className="text-gray-500 font-medium">
                  Anfitrión desde {new Date(arrendador.fechaRegistro || "").getFullYear()} | {espacio.totalResenas || 0} reseñas
                </p>
              </div>
            </div>
          )}

          {/* Descripción */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-2">Descripción</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-normal">
              {espacio.descripcion}
            </p>
          </div>

          {/* Ubicación */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-2">Ubicación</h3>
            <div className="flex justify-between items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-600 font-medium flex-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-[#00BFA5] flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  {espacio.direccion}, {espacio.ciudad}
                </span>
              </div>

              {/* Mapa Thumbnail */}
              <div className="w-24 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-122.45%2C37.75%2C-122.39%2C37.79&layer=mapnik&marker=37.77%2C-122.42"
                  style={{ border: 0 }}
                ></iframe>
              </div>
            </div>
          </div>

          {/* Servicios Incluidos */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-3">
              Servicios incluidos
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {espacio.serviciosIncluidos.map((s) => (
                <div
                  key={s.code}
                  className="flex items-center gap-2 bg-[#FFF8E1] px-3 py-2.5 rounded-2xl border border-[#FFE082]/30"
                >
                  <span className="text-sm">
                    {s.code === "wifi"
                      ? "📶"
                      : s.code === "estacionamiento"
                      ? "🅿️"
                      : s.code === "aire_acondicionado"
                      ? "❄️"
                      : "💡"}
                  </span>
                  <span className="text-xs font-semibold text-gray-700 truncate">
                    {s.nombre}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Precios */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-3">Precios</h3>
            <div className="flex gap-3">
              {espacio.precioHora && (
                <div className="flex-1 bg-[#FFF8E1] rounded-2xl p-3 border border-[#FFE082]/30 text-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block">
                    Por hora
                  </span>
                  <span className="text-base font-bold text-[#FF9800]">
                    L. {espacio.precioHora.toFixed(2)}
                  </span>
                </div>
              )}
              {espacio.precioDia && (
                <div className="flex-1 bg-[#FFF8E1] rounded-2xl p-3 border border-[#FFE082]/30 text-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide block">
                    Día completo
                  </span>
                  <span className="text-base font-bold text-[#FF9800]">
                    L. {espacio.precioDia.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Botón Reserva Ahora */}
          <button
            onClick={() => navigate(`/espacios/${espacio.id}/reservar/paso-1`)}
            className="w-full bg-[#FF9800] text-white font-bold py-3.5 rounded-2xl shadow-md shadow-orange-100 hover:bg-[#F57C00] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 mt-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Reserva ahora
          </button>
        </div>
      </div>

        
      <BottomNav/>
    </div>
  );
}
