# Prisma FrontEnd

Marketplace móvil de espacios de coworking (Honduras · Lempiras).

## Stack

- React 19 + Vite 8 + Tailwind 4 + React Router 7
- Backend Express en `server/` con SQLite (sql.js) y JWT
- Proxy Vite: `/api` → `http://localhost:3001`

## Requisitos

- Node.js 20+

## Instalación

```bash
npm install
```

## Desarrollo

Levanta API + frontend juntos:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001/api/health

Scripts útiles:

- `npm run dev:client` — solo Vite
- `npm run dev:server` — solo API
- `npm run build` — build de producción
- `npm run preview` — previsualizar build

## Cuentas demo

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Arrendatario | juan.perez@example.com | password123 |
| Arrendador (persona) | maria.gonzalez@example.com | securepass |
| Arrendador (empresa) | admin@innovatehub.com | password123 |

## Flujos principales

- Público: splash → landing → nosotros / contacto / FAQ / políticas
- Auth: login / registro arrendatario o arrendador
- Arrendatario: buscar espacios, favoritos, reservas, tarjetas, reseñas, suscripciones
- Arrendador: mis espacios, reservas recibidas, historial de ingresos, suscripciones

## Notas

- Google / Facebook en login son solo UI (“Próximamente”), sin OAuth real.
- Pagos y contrataciones de planes son simulados en backend local.
- Base de datos: `server/data/prisma.db` (se crea y seedea al iniciar el server).