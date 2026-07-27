export interface Notificacion {
    id: string;
    usuarioId: string;
    tipo: "notificaciones" | "ofertas_especiales" | "newsletter";
    habilitada: boolean;
}
