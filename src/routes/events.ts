import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import { authMiddleware, AuthUser } from '../middleware/auth';
import { requireCoordinator } from '../middleware/roles';
import { getToday, getWeekStart, getWeekEnd } from '../utils/dates';

const events = new Hono();

// Aplicar autenticación a todas las rutas
events.use('*', authMiddleware);

/**
 * GET /api/events
 * Obtener eventos de los cursos suscritos del usuario
 */
events.get('/', async (c) => {
    try {
        const user = c.get('user') as AuthUser;
        const db = c.env.DB;

        // Obtener eventos de cursos suscritos o todos si es coordinador/admin
        let query;
        if (user.role === 'parent') {
            query = `
        SELECT DISTINCT e.*, 
          GROUP_CONCAT(c.name) as course_names,
          GROUP_CONCAT(c.color) as course_colors
        FROM events e
        JOIN event_courses ec ON e.id = ec.event_id
        JOIN courses c ON ec.course_id = c.id
        WHERE (
          e.visibility = 'public' 
          AND ec.course_id IN (
            SELECT course_id FROM subscriptions WHERE user_id = ?
          )
        ) OR (
          e.visibility = 'private' AND e.created_by = ?
        )
        GROUP BY e.id
        ORDER BY e.event_date, e.start_time
      `;
        } else {
            query = `
        SELECT e.*, 
          GROUP_CONCAT(DISTINCT c.name) as course_names,
          GROUP_CONCAT(DISTINCT c.color) as course_colors
        FROM events e
        LEFT JOIN event_courses ec ON e.id = ec.event_id
        LEFT JOIN courses c ON ec.course_id = c.id
        GROUP BY e.id
        ORDER BY e.event_date, e.start_time
      `;
        }

        const { results } = await db
            .prepare(query)
            .bind(user.role === 'parent' ? user.id : undefined, user.role === 'parent' ? user.id : undefined)
            .all();

        return c.json({ events: results });
    } catch (error: any) {
        console.error('Error al obtener eventos:', error);
        return c.json({ error: 'Error al obtener eventos' }, 500);
    }
});

/**
 * GET /api/events/today
 * Eventos de hoy
 */
events.get('/today', async (c) => {
    try {
        const user = c.get('user') as AuthUser;
        const db = c.env.DB;
        const today = getToday();

        let query;
        if (user.role === 'parent') {
            query = `
        SELECT DISTINCT e.*, 
          GROUP_CONCAT(c.name) as course_names,
          GROUP_CONCAT(c.color) as course_colors
        FROM events e
        JOIN event_courses ec ON e.id = ec.event_id
        JOIN courses c ON ec.course_id = c.id
        WHERE e.event_date = ? 
          AND (
            (e.visibility = 'public' AND ec.course_id IN (
              SELECT course_id FROM subscriptions WHERE user_id = ?
            ))
            OR (e.visibility = 'private' AND e.created_by = ?)
          )
        GROUP BY e.id
        ORDER BY e.start_time
      `;
        } else {
            query = `
        SELECT e.*, 
          GROUP_CONCAT(c.name) as course_names,
          GROUP_CONCAT(c.color) as course_colors
        FROM events e
        LEFT JOIN event_courses ec ON e.id = ec.event_id
        LEFT JOIN courses c ON ec.course_id = c.id
        WHERE e.event_date = ?
        GROUP BY e.id
        ORDER BY e.start_time
      `;
        }

        const stmt = db.prepare(query);
        const { results } = user.role === 'parent'
            ? await stmt.bind(today, user.id, user.id).all()
            : await stmt.bind(today).all();

        return c.json({ events: results });
    } catch (error: any) {
        console.error('Error al obtener eventos de hoy:', error);
        return c.json({ error: 'Error al obtener eventos' }, 500);
    }
});

/**
 * GET /api/events/week
 * Eventos de esta semana
 */
events.get('/week', async (c) => {
    try {
        const user = c.get('user') as AuthUser;
        const db = c.env.DB;
        const weekStart = getWeekStart();
        const weekEnd = getWeekEnd();

        let query;
        if (user.role === 'parent') {
            query = `
        SELECT DISTINCT e.*, 
          GROUP_CONCAT(c.name) as course_names,
          GROUP_CONCAT(c.color) as course_colors
        FROM events e
        JOIN event_courses ec ON e.id = ec.event_id
        JOIN courses c ON ec.course_id = c.id
        WHERE e.event_date BETWEEN ? AND ?
          AND (
            (e.visibility = 'public' AND ec.course_id IN (
              SELECT course_id FROM subscriptions WHERE user_id = ?
            ))
            OR (e.visibility = 'private' AND e.created_by = ?)
          )
        GROUP BY e.id
        ORDER BY e.event_date, e.start_time
      `;
        } else {
            query = `
        SELECT e.*, 
          GROUP_CONCAT(c.name) as course_names,
          GROUP_CONCAT(c.color) as course_colors
        FROM events e
        LEFT JOIN event_courses ec ON e.id = ec.event_id
        LEFT JOIN courses c ON ec.course_id = c.id
        WHERE e.event_date BETWEEN ? AND ?
        GROUP BY e.id
        ORDER BY e.event_date, e.start_time
      `;
        }

        const stmt = db.prepare(query);
        const { results } = user.role === 'parent'
            ? await stmt.bind(weekStart, weekEnd, user.id, user.id).all()
            : await stmt.bind(weekStart, weekEnd).all();

        return c.json({ events: results });
    } catch (error: any) {
        console.error('Error al obtener eventos de la semana:', error);
        return c.json({ error: 'Error al obtener eventos' }, 500);
    }
    return c.json({ error: 'Error al obtener eventos' }, 500);
}
});

