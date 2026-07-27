import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../../api/client";
import { useApp } from "../../context/AppContext";

interface Faq {
  id: string;
  pregunta: string;
  respuesta: string;
}

interface Categoria {
  id: string;
  nombre: string;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { usuarioActual, espacios } = useApp();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useEffect(() => {
    if (usuarioActual) {
      navigate(usuarioActual.rol === "arrendador" ? "/arrendador/espacios" : "/inicio", { replace: true });
    }
  }, [usuarioActual, navigate]);

  useEffect(() => {
    api<Faq[]>("/faqs").then((d) => setFaqs(d.slice(0, 4))).catch(() => {});
    api<Categoria[]>("/categorias").then(setCategorias).catch(() => {});
  }, []);

  const destacados = espacios.filter((e) => e.disponible).slice(0, 3);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(busqueda.trim() ? `/login?next=/inicio&q=${encodeURIComponent(busqueda.trim())}` : "/login");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <header className="bg-[#00BFA5] px-5 pt-10 pb-8 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full" />
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white font-extrabold text-lg">P</span>
            </div>
            <span className="text-white font-extrabold text-xl">Prisma</span>
          </div>
          <div className="flex gap-2">
            <Link to="/login" className="text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/40 hover:bg-white/10">
              Entrar
            </Link>
            <Link to="/register" className="bg-white text-[#00897B] text-xs font-bold px-3 py-1.5 rounded-full">
              Registro
            </Link>
          </div>
        </div>
        <div className="relative z-10">
          <h1 className="text-white text-2xl font-extrabold leading-tight mb-2">
            Encuentra tu espacio de trabajo ideal
          </h1>
          <p className="text-white/85 text-sm mb-5">
            Oficinas, salas y escritorios en Honduras. Reserva en minutos.
          </p>
          <form onSubmit={handleBuscar} className="relative">
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por ciudad o espacio..."
              className="w-full rounded-2xl py-3.5 pl-4 pr-12 text-sm font-medium bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FF9800]"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#FF9800] rounded-xl flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      </header>

      <section className="px-5 py-6">
        <h2 className="text-xs font-extrabold text-gray-800 uppercase tracking-widest mb-3">Categorías</h2>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(categorias.length ? categorias : [{ id: "1", nombre: "Oficina" }, { id: "2", nombre: "Salas" }, { id: "3", nombre: "Escritorios" }]).map((c) => (
            <span key={c.id} className="shrink-0 px-4 py-2 rounded-full bg-[#E0F7F4] text-[#00897B] text-xs font-bold">
              {c.nombre}
            </span>
          ))}
        </div>
      </section>

      <section className="px-5 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-extrabold text-gray-800 uppercase tracking-widest">Espacios destacados</h2>
          <Link to="/login" className="text-[11px] font-bold text-[#00BFA5]">Ver todos</Link>
        </div>
        <div className="flex flex-col gap-4">
          {destacados.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">Explora espacios al iniciar sesión</p>
          )}
          {destacados.map((e) => (
            <button
              key={e.id}
              onClick={() => navigate("/login")}
              className="text-left rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
            >
              <div className="h-36 bg-gray-100">
                {e.imagenes?.[0]?.url && <img src={e.imagenes[0].url} alt={e.nombre} className="w-full h-full object-cover" />}
              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm text-gray-800">{e.nombre}</h3>
                <p className="text-[11px] text-gray-500">{e.ciudad}</p>
                {e.precioHora != null && (
                  <p className="text-xs font-extrabold text-[#FF9800] mt-1">Desde L. {e.precioHora}/hora</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="px-5 pb-6 bg-[#F5F7F9] py-6">
        <h2 className="text-xs font-extrabold text-gray-800 uppercase tracking-widest mb-3">¿Por qué Prisma?</h2>
        <div className="grid grid-cols-1 gap-3">
          {[
            { t: "Reserva flexible", d: "Por hora o por día, según tu agenda." },
            { t: "Pagos seguros", d: "Gestiona tarjetas y confirma al instante." },
            { t: "Para anfitriones", d: "Publica espacios y controla tus ingresos." },
          ].map((item) => (
            <div key={item.t} className="bg-white rounded-2xl p-4 border border-gray-100">
              <h3 className="font-bold text-sm text-[#00897B] mb-1">{item.t}</h3>
              <p className="text-xs text-gray-500">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-extrabold text-gray-800 uppercase tracking-widest">Preguntas frecuentes</h2>
          <Link to="/faq" className="text-[11px] font-bold text-[#00BFA5]">Ver más</Link>
        </div>
        <div className="flex flex-col gap-2">
          {faqs.map((f) => (
            <button
              key={f.id}
              onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
              className="text-left bg-white border border-gray-100 rounded-xl p-3"
            >
              <div className="flex justify-between gap-2">
                <span className="text-xs font-bold text-gray-800">{f.pregunta}</span>
                <span className="text-[#00BFA5] font-bold">{openFaq === f.id ? "−" : "+"}</span>
              </div>
              {openFaq === f.id && <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">{f.respuesta}</p>}
            </button>
          ))}
        </div>
      </section>

      <footer className="bg-[#0F766E] text-white px-5 py-8">
        <p className="font-extrabold text-lg mb-3">Prisma</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/85 mb-5">
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/contacto">Contacto</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/politicas">Políticas</Link>
          <Link to="/login">Iniciar sesión</Link>
        </div>
        <p className="text-[10px] text-white/60">© {new Date().getFullYear()} Prisma · Honduras</p>
      </footer>
    </div>
  );
}
