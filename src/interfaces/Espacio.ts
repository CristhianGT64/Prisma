import type { Imagenes } from "./Imagenes";
import type { ServicioIncluido } from "./ServiciosIncluidos";

export interface Espacio {
    id: string;
    arrendadorId: string;
    imagenes: Imagenes[];
    nombre: string;
    direccion: string;
    ciudad: string;
    descripcion: string;
    serviciosIncluidos: ServicioIncluido[];
    precioHora?: number;
    precioDia?: number;
    capacidad?: number;
    categoriaId?: string;
    calificacion?: number;
    totalResenas?: number;
    disponible: boolean;
    fechaCreacion?: string;
}