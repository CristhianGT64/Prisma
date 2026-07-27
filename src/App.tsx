import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AppProvider, useApp } from "./context/AppContext";
import MobileShell from "./components/layout/MobileShell";
import BottomNav from "./components/layout/BottomNav";

// Auth
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import RegistroArrendadorPage from "./pages/auth/RegistroArrendadorPage";
import RegistroPersonaNaturalPage from "./pages/auth/RegistroPersonaNaturalPage";
import RegistroEmpresaPage from "./pages/auth/RegistroEmpresaPage";

// Public
import SplashPage from "./pages/public/SplashPage";
import LandingPage from "./pages/public/LandingPage";
import NosotrosPage from "./pages/public/NosotrosPage";
import ContactoPage from "./pages/public/ContactoPage";
import FaqPage from "./pages/public/FaqPage";
import PoliticasPage from "./pages/public/PoliticasPage";

// Arrendador
import MisEspaciosPage from "./pages/arrendador/MisEspaciosPage";
import AgregarEspacioPage from "./pages/arrendador/AgregarEspacioPage";
import EditarEspacioPage from "./pages/arrendador/EditarEspacioPage";
import ArrendadorReservasPage from "./pages/arrendador/ArrendadorReservasPage";
import HistorialIngresosPage from "./pages/arrendador/HistorialIngresosPage";

// Shared
import PerfilPage from "./pages/shared/PerfilPage";
import EditarPerfilPage from "./pages/shared/EditarPerfilPage";
import InicioPage from "./pages/shared/InicioPage";
import SuscripcionesPage from "./pages/shared/SuscripcionesPage";

// Arrendatario
import EspacioDetallePage from "./pages/arrendatario/EspacioDetallePage";
import ReservaFechaHoraPage from "./pages/arrendatario/ReservaFechaHoraPage";
import ReservaPagoPage from "./pages/arrendatario/ReservaPagoPage";
import ReservaConfirmacionPage from "./pages/arrendatario/ReservaConfirmacionPage";
import MisReservasPage from "./pages/arrendatario/MisReservasPage";
import FavoritosPage from "./pages/arrendatario/FavoritosPage";
import MisTarjetasPage from "./pages/arrendatario/MisTarjetasPage";
import AgregarTarjetaPage from "./pages/arrendatario/AgregarTarjetaPage";
import DejarResenaPage from "./pages/arrendatario/DejarResenaPage";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { usuarioActual, bootstrapping } = useApp();
  if (bootstrapping) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#00BFA5] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }
  if (!usuarioActual) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1 h-full relative">
      <div className="flex-1 overflow-hidden flex flex-col">{children}</div>
      <BottomNav />
    </div>
  );
}

function AppRoutes() {
  const { usuarioActual, bootstrapping } = useApp();

  if (bootstrapping) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#00BFA5] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Cargando Prisma...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          usuarioActual ? (
            usuarioActual.rol === "arrendador" ? (
              <Navigate to="/inicio" replace />
            ) : (
              <Navigate to="/inicio" replace />
            )
          ) : (
            <SplashPage />
          )
        }
      />

      {/* Públicas */}
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/nosotros" element={<NosotrosPage />} />
      <Route path="/contacto" element={<ContactoPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/politicas" element={<PoliticasPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/arrendador" element={<RegistroArrendadorPage />} />
      <Route path="/register/arrendador/persona-natural" element={<RegistroPersonaNaturalPage />} />
      <Route path="/register/arrendador/empresa" element={<RegistroEmpresaPage />} />

      {/* Arrendador */}
      <Route
        path="/arrendador/espacios"
        element={
          <AuthGuard>
            <AppLayout>
              <MisEspaciosPage />
            </AppLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/arrendador/espacios/nuevo"
        element={
          <AuthGuard>
            <AgregarEspacioPage />
          </AuthGuard>
        }
      />
      <Route
        path="/arrendador/espacios/:id/editar"
        element={
          <AuthGuard>
            <EditarEspacioPage />
          </AuthGuard>
        }
      />
      <Route
        path="/arrendador/reservas"
        element={
          <AuthGuard>
            <AppLayout>
              <ArrendadorReservasPage />
            </AppLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/arrendador/ingresos"
        element={
          <AuthGuard>
            <AppLayout>
              <HistorialIngresosPage />
            </AppLayout>
          </AuthGuard>
        }
      />

      {/* Shared */}
      <Route
        path="/inicio"
        element={
          <AuthGuard>
            <AppLayout>
              <InicioPage />
            </AppLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/perfil"
        element={
          <AuthGuard>
            <AppLayout>
              <PerfilPage />
            </AppLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/perfil/editar"
        element={
          <AuthGuard>
            <EditarPerfilPage />
          </AuthGuard>
        }
      />
      <Route
        path="/perfil/tarjetas"
        element={
          <AuthGuard>
            <AppLayout>
              <MisTarjetasPage />
            </AppLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/perfil/tarjetas/nueva"
        element={
          <AuthGuard>
            <AppLayout>
              <AgregarTarjetaPage />
            </AppLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/perfil/suscripciones"
        element={
          <AuthGuard>
            <AppLayout>
              <SuscripcionesPage />
            </AppLayout>
          </AuthGuard>
        }
      />

      {/* Detalle y Reserva */}
      <Route
        path="/espacios/:id"
        element={
          <AuthGuard>
            <EspacioDetallePage />
          </AuthGuard>
        }
      />
      <Route
        path="/espacios/:id/reservar/paso-1"
        element={
          <AuthGuard>
            <ReservaFechaHoraPage />
          </AuthGuard>
        }
      />
      <Route
        path="/espacios/:id/reservar/paso-2"
        element={
          <AuthGuard>
            <ReservaPagoPage />
          </AuthGuard>
        }
      />
      <Route
        path="/reservas/:id/resena"
        element={
          <AuthGuard>
            <DejarResenaPage />
          </AuthGuard>
        }
      />
      <Route
        path="/reservas/:id/confirmacion"
        element={
          <AuthGuard>
            <AppLayout>
              <ReservaConfirmacionPage />
            </AppLayout>
          </AuthGuard>
        }
      />

      {/* Arrendatario tabs */}
      <Route
        path="/buscar"
        element={
          <AuthGuard>
            <AppLayout>
              <InicioPage />
            </AppLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/reservas"
        element={
          <AuthGuard>
            <AppLayout>
              <MisReservasPage />
            </AppLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/favoritos"
        element={
          <AuthGuard>
            <AppLayout>
              <FavoritosPage />
            </AppLayout>
          </AuthGuard>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <MobileShell>
          <AppRoutes />
        </MobileShell>
      </BrowserRouter>
    </AppProvider>
  );
}