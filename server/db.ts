import initSqlJs, { type Database } from "sql.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "data", "prisma.db");
const WASM_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.resolve("sql.js"))),
  "sql-wasm.wasm"
);

let db: Database;

export function getDb(): Database {
  if (!db) throw new Error("Database not initialized");
  return db;
}

export function persist() {
  const data = db.export();
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

function run(sql: string, params: unknown[] = []) {
  db.run(sql, params as never[]);
}

export function queryAll<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): T[] {
  const stmt = db.prepare(sql);
  stmt.bind(params as never[]);
  const rows: T[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return rows;
}

export function queryOne<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): T | null {
  const rows = queryAll<T>(sql, params);
  return rows[0] ?? null;
}

function tableCount(name: string): number {
  const row = queryOne<{ c: number }>(`SELECT COUNT(*) as c FROM ${name}`);
  return row?.c ?? 0;
}

function createSchema() {
  db.run(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS usuarios (
      id TEXT PRIMARY KEY,
      nombres TEXT NOT NULL,
      apellidos TEXT NOT NULL DEFAULT '',
      correo TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      usuarios TEXT NOT NULL,
      telefono TEXT NOT NULL DEFAULT '',
      rol TEXT NOT NULL,
      foto_perfil TEXT,
      fecha_registro TEXT,
      ocupacion TEXT,
      empresa TEXT,
      descripcion TEXT,
      tipo_arrendador TEXT,
      numero_identidad TEXT,
      fecha_nacimiento TEXT,
      nombre_comercial TEXT,
      razon_social TEXT,
      rtn_empresa TEXT,
      numero_registro_mercantil TEXT,
      giro_actividad_economica TEXT,
      fecha_constitucion TEXT,
      representante_legal_nombre TEXT,
      representante_legal_identidad TEXT,
      representante_legal_cargo TEXT,
      representante_legal_correo TEXT,
      representante_legal_telefono TEXT,
      departamento TEXT,
      municipio TEXT,
      direccion_exacta TEXT,
      banco TEXT,
      tipo_cuenta TEXT,
      numero_cuenta TEXT,
      nombre_titular TEXT,
      rtn TEXT
    );

    CREATE TABLE IF NOT EXISTS categorias (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      icono TEXT
    );

    CREATE TABLE IF NOT EXISTS espacios (
      id TEXT PRIMARY KEY,
      arrendador_id TEXT NOT NULL,
      nombre TEXT NOT NULL,
      direccion TEXT NOT NULL,
      ciudad TEXT NOT NULL,
      descripcion TEXT NOT NULL DEFAULT '',
      imagenes TEXT NOT NULL DEFAULT '[]',
      servicios_incluidos TEXT NOT NULL DEFAULT '[]',
      precio_hora REAL,
      precio_dia REAL,
      capacidad INTEGER,
      categoria_id TEXT,
      calificacion REAL DEFAULT 0,
      total_resenas INTEGER DEFAULT 0,
      disponible INTEGER NOT NULL DEFAULT 1,
      fecha_creacion TEXT,
      FOREIGN KEY (arrendador_id) REFERENCES usuarios(id)
    );

    CREATE TABLE IF NOT EXISTS reservas (
      id TEXT PRIMARY KEY,
      espacio_id TEXT NOT NULL,
      usuario_arrendatario_id TEXT NOT NULL,
      usuario_arrendador_id TEXT NOT NULL,
      fecha_inicio TEXT NOT NULL,
      fecha_fin TEXT NOT NULL,
      estado TEXT NOT NULL,
      precio_total REAL NOT NULL DEFAULT 0,
      fecha_creacion TEXT,
      cantidad_personas INTEGER,
      hora_inicio TEXT,
      hora_fin TEXT,
      resena_dejada INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (espacio_id) REFERENCES espacios(id),
      FOREIGN KEY (usuario_arrendatario_id) REFERENCES usuarios(id),
      FOREIGN KEY (usuario_arrendador_id) REFERENCES usuarios(id)
    );

    CREATE TABLE IF NOT EXISTS favoritos (
      id TEXT PRIMARY KEY,
      usuario_id TEXT NOT NULL,
      espacio_id TEXT NOT NULL,
      fecha_guardado TEXT,
      UNIQUE(usuario_id, espacio_id)
    );

    CREATE TABLE IF NOT EXISTS resenas (
      id TEXT PRIMARY KEY,
      espacio_id TEXT NOT NULL,
      usuario_id TEXT NOT NULL,
      reserva_id TEXT,
      calificacion INTEGER NOT NULL,
      comentario TEXT,
      fecha TEXT,
      tipos_etiquetas TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS suscripciones (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      tipo TEXT NOT NULL,
      precio_mensual REAL NOT NULL DEFAULT 0,
      precio_anual REAL NOT NULL DEFAULT 0,
      duracion TEXT NOT NULL DEFAULT 'mensual',
      beneficios TEXT NOT NULL DEFAULT '[]',
      estado TEXT NOT NULL DEFAULT 'activa',
      comision_pct REAL NOT NULL DEFAULT 7
    );

    CREATE TABLE IF NOT EXISTS suscripciones_usuario (
      id TEXT PRIMARY KEY,
      usuario_id TEXT NOT NULL,
      suscripcion_id TEXT NOT NULL,
      fecha_inicio TEXT NOT NULL,
      fecha_fin TEXT,
      estado TEXT NOT NULL DEFAULT 'activa',
      renovacion_automatica INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS tarjetas (
      id TEXT PRIMARY KEY,
      usuario_id TEXT NOT NULL,
      last4 TEXT NOT NULL,
      nombre TEXT NOT NULL,
      tipo TEXT NOT NULL DEFAULT 'Débito',
      es_principal INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS faqs (
      id TEXT PRIMARY KEY,
      pregunta TEXT NOT NULL,
      respuesta TEXT NOT NULL,
      orden INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS politicas (
      id TEXT PRIMARY KEY,
      rol TEXT NOT NULL,
      titulo TEXT NOT NULL,
      contenido TEXT NOT NULL,
      orden INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS contactos (
      id TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      correo TEXT NOT NULL,
      telefono TEXT,
      mensaje TEXT NOT NULL,
      fecha TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS preferencias (
      usuario_id TEXT PRIMARY KEY,
      notificaciones INTEGER NOT NULL DEFAULT 1,
      ofertas INTEGER NOT NULL DEFAULT 1,
      newsletter INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS counters (
      name TEXT PRIMARY KEY,
      value INTEGER NOT NULL DEFAULT 0
    );
  `);
}

export function nextId(prefix: string, counterName: string): string {
  const row = queryOne<{ value: number }>(
    "SELECT value FROM counters WHERE name = ?",
    [counterName]
  );
  const next = (row?.value ?? 0) + 1;
  if (row) {
    run("UPDATE counters SET value = ? WHERE name = ?", [next, counterName]);
  } else {
    run("INSERT INTO counters (name, value) VALUES (?, ?)", [counterName, next]);
  }
  persist();
  return `${prefix}${String(next).padStart(3, "0")}`;
}

function seed() {
  if (tableCount("usuarios") > 0) return;

  const hash = (p: string) => bcrypt.hashSync(p, 8);

  const users = [
    {
      id: "USR001",
      nombres: "Juan",
      apellidos: "Pérez",
      correo: "juan.perez@example.com",
      password: "password123",
      usuarios: "juanp",
      telefono: "555-0101",
      rol: "arrendatario",
      fecha_registro: "2024-01-15",
      ocupacion: "Desarrollador",
      empresa: "Tech Solutions",
      descripcion: "Profesional en tecnología buscando espacios de trabajo colaborativo",
    },
    {
      id: "USR002",
      nombres: "María",
      apellidos: "González",
      correo: "maria.gonzalez@example.com",
      password: "securepass",
      usuarios: "mariag",
      telefono: "555-0202",
      rol: "arrendador",
      tipo_arrendador: "persona_natural",
      numero_identidad: "0801-1990-12345",
      fecha_nacimiento: "15/05/1990",
      departamento: "Francisco Morazán",
      municipio: "Distrito Central",
      direccion_exacta: "Col. Palmira",
      banco: "BAC Credomatic",
      tipo_cuenta: "Ahorro",
      numero_cuenta: "123456789",
      nombre_titular: "María González",
      fecha_registro: "2024-02-20",
      ocupacion: "Empresaria",
      empresa: "Espacios Premium Ltda.",
      descripcion: "Propietaria de espacios de trabajo moderno",
    },
    {
      id: "USR003",
      nombres: "Carlos",
      apellidos: "Ramírez",
      correo: "carlos.ramirez@example.com",
      password: "carlitos",
      usuarios: "carlosr",
      telefono: "555-0303",
      rol: "arrendatario",
      fecha_registro: "2024-03-10",
      ocupacion: "Diseñador Gráfico",
      empresa: "Estudio Creativo",
    },
    {
      id: "USR004",
      nombres: "Innovate Hub",
      apellidos: "",
      correo: "admin@innovatehub.com",
      password: "password123",
      usuarios: "innovatehub",
      telefono: "504 9876-5432",
      rol: "arrendador",
      tipo_arrendador: "empresa",
      nombre_comercial: "Innovate Hub",
      razon_social: "Innovate Hub Centroamérica S. de R.L.",
      rtn_empresa: "0801-1998-1234-56",
      numero_registro_mercantil: "RM-2024-089874",
      giro_actividad_economica: "Alquiler de espacios de coworking y oficinas",
      fecha_constitucion: "15/03/2020",
      representante_legal_nombre: "María Fernanda Rodríguez",
      representante_legal_identidad: "0801-1990-12345",
      representante_legal_cargo: "Gerente General",
      representante_legal_correo: "mrodriguez@innovatehub.com",
      representante_legal_telefono: "+504 9876-5432",
      departamento: "Francisco Morazán",
      municipio: "Distrito Central",
      direccion_exacta: "Torre Corporativa, Nivel 8",
      banco: "BAC Credomatic",
      tipo_cuenta: "Cheques",
      numero_cuenta: "987654321",
      nombre_titular: "Innovate Hub Centroamérica S. de R.L.",
      fecha_registro: "2024-04-01",
    },
  ];

  for (const u of users) {
    run(
      `INSERT INTO usuarios (
        id, nombres, apellidos, correo, password_hash, usuarios, telefono, rol,
        fecha_registro, ocupacion, empresa, descripcion, tipo_arrendador,
        numero_identidad, fecha_nacimiento, nombre_comercial, razon_social, rtn_empresa,
        numero_registro_mercantil, giro_actividad_economica, fecha_constitucion,
        representante_legal_nombre, representante_legal_identidad, representante_legal_cargo,
        representante_legal_correo, representante_legal_telefono,
        departamento, municipio, direccion_exacta, banco, tipo_cuenta, numero_cuenta, nombre_titular
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        u.id,
        u.nombres,
        u.apellidos ?? "",
        u.correo,
        hash(u.password),
        u.usuarios,
        u.telefono ?? "",
        u.rol,
        u.fecha_registro ?? null,
        u.ocupacion ?? null,
        u.empresa ?? null,
        u.descripcion ?? null,
        u.tipo_arrendador ?? null,
        u.numero_identidad ?? null,
        u.fecha_nacimiento ?? null,
        u.nombre_comercial ?? null,
        u.razon_social ?? null,
        u.rtn_empresa ?? null,
        u.numero_registro_mercantil ?? null,
        u.giro_actividad_economica ?? null,
        u.fecha_constitucion ?? null,
        u.representante_legal_nombre ?? null,
        u.representante_legal_identidad ?? null,
        u.representante_legal_cargo ?? null,
        u.representante_legal_correo ?? null,
        u.representante_legal_telefono ?? null,
        u.departamento ?? null,
        u.municipio ?? null,
        u.direccion_exacta ?? null,
        u.banco ?? null,
        u.tipo_cuenta ?? null,
        u.numero_cuenta ?? null,
        u.nombre_titular ?? null,
      ]
    );
    run(
      "INSERT INTO preferencias (usuario_id, notificaciones, ofertas, newsletter) VALUES (?,?,?,?)",
      [u.id, 1, 1, 1]
    );
  }

  const cats = [
    ["CAT001", "Espacio de Trabajo", "briefcase"],
    ["CAT002", "Salas", "door"],
    ["CAT003", "Actos", "event"],
    ["CAT004", "Entregas", "package"],
    ["CAT005", "Estudio", "studio"],
  ];
  for (const c of cats) {
    run("INSERT INTO categorias (id, nombre, icono) VALUES (?,?,?)", c);
  }

  const espacios = [
    {
      id: "ESP001",
      arrendador_id: "USR002",
      nombre: "Oficinas en Torres Miramar",
      direccion: "Boulevard Miramar, Tegucigalpa",
      ciudad: "Tegucigalpa",
      descripcion:
        "Impulsa tu negocio en la zona comercial más dinámica de Tegucigalpa. Oficinas modernas con aire acondicionado, wifi de alta velocidad, amplios escritorios y estacionamiento.",
      imagenes: JSON.stringify([
        {
          nombre: "Oficina Principal",
          url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80",
        },
      ]),
      servicios: JSON.stringify([
        { code: "wifi", nombre: "WiFi" },
        { code: "estacionamiento", nombre: "Estacionamiento" },
        { code: "escritorios", nombre: "Escritorios" },
        { code: "aire_acondicionado", nombre: "Aire Acondicionado" },
      ]),
      precio_hora: 150,
      precio_dia: 800,
      capacidad: 20,
      calificacion: 4.8,
      total_resenas: 24,
      fecha: "2024-01-15",
    },
    {
      id: "ESP002",
      arrendador_id: "USR002",
      nombre: "Oficinas en Torres Miramar 2",
      direccion: "Boulevard Miramar, Tegucigalpa",
      ciudad: "Tegucigalpa",
      descripcion: "Espacio moderno ideal para equipos creativos y reuniones.",
      imagenes: JSON.stringify([
        {
          nombre: "Sala Creativa",
          url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&auto=format&fit=crop&q=80",
        },
      ]),
      servicios: JSON.stringify([
        { code: "wifi", nombre: "WiFi" },
        { code: "estacionamiento", nombre: "Estacionamiento" },
        { code: "escritorios", nombre: "Escritorios" },
        { code: "aire_acondicionado", nombre: "Aire Acondicionado" },
      ]),
      precio_hora: 120,
      precio_dia: 650,
      capacidad: 15,
      calificacion: 4.5,
      total_resenas: 18,
      fecha: "2024-02-10",
    },
    {
      id: "ESP003",
      arrendador_id: "USR002",
      nombre: "Premium CoWorking Center",
      direccion: "Av. Paseo de la Reforma 501",
      ciudad: "Comayagua",
      descripcion: "Coworking premium con salas de reunión y networking.",
      imagenes: JSON.stringify([
        {
          nombre: "CoWorking",
          url: "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=600&auto=format&fit=crop&q=80",
        },
      ]),
      servicios: JSON.stringify([
        { code: "wifi", nombre: "WiFi" },
        { code: "estacionamiento", nombre: "Estacionamiento" },
        { code: "aire_acondicionado", nombre: "Aire Acondicionado" },
      ]),
      precio_hora: 200,
      precio_dia: 1000,
      capacidad: 30,
      calificacion: 5.0,
      total_resenas: 42,
      fecha: "2024-03-05",
    },
  ];

  for (const e of espacios) {
    run(
      `INSERT INTO espacios (
        id, arrendador_id, nombre, direccion, ciudad, descripcion, imagenes,
        servicios_incluidos, precio_hora, precio_dia, capacidad, categoria_id,
        calificacion, total_resenas, disponible, fecha_creacion
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,1,?)`,
      [
        e.id,
        e.arrendador_id,
        e.nombre,
        e.direccion,
        e.ciudad,
        e.descripcion,
        e.imagenes,
        e.servicios,
        e.precio_hora,
        e.precio_dia,
        e.capacidad,
        "CAT001",
        e.calificacion,
        e.total_resenas,
        e.fecha,
      ]
    );
  }

  const reservas = [
    ["RES001", "ESP001", "USR001", "USR002", "2024-07-01", "2024-07-05", "completada", 1500, "2024-06-14", 4, "10:00 AM", "11:30 AM", 1],
    ["RES002", "ESP002", "USR003", "USR002", "2026-05-16", "2026-05-16", "confirmada", 1200, "2026-05-01", 6, "2:00 PM", "4:00 PM", 0],
    ["RES003", "ESP001", "USR003", "USR002", "2026-05-18", "2026-05-18", "cancelada", 150, "2026-05-10", 3, "9:00 AM", "12:30 PM", 0],
    ["RES004", "ESP001", "USR001", "USR002", "2026-05-14", "2026-05-14", "completada", 1500, "2026-05-01", 4, "10:00 AM", "11:30 AM", 0],
    ["RES005", "ESP003", "USR001", "USR002", "2026-05-22", "2026-05-22", "confirmada", 1600, "2026-05-12", 8, "3:00 PM", "5:45 PM", 0],
    ["RES006", "ESP002", "USR001", "USR002", "2026-03-17", "2026-03-17", "completada", 1600, "2026-03-01", 5, "9:00 AM", "12:00 PM", 0],
    ["RES007", "ESP001", "USR003", "USR002", "2026-01-06", "2026-01-06", "completada", 1500, "2026-01-01", 3, "10:00 AM", "1:00 PM", 0],
  ];
  for (const r of reservas) {
    run(
      `INSERT INTO reservas (
        id, espacio_id, usuario_arrendatario_id, usuario_arrendador_id,
        fecha_inicio, fecha_fin, estado, precio_total, fecha_creacion,
        cantidad_personas, hora_inicio, hora_fin, resena_dejada
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      r
    );
  }

  run("INSERT INTO favoritos VALUES (?,?,?,?)", ["FAV001", "USR001", "ESP001", "2024-06-10"]);
  run("INSERT INTO favoritos VALUES (?,?,?,?)", ["FAV002", "USR001", "ESP002", "2024-06-12"]);
  run("INSERT INTO favoritos VALUES (?,?,?,?)", ["FAV003", "USR003", "ESP001", "2024-06-08"]);

  const planes = [
    [
      "SUB001",
      "Plan Premium",
      "Plan Premium para arrendadores",
      "arrendador",
      1500,
      16200,
      "mensual",
      JSON.stringify([
        "Publicación ilimitada",
        "Espacios destacados",
        "Estadísticas de ocupación",
        "Reportes financieros",
        "Soporte prioritario",
        "Comisión reducida al 5%",
      ]),
      "activa",
      5,
    ],
    [
      "SUB002",
      "Plan básico",
      "Plan gratuito para arrendadores",
      "arrendador",
      0,
      0,
      "mensual",
      JSON.stringify([
        "Publicar hasta 5 escritorios",
        "Gestión básica de reservas",
        "Perfil público",
        "Comisión del 7% por reserva",
      ]),
      "activa",
      7,
    ],
    [
      "SUB003",
      "Plan Premium Mensual",
      "Plan Premium para arrendatarios",
      "arrendatario",
      1100,
      12000,
      "mensual",
      JSON.stringify([
        "Mayor usabilidad en búsquedas",
        "Estadísticas y métricas",
        "Soporte prioritario",
        "Descuentos y ofertas de networking",
      ]),
      "activa",
      0,
    ],
    [
      "SUB004",
      "Plan Premium Anual",
      "Plan Premium anual para arrendatarios",
      "arrendatario",
      1000,
      12000,
      "anual",
      JSON.stringify([
        "Mayor usabilidad en búsquedas",
        "Estadísticas y métricas",
        "Soporte prioritario",
        "Ahorro del 8% vs mensual",
      ]),
      "activa",
      0,
    ],
  ];
  for (const p of planes) {
    run(
      `INSERT INTO suscripciones (
        id, nombre, descripcion, tipo, precio_mensual, precio_anual, duracion, beneficios, estado, comision_pct
      ) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      p
    );
  }

  run(
    "INSERT INTO suscripciones_usuario VALUES (?,?,?,?,?,?,?)",
    ["SU001", "USR002", "SUB001", "2026-01-01", "2026-12-31", "activa", 1]
  );
  run(
    "INSERT INTO suscripciones_usuario VALUES (?,?,?,?,?,?,?)",
    ["SU002", "USR001", "SUB003", "2026-01-01", "2026-12-31", "activa", 1]
  );

  run("INSERT INTO tarjetas VALUES (?,?,?,?,?,?)", ["TAR001", "USR001", "7845", "JUAN PEREZ", "Débito", 1]);
  run("INSERT INTO tarjetas VALUES (?,?,?,?,?,?)", ["TAR002", "USR001", "4195", "JUAN PEREZ", "Débito", 0]);
  run("INSERT INTO tarjetas VALUES (?,?,?,?,?,?)", ["TAR003", "USR001", "3156", "JUAN PEREZ", "Crédito", 0]);

  const faqs = [
    ["FAQ001", "¿Qué es Prisma?", "Prisma es un marketplace que conecta a personas y empresas con espacios de coworking disponibles para renta.", 1],
    ["FAQ002", "¿Cómo funciona?", "Solo debes buscar el espacio que necesitas, filtrar según tus preferencias y realizar la reserva directamente desde la plataforma.", 2],
    ["FAQ003", "¿Necesito una suscripción?", "Sí, debes registrarte y crear una cuenta para suscribirte al plan que se ajuste a tus necesidades.", 3],
    ["FAQ004", "¿Qué tipo de espacios puedo encontrar?", "En Prisma puedes encontrar coworkings, oficinas privadas, salas de reuniones y espacios compartidos.", 4],
    ["FAQ005", "¿Puedo publicar mi espacio en Prisma?", "Sí. Si eres propietario o administrador de un espacio de coworking, puedes registrarlo en nuestra app.", 5],
    ["FAQ006", "¿Puedo cancelar una reserva?", "Sí. Las cancelaciones dependen de las políticas de cada espacio.", 6],
  ];
  for (const f of faqs) {
    run("INSERT INTO faqs (id, pregunta, respuesta, orden) VALUES (?,?,?,?)", f);
  }

  const politicasArrendador = [
    ["POLA1", "arrendador", "Publicación de espacios", "Debes publicar información veraz sobre tus espacios, incluyendo fotos, precios, capacidad y servicios. Prisma puede retirar publicaciones engañosas.", 1],
    ["POLA2", "arrendador", "Disponibilidad y Reservas", "Mantén actualizada la disponibilidad. Al aceptar una reserva te comprometes a entregar el espacio en las condiciones publicadas.", 2],
    ["POLA3", "arrendador", "Condiciones del Espacio", "El espacio debe estar limpio, seguro y operativo. Reporta mantenimientos con anticipación a los arrendatarios afectados.", 3],
    ["POLA4", "arrendador", "Pagos y Comisiones", "Prisma retiene una comisión según tu plan (5% Premium, 7% Básico). Los pagos se liquidan según el historial de ingresos.", 4],
    ["POLA5", "arrendador", "Cancelaciones", "Las cancelaciones del arrendador sin causa justificada pueden generar penalizaciones y afectar tu calificación.", 5],
    ["POLA6", "arrendador", "Atención al Cliente", "Debes responder consultas de arrendatarios en un plazo razonable y brindar soporte durante la reserva.", 6],
    ["POLA7", "arrendador", "Seguridad y Legalidad", "Cumple la normativa local, permisos y medidas de seguridad del inmueble. Prisma no se hace responsable de incumplimientos legales del arrendador.", 7],
    ["POLA8", "arrendador", "Incumplimientos", "El incumplimiento reiterado de estas políticas puede resultar en suspensión o cierre de la cuenta.", 8],
  ];
  const politicasArrendatario = [
    ["POLT1", "arrendatario", "Uso del espacio", "Utiliza el espacio solo para los fines acordados y respeta las normas del lugar y de otros usuarios.", 1],
    ["POLT2", "arrendatario", "Reservas y pagos", "Las reservas confirmadas deben pagarse según el método seleccionado. Los cargos indebidos pueden reportarse a soporte.", 2],
    ["POLT3", "arrendatario", "Cancelaciones", "Puedes cancelar según la política del espacio. Cancelaciones tardías pueden no ser reembolsables.", 3],
    ["POLT4", "arrendatario", "Daños y responsabilidad", "Eres responsable de daños causados por ti o tus invitados durante la reserva.", 4],
    ["POLT5", "arrendatario", "Conducta", "Se prohíbe el acoso, actividades ilegales o que pongan en riesgo a otros usuarios.", 5],
    ["POLT6", "arrendatario", "Privacidad", "Tus datos se usan para operar la plataforma. Consulta la política de privacidad completa en soporte.", 6],
  ];
  for (const p of [...politicasArrendador, ...politicasArrendatario]) {
    run("INSERT INTO politicas (id, rol, titulo, contenido, orden) VALUES (?,?,?,?,?)", p);
  }

  run("INSERT INTO counters VALUES ('usuarios', 4)");
  run("INSERT INTO counters VALUES ('espacios', 3)");
  run("INSERT INTO counters VALUES ('reservas', 7)");
  run("INSERT INTO counters VALUES ('favoritos', 3)");
  run("INSERT INTO counters VALUES ('tarjetas', 3)");
  run("INSERT INTO counters VALUES ('resenas', 0)");
  run("INSERT INTO counters VALUES ('suscripciones_usuario', 2)");
  run("INSERT INTO counters VALUES ('contactos', 0)");

  persist();
  console.log("[db] Seed completado");
}

export type UsuarioRow = Record<string, unknown>;

export function mapUsuario(row: UsuarioRow | null) {
  if (!row) return null;
  return {
    id: row.id as string,
    nombres: row.nombres as string,
    apellidos: (row.apellidos as string) ?? "",
    correo: row.correo as string,
    password: "",
    usuarios: row.usuarios as string,
    telefono: (row.telefono as string) ?? "",
    rol: row.rol as "arrendador" | "arrendatario",
    fotoPerfil: (row.foto_perfil as string) || undefined,
    fechaRegistro: (row.fecha_registro as string) || undefined,
    ocupacion: (row.ocupacion as string) || undefined,
    empresa: (row.empresa as string) || undefined,
    descripcion: (row.descripcion as string) || undefined,
    tipoArrendador: (row.tipo_arrendador as "persona_natural" | "empresa") || undefined,
    numeroIdentidad: (row.numero_identidad as string) || undefined,
    fechaNacimiento: (row.fecha_nacimiento as string) || undefined,
    nombreComercial: (row.nombre_comercial as string) || undefined,
    razonSocial: (row.razon_social as string) || undefined,
    rtnEmpresa: (row.rtn_empresa as string) || undefined,
    numeroRegistroMercantil: (row.numero_registro_mercantil as string) || undefined,
    giroActividadEconomica: (row.giro_actividad_economica as string) || undefined,
    fechaConstitucion: (row.fecha_constitucion as string) || undefined,
    representanteLegalNombre: (row.representante_legal_nombre as string) || undefined,
    representanteLegalIdentidad: (row.representante_legal_identidad as string) || undefined,
    representanteLegalCargo: (row.representante_legal_cargo as string) || undefined,
    representanteLegalCorreo: (row.representante_legal_correo as string) || undefined,
    representanteLegalTelefono: (row.representante_legal_telefono as string) || undefined,
    departamento: (row.departamento as string) || undefined,
    municipio: (row.municipio as string) || undefined,
    direccionExacta: (row.direccion_exacta as string) || undefined,
    banco: (row.banco as string) || undefined,
    tipoCuenta: (row.tipo_cuenta as string) || undefined,
    numeroCuenta: (row.numero_cuenta as string) || undefined,
    nombreTitular: (row.nombre_titular as string) || undefined,
    rtn: (row.rtn as string) || undefined,
  };
}

export function mapEspacio(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    arrendadorId: row.arrendador_id as string,
    nombre: row.nombre as string,
    direccion: row.direccion as string,
    ciudad: row.ciudad as string,
    descripcion: (row.descripcion as string) ?? "",
    imagenes: JSON.parse((row.imagenes as string) || "[]"),
    serviciosIncluidos: JSON.parse((row.servicios_incluidos as string) || "[]"),
    precioHora: row.precio_hora as number | undefined,
    precioDia: row.precio_dia as number | undefined,
    capacidad: row.capacidad as number | undefined,
    categoriaId: (row.categoria_id as string) || undefined,
    calificacion: (row.calificacion as number) ?? 0,
    totalResenas: (row.total_resenas as number) ?? 0,
    disponible: Boolean(row.disponible),
    fechaCreacion: (row.fecha_creacion as string) || undefined,
  };
}

export function mapReserva(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    espacioId: row.espacio_id as string,
    usuarioArrendatarioId: row.usuario_arrendatario_id as string,
    usuarioArrendadorId: row.usuario_arrendador_id as string,
    fechaInicio: row.fecha_inicio as string,
    fechaFin: row.fecha_fin as string,
    estado: row.estado as string,
    precioTotal: row.precio_total as number,
    fechaCreacion: (row.fecha_creacion as string) || undefined,
    cantidadPersonas: (row.cantidad_personas as number) || undefined,
    horaInicio: (row.hora_inicio as string) || undefined,
    horaFin: (row.hora_fin as string) || undefined,
    resenaDejada: Boolean(row.resena_dejada),
  };
}

export async function initDb() {
  const SQL = await initSqlJs({
    locateFile: () => WASM_PATH,
  });

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
    console.log("[db] Cargada desde", DB_PATH);
  } else {
    db = new SQL.Database();
    console.log("[db] Nueva base de datos");
  }

  createSchema();
  seed();
}
