import { Hono } from 'hono';
import { cors } from 'hono/cors';

import auth from './routes/auth';
import courses from './routes/courses';
import events from './routes/events';
import subscriptions from './routes/subscriptions';
import materials from './routes/materials';
import push from './routes/push';

type Bindings = {
    DB: D1Database;
    JWT_SECRET: string;
    VAPID_PUBLIC_KEY: string;
    VAPID_PRIVATE_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS - permite orígenes específicos cuando se usan credentials
app.use('*', cors({
    origin: (origin) => {
        // Permitir todos los subdominios de colegiosync-app.pages.dev y el Worker
        const allowedOrigins = [
            'https://colegiosync-app.pages.dev',
            'https://colegiosync.infra-cloudflare-811.workers.dev',
            'http://localhost:3000',
            'http://localhost:8787'
        ];

        // Permitir cualquier subdominio de pages.dev para deployments
        if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.colegiosync-app.pages.dev'))) {
            return origin;
        }

        return allowedOrigins[0]; // Default
    },
    credentials: true,
}));

// Root endpoint
app.get('/', (c) => {
    return c.json({
        message: 'ColegioSync API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            courses: '/api/courses',
            events: '/api/events',
            subscriptions: '/api/subscriptions',
            materials: '/api/materials',
            push: '/api/push'
        }
    });
});

// API Routes
app.route('/api/auth', auth);
app.route('/api/courses', courses);
app.route('/api/events', events);
app.route('/api/subscriptions', subscriptions);
app.route('/api/materials', materials);
app.route('/api/push', push);

// 404
app.notFound((c) => {
    return c.json({ error: 'Ruta no encontrada' }, 404);
});

export default app;
