import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registrar } = useApp();

  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    password: "",
    confirmarPassword: "",
    rol: "arrendatario" as "arrendador" | "arrendatario",
    usuarios: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmarPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    const { confirmarPassword, ...datos } = form;
    const success = await registrar({ ...datos, fotoPerfil: undefined });
    setLoading(false);

    if (success) {
      if (form.rol === "arrendador") navigate("/arrendador/espacios");
      else navigate("/inicio");
    } else {
      setError("Ya existe una cuenta con ese correo");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white min-h-screen flex flex-col justify-between font-sans">
      
      {/* Header Turquesa */}
      <div className="bg-[#009B9E] text-white px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="font-bold text-xl tracking-wide">Registro de Usuario</h1>
        <button onClick={() => navigate(-1)} className="text-white hover:opacity-80 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>

      <div className="px-6 py-6 flex-1 max-w-md mx-auto w-full flex flex-col justify-center">
        
        {/* Avatar Placeholder */}
        <div className="flex justify-center mb-4">
          <div className="w-28 h-28 rounded-full bg-[#FDE2D1] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-[#F58B01]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Título de la sección */}
        <h2 className="text-center text-[#1E293B] font-bold text-xl mb-6">
          Regístrate para encontrar tu espacio
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-sm mb-4 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Toggle de Selección de Tipo de Cuenta */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Tipo de cuenta
            </label>
            <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, rol: "arrendatario" }))}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  form.rol === "arrendatario"
                    ? "bg-[#009B9E] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Arrendatario
              </button>
                <button
                type="button"
                onClick={() => {
                    setForm((p) => ({ ...p, rol: "arrendador" }));
                    navigate("/register/arrendador");
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                    form.rol === "arrendador"
                    ? "bg-[#009B9E] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                >
                Arrendador
                </button>
            </div>
          </div>

          {/* Nombre Completo */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Nombre Completo
            </label>
            <input
              type="text"
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
              placeholder="Ingrese su nombre"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#009B9E] transition"
            />
          </div>

          {/* Correo electrónico */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Correo electrónico
            </label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#009B9E] transition"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="+504 1234-9876"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#009B9E] transition"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="∗ ∗ ∗ ∗ ∗ ∗ ∗ ∗"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#009B9E] transition"
            />
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="confirmarPassword"
              value={form.confirmarPassword}
              onChange={handleChange}
              placeholder="∗ ∗ ∗ ∗ ∗ ∗ ∗ ∗"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#009B9E] transition"
            />
          </div>

          {/* Botón Registrase */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F58B01] hover:bg-[#e07e00] text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-sm disabled:opacity-60 mt-4"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
      </div>

      {/* Footer Turquesa decorativo */}
      <div className="bg-[#009B9E] h-10 w-full mt-6" />
    </div>
  );
}
