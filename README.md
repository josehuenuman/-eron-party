# ColegioSync

Sistema de recordatorios escolares para familias - Una PWA que centraliza información de Google Classroom, emails y WhatsApp en un solo calendario organizado por cursos.

## 🚀 Stack Tecnológico

- **Backend**: Cloudflare Workers + Hono.js + D1 (SQLite)
- **Frontend**: Preact + TailwindCSS + PWA
- **Auth**: JWT con httpOnly cookies
- **Push**: Web Push API con VAPID

## 📋 Roles de Usuario

- **Administrador**: Gestiona cursos y coordinadores
- **Coordinador**: Publica eventos y recordatorios
- **Padres**: Se suscriben a cursos y reciben notificaciones

## 🛠️ Configuración Inicial

```bash
# Instalar dependencias
npm install

# Crear base de datos D1
npm run db:create
# Copiar el database_id generado a wrangler.toml

# Aplicar schema y datos de prueba
npm run db:reset

# Generar claves VAPID para push notifications
npx web-push generate-vapid-keys

# Configurar secrets
wrangler secret put JWT_SECRET
wrangler secret put VAPID_PUBLIC_KEY
wrangler secret put VAPID_PRIVATE_KEY
```

## 🏃 Desarrollo

```bash
# Servidor de desarrollo
npm run dev

# Deploy a producción
npm run deploy
```

## 👥 Usuarios de Prueba

Después de ejecutar `npm run db:seed`:

- **Admin**: admin@colegio.com / admin123
- **Coordinador**: coordinador@colegio.com / coord123
- **Padre**: padre@test.com / padre123

## 📱 Funcionalidades

- ✅ Dashboard "¿Qué hay hoy?" / "Esta semana"
- ✅ Calendario mensual con filtros por curso
- ✅ Lista de materiales necesarios
- ✅ Suscripción a múltiples cursos
- ✅ Notificaciones push programadas
- ✅ Confirmaciones de lectura
- ✅ Recordatorios privados
- ✅ Modo offline con Service Worker

## 📄 Licencia

MIT
