export interface Suscripcion {
    id: string;
    nombre: string;
    descripcion: string;
    tipo: "arrendador" | "arrendatario";
    precioMensual: number;
    precioAnual: number;
    duracion: "mensual" | "anual";
    beneficios: string[];
    estado: "activa" | "inactiva" | "cancelada";
    fechaInicio?: string;
    fechaFin?: string;
}
