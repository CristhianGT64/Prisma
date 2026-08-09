import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../../api/client";
import { useApp } from "../../context/AppContext";

export default function PerfilPage() {
  const navigate = useNavigate();
  const { usuarioActual, logout } = useApp();
  const [notificaciones, setNotificaciones] = useState(true);
  const [ofertas, setOfertas] = useState(true);
  const [newsletter, setNewsletter] = useState(true);
  const [saving, setSaving] = useState(false);

  const isArrendador = usuarioActual?.rol === "arrendador";
  const accent = isArrendador ? "#FF9800" : "#079FA0";

  useEffect(() => {
    if (!usuarioActual) return;
    api<{ notificaciones: number | boolean; ofertas: number | boolean; newsletter: number | boolean }>(
      "/preferencias"
    )
      .then((p) => {
        setNotificaciones(Boolean(p.notificaciones));
        setOfertas(Boolean(p.ofertas));
        setNewsletter(Boolean(p.newsletter));
      })
      .catch(() => {});
  }, [usuarioActual]);

  if (!usuarioActual) {
    navigate("/login");
    return null;
  }

  const iniciales = `${usuarioActual.nombres?.charAt(0) ?? ""}${usuarioActual.apellidos?.charAt(0) ?? ""}`.toUpperCase();

  const tabs = [
    { label: "Perfil", action: () => navigate("/perfil/editar") },
    {
      label: isArrendador ? "Historial de ingresos" : "Métodos de Pago",
      action: () => navigate(isArrendador ? "/arrendador/ingresos" : "/perfil/tarjetas"),
    },
    { label: "Suscripciones", action: () => navigate("/perfil/suscripciones") },
    { label: "Políticas", action: () => navigate("/politicas") },
    { label: "FAQ", action: () => navigate("/faq") },
  ];

  const savePref = async (next: {
    notificaciones: boolean;
    ofertas: boolean;
    newsletter: boolean;
  }) => {
    setSaving(true);
    try {
      await api("/preferencias", {
        method: "PUT",
        body: JSON.stringify(next),
      });
    } catch {
      // silencioso
    } finally {
      setSaving(false);
    }
  };

  const toggles = [
    {
      label: "Notificaciones",
      value: notificaciones,
      set: (v: boolean) => {
        setNotificaciones(v);
        void savePref({ notificaciones: v, ofertas, newsletter });
      },
    },
    {
      label: "Ofertas especiales",
      value: ofertas,
      set: (v: boolean) => {
        setOfertas(v);
        void savePref({ notificaciones, ofertas: v, newsletter });
      },
    },
    {
      label: "Newsletter",
      value: newsletter,
      set: (v: boolean) => {
        setNewsletter(v);
        void savePref({ notificaciones, ofertas, newsletter: v });
      },
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/landing");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white pb-24">
      <div className="px-5 py-4 flex items-center justify-center sticky top-0 z-10 shadow-sm" style={{ backgroundColor: accent }}>
        <h1 className="text-white font-bold text-lg">Mi perfil</h1>
      </div>

      <div className="flex flex-col items-center px-5 py-6">
        <p className="text-xs text-gray-500 mb-5">Personaliza tu experiencia en Prisma</p>

        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-md" style={{ backgroundColor: isArrendador ? "#00BFA5" : "#FF9800" }}>
          <span className="text-white text-3xl font-extrabold">{iniciales}</span>
        </div>

        <h2 className="font-extrabold text-gray-800 text-lg">
          {usuarioActual.nombres} {usuarioActual.apellidos}
        </h2>
        <p className="text-xs text-gray-500 mb-1">{usuarioActual.correo}</p>
        <p className="text-[10px] font-bold uppercase tracking-wide mb-6" style={{ color: accent }}>
          {isArrendador ? "Arrendador" : "Arrendatario"}
          {saving ? " · Guardando..." : ""}
        </p>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-6 w-full">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={tab.action}
              className="text-xs font-bold text-gray-700 hover:opacity-80 transition-colors py-1"
              style={{ color: undefined }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = accent)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "")}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full flex flex-col gap-4 mb-8">
          {toggles.map((toggle, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{toggle.label}</span>
              <button
                onClick={() => toggle.set(!toggle.value)}
                className="w-11 h-6 rounded-full relative transition-colors duration-200"
                style={{ backgroundColor: toggle.value ? accent : "#D1D5DB" }}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform duration-200 ${
                    toggle.value ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleLogout}
          className="w-full text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98]"
          style={{ backgroundColor: isArrendador ? "#00BFA5" : "#FF9800" }}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}