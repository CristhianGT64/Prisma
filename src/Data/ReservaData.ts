import type { Reserva } from "../interfaces/Reserva";

export const reservas: Reserva[] = [
    {
        id: "RES001",
        espacioId: "ESP001",
        usuarioArrendatarioId: "USR001",
        usuarioArrendadorId: "USR002",
        fechaInicio: "2024-07-01",
        fechaFin: "2024-07-05",
        estado: "completada",
        precioTotal: 500,
        fechaCreacion: "2024-06-14",
        cantidadPersonas: 4,
        horaInicio: "10:00 AM",
        horaFin: "11:30 AM"
    },
    {
        id: "RES002",
        espacioId: "ESP002",
        usuarioArrendatarioId: "USR003",
        usuarioArrendadorId: "USR002",
        fechaInicio: "2024-07-10",
        fechaFin: "2024-07-12",
        estado: "pendiente",
        precioTotal: 300,
        fechaCreacion: "2024-06-14",
        cantidadPersonas: 6,
        horaInicio: "2:00 PM",
        horaFin: "4:00 PM"
    },
    {
        id: "RES003",
        espacioId: "ESP001",
        usuarioArrendatarioId: "USR003",
        usuarioArrendadorId: "USR002",
        fechaInicio: "2024-07-18",
        fechaFin: "2024-07-18",
        estado: "cancelada",
        precioTotal: 150,
        fechaCreacion: "2024-06-10",
        cantidadPersonas: 3,
        horaInicio: "9:00 AM",
        horaFin: "12:30 AM"
    }
];
