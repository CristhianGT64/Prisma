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

CREATE TABLE IF NOT EXISTS fechas_bloqueadas (
  espacio_id TEXT NOT NULL,
  arrendador_id TEXT NOT NULL,
  fecha TEXT NOT NULL,
  fecha_creacion TEXT,
  PRIMARY KEY (espacio_id, fecha),
  FOREIGN KEY (espacio_id) REFERENCES espacios(id),
  FOREIGN KEY (arrendador_id) REFERENCES usuarios(id)
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
