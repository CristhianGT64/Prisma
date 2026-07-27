import type { ServicioIncluido } from "../../interfaces/ServiciosIncluidos";

const serviceIcons: Record<string, string> = {
    wifi: "📶",
    estacionamiento: "🚗",
    aire_acondicionado: "❄️",
    escritorios: "🖥️",
    sala_reunion: "🏛️",
    cocina: "🍳",
    seguridad: "🔒",
    cafe: "☕",
    impresora: "🖨️",
    pizarra: "📋",
};

interface Props {
    servicio: ServicioIncluido;
    variant?: "default" | "selected" | "selectable";
    selected?: boolean;
    onClick?: () => void;
}

export default function ServicioTag({ servicio, variant = "default", selected, onClick }: Props) {
    const isSelectable = variant === "selectable";
    const isSelected = selected ?? variant === "selected";

    return (
        <button
            type={isSelectable ? "button" : undefined}
            onClick={onClick}
            disabled={!isSelectable}
            className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                border transition-all duration-200 select-none
                ${isSelectable ? "cursor-pointer active:scale-95" : "cursor-default"}
                ${isSelected
                    ? "bg-[#E0F7F4] border-[#00BFA5] text-[#00897B]"
                    : "bg-white border-gray-200 text-gray-600"}
            `}
        >
            <span>{serviceIcons[servicio.code] ?? "📦"}</span>
            <span>{servicio.nombre}</span>
        </button>
    );
}
