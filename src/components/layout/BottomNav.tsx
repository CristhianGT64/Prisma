import { useNavigate, useLocation } from "react-router";
import { useApp } from "../../context/AppContext";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

/* Iconos en formato de línea (stroke) como en las imágenes */
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 stroke-[2.2]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 stroke-[2.2]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 stroke-[2.2]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 stroke-[2.2]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 stroke-[2.2]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SpacesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 stroke-[2.2]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4z" />
  </svg>
);

const IncomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 stroke-[2.2]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuarioActual } = useApp();
  
  const isArrendador = usuarioActual?.rol === "arrendador";

  // Colores dinámicos según el rol:
  // Fondo: Turquesa para Arrendatario / Naranja para Arrendador
  const navBg = isArrendador ? "bg-[#F58220]" : "bg-[#079FA0]";
  
  // Colores del ítem: Amarillo (#FFCC00) para el activo / Blanco para inactivos
  const activeColor = "text-[#FFCC00]";
  const inactiveColor = "text-white opacity-90 hover:opacity-100";

  const navItemsArrendador: NavItem[] = [
    { label: "Inicio", icon: <HomeIcon />, path: "/inicio" },
    { label: "Mis espacios", icon: <SpacesIcon />, path: "/arrendador/espacios" },
    { label: "Reservas", icon: <CalendarIcon />, path: "/arrendador/reservas" },
    { label: "Ingresos", icon: <IncomeIcon />, path: "/arrendador/ingresos" },
    { label: "Perfil", icon: <UserIcon />, path: "/perfil" },
  ];

  const navItemsArrendatario: NavItem[] = [
    { label: "Inicio", icon: <HomeIcon />, path: "/inicio" },
    { label: "Buscar", icon: <SearchIcon />, path: "/buscar" },
    { label: "Reservas", icon: <CalendarIcon />, path: "/reservas" },
    { label: "Favoritos", icon: <HeartIcon />, path: "/favoritos" },
    { label: "Perfil", icon: <UserIcon />, path: "/perfil" },
  ];

  const items = isArrendador ? navItemsArrendador : navItemsArrendatario;

  return (
    <nav className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] ${navBg} z-50 shadow-lg py-1.5`}>
      <div className="flex items-center justify-around px-2">
        {items.map((item) => {
          const isActive =
            location.pathname === item.path || location.pathname.startsWith(item.path + "/");
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 ${
                isActive ? activeColor : inactiveColor
              }`}
            >
              <span className={`transition-transform duration-200 ${isActive ? "scale-105" : ""}`}>
                {item.icon}
              </span>
              <span className="text-[11px] font-bold tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}