/**
 * GET /api/events/upcoming
 * Próximos 5 eventos
 */
events.get('/upcoming', async (c) => {
    try {
        const user = c.get('user') as AuthUser;
        const db = c.env.DB;
        const today = getToday();

        let query;
        if (user.role === 'parent') {
            query = `
        SELECT DISTINCT e.*, 
          GROUP_CONCAT(c.name) as course_names,
          GROUP_CONCAT(c.color) as course_colors
        FROM events e
        JOIN event_courses ec ON e.id = ec.event_id
        JOIN courses c ON ec.course_id = c.id
        WHERE e.event_date >= ?
          AND (
            (e.visibility = 'public' AND ec.course_id IN (
              SELECT course_id FROM subscriptions WHERE user_id = ?
            ))
            OR (e.visibility = 'private' AND e.created_by = ?)
          )
        GROUP BY e.id
        ORDER BY e.event_date, e.start_time
        LIMIT 5
      `;
        } else {
            query = `
        SELECT e.*, 
          GROUP_CONCAT(c.name) as course_names,
          GROUP_CONCAT(c.color) as course_colors
        FROM events e
        LEFT JOIN event_courses ec ON e.id = ec.event_id
        LEFT JOIN courses c ON ec.course_id = c.id
        WHERE e.event_date >= ?
        GROUP BY e.id
        ORDER BY e.event_date, e.start_time
        LIMIT 5
      `;
        }

        const stmt = db.prepare(query);
        const { results } = user.role === 'parent'
            ? await stmt.bind(today, user.id, user.id).all()
            : await stmt.bind(today).all();

        return c.json({ events: results });
    } catch (error: any) {
        console.error('Error al obtener próximos eventos:', error);
        return c.json({ error: 'Error al obtener eventos' }, 500);
    }
});

/**
 * GET /api/events/:id
 * Obtener detalle de evento
 */
events.get('/:id', async (c) => {
    try {
        const user = c.get('user') as AuthUser;
        const eventId = c.req.param('id');
        const db = c.env.DB;

        // Obtener evento
        const event = await db
            .prepare('SELECT * FROM events WHERE id = ?')
            .bind(eventId)
            .first();

        if (!event) {
            return c.json({ error: 'Evento no encontrado' }, 404);
        }

        // Obtener cursos asociados
        const { results: courses } = await db
            .prepare(`
        SELECT c.id, c.name, c.color
        FROM courses c
        JOIN event_courses ec ON c.id = ec.course_id
        WHERE ec.event_id = ?
      `)
            .bind(eventId)
            .all();

        // Obtener materiales
        const { results: materials } = await db
            .prepare(`
        SELECT m.*, mc.checked
        FROM materials m
        LEFT JOIN material_checks mc ON m.id = mc.material_id AND mc.user_id = ?
        WHERE m.event_id = ?
        ORDER BY m.sort_order
      `)
            .bind(user.id, eventId)
            .all();

        // Verificar si el usuario lo leyó
        const read = await db
            .prepare('SELECT read_at FROM event_reads WHERE event_id = ? AND user_id = ?')
            .bind(eventId, user.id)
            .first();

        return c.json({
            event: {
                ...event,
                courses,
                materials,
                read: !!read,
                read_at: read?.read_at,
            },
        });
    } catch (error: any) {
        console.error('Error al obtener detalle de evento:', error);
        return c.json({ error: 'Error al obtener evento' }, 500);
    }
});

/**
 * POST /api/events
 * Crear evento (coordinador)
 */
