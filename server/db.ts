import { createClient, type Client, type InValue } from "@libsql/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type SqlValue = InValue;
type Row = Record<string, unknown>;

let client: Client | null = null;
let initPromise: Promise<void> | null = null;

function resolveDbUrl(): string {
  const url = process.env.TURSO_DATABASE_URL?.trim();
  if (url) {
    if (url.startsWith("file:")) {
      const rel = url.slice("file:".length);
      const abs = path.isAbsolute(rel) ? rel : path.resolve(process.cwd(), rel);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      return `file:${abs}`;
    }
    return url;
  }
  const fallback = path.resolve(process.cwd(), "server/data/local.db");
  fs.mkdirSync(path.dirname(fallback), { recursive: true });
  return `file:${fallback}`;
}

export function getClient(): Client {
  if (!client) {
    const url = resolveDbUrl();
    const authToken = process.env.TURSO_AUTH_TOKEN?.trim() || undefined;
    client = createClient({
      url,
      authToken: url.startsWith("file:") ? undefined : authToken,
    });
  }
  return client;
}

function normalizeRow(row: Record<string, unknown>): Row {
  const out: Row = {};
  for (const [k, v] of Object.entries(row)) {
    out[k] = typeof v === "bigint" ? Number(v) : v;
  }
  return out;
}

export async function run(sql: string, params: SqlValue[] = []): Promise<void> {
  await getClient().execute({ sql, args: params });
}

export async function queryAll<T = Row>(
  sql: string,
  params: SqlValue[] = []
): Promise<T[]> {
  const rs = await getClient().execute({ sql, args: params });
  return rs.rows.map((r) => normalizeRow(r as unknown as Row) as T);
}

export async function queryOne<T = Row>(
  sql: string,
  params: SqlValue[] = []
): Promise<T | null> {
  const rows = await queryAll<T>(sql, params);
  return rows[0] ?? null;
}

async function tableCount(name: string): Promise<number> {
  const row = await queryOne<{ c: number }>(`SELECT COUNT(*) as c FROM ${name}`);
  return Number(row?.c ?? 0);
}

async function applySchema(): Promise<void> {
  const schemaPath = path.join(__dirname, "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  for (const statement of statements) {
    await run(statement);
  }
}

export async function nextId(prefix: string, counterName: string): Promise<string> {
  const c = getClient();
  const tx = await c.transaction("write");
  try {
    const rs = await tx.execute({
      sql: "SELECT value FROM counters WHERE name = ?",
      args: [counterName],
    });
    const current = rs.rows[0]
      ? Number((rs.rows[0] as unknown as { value: number }).value ?? 0)
      : 0;
    const next = current + 1;
    if (rs.rows[0]) {
      await tx.execute({
        sql: "UPDATE counters SET value = ? WHERE name = ?",
        args: [next, counterName],
      });
    } else {
      await tx.execute({
        sql: "INSERT INTO counters (name, value) VALUES (?, ?)",
        args: [counterName, next],
      });
    }
    await tx.commit();
    return `${prefix}${String(next).padStart(3, "0")}`;
  } catch (err) {
    await tx.rollback();
    throw err;
  }
}

