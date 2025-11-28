import { Hono } from 'hono';
import { authMiddleware, AuthUser } from '../middleware/auth';
import { addDays, getToday } from '../utils/dates';

const materials = new Hono();

// Aplicar autenticación a todas las rutas
materials.use('*', authMiddleware);

/**
 * GET /api/materials
 * Obtener materiales de los próximos 7 días
 */
materials.get('/', async (c) => {
    try {
        const user = c.get('user') as AuthUser;
        const db = c.env.DB;
        const today = getToday();
        const nextWeek = addDays(today, 7);

        // Obtener materiales de eventos próximos de cursos suscritos
        const { results } = await db
            .prepare(`
        SELECT DISTINCT 
          m.id, m.description, m.event_id,
          e.title as event_title, e.event_date, e.start_time,
          mc.checked, mc.checked_at
        FROM materials m
        JOIN events e ON m.event_id = e.id
        LEFT JOIN material_checks mc ON m.id = mc.material_id AND mc.user_id = ?
        WHERE e.event_date BETWEEN ? AND ?
          AND (
            (e.visibility = 'public' AND e.id IN (
              SELECT DISTINCT ec.event_id
              FROM event_courses ec
              WHERE ec.course_id IN (
                SELECT course_id FROM subscriptions WHERE user_id = ?
              )
            ))
            OR (e.visibility = 'private' AND e.created_by = ?)
          )
        ORDER BY e.event_date, e.start_time, m.sort_order
      `)
            .bind(user.id, today, nextWeek, user.id, user.id)
            .all();

        return c.json({ materials: results });
    } catch (error: any) {
        console.error('Error al obtener materiales:', error);
        return c.json({ error: 'Error al obtener materiales' }, 500);
    }
});

/**
 * POST /api/materials/:id/check
 * Toggle check de material
 */
materials.post('/:id/check', async (c) => {
    try {
        const user = c.get('user') as AuthUser;
        const materialId = c.req.param('id');
        const db = c.env.DB;

        // Verificar si existe el check
        const existing = await db
            .prepare('SELECT checked FROM material_checks WHERE material_id = ? AND user_id = ?')
            .bind(materialId, user.id)
            .first();

        if (existing) {
            // Toggle
            const newChecked = existing.checked === 1 ? 0 : 1;
            await db
                .prepare('UPDATE material_checks SET checked = ?, checked_at = CURRENT_TIMESTAMP WHERE material_id = ? AND user_id = ?')
                .bind(newChecked, materialId, user.id)
                .run();

            return c.json({ success: true, checked: newChecked === 1 });
        } else {
            // Crear check
            await db
                .prepare('INSERT INTO material_checks (material_id, user_id, checked, checked_at) VALUES (?, ?, 1, CURRENT_TIMESTAMP)')
                .bind(materialId, user.id)
                .run();

            return c.json({ success: true, checked: true });
        }
    } catch (error: any) {
        console.error('Error al actualizar check de material:', error);
        return c.json({ error: 'Error al actualizar material' }, 500);
    }
});

export default materials;
