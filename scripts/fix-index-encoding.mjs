import fs from "fs";
import { execSync } from "child_process";

let cur = fs.readFileSync("server/index.ts", "utf8");

// Make remaining handlers async if they use await
cur = cur.replace(
  'app.get("/api/categorias", (_req, res) => {',
  'app.get("/api/categorias", async (_req, res) => {'
);
cur = cur.replace(
  'app.get("/api/faqs", (_req, res) => {',
  'app.get("/api/faqs", async (_req, res) => {'
);

// Fix common mojibake / broken Spanish strings
const fixes = [
  [/Correo y contrase[^\"]*?requeridos/g, "Correo y contraseña requeridos"],
  [/Correo o contrase[^\"]*?incorrectos/g, "Correo o contraseña incorrectos"],
  [/Correo y contrase[^\"]*?6\) requeridos/g, "Correo y contraseña (mín. 6) requeridos"],
  [/El correo ya est[^\"]*?registrado/g, "El correo ya está registrado"],
  [/Token inv[^\"]*?lido o expirado/g, "Token inválido o expirado"],
  [/contraseÃ±a/g, "contraseña"],
  [/contrase├▒a/g, "contraseña"],
  [/mÃ­n\./g, "mín."],
  [/m├¡n\./g, "mín."],
  [/estÃ¡/g, "está"],
  [/est├¡/g, "está"],
  [/est├í/g, "está"],
];

for (const [re, rep] of fixes) cur = cur.replace(re, rep);

// Clean section comments
cur = cur.replace(/^\/\/[^\n]*Auth[^\n]*$/gm, "// --- Auth ---");
cur = cur.replace(/^\/\/[^\n]*Categor[^\n]*$/gm, "// --- Categorias ---");
cur = cur.replace(/^\/\/[^\n]*Espacio[^\n]*$/gm, "// --- Espacios ---");
cur = cur.replace(/^\/\/[^\n]*Favorito[^\n]*$/gm, "// --- Favoritos ---");
cur = cur.replace(/^\/\/[^\n]*Reserva[^\n]*$/gm, "// --- Reservas ---");
cur = cur.replace(/^\/\/[^\n]*Rese[^\n]*$/gm, "// --- Resenas ---");
cur = cur.replace(/^\/\/[^\n]*Tarjeta[^\n]*$/gm, "// --- Tarjetas ---");
cur = cur.replace(/^\/\/[^\n]*Suscripci[^\n]*$/gm, "// --- Suscripciones ---");
cur = cur.replace(/^\/\/[^\n]*FAQ[^\n]*$/gm, "// --- FAQs / Politicas ---");
cur = cur.replace(/^\/\/[^\n]*Preferenc[^\n]*$/gm, "// --- Preferencias ---");
cur = cur.replace(/^\/\/[^\n]*Contacto[^\n]*$/gm, "// --- Contacto ---");
cur = cur.replace(/^\/\/[^\n]*Ingresos[^\n]*$/gm, "// --- Ingresos ---");

// Prefer original Spanish error strings from git when possible
try {
  const orig = execSync("git show HEAD:server/index.ts", { encoding: "utf8" });
  const re = /error:\s*"([^"]+)"/g;
  const origErrors = [];
  let m;
  while ((m = re.exec(orig))) origErrors.push(m[1]);
  // Replace by index order of error: occurrences if counts match
  const curErrors = [];
  const re2 = /error:\s*"([^"]+)"/g;
  while ((m = re2.exec(cur))) curErrors.push(m[1]);
  if (origErrors.length === curErrors.length && origErrors.length > 0) {
    let i = 0;
    cur = cur.replace(/error:\s*"[^"]+"/g, () => `error: "${origErrors[i++]}"`);
  }
} catch {
  /* ignore */
}

fs.writeFileSync("server/index.ts", cur, "utf8");

const checks = {
  categoriasAsync: cur.includes('categorias", async'),
  faqsAsync: cur.includes('faqs", async'),
  exportDefault: cur.includes("export default app"),
  badMain: cur.includes("async function main") || cur.includes("await export"),
  persist: (cur.match(/persist\(/g) || []).length,
  getDb: (cur.match(/getDb/g) || []).length,
  sample: cur
    .split("\n")
    .filter((l) => /contrase|mín|está|invál/.test(l))
    .slice(0, 6),
};
console.log(JSON.stringify(checks, null, 2));
