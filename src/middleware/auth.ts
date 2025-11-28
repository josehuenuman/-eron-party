import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { verifyToken } from '../utils/jwt';

export interface AuthUser {
    id: string;
    email: string;
    role: string;
}

/**
 * Middleware de autenticación
 * Lee JWT desde cookie y lo verifica
 */
export async function authMiddleware(c: Context, next: Next) {
    const token = getCookie(c, 'auth_token');

    if (!token) {
        return c.json({ error: 'No autorizado' }, 401);
    }

    const secret = c.env.JWT_SECRET;
    if (!secret) {
        return c.json({ error: 'Error de configuración del servidor' }, 500);
    }

    const user = await verifyToken(token, secret);

    if (!user) {
        return c.json({ error: 'Token inválido o expirado' }, 401);
    }

    // Adjuntar usuario al contexto
    c.set('user', user);

    await next();
}
