export interface Reserva {
    id: string;
    espacioId: string;
    usuarioArrendatarioId: string;
    usuarioArrendadorId: string;
    fechaInicio: string;
    fechaFin: string;
    estado: "pendiente" | "confirmada" | "cancelada" | "completada";
    precioTotal: number;
    fechaCreacion: string;
    cantidadPersonas?: number;
    horaInicio?: string;
    horaFin?: string;
    resenaDejada?: boolean;
}
