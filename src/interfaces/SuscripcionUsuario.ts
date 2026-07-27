export interface SuscripcionUsuario {
    id: string;
    usuarioId: string;
    suscripcionId: string;
    fechaInicio: string;
    fechaFin: string;
    estado: "activa" | "pausada" | "cancelada";
    renovacionAutomatica: boolean;
}
