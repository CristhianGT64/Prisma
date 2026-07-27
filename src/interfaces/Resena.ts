export interface Resena {
    id: string;
    espacioId: string;
    usuarioId: string;
    calificacion: number;
    comentario: string;
    fecha: string;
    tiposEtiquetas?: string[];
    comentariosAdicionales?: string;
}
