import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Usuario } from "../interfaces/Usuario";
import type { Espacio } from "../interfaces/Espacio";
import type { Favorito } from "../interfaces/Favorito";
import type { Reserva } from "../interfaces/Reserva";
import { api, getToken, setToken } from "../api/client";

export interface Tarjeta {
  id: string;
  last4: string;
  nombre: string;
  tipo: string;
}

export interface ReservaEnCurso {
  espacioId: string;
  fechaInicio: string;
  fechaFin: string;
  horaInicio: string;
  horaFin: string;
  cantidadPersonas: number;
  precioTotal: number;
  codigoDescuento?: string;
  descuento?: number;
}

interface AppContextType {
  bootstrapping: boolean;
  usuarioActual: Usuario | null;
  login: (correo: string, password: string) => Promise<boolean>;
  logout: () => void;
  registrar: (usuario: Omit<Usuario, "id" | "fechaRegistro">) => Promise<boolean>;
  actualizarPerfil: (datos: Partial<Usuario>) => Promise<void>;

  espacios: Espacio[];
  refreshEspacios: () => Promise<void>;
  agregarEspacio: (espacio: Omit<Espacio, "id" | "fechaCreacion">) => Promise<void>;
  actualizarEspacio: (id: string, datos: Partial<Espacio>) => Promise<void>;
  eliminarEspacio: (id: string) => Promise<void>;
  obtenerEspaciosPorArrendador: (arrendadorId: string) => Espacio[];

  favoritos: Favorito[];
  toggleFavorito: (espacioId: string) => Promise<void>;
  esFavorito: (espacioId: string) => boolean;

  reservas: Reserva[];
  refreshReservas: () => Promise<void>;
  agregarReserva: (reserva: Omit<Reserva, "id" | "fechaCreacion">) => Promise<string>;
  cancelarReserva: (id: string) => Promise<void>;
  guardarResena: (
    reservaId: string,
    data: { calificacion: number; comentario: string; tiposEtiquetas: string[] }
  ) => Promise<void>;

  reservaEnCurso: ReservaEnCurso | null;
  setReservaEnCurso: (r: ReservaEnCurso | null) => void;

  ultimaReservaId: string | null;
  setUltimaReservaId: (id: string | null) => void;

  usuarios: Usuario[];

  codigoDescuentoActivo: string | null;
  setCodigoDescuentoActivo: (c: string | null) => void;

  tarjetas: Tarjeta[];
  refreshTarjetas: () => Promise<void>;
  agregarTarjeta: (tarjeta: Omit<Tarjeta, "id">) => Promise<void>;
  eliminarTarjeta: (id: string) => Promise<void>;
  tarjetaSeleccionada: string | null;
  setTarjetaSeleccionada: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const CODIGOS_DESCUENTO: Record<string, number> = {
  AGOSTO2025: 0.3,
  PROMO10: 0.1,
  PRISMA20: 0.2,
};

export const validarCodigoDescuento = (codigo: string): number | null => {
  return CODIGOS_DESCUENTO[codigo.toUpperCase()] ?? null;
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [bootstrapping, setBootstrapping] = useState(true);
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [reservaEnCurso, setReservaEnCurso] = useState<ReservaEnCurso | null>(null);
  const [ultimaReservaId, setUltimaReservaId] = useState<string | null>(null);
  const [codigoDescuentoActivo, setCodigoDescuentoActivo] = useState<string | null>(null);
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState<string | null>(null);

  const refreshEspacios = useCallback(async () => {
    try {
      const data = await api<Espacio[]>("/espacios");
      setEspacios(data);
    } catch (e) {
      console.error("refreshEspacios", e);
    }
  }, []);

  const refreshFavoritos = useCallback(async () => {
    try {
      const data = await api<Favorito[]>("/favoritos");
      setFavoritos(data);
    } catch {
      setFavoritos([]);
    }
  }, []);

  const refreshReservas = useCallback(async () => {
    try {
      const data = await api<Reserva[]>("/reservas");
      setReservas(data);
    } catch {
      setReservas([]);
    }
  }, []);

  const refreshTarjetas = useCallback(async () => {
    try {
      const data = await api<Tarjeta[]>("/tarjetas");
      setTarjetas(data);
      setTarjetaSeleccionada((prev) => {
        if (prev && data.some((t) => t.id === prev)) return prev;
        return data[0]?.id ?? null;
      });
    } catch {
      setTarjetas([]);
    }
  }, []);

  const loadSessionData = useCallback(async () => {
    await Promise.all([
      refreshEspacios(),
      refreshFavoritos(),
      refreshReservas(),
      refreshTarjetas(),
    ]);
  }, [refreshEspacios, refreshFavoritos, refreshReservas, refreshTarjetas]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await refreshEspacios();
        const token = getToken();
        if (token) {
          const me = await api<{ usuario: Usuario }>("/auth/me");
          if (!cancelled) {
            setUsuarioActual(me.usuario);
            setUsuarios([me.usuario]);
            await loadSessionData();
          }
        }
      } catch {
        setToken(null);
        if (!cancelled) setUsuarioActual(null);
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadSessionData, refreshEspacios]);

