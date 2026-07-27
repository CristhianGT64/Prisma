import type { SuscripcionUsuario } from "../interfaces/SuscripcionUsuario";

export const suscripcionesUsuario: SuscripcionUsuario[] = [
    {
        id: "SUBU001",
        usuarioId: "USR001",
        suscripcionId: "SUB001",
        fechaInicio: "2024-06-01",
        fechaFin: "2024-07-01",
        estado: "activa",
        renovacionAutomatica: true
    },
    {
        id: "SUBU002",
        usuarioId: "USR002",
        suscripcionId: "SUB003",
        fechaInicio: "2024-05-15",
        fechaFin: "2024-06-15",
        estado: "activa",
        renovacionAutomatica: true
    },
    {
        id: "SUBU003",
        usuarioId: "USR003",
        suscripcionId: "SUB001",
        fechaInicio: "2024-04-01",
        fechaFin: "2024-05-01",
        estado: "cancelada",
        renovacionAutomatica: false
    }
];
