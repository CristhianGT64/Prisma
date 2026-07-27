import type { Notificacion } from "../interfaces/Notificacion";

export const notificaciones: Notificacion[] = [
    {
        id: "NOT001",
        usuarioId: "USR001",
        tipo: "notificaciones",
        habilitada: true
    },
    {
        id: "NOT002",
        usuarioId: "USR001",
        tipo: "ofertas_especiales",
        habilitada: true
    },
    {
        id: "NOT003",
        usuarioId: "USR001",
        tipo: "newsletter",
        habilitada: false
    },
    {
        id: "NOT004",
        usuarioId: "USR002",
        tipo: "notificaciones",
        habilitada: true
    },
    {
        id: "NOT005",
        usuarioId: "USR002",
        tipo: "ofertas_especiales",
        habilitada: false
    },
    {
        id: "NOT006",
        usuarioId: "USR002",
        tipo: "newsletter",
        habilitada: true
    }
];
