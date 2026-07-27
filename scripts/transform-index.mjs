import fs from "fs";
import path from "path";
import os from "os";

const origPath = path.join(os.tmpdir(), "prisma-index-orig.ts");
let src = fs.readFileSync(origPath, "utf8");
if (src.charCodeAt(0) === 0xfeff) src = src.slice(1);
src = src.replace(/\r\n/g, "\n");

src = 'import "dotenv/config";\n' + src;

src = src.replace(
  /import \{\n  initDb,\n  queryAll,\n  queryOne,\n  persist,\n  nextId,\n  mapUsuario,\n  mapEspacio,\n  mapReserva,\n  getDb,\n\} from "\.\/db\.js";/,
  `import {
  ensureDb,
  queryAll,
  queryOne,
  run,
  nextId,
  mapUsuario,
  mapEspacio,
  mapReserva,
} from "./db.js";`
);

src = src.replace(
  /function run\(sql: string, params: unknown\[\] = \[\]\) \{\n  getDb\(\)\.run\(sql, params as never\[\]\);\n\}\n\n/,
  ""
);

src = src.replace(/\n  persist\(\);/g, "");
src = src.replace(/\n    persist\(\);/g, "");

src = src.replace(
  'app.use(cors());\napp.use(express.json({ limit: "2mb" }));\n',
  `app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.use(async (_req, res, next) => {
  try {
    await ensureDb();
    next();
  } catch (err) {
    console.error("[db] init error", err);
    res.status(500).json({ error: "Error de base de datos" });
  }
});
`
);

src = src.replace(
  /((?:requireAuth,\s*)?)\(req((?:: AuthRequest)?), res\) => \{/g,
  "$1async (req$2, res) => {"
);

src = src.replace(/(?<!await )(?<![\w.$])queryOne\(/g, "await queryOne(");
src = src.replace(/(?<!await )(?<![\w.$])queryAll\(/g, "await queryAll(");
src = src.replace(/(?<!await )(?<![\w.$])run\(/g, "await run(");
src = src.replace(/(?<!await )(?<![\w.$])nextId\(/g, "await nextId(");

const boot = `export default app;

if (!process.env.VERCEL) {
  ensureDb()
    .then(() => {
      app.listen(PORT, () => {
        console.log(\`API Prisma en http://localhost:\${PORT}\`);
      });
    })
    .catch((err) => {
      console.error("Error iniciando DB", err);
      process.exit(1);
    });
}
`;

if (src.includes("async function main()")) {
  src = src.replace(/async function main\(\)[\s\S]*$/, boot);
} else if (src.includes("initDb()")) {
  src = src.replace(/initDb\(\)[\s\S]*$/, boot);
} else {
  src = src.trimEnd() + "\n\n" + boot;
}

fs.writeFileSync("server/index.ts", src, "utf8");
console.log(
  JSON.stringify(
    {
      len: src.length,
      exportDefault: src.includes("export default app"),
      persist: (src.match(/persist\(/g) || []).length,
      getDb: (src.match(/getDb/g) || []).length,
      ensureDb: (src.match(/ensureDb/g) || []).length,
      asyncReq: (src.match(/async \(req/g) || []).length,
      badPost: (src.match(/async \(post/g) || []).length,
      awaitQueryOne: (src.match(/await queryOne/g) || []).length,
      awaitRun: (src.match(/await run/g) || []).length,
      login: src.split("\n").find((l) => l.includes("/api/auth/login")),
    },
    null,
    2
  )
);
