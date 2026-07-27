import type { Suscripcion } from "../interfaces/Suscripcion";

export const suscripciones: Suscripcion[] = [
    {
        id: "SUB001",
        nombre: "Plan Premium Mensual",
        descripcion: "Plan Premium para Arrendatarios",
        tipo: "arrendatario",
        precioMensual: 1100,
        precioAnual: 12000,
        duracion: "mensual",
        beneficios: [
            "Mayor usabilidad en búsquedas",
            "Estadísticas y métricas",
            "Soporte prioritario",
            "Marca tus espacios registrados como premium",
            "Descuentos y ofertas de networking realizadas por Prisma"
        ],
        estado: "activa"
    },
    {
        id: "SUB002",
        nombre: "Plan Premium Anual",
        descripcion: "Plan Premium para Arrendatarios - Pago Anual",
        tipo: "arrendatario",
        precioMensual: 1000,
        precioAnual: 12000,
        duracion: "anual",
        beneficios: [
            "Mayor usabilidad en búsquedas",
            "Estadísticas y métricas",
            "Soporte prioritario",
            "Marca tus espacios registrados como premium",
            "Descuentos y ofertas de networking realizadas por Prisma",
            "Ahorro del 8% en comparación con pago mensual"
        ],
        estado: "activa"
    },
    {
        id: "SUB003",
        nombre: "Plan Básico Arrendador",
        descripcion: "Plan Básico para Arrendadores",
        tipo: "arrendador",
        precioMensual: 500,
        precioAnual: 5400,
        duracion: "mensual",
        beneficios: [
            "Listar espacios",
            "Soporte básico",
            "Estadísticas de reservas"
        ],
        estado: "activa"
    }
];
