import { h } from 'https://esm.sh/preact@10.19.3';
import { formatDate, formatTime } from '../utils/dates.js';
import { EVENT_TYPES } from '../utils/constants.js';

export function EventCard({ event, onClick }) {
    const eventType = EVENT_TYPES.find(t => t.value === event.event_type);
    const emoji = eventType?.emoji || '📅';

    // Parsear nombres y colores de cursos
    const courseNames = event.course_names ? event.course_names.split(',') : [];
    const courseColors = event.course_colors ? event.course_colors.split(',') : [];

    const hasMaterials = event.materials && event.materials.length > 0;

    return h('div', {
        className: `card event-card cursor-pointer hover:shadow-md transition-shadow ${event.priority ? `priority-${event.priority}` : ''}`,
        style: { borderLeftColor: courseColors[0] || '#3B82F6' },
        onClick: () => onClick(event)
    },
        h('div', { className: 'flex justify-between items-start mb-2' },
            h('div', { className: 'flex-1' },
                h('div', { className: 'flex items-center gap-2 mb-1' },
                    h('span', { className: 'text-lg' }, emoji),
                    event.start_time && h('span', { className: 'text-sm text-gray-500' }, formatTime(event.start_time))
                ),
                h('h3', { className: 'font-semibold text-gray-900' }, event.title)
            ),
            event.priority === 'urgent' && h('span', { className: 'badge bg-red-100 text-red-700' }, 'Urgente'),
            event.priority === 'important' && h('span', { className: 'badge bg-yellow-100 text-yellow-700' }, 'Importante')
        ),

        h('div', { className: 'flex flex-wrap gap-2 mt-2' },
            courseNames.map((name, i) =>
                h('span', {
                    key: i,
                    className: 'badge text-white text-xs',
                    style: { backgroundColor: courseColors[i] || '#3B82F6' }
                }, name.trim())
            ),
            hasMaterials && h('span', { className: 'badge bg-blue-50 text-blue-700' }, '🎒 Materiales')
        )
    );
}