async function seed(): Promise<void> {
  if ((await tableCount("usuarios")) > 0) return;

  const hash = (p: string) => bcrypt.hashSync(p, 8);

  type SeedUser = {
    id: string;
    nombres: string;
    apellidos?: string;
    correo: string;
    password: string;
    usuarios: string;
    telefono?: string;
    rol: string;
    fecha_registro?: string;
    ocupacion?: string;
    empresa?: string;
    descripcion?: string;
    tipo_arrendador?: string;
    numero_identidad?: string;
    fecha_nacimiento?: string;
    nombre_comercial?: string;
    razon_social?: string;
    rtn_empresa?: string;
    numero_registro_mercantil?: string;
    giro_actividad_economica?: string;
    fecha_constitucion?: string;
    representante_legal_nombre?: string;
    representante_legal_identidad?: string;
    representante_legal_cargo?: string;
    representante_legal_correo?: string;
    representante_legal_telefono?: string;
    departamento?: string;
    municipio?: string;
    direccion_exacta?: string;
    banco?: string;
    tipo_cuenta?: string;
    numero_cuenta?: string;
    nombre_titular?: string;
  };

  const users: SeedUser[] = [
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
    await run(
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
    await run(
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
    await run("INSERT INTO categorias (id, nombre, icono) VALUES (?,?,?)", c);
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
    await run(
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
    await run(
      `INSERT INTO reservas (
        id, espacio_id, usuario_arrendatario_id, usuario_arrendador_id,
        fecha_inicio, fecha_fin, estado, precio_total, fecha_creacion,
        cantidad_personas, hora_inicio, hora_fin, resena_dejada
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      r as SqlValue[]
    );
  }

  await run("INSERT INTO favoritos VALUES (?,?,?,?)", ["FAV001", "USR001", "ESP001", "2024-06-10"]);
  await run("INSERT INTO favoritos VALUES (?,?,?,?)", ["FAV002", "USR001", "ESP002", "2024-06-12"]);
  await run("INSERT INTO favoritos VALUES (?,?,?,?)", ["FAV003", "USR003", "ESP001", "2024-06-08"]);

  const planes: SqlValue[][] = [
    [
      "SUB001",
      "Plan Premium Mensual",
      "Plan Premium mensual para arrendadores",
      "arrendador",
      1500,
      16200,
      "mensual",
      JSON.stringify([
        "Mayor usabilidad en búsquedas",
        "Estadísticas y métricas",
        "Soporte prioritario",
        "Descuentos y ofertas de networking",
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
      "Plan Pro (Full-time)",
      "Plan Premium para arrendatarios",
      "arrendatario",
      2800,
      12000,
      "mensual",
      JSON.stringify([
        "Acceso ilimitado a la red de espacios aliados.",
        "Uso de escritorios compartidos sin límite de horas.",
        "Prioridad en reservas.",
        "Acceso a todos los espacios disponibles.",
        "Eventos y beneficios exclusivos.",
      ]),
      "activa",
      0,
    ],
    [
      "SUB004",
      "Plan Freelance (Part-time)",
      "Plan Premium anual para arrendatarios",
      "arrendatario",
      1200,
      12000,
      "anual",
      JSON.stringify([
        "Acceso a la red de espacios aliados.",
        "Hasta 40 horas de uso al mes (aprox. 10 horas por semana).",
        "Reserva de escritorios compartidos según disponibilidad.",
        "Acceso a eventos y networking de la comunidad.",
      ]),
      "activa",
      0,
    ],
  ];
  for (const p of planes) {
    await run(
      `INSERT INTO suscripciones (
        id, nombre, descripcion, tipo, precio_mensual, precio_anual, duracion, beneficios, estado, comision_pct
      ) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      p
    );
  }

  await run("INSERT INTO suscripciones_usuario VALUES (?,?,?,?,?,?,?)", [
    "SU001",
    "USR002",
    "SUB001",
    "2026-01-01",
    "2026-12-31",
    "activa",
    1,
  ]);
  await run("INSERT INTO suscripciones_usuario VALUES (?,?,?,?,?,?,?)", [
    "SU002",
    "USR001",
    "SUB003",
    "2026-01-01",
    "2026-12-31",
    "activa",
    1,
  ]);

  await run("INSERT INTO tarjetas VALUES (?,?,?,?,?,?)", [
    "TAR001",
    "USR001",
    "7845",
    "JUAN PEREZ",
    "Débito",
    1,
  ]);
  await run("INSERT INTO tarjetas VALUES (?,?,?,?,?,?)", [
    "TAR002",
    "USR001",
    "4195",
    "JUAN PEREZ",
    "Débito",
    0,
  ]);
  await run("INSERT INTO tarjetas VALUES (?,?,?,?,?,?)", [
    "TAR003",
    "USR001",
    "3156",
    "JUAN PEREZ",
    "Crédito",
    0,
  ]);

  const faqs: SqlValue[][] = [
    ["FAQ001", "¿Qué es Prisma?", "Prisma es un marketplace que conecta a personas y empresas con espacios de coworking disponibles para renta.", 1],
    ["FAQ002", "¿Cómo funciona?", "Solo debes buscar el espacio que necesitas, filtrar según tus preferencias y realizar la reserva directamente desde la plataforma.", 2],
    ["FAQ003", "¿Necesito una suscripción?", "Sí, debes registrarte y crear una cuenta para suscribirte al plan que se ajuste a tus necesidades.", 3],
    ["FAQ004", "¿Qué tipo de espacios puedo encontrar?", "En Prisma puedes encontrar coworkings, oficinas privadas, salas de reuniones y espacios compartidos.", 4],
    ["FAQ005", "¿Puedo publicar mi espacio en Prisma?", "Sí. Si eres propietario o administrador de un espacio de coworking, puedes registrarlo en nuestra app.", 5],
    ["FAQ006", "¿Puedo cancelar una reserva?", "Sí. Las cancelaciones dependen de las políticas de cada espacio.", 6],
  ];
  for (const f of faqs) {
    await run("INSERT INTO faqs (id, pregunta, respuesta, orden) VALUES (?,?,?,?)", f);
  }

  const politicas: SqlValue[][] = [
    ["POLA1", "arrendador", "Publicación de espacios", "Debes publicar información veraz sobre tus espacios, incluyendo fotos, precios, capacidad y servicios. Prisma puede retirar publicaciones engañosas.", 1],
    ["POLA2", "arrendador", "Disponibilidad y Reservas", "Mantén actualizada la disponibilidad. Al aceptar una reserva te comprometes a entregar el espacio en las condiciones publicadas.", 2],
    ["POLA3", "arrendador", "Condiciones del Espacio", "El espacio debe estar limpio, seguro y operativo. Reporta mantenimientos con anticipación a los arrendatarios afectados.", 3],
    ["POLA4", "arrendador", "Pagos y Comisiones", "Prisma retiene una comisión según tu plan (5% Premium, 7% Básico). Los pagos se liquidan según el historial de ingresos.", 4],
    ["POLA5", "arrendador", "Cancelaciones", "Las cancelaciones del arrendador sin causa justificada pueden generar penalizaciones y afectar tu calificación.", 5],
    ["POLA6", "arrendador", "Atención al Cliente", "Debes responder consultas de arrendatarios en un plazo razonable y brindar soporte durante la reserva.", 6],
    ["POLA7", "arrendador", "Seguridad y Legalidad", "Cumple la normativa local, permisos y medidas de seguridad del inmueble. Prisma no se hace responsable de incumplimientos legales del arrendador.", 7],
    ["POLA8", "arrendador", "Incumplimientos", "El incumplimiento reiterado de estas políticas puede resultar en suspensión o cierre de la cuenta.", 8],
    ["POLT1", "arrendatario", "Uso del espacio", "Utiliza el espacio solo para los fines acordados y respeta las normas del lugar y de otros usuarios.", 1],
    ["POLT2", "arrendatario", "Reservas y pagos", "Las reservas confirmadas deben pagarse según el método seleccionado. Los cargos indebidos pueden reportarse a soporte.", 2],
    ["POLT3", "arrendatario", "Cancelaciones", "Puedes cancelar según la política del espacio. Cancelaciones tardías pueden no ser reembolsables.", 3],
    ["POLT4", "arrendatario", "Daños y responsabilidad", "Eres responsable de daños causados por ti o tus invitados durante la reserva.", 4],
    ["POLT5", "arrendatario", "Conducta", "Se prohíbe el acoso, actividades ilegales o que pongan en riesgo a otros usuarios.", 5],
    ["POLT6", "arrendatario", "Privacidad", "Tus datos se usan para operar la plataforma. Consulta la política de privacidad completa en soporte.", 6],
  ];
  for (const p of politicas) {
    await run(
      "INSERT INTO politicas (id, rol, titulo, contenido, orden) VALUES (?,?,?,?,?)",
      p
    );
  }

  await run("INSERT INTO counters VALUES ('usuarios', 4)");
  await run("INSERT INTO counters VALUES ('espacios', 3)");
  await run("INSERT INTO counters VALUES ('reservas', 7)");
  await run("INSERT INTO counters VALUES ('favoritos', 3)");
  await run("INSERT INTO counters VALUES ('tarjetas', 3)");
  await run("INSERT INTO counters VALUES ('resenas', 0)");
  await run("INSERT INTO counters VALUES ('suscripciones_usuario', 2)");
  await run("INSERT INTO counters VALUES ('contactos', 0)");

  console.log("[db] Seed completado");
}

export type UsuarioRow = Row;

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

export function mapEspacio(row: Row) {
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

export function mapReserva(row: Row) {
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

export async function initDb(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      getClient();
      await applySchema();
      await seed();
      console.log(
        "[db] Lista:",
        resolveDbUrl().startsWith("file:") ? "local file" : "turso remote"
      );
    })().catch((err) => {
      initPromise = null;
      throw err;
    });
  }
  await initPromise;
}

export async function ensureDb(): Promise<void> {
  await initDb();
}
