import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";

export default function InicioPage() {
  const navigate = useNavigate();
  const { espacios } = useApp();
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [codigoPromo, setCodigoPromo] = useState("");

  const categorias = ["Todos", "Oficinas", "Salas", "Escritorios", "Eventos"];

  const espaciosDisponibles = espacios.filter((e) => e.disponible);

  // Filtro por categoría
  const espaciosFiltrados =
    categoriaActiva === "Todos"
      ? espaciosDisponibles
      : espaciosDisponibles.filter((e) => e.categoriaId === "CAT001");

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-white font-sans">
      {/* Header Top Bar */}
      <div className="bg-[#079FA0] px-5 py-3.5 sticky top-0 z-10 shadow-sm flex items-center justify-center">
        <h1 className="text-white font-bold text-lg">Espacio de Trabajo</h1>
      </div>

      <div className="p-5 max-w-md mx-auto">
        {/* Barra de búsqueda estilo amarillo suave */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-[#079FA0]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar espacios..."
            className="w-full bg-[#FFF3C4] border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium text-gray-700 placeholder-[#079FA0]/60 focus:outline-none focus:ring-2 focus:ring-[#079FA0] transition"
          />
        </div>

        {/* Banner Promocional Naranja */}
        <div className="bg-[#F58220] rounded-2xl p-4 mb-6 text-white shadow-md">
          <div className="flex items-start gap-2 mb-2">
            <span className="bg-[#FFCC00] text-gray-900 px-2.5 py-1 rounded-xl text-[10px] font-extrabold tracking-wide uppercase shrink-0">
              PROMOCIÓN
            </span>
            <h2 className="text-sm font-bold leading-tight">
              ¡20% descuento en tu primer reserva!
            </h2>
          </div>

          <p className="text-xs text-white/90 mb-3 font-medium">
            Ingresa el código: WELCOME20
          </p>

          {/* Input de cupón promocional + Botón Aplicar */}
          <div className="flex bg-white rounded-full p-1 pl-4 items-center shadow-inner">
            <input
              type="text"
              placeholder="Ingresa tu código promocional"
              value={codigoPromo}
              onChange={(e) => setCodigoPromo(e.target.value)}
              className="w-full bg-transparent text-xs text-gray-700 placeholder-gray-400 focus:outline-none font-medium"
            />
            <button className="bg-[#FFCC00] text-white px-5 py-2 rounded-full text-xs font-extrabold hover:bg-yellow-400 transition-colors shrink-0">
              Aplicar
            </button>
          </div>
        </div>

        {/* Categorías */}
        <div className="mb-6">
          <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide mb-3">
            CATEGORIAS
          </h3>
          <div className="flex overflow-x-auto gap-2 pb-1 hide-scrollbar">
            {categorias.map((cat) => {
              const isActive = categoriaActiva === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-[#F58220] text-white shadow-sm"
                      : "bg-[#FFF3C4] text-gray-700 hover:bg-yellow-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Espacios Recomendados */}
        <div>
          <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide mb-3">
            ESPACIOS RECOMENDADOS
          </h3>
          <div className="flex flex-col gap-5">
            {espaciosFiltrados.map((espacio) => (
              <button
                key={espacio.id}
                onClick={() => navigate(`/espacios/${espacio.id}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col text-left transition-transform active:scale-[0.99]"
              >
                {/* Imagen Principal */}
                <div className="w-full h-44 bg-gray-100 overflow-hidden">
                  {espacio.imagenes && espacio.imagenes[0] ? (
                    <img
                      src={espacio.imagenes[0].url}
                      alt={espacio.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      Sin imagen
                    </div>
                  )}
                </div>

                {/* Info del Espacio */}
                <div className="p-4">
                  <h4 className="font-bold text-[#079FA0] text-base mb-1">
                    {espacio.nombre}
                  </h4>
                  <p className="text-xs text-gray-500 mb-2 font-medium">
                    {espacio.direccion}, {espacio.ciudad}
                  </p>
                  {espacio.precioHora && (
                    <p className="text-[#F58220] font-extrabold text-sm">
                      ${espacio.precioHora}/hora
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Botón Flotante Q&A (Burbujas) */}
      <div 
        onClick={() => navigate("/faq")}
        className="fixed bottom-16 right-4 cursor-pointer z-40 hover:scale-105 transition-transform opacity-50 hover:opacity-100"
      >
        <svg width="70" height="70" viewBox="0 0 132 132" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.85662 64.6387C5.43199 58.8345 3.99755 51.471 4.09624 44.8176C4.44283 21.4533 22.7303 3.96084 45.9324 4.09797C55.7808 4.11126 65.2875 7.71049 72.6754 14.2229C81.0081 21.4721 86.6464 32.8273 86.6313 43.9197C86.6307 44.391 86.6286 44.8625 86.6233 45.3338C86.4323 50.9526 85.8582 55.237 83.7325 60.5589C83.1296 62.0683 82.3222 63.5577 81.7584 64.9519C79.5019 67.7976 76.2207 72.0206 74.1886 74.996C72.6054 76.3285 71.1516 77.6581 69.4591 78.8524C61.6432 84.3671 54.6036 86.2872 45.2131 86.6485C44.1707 86.6622 43.1284 86.6281 42.0892 86.5467C35.5302 86.034 29.1894 83.958 23.5973 80.4922C22.3629 79.7363 20.9457 78.897 20.0195 77.8002C18.4938 78.3267 4.80267 82.5633 4.27561 82.4424C3.98228 81.7767 8.26 66.9924 8.85662 64.6387Z" fill="#F58B01"/>
            <path d="M44.283 22.7412C48.9514 22.4932 53.581 23.7046 57.5297 26.2073C62.6183 29.454 66.2115 34.5864 67.5211 40.4788C68.9098 46.7352 67.584 52.7134 64.177 58.0633C64.3861 58.238 64.9244 58.7277 65.1067 58.9292C66.8519 60.8585 70.1016 62.9322 70.1189 65.7326C70.1229 66.8882 69.6612 67.9968 68.8381 68.8082C68.0042 69.6576 66.8608 70.1318 65.6704 70.1217C63.0443 70.0769 59.9443 66.129 58.0364 64.1852C57.3461 64.6337 56.5927 65.0583 55.8792 65.4759C53.1342 66.9072 50.1236 67.7572 47.0354 67.9727C41.0289 68.4404 35.0854 66.481 30.5348 62.5329C26.0124 58.6206 23.2246 53.0755 22.7821 47.1121C22.3031 41.0432 24.293 35.0378 28.3012 30.4558C32.5033 25.6578 37.9707 23.1514 44.283 22.7412Z" fill="#FEFEFE"/>
            <path d="M44.9229 30.991C46.9684 30.8781 49.3118 31.3486 51.1804 32.1689C54.6864 33.7003 57.4362 36.5675 58.82 40.1343C60.426 44.2736 59.9471 48.1108 58.1903 52.0661C56.5691 50.3642 54.3368 47.4457 51.9851 47.4468C50.8578 47.4225 49.586 47.8469 48.7868 48.7001C45.3836 52.3337 48.9499 55.1631 51.3334 57.5249L52.0277 58.177C50.0842 59.1049 48.5778 59.5939 46.3989 59.7462C42.5411 60.0187 38.7346 58.7374 35.8269 56.1876C32.9751 53.687 31.2399 50.1511 31.0065 46.3655C30.7287 42.5225 32.0119 38.7299 34.5659 35.8449C37.3932 32.6415 40.7341 31.2461 44.9229 30.991Z" fill="#F58B01"/>
            <path d="M86.6233 45.3337C109.965 45.5713 128.343 63.9263 127.897 87.457C127.76 94.7006 126.228 99.4944 123.163 105.991C123.497 108.028 124.964 112.872 125.565 115.069C126.144 117.179 127.341 122.066 128.064 123.951C123.668 122.104 116.766 120.811 112.23 119.057C111.111 119.894 110.004 120.7 108.826 121.453C90.5659 133.118 66.4076 128.562 53.4748 111.263C49.3293 105.691 46.661 99.1601 45.718 92.2792C45.5509 91.125 45.4171 87.2109 45.2131 86.6485C54.6036 86.2871 61.6432 84.3671 69.459 78.8523C71.1516 77.658 72.6054 76.3285 74.1886 74.996C76.2207 72.0206 79.5019 67.7976 81.7584 64.9519C82.3222 63.5576 83.1296 62.0682 83.7325 60.5589C85.8582 55.237 86.4323 50.9525 86.6233 45.3337Z" fill="#079FA0"/>
            <path d="M81.7584 64.9519C88.4543 62.2928 95.5144 65.2498 98.2161 72.0186C98.9901 73.9579 99.3911 76.2407 99.8548 78.2889L101.941 87.4671L103.986 96.3162C104.829 99.9669 106.732 105.01 102.086 106.904C99.4262 107.988 96.3725 106.335 95.7314 103.54C95.2549 101.463 94.5123 99.0513 94.2953 96.9584L78.9687 96.9563C78.5094 99.7015 77.8669 104.718 75.5929 106.364C74.589 107.098 73.3315 107.396 72.105 107.191C70.7682 106.96 69.716 106.2 68.9438 105.111C67.8364 103.55 68.0094 101.959 68.3979 100.209C70.1015 92.5353 71.9167 84.888 73.6577 77.2224C73.8241 76.4901 73.9789 75.7126 74.1886 74.996C76.2207 72.0206 79.5019 67.7976 81.7584 64.9519Z" fill="#FEFEFE"/>
            <path d="M86.2999 72.2049C88.9465 72.1411 89.1067 74.4094 89.5769 76.4305C90.5234 80.4981 91.3656 84.598 92.3322 88.6602L87.0973 88.6712L80.9728 88.6825C81.373 86.3565 83.7803 74.7715 84.6494 73.2063C84.9756 72.6187 85.6969 72.3801 86.2999 72.2049Z" fill="#079FA0"/>
        </svg>
      </div>
    </div>
  );
}