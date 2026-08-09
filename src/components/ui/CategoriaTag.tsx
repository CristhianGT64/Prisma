interface CategoriaTagProps {
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}

export default function CategoriaTag({ label, isActive, onClick }: CategoriaTagProps) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                isActive
                    ? "bg-[#F58220] text-white shadow-sm"
                    : "bg-[#FFF3C4] text-gray-700 hover:bg-yellow-200"
            }`}
        >
            {label}
        </button>
    );
}
