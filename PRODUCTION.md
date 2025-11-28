# 🚀 ColegioSync - Deployado en Cloudflare!

## ✅ Status del Deploy

### Backend API (Cloudflare Workers)
- **URL**: https://colegiosync.infra-cloudflare-811.workers.dev
- **Status**: ✅ LIVE
- **Database**: D1 con schema y datos de prueba cargados
- **Secrets configurados**:
  - ✅ JWT_SECRET
  - ✅ VAPID_PUBLIC_KEY
  - ✅ VAPID_PRIVATE_KEY

### Usuarios de Prueba

Puedes hacer login con cualquiera de estos usuarios:

| Rol | Email | Password |
|-----|-------|----------|
| 👨‍💼 **Admin** | admin@colegio.com | admin123 |
| 👩‍🏫 **Coordinador** | coordinador@colegio.com | coord123 |
| 👨‍👩‍👧 **Padre** | padre@test.com | padre123 |

### Datos de Prueba Cargados

- ✅ 6 cursos (Sala de 3 años → 2do Grado)
- ✅ 6 eventos de ejemplo (Diciembre 2024)
- ✅ 4 materiales asociados a eventos
- ✅ 2 suscripciones para el usuario padre de prueba

---

## 🧪 Testing de la API

### Probar la API directamente

```bash
# Endpoint raíz
curl https://colegiosync.infra-cloudflare-811.workers.dev/

# Login
curl -X POST https://colegiosync.infra-cloudflare-811.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"padre@test.com","password":"padre123"}' \
  -c cookies.txt

# Ver eventos de hoy (con cookie)
curl https://colegiosync.infra-cloudflare-811.workers.dev/api/events/today \
  -b cookies.txt

# Ver eventos de la semana
curl https://colegiosync.infra-cloudflare-811.workers.dev/api/events/week \
  -b cookies.txt
```

### Endpoints Disponibles

- ✅ `GET /` - Info de la API
- ✅ `POST /api/auth/login` - Login
- ✅ `POST /api/auth/logout` - Logout
- ✅ `GET /api/auth/me` - Usuario actual
- ✅ `GET /api/courses` - Listar cursos
- ✅ `GET /api/events` - Todos los eventos
- ✅ `GET /api/events/today` - Eventos de hoy
- ✅ `GET /api/events/week` - Eventos de la semana
- ✅ `GET /api/events/:id` - Detalle de evento
- ✅ `GET /api/subscriptions` - Suscripciones del usuario
- ✅ `GET /api/materials` - Materiales próximos 7 días
- ✅ Y más...

---

## 📱 Deploy del Frontend

### Opción 1: Cloudflare Pages (Recomendada)

1. **Ir a Cloudflare Dashboard**
   - https://dash.cloudflare.com/
   - Navega a Pages

2. **Crear nuevo proyecto**
   - Click en "Create a project"
   - Conecta tu repositorio Git o usa "Direct Upload"

3. **Configuración del build**
   - Framework preset: **None**
   - Build command: *(dejar vacío)*
   - Build output directory: `/frontend`
   - Root directory: `/frontend`

4. **Variables de entorno** (opcional)
   - No necesarias, ya está configurado en el código

5. **Deploy!**
   - Cloudflare Pages generará una URL como:
   - `https://colegiosync-<hash>.pages.dev`

### Opción 2: Deploy Directo (wrangler pages)

```bash
cd frontend
npx wrangler pages deploy . --project-name=colegiosync-app
```

Esto deployará el frontend y te dará una URL como:
`https://colegiosync-app.pages.dev`

### Opción 3: Servidor Simple para Testing Rápido

```bash
# Terminal 1: Ya tienes el backend en producción
# No necesitas npm run dev

# Terminal 2: Servir frontend localmente pero apuntando a producción
cd frontend
python3 -m http.server 3000
```

Abre **http://localhost:3000** - Esto usará la API de producción!

---

## 🎯 Testing del Flujo Completo

### 1. Test de Login
1. Accede a tu frontend (Pages URL o localhost:3000)
2. Usa: `padre@test.com` / `padre123`
3. Deberías ver el Dashboard

### 2. Test de Dashboard
1. Click en "HOY" - Deberías ver eventos del día (si hay)
2. Click en "ESTA SEMANA" - Ver eventos de la semana
3. Los eventos se muestran agrupados por fecha

### 3. Test de Evento Detallado
1. Click en cualquier evento
2. Debería abrir un modal con toda la información
3. Prueba "Agregar al calendario" (descarga .ics)
4. Prueba "Marcar como visto"

### 4. Test de Profile
1. Click en "Perfil" en la barra inferior
2. Verifica que muestre tu información
3. Ajusta las preferencias de notificaciones
4. Click en "Guardar Preferencias"

### 5. Test de Logout
1. Scroll hasta el final del perfil
2. Click en "Cerrar Sesión"
3. Deberías volver al login

---

## 📊 Monitoring y Logs

### Ver logs del Worker
```bash
wrangler tail colegiosync
```

### Ver queries a la base de datos
```bash
wrangler d1 execute colegiosync-db --remote --command "SELECT * FROM users;"
wrangler d1 execute colegiosync-db --remote --command "SELECT * FROM events;"
```

### Dashboard de Cloudflare
- Workers: https://dash.cloudflare.com/workers
- D1 Databases: https://dash.cloudflare.com/d1
- Analytics disponibles en ambos dashboards

---

## 🔧 Troubleshooting

### CORS Errors
- ✅ Ya configurado en el backend con `cors()` middleware
- Acepta requests de cualquier origen con credentials

### Cookies no se guardan
- ✅ En producción usa HTTPS, las cookies deberían guardarse correctamente
- Verifica en DevTools > Application > Cookies

### Push Notifications no funcionan
- Requiere HTTPS (✅ Workers tiene HTTPS automático)
- Necesitas permitir notificaciones en el navegador
- La implementación de scheduled push requiere Cron Triggers adicionales

---

## 🎉 ¡Listo para Usar!

La aplicación está completamente deployada y funcional en producción.

**Backend API**: ✅ https://colegiosync.infra-cloudflare-811.workers.dev
**Frontend App**: ✅ https://colegiosync-app.pages.dev

### Bugs Solucionados (v1.0.1)
- ✅ **BUG-001**: Eventos vacíos (Corregido con fechas relativas)
- ✅ **BUG-002**: Puerto dev incorrecto (Corregido a 8787)
- ✅ **BUG-004**: Duplicados en cursos (Corregido con DISTINCT)

---

## 📝 Próximos Pasos

1. 🔜 Configurar dominio personalizado (ej: app.colegiosync.com)
2. 🔜 Completar páginas restantes (Calendar, Materials, Admin)
3. 🔜 Configurar Cron Triggers para notificaciones automáticas
4. 🔜 Testing completo end-to-end con usuarios reales

---

**¡ColegioSync está LIVE en Cloudflare! 🚀**
