import type { Tarjeta } from "../interfaces/Tarjeta";

export const tarjetas: Tarjeta[] = [
    {
        id: "TAR001",
        usuarioId: "USR001",
        numero: "4532015112830366",
        titular: "Juan Pérez",
        mesExpiracion: 12,
        anioExpiracion: 2026,
        cvv: "123",
        tipo: "credito",
        esPrincipal: true
    },
    {
        id: "TAR002",
        usuarioId: "USR002",
        numero: "5425233010103010",
        titular: "María González",
        mesExpiracion: 8,
        anioExpiracion: 2025,
        cvv: "456",
        tipo: "debito",
        esPrincipal: true
    },
    {
        id: "TAR003",
        usuarioId: "USR003",
        numero: "378282246310005",
        titular: "Carlos Ramírez",
        mesExpiracion: 6,
        anioExpiracion: 2027,
        cvv: "789",
        tipo: "credito",
        esPrincipal: false
    }
];
