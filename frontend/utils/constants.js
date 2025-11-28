// Colores de cursos predefinidos
export const COURSE_COLORS = [
    { name: 'Azul', value: '#3B82F6' },
    { name: 'Verde', value: '#10B981' },
    { name: 'Rojo', value: '#EF4444' },
    { name: 'Naranja', value: '#F97316' },
    { name: 'Violeta', value: '#8B5CF6' },
    { name: 'Rosa', value: '#EC4899' },
    { name: 'Amarillo', value: '#EAB308' },
    { name: 'Celeste', value: '#06B6D4' },
    { name: 'Lima', value: '#84CC16' },
    { name: 'Índigo', value: '#6366F1' },
];

// Tipos de eventos con emojis
export const EVENT_TYPES = [
    { value: 'event', label: '📅 Evento general', emoji: '📅' },
    { value: 'meeting', label: '👥 Reunión de padres', emoji: '👥' },
    { value: 'delivery', label: '📦 Entrega', emoji: '📦' },
    { value: 'deadline', label: '⏰ Fecha límite', emoji: '⏰' },
    { value: 'info', label: 'ℹ️ Información importante', emoji: 'ℹ️' },
    { value: 'material', label: '🎒 Materiales', emoji: '🎒' },
];

// Niveles de prioridad
export const PRIORITY_LEVELS = [
    { value: 'normal', label: 'Normal', color: 'transparent' },
    { value: 'important', label: 'Importante', color: '#FEF3C7' },
    { value: 'urgent', label: 'Urgente', color: '#FEE2E2' },
];

// URL base de la API
// En producción usa el Worker, en dev puede ser sobrescrito por window.API_BASE_URL
export const API_BASE_URL = (typeof window !== 'undefined' && window.API_BASE_URL)
    ? window.API_BASE_URL
    : 'https://colegiosync.infra-cloudflare-811.workers.dev/api';

