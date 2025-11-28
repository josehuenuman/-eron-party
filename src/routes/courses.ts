import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import { authMiddleware } from '../middleware/auth';
import { requireAdmin } from '../middleware/roles';

const courses = new Hono();

// Aplicar autenticación a todas las rutas
courses.use('*', authMiddleware);

/**
 * GET /api/courses
 * Listar todos los cursos activos
 */
courses.get('/', async (c) => {
    try {
        const db = c.env.DB;

        const { results } = await db
            .prepare('SELECT id, name, color, year, active FROM courses WHERE active = 1 ORDER BY name')
            .all();

        return c.json({ courses: results });
    } catch (error: any) {
        console.error('Error al listar cursos:', error);
        return c.json({ error: 'Error al obtener cursos' }, 500);
    }
});

/**
 * POST /api/courses
 * Crear nuevo curso (solo admin)
 */
courses.post('/', requireAdmin(), async (c) => {
    try {
        const { name, color, year } = await c.req.json();

        if (!name || !color || !year) {
            return c.json({ error: 'Nombre, color y año son requeridos' }, 400);
        }

        const db = c.env.DB;
        const courseId = nanoid();

        await db
            .prepare('INSERT INTO courses (id, name, color, year) VALUES (?, ?, ?, ?)')
            .bind(courseId, name, color, year)
            .run();

        return c.json({
            success: true,
            course: { id: courseId, name, color, year, active: 1 },
        });
    } catch (error: any) {
        console.error('Error al crear curso:', error);
        return c.json({ error: 'Error al crear curso' }, 500);
    }
});

/**
 * PUT /api/courses/:id
 * Actualizar curso (solo admin)
 */
courses.put('/:id', requireAdmin(), async (c) => {
    try {
        const courseId = c.req.param('id');
        const { name, color, year, active } = await c.req.json();

        const db = c.env.DB;

        // Verificar que el curso existe
        const existing = await db.prepare('SELECT id FROM courses WHERE id = ?').bind(courseId).first();

        if (!existing) {
            return c.json({ error: 'Curso no encontrado' }, 404);
        }

        // Actualizar
        await db
            .prepare('UPDATE courses SET name = ?, color = ?, year = ?, active = ? WHERE id = ?')
            .bind(name, color, year, active ?? 1, courseId)
            .run();

        return c.json({
            success: true,
            course: { id: courseId, name, color, year, active: active ?? 1 },
        });
    } catch (error: any) {
        console.error('Error al actualizar curso:', error);
        return c.json({ error: 'Error al actualizar curso' }, 500);
    }
});

/**
 * DELETE /api/courses/:id
 * Eliminar curso (solo admin)
 */
courses.delete('/:id', requireAdmin(), async (c) => {
    try {
        const courseId = c.req.param('id');
        const db = c.env.DB;

        // Soft delete - marcar como inactivo
        await db
            .prepare('UPDATE courses SET active = 0 WHERE id = ?')
            .bind(courseId)
            .run();

        return c.json({ success: true });
    } catch (error: any) {
        console.error('Error al eliminar curso:', error);
        return c.json({ error: 'Error al eliminar curso' }, 500);
    }
});

export default courses;
