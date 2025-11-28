import { Hono } from 'hono';
import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import { nanoid } from 'nanoid';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateToken, verifyToken } from '../utils/jwt';
import { authMiddleware } from '../middleware/auth';

const auth = new Hono();

/**
 * POST /api/auth/register
 * Registro de nuevo usuario
 */
auth.post('/register', async (c) => {
    try {
        const { email, name, password, role = 'parent' } = await c.req.json();

        if (!email || !name || !password) {
            return c.json({ error: 'Email, nombre y contraseña son requeridos' }, 400);
        }

        const db = c.env.DB;

        // Verificar si el email ya existe
        const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();

        if (existing) {
            return c.json({ error: 'El email ya está registrado' }, 409);
        }

        // Hash de contraseña
        const passwordHash = await hashPassword(password);
        const userId = nanoid();

        // Insertar usuario
        await db
            .prepare(
                'INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, ?)'
            )
            .bind(userId, email, name, passwordHash, role)
            .run();

        // Generar token
        const token = await generateToken({ id: userId, email, role }, c.env.JWT_SECRET);

        // Establecer cookie
        setCookie(c, 'auth_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60, // 7 días
        });

        return c.json({
            success: true,
            user: { id: userId, email, name, role },
        });
    } catch (error: any) {
        console.error('Error en registro:', error);
        return c.json({ error: 'Error al registrar usuario' }, 500);
    }
});

/**
 * POST /api/auth/login
 * Login de usuario
 */
auth.post('/login', async (c) => {
    try {
        const { email, password } = await c.req.json();

        if (!email || !password) {
            return c.json({ error: 'Email y contraseña son requeridos' }, 400);
        }

        const db = c.env.DB;

        // Buscar usuario
        const user = await db
            .prepare('SELECT id, email, name, password_hash, role FROM users WHERE email = ?')
            .bind(email)
            .first();

        if (!user) {
            return c.json({ error: 'Credenciales inválidas' }, 401);
        }

        // Verificar contraseña
        const valid = await verifyPassword(password, user.password_hash as string);

        if (!valid) {
            return c.json({ error: 'Credenciales inválidas' }, 401);
        }

        // Generar token
        const token = await generateToken(
            { id: user.id as string, email: user.email as string, role: user.role as string },
            c.env.JWT_SECRET
        );

        // Establecer cookie
        setCookie(c, 'auth_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60,
        });

        return c.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error: any) {
        console.error('Error en login:', error);
        return c.json({ error: 'Error al iniciar sesión' }, 500);
    }
});

/**
 * POST /api/auth/logout
 * Cerrar sesión
 */
auth.post('/logout', (c) => {
    deleteCookie(c, 'auth_token');
    return c.json({ success: true });
});

/**
 * GET /api/auth/me
 * Obtener usuario actual
 */
auth.get('/me', authMiddleware, async (c) => {
    try {
        const user = c.get('user');
        const db = c.env.DB;

        const userData = await db
            .prepare('SELECT id, email, name, role, phone, notification_evening, notification_morning, notification_time_evening, notification_time_morning, notification_only_important FROM users WHERE id = ?')
            .bind(user.id)
            .first();

        if (!userData) {
            return c.json({ error: 'Usuario no encontrado' }, 404);
        }

        return c.json({ user: userData });
    } catch (error: any) {
        console.error('Error al obtener usuario:', error);
        return c.json({ error: 'Error al obtener usuario' }, 500);
    }
});

export default auth;
