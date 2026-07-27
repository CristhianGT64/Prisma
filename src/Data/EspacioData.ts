import type { Espacio } from "../interfaces/Espacio";

export const espaciosData: Espacio[] = [
    {
        id: "ESP001",
        arrendadorId: "USR002",
        nombre: "Oficinas en Torres Miramar",
        direccion: "Boulevard Miramar, Iztapalapa",
        ciudad: "Comayagua",
        descripcion: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley.",
        imagenes: [
            {
                nombre: "Oficina Principal",
                url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80"
            }
        ],
        serviciosIncluidos: [
            { code: "wifi", nombre: "WiFi" },
            { code: "estacionamiento", nombre: "Estacionamiento" },
            { code: "escritorios", nombre: "Escritorios" },
            { code: "aire_acondicionado", nombre: "Aire Acondicionado" }
        ],
        precioHora: 150,
        precioDia: 800,
        capacidad: 20,
        categoriaId: "CAT001",
        calificacion: 4.8,
        totalResenas: 24,
        disponible: true,
        fechaCreacion: "2024-01-15"
    },
    {
        id: "ESP002",
        arrendadorId: "USR002",
        nombre: "Oficinas en Torres Miramar 2",
        direccion: "Boulevard Miramar, Iztapalapa",
        ciudad: "Comayagua",
        descripcion: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley.",
        imagenes: [
            {
                nombre: "Sala Creativa",
                url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80"
            }
        ],
        serviciosIncluidos: [
            { code: "wifi", nombre: "WiFi" },
            { code: "estacionamiento", nombre: "Estacionamiento" },
            { code: "escritorios", nombre: "Escritorios" },
            { code: "aire_acondicionado", nombre: "Aire Acondicionado" }
        ],
        precioHora: 120,
        precioDia: 650,
        capacidad: 15,
        categoriaId: "CAT001",
        calificacion: 4.5,
        totalResenas: 18,
        disponible: true,
        fechaCreacion: "2024-02-10"
    },
    {
        id: "ESP003",
        arrendadorId: "USR002",
        nombre: "Premium CoWorking Center",
        direccion: "Av. Paseo de la Reforma 501",
        ciudad: "Comayagua",
        descripcion: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley.",
        imagenes: [
            {
                nombre: "CoWorking",
                url: "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=600&auto=format&fit=crop&q=80"
            }
        ],
        serviciosIncluidos: [
            { code: "wifi", nombre: "WiFi" },
            { code: "estacionamiento", nombre: "Estacionamiento" },
            { code: "aire_acondicionado", nombre: "Aire Acondicionado" }
        ],
        precioHora: 200,
        precioDia: 1000,
        capacidad: 30,
        categoriaId: "CAT001",
        calificacion: 5.0,
        totalResenas: 42,
        disponible: true,
        fechaCreacion: "2024-03-05"
    }
];
