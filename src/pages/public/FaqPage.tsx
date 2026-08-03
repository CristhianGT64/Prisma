import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
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
  const navigate = useNavigate();

  useEffect(() => {
    api<Faq[]>("/faqs")
      .then(setFaqs)
      .catch(() => setFaqs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-white min-h-screen font-sans flex flex-col justify-between">
      <div>
        {/* Header Top Bar */}
        <div className="bg-[#079FA0] px-6 py-3.5 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-white font-bold text-lg">Preguntas frecuentes</h1>
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
          {/* Ilustración / Imagen de FAQ central */}
          <div className="flex justify-center my-4">
            <svg width="132" height="132" viewBox="0 0 132 132" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.85662 64.6387C5.43199 58.8345 3.99755 51.471 4.09624 44.8176C4.44283 21.4533 22.7303 3.96084 45.9324 4.09797C55.7808 4.11126 65.2875 7.71049 72.6754 14.2229C81.0081 21.4721 86.6464 32.8273 86.6313 43.9197C86.6307 44.391 86.6286 44.8625 86.6233 45.3338C86.4323 50.9526 85.8582 55.237 83.7325 60.5589C83.1296 62.0683 82.3222 63.5577 81.7584 64.9519C79.5019 67.7976 76.2207 72.0206 74.1886 74.996C72.6054 76.3285 71.1516 77.6581 69.4591 78.8524C61.6432 84.3671 54.6036 86.2872 45.2131 86.6485C44.1707 86.6622 43.1284 86.6281 42.0892 86.5467C35.5302 86.034 29.1894 83.958 23.5973 80.4922C22.3629 79.7363 20.9457 78.897 20.0195 77.8002C18.4938 78.3267 4.80267 82.5633 4.27561 82.4424C3.98228 81.7767 8.26 66.9924 8.85662 64.6387Z" fill="#F58B01"/>
              <path d="M44.283 22.7412C48.9514 22.4932 53.581 23.7046 57.5297 26.2073C62.6183 29.454 66.2115 34.5864 67.5211 40.4788C68.9098 46.7352 67.584 52.7134 64.177 58.0633C64.3861 58.238 64.9244 58.7277 65.1067 58.9292C66.8519 60.8585 70.1016 62.9322 70.1189 65.7326C70.1229 66.8882 69.6612 67.9968 68.8381 68.8082C68.0042 69.6576 66.8608 70.1318 65.6704 70.1217C63.0443 70.0769 59.9443 66.129 58.0364 64.1852C57.3461 64.6337 56.5927 65.0583 55.8792 65.4759C53.1342 66.9072 50.1236 67.7572 47.0354 67.9727C41.0289 68.4404 35.0854 66.481 30.5348 62.5329C26.0124 58.6206 23.2246 53.0755 22.7821 47.1121C22.3031 41.0432 24.293 35.0378 28.3012 30.4558C32.5033 25.6578 37.9707 23.1514 44.283 22.7412Z" fill="#FEFEFE"/>
              <path d="M44.9229 30.991C46.9684 30.8781 49.3118 31.3486 51.1804 32.1689C54.6864 33.7003 57.4362 36.5675 58.82 40.1343C60.426 44.2736 59.9471 48.1108 58.1903 52.0661C56.5691 50.3642 54.3368 47.4457 51.9851 47.4468C50.8578 47.4225 49.586 47.8469 48.7868 48.7001C45.3836 52.3337 48.9499 55.1631 51.3334 57.5249L52.0277 58.177C50.0842 59.1049 48.5778 59.5939 46.3989 59.7462C42.5411 60.0187 38.7346 58.7374 35.8269 56.1876C32.9751 53.687 31.2399 50.1511 31.0065 46.3655C30.7287 42.5225 32.0119 38.7299 34.5659 35.8449C37.3932 32.6415 40.7341 31.2461 44.9229 30.991Z" fill="#F58B01"/>
              <path d="M86.6233 45.3337C109.965 45.5713 128.343 63.9263 127.897 87.457C127.76 94.7006 126.228 99.4944 123.163 105.991C123.497 108.028 124.964 112.872 125.565 115.069C126.144 117.179 127.341 122.066 128.064 123.951C123.668 122.104 116.766 120.811 112.23 119.057C111.111 119.894 110.004 120.7 108.826 121.453C90.5659 133.118 66.4076 128.562 53.4748 111.263C49.3293 105.691 46.661 99.1601 45.718 92.2792C45.5509 91.125 45.4171 87.2109 45.2131 86.6485C54.6036 86.2871 61.6432 84.3671 69.459 78.8523C71.1516 77.658 72.6054 76.3285 74.1886 74.996C76.2207 72.0206 79.5019 67.7976 81.7584 64.9519C82.3222 63.5576 83.1296 62.0682 83.7325 60.5589C85.8582 55.237 86.4323 50.9525 86.6233 45.3337Z" fill="#079FA0"/>
              <path d="M81.7584 64.9519C88.4543 62.2928 95.5144 65.2498 98.2161 72.0186C98.9901 73.9579 99.3911 76.2407 99.8548 78.2889L101.941 87.4671L103.986 96.3162C104.829 99.9669 106.732 105.01 102.086 106.904C99.4262 107.988 96.3725 106.335 95.7314 103.54C95.2549 101.463 94.5123 99.0513 94.2953 96.9584L78.9687 96.9563C78.5094 99.7015 77.8669 104.718 75.5929 106.364C74.589 107.098 73.3315 107.396 72.105 107.191C70.7682 106.96 69.716 106.2 68.9438 105.111C67.8364 103.55 68.0094 101.959 68.3979 100.209C70.1015 92.5353 71.9167 84.888 73.6577 77.2224C73.8241 76.4901 73.9789 75.7126 74.1886 74.996C76.2207 72.0206 79.5019 67.7976 81.7584 64.9519Z" fill="#FEFEFE"/>
              <path d="M86.2999 72.2049C88.9465 72.1411 89.1067 74.4094 89.5769 76.4305C90.5234 80.4981 91.3656 84.598 92.3322 88.6602L87.0973 88.6712L80.9728 88.6825C81.373 86.3565 83.7803 74.7715 84.6494 73.2063C84.9756 72.6187 85.6969 72.3801 86.2999 72.2049Z" fill="#079FA0"/>
            </svg>
          </div>

          {/* Estado de Carga y Vacío */}
          {loading && (
            <p className="text-sm text-gray-400 text-center py-8">Cargando...</p>
          )}
          {!loading && faqs.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-8">No hay preguntas disponibles</p>
          )}

          {/* Lista de Preguntas Desplegables */}
          <div className="space-y-4 my-4">
            {faqs.map((f) => {
              const isOpen = open === f.id;
              return (
                <div key={f.id} className="flex flex-col">
                  {/* Botón de la Pregunta */}
                  <button
                    onClick={() => setOpen(isOpen ? null : f.id)}
                    className="text-left font-extrabold text-gray-900 text-base mb-2 hover:text-[#079FA0] transition-colors flex justify-between items-center"
                  >
                    <span>{f.pregunta}</span>
                    <span className="text-gray-400 text-xs ml-2">
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {/* Tarjeta Desplegable con Respuesta */}
                  {isOpen && (
                    <div className="bg-[#FFF3C4] border border-[#FDE68A] rounded-2xl p-4 shadow-sm transition-all duration-200">
                      <p className="text-gray-800 text-sm leading-relaxed font-normal">
                        {f.respuesta}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
