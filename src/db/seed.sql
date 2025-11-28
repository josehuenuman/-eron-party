-- Insertar colegio
INSERT INTO school (id, name, code) VALUES ('main', 'Colegio Demo', 'DEMO2024');

-- Insertar cursos de ejemplo
INSERT INTO courses (id, name, color, year) VALUES 
  ('c1', 'Sala de 3 años', '#EC4899', 2024),
  ('c2', 'Sala de 4 años', '#8B5CF6', 2024),
  ('c3', 'Sala de 5 años', '#3B82F6', 2024),
  ('c4', '1er Grado A', '#10B981', 2024),
  ('c5', '1er Grado B', '#F97316', 2024),
  ('c6', '2do Grado', '#EAB308', 2024);

-- Usuario admin (password: admin123)
-- Hash generado con bcrypt rounds=10
INSERT INTO users (id, email, name, password_hash, role) VALUES 
  ('admin1', 'admin@colegio.com', 'Administrador', '$2a$10$GfjxUntNNFBwtqXiDTh3qOSJ0BJrC2RLsjjOr6bb0uenGSx6erCF6', 'admin');

-- Usuario coordinador (password: coord123)  
INSERT INTO users (id, email, name, password_hash, role) VALUES
  ('coord1', 'coordinador@colegio.com', 'María Coordinadora', '$2a$10$7ubP0LpPfdWPf7/1FW9tueEXMT7.aGmP1slDOOytYp9lkveKyxRPW', 'coordinator');

-- Usuario padre de prueba (password: padre123)
INSERT INTO users (id, email, name, password_hash, role) VALUES
  ('parent1', 'padre@test.com', 'Juan Padre', '$2a$10$W02/27SgKhuNsANIxb9oSOQKhKg2lYmIYZ4V6v9O8rlXKCQXV5acW', 'parent');

-- Suscripciones del padre
INSERT INTO subscriptions (id, user_id, course_id, child_alias) VALUES
  ('sub1', 'parent1', 'c3', 'Hijo mayor'),
  ('sub2', 'parent1', 'c1', 'Hijo menor');

-- Eventos de ejemplo (fechas relativas a hoy para testing)
INSERT INTO events (id, title, description, event_type, event_date, start_time, priority, visibility, created_by) VALUES
  ('ev1', 'Clase pública de música 🎼🎵', 'Los esperamos para disfrutar de la muestra de fin de año', 'event', date('now', '+1 day'), '11:50', 'normal', 'public', 'coord1'),
  ('ev2', 'Taller de inglés', NULL, 'event', date('now', '+1 day'), '15:40', 'normal', 'public', 'coord1'),
  ('ev3', 'Encuentro biodanza con abuelos 👵🏻👴🏻', 'Invitamos a los abuelos a compartir una jornada especial', 'event', date('now', '+2 days'), '11:00', 'important', 'public', 'coord1'),
  ('ev4', 'Reunión articulación primer grado', 'Reunión para padres de sala de 5 sobre el paso a primaria', 'meeting', date('now', '+5 days'), '08:00', 'important', 'public', 'coord1'),
  ('ev5', 'Entrega de carpetas 📦', 'Retiro de carpetas en cada sala', 'delivery', date('now', '+7 days'), '12:15', 'urgent', 'public', 'coord1'),
  ('ev6', 'Colación sala de 5 años ⛪🎓', 'Ceremonia de egreso en la Capilla del colegio', 'event', date('now', '+10 days'), '08:00', 'urgent', 'public', 'coord1');

-- Asociar eventos a cursos
INSERT INTO event_courses (event_id, course_id) VALUES
  ('ev1', 'c3'),
  ('ev2', 'c3'),
  ('ev3', 'c3'),
  ('ev4', 'c3'),
  ('ev5', 'c1'),
  ('ev5', 'c2'),
  ('ev5', 'c3'),
  ('ev6', 'c3');

-- Materiales para evento de entrega
INSERT INTO materials (id, event_id, description, sort_order) VALUES
  ('mat1', 'ev5', 'Bolsa grande para carpeta', 1),
  ('mat2', 'ev5', 'Identificación del padre/madre', 2);

-- Material para colación
INSERT INTO materials (id, event_id, description, sort_order) VALUES
  ('mat3', 'ev6', 'Vestimenta formal', 1),
  ('mat4', 'ev6', 'Cámara de fotos', 2);
