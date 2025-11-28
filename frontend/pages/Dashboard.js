import { h, Fragment } from 'https://esm.sh/preact@10.19.3';
import { useState, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import { Layout } from '../components/Layout.js';
import { EventCard } from '../components/EventCard.js';
import { EmptyState } from '../components/EmptyState.js';
import { Modal } from '../components/Modal.js';
import { Button } from '../components/Button.js';
import { eventsAPI } from '../services/api.js';
import { formatDate, formatTime, downloadICS } from '../utils/dates.js';

export function Dashboard() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setLoading(true);
        try {
            const result = await eventsAPI.upcoming();
            setEvents(result.events || []);
        } catch (error) {
            console.error('Error al cargar eventos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEventClick = async (event) => {
        try {
            const detailed = await eventsAPI.get(event.id);
            setSelectedEvent(detailed.event);
        } catch (error) {
            console.error('Error al cargar evento:', error);
        }
    };

    const handleMarkRead = async () => {
        if (!selectedEvent) return;
        try {
            await eventsAPI.markRead(selectedEvent.id);
            setSelectedEvent({ ...selectedEvent, read: true });
        } catch (error) {
            console.error('Error al marcar como leído:', error);
        }
    };

    // Agrupar eventos por fecha
    const groupedEvents = events.reduce((acc, event) => {
        const date = event.event_date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(event);
        return acc;
    }, {});

    return h(Layout, { activeTab: 'dashboard' },
        // Header
        h('div', { className: 'mb-6' },
            h('h1', { className: 'text-3xl font-bold text-gray-900 mb-2' }, 'Próximos Eventos'),
            h('p', { className: 'text-gray-600' }, 'Tus próximas 5 actividades importantes')
        ),

        // Eventos agrupados
        loading ? h('div', { className: 'text-center py-12' }, 'Cargando...') :
            events.length === 0 ? h(EmptyState, {
                emoji: '🎉',
                title: '¡Todo despejado!',
                message: 'No tienes eventos próximos.'
            }) :
                h('div', { className: 'space-y-6' },
                    Object.entries(groupedEvents).map(([date, dateEvents]) =>
                        h('div', { key: date },
                            h('h2', { className: 'text-lg font-semibold text-gray-700 mb-3' }, formatDate(date)),
                            h('div', { className: 'space-y-3' },
                                dateEvents.map(event =>
                                    h(EventCard, {
                                        key: event.id,
                                        event,
                                        onClick: handleEventClick
                                    })
                                )
                            )
                        )
                    )
                ),

        // Modal de detalle de evento
        selectedEvent && h(Modal, {
            isOpen: true,
            onClose: () => setSelectedEvent(null),
            title: selectedEvent.title
        },
            h('div', { className: 'space-y-4' },
                h('div', {},
                    h('p', { className: 'text-gray-600' },
                        '📅 ', formatDate(selectedEvent.event_date),
                        selectedEvent.start_time && ` · ${formatTime(selectedEvent.start_time)}`
                    )
                ),

                selectedEvent.description && h('div', {},
                    h('p', { className: 'text-gray-700' }, selectedEvent.description)
                ),

                selectedEvent.location && h('div', {},
                    h('p', { className: 'text-gray-600' },
                        '📍 ', selectedEvent.location
                    ),
                    selectedEvent.location_url && h('a', {
                        href: selectedEvent.location_url,
                        target: '_blank',
                        className: 'text-blue-600 text-sm'
                    }, 'Ver en el mapa')
                ),

                selectedEvent.courses && selectedEvent.courses.length > 0 && h('div', {},
                    h('p', { className: 'font-semibold text-gray-700 mb-2' }, 'Cursos:'),
                    h('div', { className: 'flex flex-wrap gap-2' },
                        selectedEvent.courses.map(course =>
                            h('span', {
                                key: course.id,
                                className: 'badge text-white',
                                style: { backgroundColor: course.color }
                            }, course.name)
                        )
                    )
                ),

                selectedEvent.materials && selectedEvent.materials.length > 0 && h('div', {},
                    h('p', { className: 'font-semibold text-gray-700 mb-2' }, 'Materiales necesarios:'),
                    h('ul', { className: 'list-disc list-inside space-y-1 text-gray-700' },
                        selectedEvent.materials.map(material =>
                            h('li', { key: material.id }, material.description)
                        )
                    )
                ),

                h('div', { className: 'flex gap-2 mt-6' },
                    !selectedEvent.read && h(Button, {
                        onClick: handleMarkRead
                    }, 'Marcar como visto'),

                    h(Button, {
                        variant: 'secondary',
                        onClick: () => downloadICS(selectedEvent)
                    }, '📅 Agregar al calendario')
                )
            )
        )
    );
}
