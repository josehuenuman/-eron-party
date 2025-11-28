import { Context, Next } from 'hono';
import { AuthUser } from './auth';

/**
 * Middleware para requerir rol de administrador
 */
export function requireAdmin() {
    return async (c: Context, next: Next) => {
        const user = c.get('user') as AuthUser;

        if (!user || user.role !== 'admin') {
            return c.json({ error: 'Se requiere rol de administrador' }, 403);
        }

        await next();
    };
}

/**
 * Middleware para requerir rol de coordinador o superior
 */
export function requireCoordinator() {
    return async (c: Context, next: Next) => {
        const user = c.get('user') as AuthUser;

        if (!user || (user.role !== 'coordinator' && user.role !== 'admin')) {
            return c.json({ error: 'Se requiere rol de coordinador o administrador' }, 403);
        }

        await next();
    };
}

/**
 * Middleware para requerir usuario autenticado (cualquier rol)
 */
export function requireAuth() {
    return async (c: Context, next: Next) => {
        const user = c.get('user') as AuthUser;

        if (!user) {
            return c.json({ error: 'Se requiere autenticación' }, 403);
        }

        await next();
    };
}
