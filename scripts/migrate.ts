import "dotenv/config";
import { initDb } from "../server/db.js";

async function main() {
  console.log("[migrate] Aplicando schema y seed si hace falta...");
  console.log(
    "[migrate] DB:",
    process.env.TURSO_DATABASE_URL || "file:server/data/local.db (default)"
  );
  await initDb();
  console.log("[migrate] Listo");
}

main().catch((err) => {
  console.error("[migrate] Error:", err);
  process.exit(1);
});
