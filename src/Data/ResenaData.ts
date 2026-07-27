import type { Resena } from "../interfaces/Resena";

export const resenas: Resena[] = [
    {
        id: "RES001",
        espacioId: "ESP001",
        usuarioId: "USR001",
        calificacion: 5,
        comentario: "Excelente espacio, muy limpio y con todas las comodidades. Muy recomendado.",
        fecha: "2024-06-10",
        tiposEtiquetas: ["Limpieza", "Comodidad", "Ubicación"],
        comentariosAdicionales: "El anfitrión fue muy atento y amable."
    },
    {
        id: "RES002",
        espacioId: "ESP001",
        usuarioId: "USR003",
        calificacion: 4,
        comentario: "Muy buen lugar para trabajar. El wifi es rápido y hay buena iluminación.",
        fecha: "2024-06-08",
        tiposEtiquetas: ["Iluminación", "Conectividad"],
        comentariosAdicionales: ""
    },
    {
        id: "RES003",
        espacioId: "ESP002",
        usuarioId: "USR001",
        calificacion: 5,
        comentario: "El ambiente es muy creativo e inspirador. Perfecto para colaborar.",
        fecha: "2024-06-05",
        tiposEtiquetas: ["Ambiente", "Colaboración", "Comunidad"],
        comentariosAdicionales: "Excelente comunidad de profesionales."
    }
];
