import fs from "fs";

const md = `# Prisma FrontEnd

Marketplace móvil de espacios de coworking (Honduras · Lempiras).

## Stack

- React 19 + Vite 8 + Tailwind 4 + React Router 7
- Backend Express en \`server/\` con **Turso/libSQL** (\`@libsql/client\`) y JWT
- Proxy Vite en dev: \`/api\` → \`http://localhost:3001\`
- Producción: **Vercel** (SPA + API serverless) + **Turso** (SQLite remoto)

## Requisitos

- Node.js 20+

## Instalación

\`\`\`bash
npm install
cp .env.example .env
\`\`\`

## Base de datos

### Local (archivo)

En \`.env\`:

\`\`\`env
TURSO_DATABASE_URL=file:server/data/local.db
JWT_SECRET=tu-secreto
\`\`\`

Aplica schema + seed demo:

\`\`\`bash
npm run db:migrate
\`\`\`

### Turso (producción)

\`\`\`bash
turso auth login
turso db create prisma-app
turso db show prisma-app --url
turso db tokens create prisma-app
\`\`\`

Configura en Vercel / \`.env\`:

\`\`\`env
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
JWT_SECRET=secreto-fuerte
\`\`\`

Luego:

\`\`\`bash
npm run db:migrate
\`\`\`

El seed solo corre si la tabla \`usuarios\` está vacía.

## Desarrollo

\`\`\`bash
npm run dev
\`\`\`

- Frontend: http://localhost:5173
- API: http://localhost:3001/api/health

Scripts:

- \`npm run dev:client\` — solo Vite
- \`npm run dev:server\` — solo API
- \`npm run db:migrate\` / \`npm run db:seed\` — schema + seed
- \`npm run build\` — build frontend
- \`npm run preview\` — previsualizar build

## Despliegue (Vercel + Turso)

1. Crea la DB en Turso y obtén URL + token.
2. Ejecuta \`npm run db:migrate\` apuntando a Turso (vars en entorno).
3. En Vercel, define:
   - \`TURSO_DATABASE_URL\`
   - \`TURSO_AUTH_TOKEN\`
   - \`JWT_SECRET\`
4. Deploy:

\`\`\`bash
npx vercel --prod
\`\`\`

O conecta el repo en el dashboard de Vercel. \`vercel.json\` reescribe \`/api/*\` a la función Express y el resto al SPA.

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
- Pagos y contrataciones de planes son simulados.
- En local la DB es \`server/data/local.db\`; en prod es Turso remoto.
`;

fs.writeFileSync("README.md", md, "utf8");
console.log("README written", md.length);
