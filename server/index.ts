import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import {
  ensureDb,
  queryAll,
  queryOne,
  run,
  nextId,
  mapUsuario,
  mapEspacio,
  mapReserva,
} from "./db.js";
import { requireAuth, signToken, type AuthRequest } from "./middleware/auth.js";

const PORT = Number(process.env.PORT) || 3001;
const app = express();

app.use(cors());
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

// --- Auth ---
app.post("/api/auth/login", async (req, res) => {
  const correo = String(req.body.correo ?? "").trim().toLowerCase();
  const password = String(req.body.password ?? "");
  if (!correo || !password) {
    return res.status(400).json({ error: "Correo y contraseña requeridos" });
  }
  const row = await queryOne("SELECT * FROM usuarios WHERE lower(correo) = ?", [correo]);
  if (!row || !bcrypt.compareSync(password, row.password_hash as string)) {
    return res.status(401).json({ error: "Correo o contraseña incorrectos" });
  }
  const usuario = mapUsuario(row)!;
  const token = signToken({ id: usuario.id, rol: usuario.rol, correo: usuario.correo });
  res.json({ token, usuario });
});

app.post("/api/auth/register", async (req, res) => {
  const b = req.body ?? {};
  const correo = String(b.correo ?? "").trim().toLowerCase();
  const password = String(b.password ?? "");
  if (!correo || !password || password.length < 6) {
    return res.status(400).json({ error: "Correo y contraseña (mín. 6) requeridos" });
  }
  const exists = await queryOne("SELECT id FROM usuarios WHERE lower(correo) = ?", [correo]);
  if (exists) return res.status(409).json({ error: "El correo ya está registrado" });

  const id = await nextId("USR", "usuarios");
  const fecha = new Date().toISOString().split("T")[0];
  const hash = bcrypt.hashSync(password, 8);
  const rol = b.rol === "arrendador" ? "arrendador" : "arrendatario";

  await run(
    `INSERT INTO usuarios (
      id, nombres, apellidos, correo, password_hash, usuarios, telefono, rol,
      fecha_registro, ocupacion, empresa, descripcion, tipo_arrendador,
      numero_identidad, fecha_nacimiento, nombre_comercial, razon_social, rtn_empresa,
      numero_registro_mercantil, giro_actividad_economica, fecha_constitucion,
      representante_legal_nombre, representante_legal_identidad, representante_legal_cargo,
      representante_legal_correo, representante_legal_telefono,
      departamento, municipio, direccion_exacta, banco, tipo_cuenta, numero_cuenta, nombre_titular, foto_perfil
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      id,
      b.nombres ?? "",
      b.apellidos ?? "",
      correo,
      hash,
      b.usuarios || correo.split("@")[0],
      b.telefono ?? "",
      rol,
      fecha,
      b.ocupacion ?? null,
      b.empresa ?? null,
      b.descripcion ?? null,
      b.tipoArrendador ?? null,
      b.numeroIdentidad ?? null,
      b.fechaNacimiento ?? null,
      b.nombreComercial ?? null,
      b.razonSocial ?? null,
      b.rtnEmpresa ?? null,
      b.numeroRegistroMercantil ?? null,
      b.giroActividadEconomica ?? null,
      b.fechaConstitucion ?? null,
      b.representanteLegalNombre ?? null,
      b.representanteLegalIdentidad ?? null,
      b.representanteLegalCargo ?? null,
      b.representanteLegalCorreo ?? null,
      b.representanteLegalTelefono ?? null,
      b.departamento ?? null,
      b.municipio ?? null,
      b.direccionExacta ?? null,
      b.banco ?? null,
      b.tipoCuenta ?? null,
      b.numeroCuenta ?? null,
      b.nombreTitular ?? null,
      b.fotoPerfil ?? null,
    ]
  );
  await run("INSERT INTO preferencias (usuario_id) VALUES (?)", [id]);

  // Plan b├ísico gratis para arrendadores nuevos
  if (rol === "arrendador") {
    const suId = await nextId("SU", "suscripciones_usuario");
    await run(
      "INSERT INTO suscripciones_usuario VALUES (?,?,?,?,?,?,?)",
      [suId, id, "SUB002", fecha, null, "activa", 1]
    );
  }

  const row = await queryOne("SELECT * FROM usuarios WHERE id = ?", [id]);
  const usuario = mapUsuario(row)!;
  const token = signToken({ id: usuario.id, rol: usuario.rol, correo: usuario.correo });
  res.status(201).json({ token, usuario });
});

app.get("/api/auth/me", requireAuth, async (req: AuthRequest, res) => {
  const row = await queryOne("SELECT * FROM usuarios WHERE id = ?", [req.user!.id]);
  if (!row) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json({ usuario: mapUsuario(row) });
});

app.put("/api/auth/perfil", requireAuth, async (req: AuthRequest, res) => {
  const b = req.body ?? {};
  const fields: [string, unknown][] = [
    ["nombres", b.nombres],
    ["apellidos", b.apellidos],
    ["telefono", b.telefono],
    ["usuarios", b.usuarios],
    ["ocupacion", b.ocupacion],
    ["empresa", b.empresa],
    ["descripcion", b.descripcion],
    ["foto_perfil", b.fotoPerfil],
    ["numero_identidad", b.numeroIdentidad],
    ["fecha_nacimiento", b.fechaNacimiento],
    ["nombre_comercial", b.nombreComercial],
    ["razon_social", b.razonSocial],
    ["rtn_empresa", b.rtnEmpresa],
    ["numero_registro_mercantil", b.numeroRegistroMercantil],
    ["giro_actividad_economica", b.giroActividadEconomica],
    ["fecha_constitucion", b.fechaConstitucion],
    ["representante_legal_nombre", b.representanteLegalNombre],
    ["representante_legal_identidad", b.representanteLegalIdentidad],
    ["representante_legal_cargo", b.representanteLegalCargo],
    ["representante_legal_correo", b.representanteLegalCorreo],
    ["representante_legal_telefono", b.representanteLegalTelefono],
    ["departamento", b.departamento],
    ["municipio", b.municipio],
    ["direccion_exacta", b.direccionExacta],
    ["banco", b.banco],
    ["tipo_cuenta", b.tipoCuenta],
    ["numero_cuenta", b.numeroCuenta],
    ["nombre_titular", b.nombreTitular],
    ["rtn", b.rtn],
  ];
  const sets: string[] = [];
  const vals: unknown[] = [];
  for (const [col, val] of fields) {
    if (val !== undefined) {
      sets.push(`${col} = ?`);
      vals.push(val);
    }
  }
  if (sets.length === 0) return res.status(400).json({ error: "Sin cambios" });
  vals.push(req.user!.id);
  await run(`UPDATE usuarios SET ${sets.join(", ")} WHERE id = ?`, vals);
  const row = await queryOne("SELECT * FROM usuarios WHERE id = ?", [req.user!.id]);
  res.json({ usuario: mapUsuario(row) });
});

// --- Categorias ---
app.get("/api/categorias", async (_req, res) => {
  res.json(await queryAll("SELECT id, nombre, icono FROM categorias ORDER BY id"));
});

// --- Espacios ---
app.get("/api/espacios", async (req, res) => {
  const q = String(req.query.q ?? "").trim().toLowerCase();
  const categoriaId = String(req.query.categoriaId ?? "");
  const ciudad = String(req.query.ciudad ?? "").trim().toLowerCase();
  let sql = "SELECT * FROM espacios WHERE disponible = 1";
  const params: unknown[] = [];
  if (q) {
    sql += " AND (lower(nombre) LIKE ? OR lower(descripcion) LIKE ? OR lower(direccion) LIKE ? OR lower(ciudad) LIKE ?)";
    const like = `%${q}%`;
    params.push(like, like, like, like);
  }
  if (categoriaId && categoriaId !== "Todo") {
    sql += " AND categoria_id = ?";
    params.push(categoriaId);
  }
  if (ciudad) {
    sql += " AND lower(ciudad) LIKE ?";
    params.push(`%${ciudad}%`);
  }
  sql += " ORDER BY fecha_creacion DESC";
  const rows = await queryAll(sql, params);
  res.json(rows.map(mapEspacio));
});

app.get("/api/espacios/mios", requireAuth, async (req: AuthRequest, res) => {
  const rows = await queryAll(
    "SELECT * FROM espacios WHERE arrendador_id = ? ORDER BY fecha_creacion DESC",
    [req.user!.id]
  );
  res.json(rows.map(mapEspacio));
});

app.get("/api/espacios/:id", async (req, res) => {
  const row = await queryOne("SELECT * FROM espacios WHERE id = ?", [req.params.id]);
  if (!row) return res.status(404).json({ error: "Espacio no encontrado" });
  res.json(mapEspacio(row));
});

app.get("/api/espacios/:id/reservas", requireAuth, async (req: AuthRequest, res) => {
  const espacio = await queryOne("SELECT id FROM espacios WHERE id = ?", [req.params.id]);
  if (!espacio) return res.status(404).json({ error: "Espacio no encontrado" });

  const rows = await queryAll(
    `SELECT * FROM reservas
     WHERE espacio_id = ? AND estado <> 'cancelada'
     ORDER BY fecha_inicio ASC, fecha_fin ASC`,
    [req.params.id]
  );
  res.json(rows.map(mapReserva));
});

app.post("/api/espacios", requireAuth, async (req: AuthRequest, res) => {
  if (req.user!.rol !== "arrendador") {
    return res.status(403).json({ error: "Solo arrendadores pueden publicar espacios" });
  }
  const b = req.body ?? {};
  const id = await nextId("ESP", "espacios");
  const fecha = new Date().toISOString().split("T")[0];
  await run(
    `INSERT INTO espacios (
      id, arrendador_id, nombre, direccion, ciudad, descripcion, imagenes,
      servicios_incluidos, precio_hora, precio_dia, capacidad, categoria_id,
      calificacion, total_resenas, disponible, fecha_creacion
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,0,0,1,?)`,
    [
      id,
      req.user!.id,
      b.nombre ?? "Sin nombre",
      b.direccion ?? "",
      b.ciudad ?? "",
      b.descripcion ?? "",
      JSON.stringify(b.imagenes ?? []),
      JSON.stringify(b.serviciosIncluidos ?? []),
      b.precioHora ?? null,
      b.precioDia ?? null,
      b.capacidad ?? null,
      b.categoriaId ?? "CAT001",
      fecha,
    ]
  );
  const row = await queryOne("SELECT * FROM espacios WHERE id = ?", [id]);
  res.status(201).json(mapEspacio(row!));
});

app.put("/api/espacios/:id", requireAuth, async (req: AuthRequest, res) => {
  const existing = await queryOne("SELECT * FROM espacios WHERE id = ?", [req.params.id]);
  if (!existing) return res.status(404).json({ error: "Espacio no encontrado" });
  if (existing.arrendador_id !== req.user!.id) {
    return res.status(403).json({ error: "No autorizado" });
  }
  const b = req.body ?? {};
  await run(
    `UPDATE espacios SET
      nombre = ?, direccion = ?, ciudad = ?, descripcion = ?, imagenes = ?,
      servicios_incluidos = ?, precio_hora = ?, precio_dia = ?, capacidad = ?,
      categoria_id = ?, disponible = ?
     WHERE id = ?`,
    [
      b.nombre ?? existing.nombre,
      b.direccion ?? existing.direccion,
      b.ciudad ?? existing.ciudad,
      b.descripcion ?? existing.descripcion,
      b.imagenes !== undefined ? JSON.stringify(b.imagenes) : existing.imagenes,
      b.serviciosIncluidos !== undefined
        ? JSON.stringify(b.serviciosIncluidos)
        : existing.servicios_incluidos,
      b.precioHora !== undefined ? b.precioHora : existing.precio_hora,
      b.precioDia !== undefined ? b.precioDia : existing.precio_dia,
      b.capacidad !== undefined ? b.capacidad : existing.capacidad,
      b.categoriaId !== undefined ? b.categoriaId : existing.categoria_id,
      b.disponible !== undefined ? (b.disponible ? 1 : 0) : existing.disponible,
      req.params.id,
    ]
  );
  const row = await queryOne("SELECT * FROM espacios WHERE id = ?", [req.params.id]);
  res.json(mapEspacio(row!));
});

app.delete("/api/espacios/:id", requireAuth, async (req: AuthRequest, res) => {
  const existing = await queryOne("SELECT * FROM espacios WHERE id = ?", [req.params.id]);
  if (!existing) return res.status(404).json({ error: "Espacio no encontrado" });
  if (existing.arrendador_id !== req.user!.id) {
    return res.status(403).json({ error: "No autorizado" });
  }
  await run("DELETE FROM fechas_bloqueadas WHERE espacio_id = ?", [req.params.id]);
  await run("DELETE FROM favoritos WHERE espacio_id = ?", [req.params.id]);
  await run("DELETE FROM espacios WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

app.get("/api/espacios/:id/fechas-bloqueadas", async (req, res) => {
  const espacio = await queryOne("SELECT id FROM espacios WHERE id = ?", [req.params.id]);
  if (!espacio) return res.status(404).json({ error: "Espacio no encontrado" });

  const rows = await queryAll<{ fecha: string }>(
    "SELECT fecha FROM fechas_bloqueadas WHERE espacio_id = ? ORDER BY fecha ASC",
    [req.params.id]
  );
  res.json({ fechas: rows.map((r) => r.fecha) });
});

app.put("/api/arrendador/espacios/:id/fechas-bloqueadas", requireAuth, async (req: AuthRequest, res) => {
  if (req.user!.rol !== "arrendador") {
    return res.status(403).json({ error: "Solo arrendadores" });
  }

  const espacio = await queryOne<{ id: string; arrendador_id: string }>(
    "SELECT id, arrendador_id FROM espacios WHERE id = ?",
    [req.params.id]
  );
  if (!espacio) return res.status(404).json({ error: "Espacio no encontrado" });
  if (espacio.arrendador_id !== req.user!.id) {
    return res.status(403).json({ error: "No autorizado" });
  }

  const fechasInput = Array.isArray(req.body?.fechas) ? req.body.fechas : [];
  const fechasLimpias = Array.from(
    new Set(
      fechasInput
        .map((f: unknown) => String(f ?? "").trim())
        .filter((f: string) => /^\d{4}-\d{2}-\d{2}$/.test(f))
    )
  ).sort();

  const existentes = await queryAll<{ fecha: string }>(
    "SELECT fecha FROM fechas_bloqueadas WHERE espacio_id = ?",
    [req.params.id]
  );
  const existentesSet = new Set(existentes.map((x) => x.fecha));
  const nuevasSet = new Set(fechasLimpias);

  const paraEliminar = existentes.filter((x) => !nuevasSet.has(x.fecha)).map((x) => x.fecha);
  const paraInsertar = fechasLimpias.filter((f) => !existentesSet.has(f));

  for (const fecha of paraEliminar) {
    await run("DELETE FROM fechas_bloqueadas WHERE espacio_id = ? AND fecha = ?", [req.params.id, fecha]);
  }

  const hoy = new Date().toISOString().split("T")[0];
  for (const fecha of paraInsertar) {
    await run(
      "INSERT INTO fechas_bloqueadas (espacio_id, arrendador_id, fecha, fecha_creacion) VALUES (?,?,?,?)",
      [req.params.id, req.user!.id, fecha, hoy]
    );
  }

  res.json({ fechas: fechasLimpias });
});

// --- Favoritos ---
app.get("/api/favoritos", requireAuth, async (req: AuthRequest, res) => {
  const rows = await queryAll(
    "SELECT id, usuario_id as usuarioId, espacio_id as espacioId, fecha_guardado as fechaGuardado FROM favoritos WHERE usuario_id = ?",
    [req.user!.id]
  );
  res.json(rows);
});

app.post("/api/favoritos/toggle", requireAuth, async (req: AuthRequest, res) => {
  const espacioId = String(req.body.espacioId ?? "");
  if (!espacioId) return res.status(400).json({ error: "espacioId requerido" });
  const existing = await queryOne(
    "SELECT id FROM favoritos WHERE usuario_id = ? AND espacio_id = ?",
    [req.user!.id, espacioId]
  );
  if (existing) {
    await run("DELETE FROM favoritos WHERE id = ?", [existing.id]);
    return res.json({ favorito: false });
  }
  const id = await nextId("FAV", "favoritos");
  const fecha = new Date().toISOString().split("T")[0];
  await run("INSERT INTO favoritos VALUES (?,?,?,?)", [id, req.user!.id, espacioId, fecha]);
  res.json({ favorito: true, id });
});

// --- Resenas ---
app.get("/api/reservas", requireAuth, async (req: AuthRequest, res) => {
  const user = req.user!;
  let rows;
  if (user.rol === "arrendador") {
    rows = await queryAll(
      "SELECT * FROM reservas WHERE usuario_arrendador_id = ? ORDER BY fecha_inicio DESC",
      [user.id]
    );
  } else {
    rows = await queryAll(
      "SELECT * FROM reservas WHERE usuario_arrendatario_id = ? ORDER BY fecha_inicio DESC",
      [user.id]
    );
  }
  res.json(rows.map(mapReserva));
});

app.get("/api/arrendador/reservas", requireAuth, async (req: AuthRequest, res) => {
  if (req.user!.rol !== "arrendador") {
    return res.status(403).json({ error: "Solo arrendadores" });
  }
  const rows = await queryAll(
    `SELECT r.*, e.nombre as espacio_nombre, e.direccion as espacio_direccion,
            e.ciudad as espacio_ciudad, e.descripcion as espacio_descripcion,
            e.imagenes as espacio_imagenes,
            u.nombres as arrendatario_nombres, u.apellidos as arrendatario_apellidos,
            u.correo as arrendatario_correo
     FROM reservas r
     JOIN espacios e ON e.id = r.espacio_id
     JOIN usuarios u ON u.id = r.usuario_arrendatario_id
     WHERE r.usuario_arrendador_id = ?
     ORDER BY r.fecha_inicio DESC`,
    [req.user!.id]
  );
  const mapped = rows.map((r) => ({
    ...mapReserva(r),
    espacio: {
      id: r.espacio_id,
      nombre: r.espacio_nombre,
      direccion: r.espacio_direccion,
      ciudad: r.espacio_ciudad,
      descripcion: r.espacio_descripcion,
      imagenes: JSON.parse((r.espacio_imagenes as string) || "[]"),
    },
    arrendatario: {
      nombres: r.arrendatario_nombres,
      apellidos: r.arrendatario_apellidos,
      correo: r.arrendatario_correo,
    },
  }));
  const contadores = {
    todas: mapped.length,
    proximas: mapped.filter((x) => x.estado === "confirmada" || x.estado === "pendiente").length,
    completadas: mapped.filter((x) => x.estado === "completada").length,
    canceladas: mapped.filter((x) => x.estado === "cancelada").length,
  };
  res.json({ reservas: mapped, contadores });
});

app.post("/api/reservas", requireAuth, async (req: AuthRequest, res) => {
  const b = req.body ?? {};
  const espacio = await queryOne("SELECT * FROM espacios WHERE id = ?", [b.espacioId]);
  if (!espacio) return res.status(404).json({ error: "Espacio no encontrado" });

  const fechaInicio = String(b.fechaInicio ?? "");
  const fechaFin = String(b.fechaFin ?? b.fechaInicio ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaInicio) || !/^\d{4}-\d{2}-\d{2}$/.test(fechaFin)) {
    return res.status(400).json({ error: "Fechas inválidas" });
  }

  const bloqueada = await queryOne<{ fecha: string }>(
    `SELECT fecha
     FROM fechas_bloqueadas
     WHERE espacio_id = ? AND fecha >= ? AND fecha <= ?
     ORDER BY fecha ASC
     LIMIT 1`,
    [b.espacioId, fechaInicio, fechaFin]
  );
  if (bloqueada) {
    return res.status(409).json({ error: `La fecha ${bloqueada.fecha} no está disponible para reservar` });
  }

  const id = await nextId("RES", "reservas");
  const fecha = new Date().toISOString().split("T")[0];
  await run(
    `INSERT INTO reservas (
      id, espacio_id, usuario_arrendatario_id, usuario_arrendador_id,
      fecha_inicio, fecha_fin, estado, precio_total, fecha_creacion,
      cantidad_personas, hora_inicio, hora_fin, resena_dejada
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,0)`,
    [
      id,
      b.espacioId,
      req.user!.id,
      espacio.arrendador_id,
      fechaInicio,
      fechaFin,
      b.estado ?? "confirmada",
      b.precioTotal ?? 0,
      fecha,
      b.cantidadPersonas ?? 1,
      b.horaInicio ?? null,
      b.horaFin ?? null,
    ]
  );
  const row = await queryOne("SELECT * FROM reservas WHERE id = ?", [id]);
  res.status(201).json(mapReserva(row!));
});

app.patch("/api/reservas/:id/cancelar", requireAuth, async (req: AuthRequest, res) => {
  const row = await queryOne("SELECT * FROM reservas WHERE id = ?", [req.params.id]);
  if (!row) return res.status(404).json({ error: "Reserva no encontrada" });
  if (
    row.usuario_arrendatario_id !== req.user!.id &&
    row.usuario_arrendador_id !== req.user!.id
  ) {
    return res.status(403).json({ error: "No autorizado" });
  }
  await run("UPDATE reservas SET estado = 'cancelada' WHERE id = ?", [req.params.id]);
  const updated = await queryOne("SELECT * FROM reservas WHERE id = ?", [req.params.id]);
  res.json(mapReserva(updated!));
});

// --- Resenas ---
app.post("/api/reservas/:id/resena", requireAuth, async (req: AuthRequest, res) => {
  const reserva = await queryOne("SELECT * FROM reservas WHERE id = ?", [req.params.id]);
  if (!reserva) return res.status(404).json({ error: "Reserva no encontrada" });
  if (reserva.usuario_arrendatario_id !== req.user!.id) {
    return res.status(403).json({ error: "No autorizado" });
  }
  const b = req.body ?? {};
  const id = await nextId("REV", "resenas");
  const fecha = new Date().toISOString().split("T")[0];
  await run(
    "INSERT INTO resenas (id, espacio_id, usuario_id, reserva_id, calificacion, comentario, fecha, tipos_etiquetas) VALUES (?,?,?,?,?,?,?,?)",
    [
      id,
      reserva.espacio_id,
      req.user!.id,
      reserva.id,
      Number(b.calificacion) || 5,
      b.comentario ?? "",
      fecha,
      JSON.stringify(b.tiposEtiquetas ?? []),
    ]
  );
  await run("UPDATE reservas SET resena_dejada = 1 WHERE id = ?", [reserva.id]);

  const stats = await queryOne<{ avg: number; c: number }>(
    "SELECT AVG(calificacion) as avg, COUNT(*) as c FROM resenas WHERE espacio_id = ?",
    [reserva.espacio_id]
  );
  if (stats) {
    await run("UPDATE espacios SET calificacion = ?, total_resenas = ? WHERE id = ?", [
      Math.round((stats.avg ?? 0) * 10) / 10,
      stats.c,
      reserva.espacio_id,
    ]);
  }
  res.status(201).json({ id, ok: true });
});

// --- Tarjetas ---
app.get("/api/tarjetas", requireAuth, async (req: AuthRequest, res) => {
  const rows = await queryAll(
    "SELECT id, last4, nombre, tipo, es_principal as esPrincipal FROM tarjetas WHERE usuario_id = ?",
    [req.user!.id]
  );
  res.json(rows);
});

app.post("/api/tarjetas", requireAuth, async (req: AuthRequest, res) => {
  const b = req.body ?? {};
  const id = await nextId("TAR", "tarjetas");
  const count = queryOne<{ c: number }>(
    "SELECT COUNT(*) as c FROM tarjetas WHERE usuario_id = ?",
    [req.user!.id]
  );
  const esPrincipal = (count?.c ?? 0) === 0 ? 1 : 0;
  await run("INSERT INTO tarjetas VALUES (?,?,?,?,?,?)", [
    id,
    req.user!.id,
    b.last4 ?? "0000",
    b.nombre ?? "",
    b.tipo ?? "D├®bito",
    esPrincipal,
  ]);
  res.status(201).json({ id, last4: b.last4, nombre: b.nombre, tipo: b.tipo ?? "D├®bito" });
});

app.delete("/api/tarjetas/:id", requireAuth, async (req: AuthRequest, res) => {
  const row = await queryOne("SELECT * FROM tarjetas WHERE id = ? AND usuario_id = ?", [
    req.params.id,
    req.user!.id,
  ]);
  if (!row) return res.status(404).json({ error: "Tarjeta no encontrada" });
  await run("DELETE FROM tarjetas WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

// --- Suscripciones ---
app.get("/api/suscripciones", async (req, res) => {
  const tipo = String(req.query.tipo ?? "");
  let sql = "SELECT * FROM suscripciones WHERE estado = 'activa'";
  const params: unknown[] = [];
  if (tipo) {
    sql += " AND tipo = ?";
    params.push(tipo);
  }
  sql += " ORDER BY precio_mensual DESC";
  const raw = await queryAll(sql, params);
  const rows = raw.map((r) => ({
    id: r.id,
    nombre: r.nombre,
    descripcion: r.descripcion,
    tipo: r.tipo,
    precioMensual: r.precio_mensual,
    precioAnual: r.precio_anual,
    duracion: r.duracion,
    beneficios: JSON.parse((r.beneficios as string) || "[]"),
    estado: r.estado,
    comisionPct: r.comision_pct,
  }));
  res.json(rows);
});

app.get("/api/suscripciones/mia", requireAuth, async (req: AuthRequest, res) => {
  const row = await queryOne(
    `SELECT su.*, s.nombre, s.descripcion, s.tipo, s.precio_mensual, s.precio_anual,
            s.duracion, s.beneficios, s.comision_pct
     FROM suscripciones_usuario su
     JOIN suscripciones s ON s.id = su.suscripcion_id
     WHERE su.usuario_id = ? AND su.estado = 'activa'
     ORDER BY su.fecha_inicio DESC LIMIT 1`,
    [req.user!.id]
  );
  if (!row) return res.json(null);
  res.json({
    id: row.id,
    usuarioId: row.usuario_id,
    suscripcionId: row.suscripcion_id,
    fechaInicio: row.fecha_inicio,
    fechaFin: row.fecha_fin,
    estado: row.estado,
    renovacionAutomatica: Boolean(row.renovacion_automatica),
    plan: {
      id: row.suscripcion_id,
      nombre: row.nombre,
      descripcion: row.descripcion,
      tipo: row.tipo,
      precioMensual: row.precio_mensual,
      precioAnual: row.precio_anual,
      duracion: row.duracion,
      beneficios: JSON.parse((row.beneficios as string) || "[]"),
      comisionPct: row.comision_pct,
    },
  });
});

app.post("/api/suscripciones/contratar", requireAuth, async (req: AuthRequest, res) => {
  const suscripcionId = String(req.body.suscripcionId ?? "");
  const plan = await queryOne("SELECT * FROM suscripciones WHERE id = ?", [suscripcionId]);
  if (!plan) return res.status(404).json({ error: "Plan no encontrado" });
  if (plan.tipo !== req.user!.rol) {
    return res.status(400).json({ error: "Este plan no aplica a tu tipo de cuenta" });
  }
  await run(
    "UPDATE suscripciones_usuario SET estado = 'cancelada' WHERE usuario_id = ? AND estado = 'activa'",
    [req.user!.id]
  );
  const id = await nextId("SU", "suscripciones_usuario");
  const fecha = new Date().toISOString().split("T")[0];
  const fin = new Date();
  fin.setMonth(fin.getMonth() + (plan.duracion === "anual" ? 12 : 1));
  await run("INSERT INTO suscripciones_usuario VALUES (?,?,?,?,?,?,?)", [
    id,
    req.user!.id,
    suscripcionId,
    fecha,
    fin.toISOString().split("T")[0],
    "activa",
    1,
  ]);
  res.status(201).json({ ok: true, id });
});

// --- Ingresos ---
app.get("/api/arrendador/ingresos", requireAuth, async (req: AuthRequest, res) => {
  if (req.user!.rol !== "arrendador") {
    return res.status(403).json({ error: "Solo arrendadores" });
  }
  const planRow = await queryOne(
    `SELECT s.comision_pct FROM suscripciones_usuario su
     JOIN suscripciones s ON s.id = su.suscripcion_id
     WHERE su.usuario_id = ? AND su.estado = 'activa' LIMIT 1`,
    [req.user!.id]
  );
  const comisionPct = Number(planRow?.comision_pct ?? 7);

  const rows = await queryAll(
    `SELECT r.*, e.nombre as espacio_nombre,
            u.nombres as arrendatario_nombres, u.apellidos as arrendatario_apellidos
     FROM reservas r
     JOIN espacios e ON e.id = r.espacio_id
     JOIN usuarios u ON u.id = r.usuario_arrendatario_id
     WHERE r.usuario_arrendador_id = ? AND r.estado IN ('completada', 'confirmada')
     ORDER BY r.fecha_inicio DESC`,
    [req.user!.id]
  );

  const detalle = rows.map((r) => {
    const ingreso = Number(r.precio_total) || 0;
    const comision = Math.round(ingreso * (comisionPct / 100) * 100) / 100;
    return {
      id: r.id,
      fechaInicio: r.fecha_inicio,
      espacioNombre: r.espacio_nombre,
      arrendatario: `${r.arrendatario_nombres} ${r.arrendatario_apellidos}`.trim(),
      estado: r.estado,
      ingreso,
      comision,
      neto: Math.round((ingreso - comision) * 100) / 100,
    };
  });

  const ingresos = detalle.reduce((s, d) => s + d.ingreso, 0);
  const comisiones = detalle.reduce((s, d) => s + d.comision, 0);
  res.json({
    resumen: {
      ingresos: Math.round(ingresos * 100) / 100,
      comisiones: Math.round(comisiones * 100) / 100,
      neto: Math.round((ingresos - comisiones) * 100) / 100,
      reservas: detalle.length,
      comisionPct,
    },
    detalle,
  });
});

// ÔöÇÔöÇÔöÇ Contenido ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
app.get("/api/faqs", async (_req, res) => {
  res.json(
    await queryAll("SELECT id, pregunta, respuesta, orden FROM faqs ORDER BY orden ASC")
  );
});

app.get("/api/politicas", async (req, res) => {
  const rol = String(req.query.rol ?? "arrendatario");
  res.json(
    await queryAll(
      "SELECT id, rol, titulo, contenido, orden FROM politicas WHERE rol = ? ORDER BY orden ASC",
      [rol]
    )
  );
});

app.post("/api/contacto", async (req, res) => {
  const b = req.body ?? {};
  if (!b.nombre || !b.correo || !b.mensaje) {
    return res.status(400).json({ error: "Nombre, correo y mensaje son requeridos" });
  }
  const id = await nextId("CON", "contactos");
  const fecha = new Date().toISOString();
  await run("INSERT INTO contactos VALUES (?,?,?,?,?,?)", [
    id,
    b.nombre,
    b.correo,
    b.telefono ?? "",
    b.mensaje,
    fecha,
  ]);
  res.status(201).json({ ok: true, id });
});

app.get("/api/preferencias", requireAuth, async (req: AuthRequest, res) => {
  const row = await queryOne("SELECT * FROM preferencias WHERE usuario_id = ?", [req.user!.id]);
  res.json({
    notificaciones: Boolean(row?.notificaciones ?? 1),
    ofertas: Boolean(row?.ofertas ?? 1),
    newsletter: Boolean(row?.newsletter ?? 1),
  });
});

app.put("/api/preferencias", requireAuth, async (req: AuthRequest, res) => {
  const b = req.body ?? {};
  await run(
    `INSERT INTO preferencias (usuario_id, notificaciones, ofertas, newsletter)
     VALUES (?,?,?,?)
     ON CONFLICT(usuario_id) DO UPDATE SET
       notificaciones = excluded.notificaciones,
       ofertas = excluded.ofertas,
       newsletter = excluded.newsletter`,
    [
      req.user!.id,
      b.notificaciones ? 1 : 0,
      b.ofertas ? 1 : 0,
      b.newsletter ? 1 : 0,
    ]
  );
  res.json({ ok: true });
});

// Lookup usuarios (para mostrar nombres en UI)
app.get("/api/usuarios/:id", requireAuth, async (req, res) => {
  const row = await queryOne("SELECT * FROM usuarios WHERE id = ?", [req.params.id]);
  if (!row) return res.status(404).json({ error: "No encontrado" });
  res.json(mapUsuario(row));
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

export default app;

if (!process.env.VERCEL) {
  ensureDb()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`API Prisma en http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Error iniciando DB", err);
      process.exit(1);
    });
}