events.post('/', requireCoordinator(), async (c) => {
    try {
        const user = c.get('user') as AuthUser;
        const {
            title,
            description,
            event_type,
            event_date,
            start_time,
            end_time,
            location,
            location_url,
            priority,
            visibility,
            course_ids,
            materials,
        } = await c.req.json();

        if (!title || !event_date || !event_type) {
            return c.json({ error: 'Título, fecha y tipo son requeridos' }, 400);
        }

        if (!course_ids || course_ids.length === 0) {
            return c.json({ error: 'Debe seleccionar al menos un curso' }, 400);
        }

        const db = c.env.DB;
        const eventId = nanoid();

        // Insertar evento
        await db
            .prepare(`
        INSERT INTO events (
          id, title, description, event_type, event_date, start_time, end_time,
          location, location_url, priority, visibility, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
            .bind(
                eventId,
                title,
                description || null,
                event_type,
                event_date,
                start_time || null,
                end_time || null,
                location || null,
                location_url || null,
                priority || 'normal',
                visibility || 'public',
                user.id
            )
            .run();

        // Asociar cursos
        for (const courseId of course_ids) {
            await db
                .prepare('INSERT INTO event_courses (event_id, course_id) VALUES (?, ?)')
                .bind(eventId, courseId)
                .run();
        }

        // Agregar materiales si hay
        if (materials && materials.length > 0) {
            for (let i = 0; i < materials.length; i++) {
                const materialId = nanoid();
                await db
                    .prepare('INSERT INTO materials (id, event_id, description, sort_order) VALUES (?, ?, ?, ?)')
                    .bind(materialId, eventId, materials[i], i)
                    .run();
            }
        }

        return c.json({ success: true, event: { id: eventId } });
    } catch (error: any) {
        console.error('Error al crear evento:', error);
        return c.json({ error: 'Error al crear evento' }, 500);
    }
});

/**
 * PUT /api/events/:id
 * Actualizar evento (coordinador, solo propios)
 */
events.put('/:id', requireCoordinator(), async (c) => {
    try {
        const user = c.get('user') as AuthUser;
        const eventId = c.req.param('id');
        const db = c.env.DB;

        // Verificar que el evento existe y fue creado por este usuario
        const existing = await db
            .prepare('SELECT created_by FROM events WHERE id = ?')
            .bind(eventId)
            .first();

        if (!existing) {
            return c.json({ error: 'Evento no encontrado' }, 404);
        }

        if (existing.created_by !== user.id && user.role !== 'admin') {
            return c.json({ error: 'No tienes permiso para editar este evento' }, 403);
        }

        const {
            title,
            description,
            event_type,
            event_date,
            start_time,
            end_time,
            location,
            location_url,
            priority,
            course_ids,
        } = await c.req.json();

        // Actualizar evento
        await db
            .prepare(`
        UPDATE events SET
          title = ?, description = ?, event_type = ?, event_date = ?,
          start_time = ?, end_time = ?, location = ?, location_url = ?,
          priority = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
            .bind(
                title,
                description || null,
                event_type,
                event_date,
                start_time || null,
                end_time || null,
                location || null,
                location_url || null,
                priority || 'normal',
                eventId
            )
            .run();

        // Actualizar cursos asociados
        if (course_ids) {
            // Eliminar asociaciones existentes
            await db.prepare('DELETE FROM event_courses WHERE event_id = ?').bind(eventId).run();

            // Crear nuevas asociaciones
            for (const courseId of course_ids) {
                await db
                    .prepare('INSERT INTO event_courses (event_id, course_id) VALUES (?, ?)')
                    .bind(eventId, courseId)
                    .run();
            }
        }

        return c.json({ success: true });
    } catch (error: any) {
        console.error('Error al actualizar evento:', error);
        return c.json({ error: 'Error al actualizar evento' }, 500);
    }
});

/**
 * DELETE /api/events/:id
 * Eliminar evento (coordinador, solo propios)
 */
events.delete('/:id', requireCoordinator(), async (c) => {
    try {
        const user = c.get('user') as AuthUser;
        const eventId = c.req.param('id');
        const db = c.env.DB;

        // Verificar que el evento existe y fue creado por este usuario
        const existing = await db
            .prepare('SELECT created_by FROM events WHERE id = ?')
            .bind(eventId)
            .first();

        if (!existing) {
            return c.json({ error: 'Evento no encontrado' }, 404);
        }

        if (existing.created_by !== user.id && user.role !== 'admin') {
            return c.json({ error: 'No tienes permiso para eliminar este evento' }, 403);
        }

        // Eliminar evento (cascade eliminará relaciones)
        await db.prepare('DELETE FROM events WHERE id = ?').bind(eventId).run();

        return c.json({ success: true });
    } catch (error: any) {
        console.error('Error al eliminar evento:', error);
        return c.json({ error: 'Error al eliminar evento' }, 500);
    }
});

/**
 * POST /api/events/:id/read
 * Marcar evento como leído
 */
events.post('/:id/read', async (c) => {
    try {
        const user = c.get('user') as AuthUser;
        const eventId = c.req.param('id');
        const db = c.env.DB;

        // Verificar si ya lo leyó
        const existing = await db
            .prepare('SELECT * FROM event_reads WHERE event_id = ? AND user_id = ?')
            .bind(eventId, user.id)
            .first();

        if (existing) {
            return c.json({ success: true, already_read: true });
        }

        // Marcar como leído
        await db
            .prepare('INSERT INTO event_reads (event_id, user_id) VALUES (?, ?)')
            .bind(eventId, user.id)
            .run();

        return c.json({ success: true });
    } catch (error: any) {
        console.error('Error al marcar evento como leído:', error);
        return c.json({ error: 'Error al marcar como leído' }, 500);
    }
});

export default events;
