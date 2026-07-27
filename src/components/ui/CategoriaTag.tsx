interface CategoriaTagProps {
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}

export default function CategoriaTag({ label, isActive, onClick }: CategoriaTagProps) {
    return (
        <button
            onClick={onClick}
            className={`
                px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap border
                ${isActive 
                    ? "bg-[#FF9800] text-white border-[#FF9800]" 
                    : "bg-white text-gray-500 border-gray-200 hover:border-[#FF9800] hover:text-[#FF9800]"}
            `}
        >
            {label}
        </button>
    );
}
