import { Hono } from 'hono';
import { authMiddleware, AuthUser } from '../middleware/auth';

const push = new Hono();

// Aplicar autenticación a todas las rutas
push.use('*', authMiddleware);

/**
 * POST /api/push/subscribe
 * Guardar suscripción de push
 */
push.post('/subscribe', async (c) => {
    try {
        const user = c.get('user') as AuthUser;
        const { subscription } = await c.req.json();

        if (!subscription) {
            return c.json({ error: 'subscription es requerido' }, 400);
        }

        const db = c.env.DB;

        // Guardar suscripción
        await db
            .prepare('UPDATE users SET push_subscription = ? WHERE id = ?')
            .bind(JSON.stringify(subscription), user.id)
            .run();

        return c.json({ success: true });
    } catch (error: any) {
        console.error('Error al guardar suscripción push:', error);
        return c.json({ error: 'Error al suscribirse a notificaciones' }, 500);
    }
});

/**
 * DELETE /api/push/unsubscribe
 * Eliminar suscripción de push
 */
push.delete('/unsubscribe', async (c) => {
    try {
        const user = c.get('user') as AuthUser;
        const db = c.env.DB;

        await db
            .prepare('UPDATE users SET push_subscription = NULL WHERE id = ?')
            .bind(user.id)
            .run();

        return c.json({ success: true });
    } catch (error: any) {
        console.error('Error al eliminar suscripción push:', error);
        return c.json({ error: 'Error al desuscribirse' }, 500);
    }
});

/**
 * PUT /api/push/preferences
 * Actualizar preferencias de notificaciones
 */
push.put('/preferences', async (c) => {
    try {
        const user = c.get('user') as AuthUser;
        const {
            notification_evening,
            notification_morning,
            notification_time_evening,
            notification_time_morning,
            notification_only_important,
        } = await c.req.json();

        const db = c.env.DB;

        await db
            .prepare(`
        UPDATE users SET
          notification_evening = ?,
          notification_morning = ?,
          notification_time_evening = ?,
          notification_time_morning = ?,
          notification_only_important = ?
        WHERE id = ?
      `)
            .bind(
                notification_evening ?? 1,
                notification_morning ?? 1,
                notification_time_evening || '20:00',
                notification_time_morning || '07:00',
                notification_only_important ?? 0,
                user.id
            )
            .run();

        return c.json({ success: true });
    } catch (error: any) {
        console.error('Error al actualizar preferencias:', error);
        return c.json({ error: 'Error al actualizar preferencias' }, 500);
    }
});

/**
 * GET /api/push/vapid-key
 * Obtener clave pública VAPID
 */
push.get('/vapid-key', (c) => {
    return c.json({ publicKey: c.env.VAPID_PUBLIC_KEY });
});

export default push;
