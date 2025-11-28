# Guía de Desarrollo Local

## 🚀 Setup Rápido

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Levantar Backend (API)
```bash
npm run dev
```
Esto iniciará el servidor en **http://localhost:8787**

### 3. Servir Frontend (en otra terminal)
```bash
cd frontend
python3 -m http.server 3000
# O con Node:
# npx serve -p 3000
```
Abre **http://localhost:3000/dev-server.html** en tu navegador

## 📝 Arquitectura de Desarrollo

En desarrollo local, el proyecto está dividido en 2 partes:

### Backend (Puerto 8787)
- Cloudflare Workers con Wrangler
- API REST con Hono.js
- Base de datos D1 (simulada con Miniflare)
- Endpoints disponibles en `http://localhost:8787/api/*`

### Frontend (Puerto 3000)
- Archivos estáticos HTML/CSS/JS
- Preact desde CDN
- Llama al backend en `http://localhost:8787/api`

## 🔧 Comandos Útiles

### Backend
```bash
# Desarrollo local
npm run dev

# Ver base de datos
wrangler d1 execute colegiosync-db --local --command "SELECT * FROM users;"

# Resetear base de datos
npm run db:reset
```

### Probar la API
```bash
# Probar login
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"padre@test.com","password":"padre123"}'

# Ver eventos de hoy
curl http://localhost:8787/api/events/today \
  -H "Cookie: auth_token=YOUR_TOKEN"
```

## 🐛 Solución de Problemas

### Error: __STATIC_CONTENT_MANIFEST
✅ **Solucionado**: Ahora el backend solo sirve la API.
El frontend se sirve por separado en desarrollo.

### CORS Errors
Si ves errores de CORS, verifica que:
1. El backend está corriendo en `localhost:8787`
2. El frontend está accediendo a `http://localhost:8787/api`
3. Las credenciales están habilitadas en `api.js`

### Cookies no se guardan
En desarrollo local, asegúrate de:
- Usar HTTP (no HTTPS) para ambos servidores
- La cookie se establece con `sameSite: 'Lax'` en desarrollo

## 📦 Estructura de Archivos

```
cr-app/
├── src/              # Backend (TypeScript)
│   ├── index.ts     # Entry point
│   ├── routes/      # API endpoints
│   └── utils/       # Helpers
├── frontend/         # Frontend (Preact)
│   ├── dev-server.html  # HTML para desarrollo
│   ├── index.html       # HTML para producción
│   └── ...
└── wrangler.toml    # Config de Workers
```

## 🚀 Deploy a Producción

Para producción, el frontend se debe servir desde Cloudflare Pages o similar:

```bash
# 1. Deploy backend
npm run deploy

# 2. Deploy frontend a Cloudflare Pages
# Conecta tu repo a Pages y apunta a /frontend
```

O puedes agregar la configuración `[site]` de vuelta a `wrangler.toml` para servir todo desde Workers.

## 🧪 Testing

### Test de autenticación
1. Abre http://localhost:3000/dev-server.html
2. Login con: `padre@test.com` / `padre123`
3. Deberías ver el dashboard

### Test de API directa
```bash
# Health check
curl http://localhost:8787/

# Login
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"padre@test.com","password":"padre123"}' \
  -c cookies.txt

# Ver eventos (con cookie)
curl http://localhost:8787/api/events/today -b cookies.txt
```

## 📚 Recursos

- [Wrangler Docs](https://developers.cloudflare.com/workers/wrangler/)
- [Hono.js Docs](https://hono.dev/)
- [Preact Docs](https://preactjs.com/)
- [D1 Database](https://developers.cloudflare.com/d1/)

---

**Happy coding! 🎉**
