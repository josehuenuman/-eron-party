-- Configuración del colegio (single tenant)
CREATE TABLE school (
  id TEXT PRIMARY KEY DEFAULT 'main',
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cursos
CREATE TABLE courses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  year INTEGER NOT NULL,
  active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Usuarios
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'parent',
  phone TEXT,
  push_subscription TEXT,
  notification_evening INTEGER DEFAULT 1,
  notification_morning INTEGER DEFAULT 1,
  notification_time_evening TEXT DEFAULT '20:00',
  notification_time_morning TEXT DEFAULT '07:00',
  notification_only_important INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Suscripciones de padres a cursos
CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  child_alias TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE(user_id, course_id)
);

-- Eventos/Recordatorios
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL DEFAULT 'event',
  event_date DATE NOT NULL,
  start_time TEXT,
  end_time TEXT,
  location TEXT,
  location_url TEXT,
  priority TEXT NOT NULL DEFAULT 'normal',
  visibility TEXT NOT NULL DEFAULT 'public',
  created_by TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Relación eventos-cursos (muchos a muchos)
CREATE TABLE event_courses (
  event_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  PRIMARY KEY (event_id, course_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Materiales por evento
CREATE TABLE materials (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Check de materiales por usuario
CREATE TABLE material_checks (
  material_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  checked INTEGER DEFAULT 0,
  checked_at DATETIME,
  PRIMARY KEY (material_id, user_id),
  FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Confirmaciones de lectura de eventos
CREATE TABLE event_reads (
  event_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (event_id, user_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_visibility ON events(visibility);
CREATE INDEX idx_event_courses_course ON event_courses(course_id);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_course ON subscriptions(course_id);