  const login = async (correo: string, password: string): Promise<boolean> => {
    try {
      const data = await api<{ token: string; usuario: Usuario }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ correo, password }),
      });
      setToken(data.token);
      setUsuarioActual(data.usuario);
      setUsuarios([data.usuario]);
      await loadSessionData();
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUsuarioActual(null);
    setFavoritos([]);
    setReservas([]);
    setTarjetas([]);
    setReservaEnCurso(null);
    setUltimaReservaId(null);
    setTarjetaSeleccionada(null);
    void refreshEspacios();
  };

  const registrar = async (
    datos: Omit<Usuario, "id" | "fechaRegistro">
  ): Promise<boolean> => {
    try {
      const data = await api<{ token: string; usuario: Usuario }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(datos),
      });
      setToken(data.token);
      setUsuarioActual(data.usuario);
      setUsuarios([data.usuario]);
      await loadSessionData();
      return true;
    } catch {
      return false;
    }
  };

  const actualizarPerfil = async (datos: Partial<Usuario>) => {
    const data = await api<{ usuario: Usuario }>("/auth/perfil", {
      method: "PUT",
      body: JSON.stringify(datos),
    });
    setUsuarioActual(data.usuario);
    setUsuarios((prev) => {
      const others = prev.filter((u) => u.id !== data.usuario.id);
      return [...others, data.usuario];
    });
  };

  const agregarEspacio = async (espacio: Omit<Espacio, "id" | "fechaCreacion">) => {
    const created = await api<Espacio>("/espacios", {
      method: "POST",
      body: JSON.stringify(espacio),
    });
    setEspacios((prev) => [created, ...prev]);
  };

  const actualizarEspacio = async (id: string, datos: Partial<Espacio>) => {
    const updated = await api<Espacio>(`/espacios/${id}`, {
      method: "PUT",
      body: JSON.stringify(datos),
    });
    setEspacios((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  const eliminarEspacio = async (id: string) => {
    await api(`/espacios/${id}`, { method: "DELETE" });
    setEspacios((prev) => prev.filter((e) => e.id !== id));
  };

  const obtenerEspaciosPorArrendador = (arrendadorId: string) =>
    espacios.filter((e) => e.arrendadorId === arrendadorId);

  const toggleFavorito = async (espacioId: string) => {
    const res = await api<{ favorito: boolean; id?: string }>("/favoritos/toggle", {
      method: "POST",
      body: JSON.stringify({ espacioId }),
    });
    if (res.favorito) {
      await refreshFavoritos();
    } else {
      setFavoritos((prev) => prev.filter((f) => f.espacioId !== espacioId));
    }
  };

  const esFavorito = (espacioId: string): boolean => {
    if (!usuarioActual) return false;
    return favoritos.some(
      (f) => f.usuarioId === usuarioActual.id && f.espacioId === espacioId
    );
  };

  const agregarReserva = async (
    reserva: Omit<Reserva, "id" | "fechaCreacion">
  ): Promise<string> => {
    const created = await api<Reserva>("/reservas", {
      method: "POST",
      body: JSON.stringify(reserva),
    });
    setReservas((prev) => [created, ...prev]);
    return created.id;
  };

  const cancelarReserva = async (id: string) => {
    const updated = await api<Reserva>(`/reservas/${id}/cancelar`, { method: "PATCH" });
    setReservas((prev) => prev.map((r) => (r.id === id ? updated : r)));
  };

  const guardarResena = async (
    reservaId: string,
    data: { calificacion: number; comentario: string; tiposEtiquetas: string[] }
  ) => {
    await api(`/reservas/${reservaId}/resena`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    setReservas((prev) =>
      prev.map((r) => (r.id === reservaId ? { ...r, resenaDejada: true } : r))
    );
    await refreshEspacios();
  };

  const agregarTarjeta = async (tarjeta: Omit<Tarjeta, "id">) => {
    const created = await api<Tarjeta>("/tarjetas", {
      method: "POST",
      body: JSON.stringify(tarjeta),
    });
    setTarjetas((prev) => [...prev, created]);
    setTarjetaSeleccionada(created.id);
  };

  const eliminarTarjeta = async (id: string) => {
    await api(`/tarjetas/${id}`, { method: "DELETE" });
    setTarjetas((prev) => prev.filter((t) => t.id !== id));
    if (tarjetaSeleccionada === id) {
      setTarjetaSeleccionada(null);
    }
  };

  return (
    <AppContext.Provider
      value={{
        bootstrapping,
        usuarioActual,
        login,
        logout,
        registrar,
        actualizarPerfil,
        espacios,
        refreshEspacios,
        agregarEspacio,
        actualizarEspacio,
        eliminarEspacio,
        obtenerEspaciosPorArrendador,
        favoritos,
        toggleFavorito,
        esFavorito,
        reservas,
        refreshReservas,
        agregarReserva,
        cancelarReserva,
        guardarResena,
        reservaEnCurso,
        setReservaEnCurso,
        ultimaReservaId,
        setUltimaReservaId,
        usuarios,
        codigoDescuentoActivo,
        setCodigoDescuentoActivo,
        tarjetas,
        refreshTarjetas,
        agregarTarjeta,
        eliminarTarjeta,
        tarjetaSeleccionada,
        setTarjetaSeleccionada,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
