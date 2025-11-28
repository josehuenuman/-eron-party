import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import { authMiddleware, AuthUser } from '../middleware/auth';

const subscriptions = new Hono();

// Aplicar autenticación a todas las rutas
subscriptions.use('*', authMiddleware);

/**
 * GET /api/subscriptions
 * Obtener suscripciones del usuario
 */
subscriptions.get('/', async (c) => {
    try {
        const user = c.get('user') as AuthUser;
        const db = c.env.DB;

        const { results } = await db
            .prepare(`
        SELECT s.id, s.child_alias, c.id as course_id, c.name as course_name, c.color as course_color
        FROM subscriptions s
        JOIN courses c ON s.course_id = c.id
        WHERE s.user_id = ? AND c.active = 1
        ORDER BY c.name
      `)
            .bind(user.id)
            .all();

        return c.json({ subscriptions: results });
    } catch (error: any) {
        console.error('Error al obtener suscripciones:', error);
        return c.json({ error: 'Error al obtener suscripciones' }, 500);
    }
});

/**
 * POST /api/subscriptions
 * Suscribirse a un curso
 */
subscriptions.post('/', async (c) => {
    try {
        const user = c.get('user') as AuthUser;
        const { course_id, child_alias } = await c.req.json();

        if (!course_id) {
            return c.json({ error: 'course_id es requerido' }, 400);
        }

        const db = c.env.DB;

        // Verificar que el curso existe
        const course = await db
            .prepare('SELECT id FROM courses WHERE id = ? AND active = 1')
            .bind(course_id)
            .first();

        if (!course) {
            return c.json({ error: 'Curso no encontrado' }, 404);
        }

        // Verificar si ya está suscrito
        const existing = await db
            .prepare('SELECT id FROM subscriptions WHERE user_id = ? AND course_id = ?')
            .bind(user.id, course_id)
            .first();

        if (existing) {
            return c.json({ error: 'Ya estás suscrito a este curso' }, 409);
        }

        const subId = nanoid();

        await db
            .prepare('INSERT INTO subscriptions (id, user_id, course_id, child_alias) VALUES (?, ?, ?, ?)')
            .bind(subId, user.id, course_id, child_alias || null)
            .run();

        return c.json({
            success: true,
            subscription: { id: subId, course_id, child_alias },
        });
    } catch (error: any) {
        console.error('Error al crear suscripción:', error);
        return c.json({ error: 'Error al suscribirse' }, 500);
    }
});

/**
 * DELETE /api/subscriptions/:id
 * Desuscribirse de un curso
 */
subscriptions.delete('/:id', async (c) => {
    try {
        const user = c.get('user') as AuthUser;
        const subId = c.req.param('id');
        const db = c.env.DB;

        // Verificar que la suscripción pertenece al usuario
        const subscription = await db
            .prepare('SELECT id FROM subscriptions WHERE id = ? AND user_id = ?')
            .bind(subId, user.id)
            .first();

        if (!subscription) {
            return c.json({ error: 'Suscripción no encontrada' }, 404);
        }

        await db
            .prepare('DELETE FROM subscriptions WHERE id = ?')
            .bind(subId)
            .run();

        return c.json({ success: true });
    } catch (error: any) {
        console.error('Error al eliminar suscripción:', error);
        return c.json({ error: 'Error al desuscribirse' }, 500);
    }
});

export default subscriptions;
