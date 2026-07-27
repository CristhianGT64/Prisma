import React from "react";

// Contenedor móvil principal – centra la app en 390px simulando un teléfono
export default function MobileShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#E8ECEF] flex justify-center">
            <div
                className="relative w-full max-w-[430px] min-h-screen bg-[#F5F7F9] shadow-2xl flex flex-col overflow-hidden"
                style={{ fontFamily: "'Inter', sans-serif" }}
            >
                {children}
            </div>
        </div>
    );
}
