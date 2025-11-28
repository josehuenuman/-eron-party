import { h } from 'https://esm.sh/preact@10.19.3';
import { useState, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import { Layout } from '../components/Layout.js';
import { EventCard } from '../components/EventCard.js';
import { EventForm } from '../components/EventForm.js';
import { EmptyState } from '../components/EmptyState.js';
import { Button } from '../components/Button.js';
import { eventsAPI } from '../services/api.js';

import { useToast } from '../components/Toast.js';

export function CoordEvents() {
    const { addToast } = useToast();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setLoading(true);
        try {
            const result = await eventsAPI.list();
            setEvents(result.events || []);
        } catch (error) {
            console.error('Error loading events:', error);
            addToast('Error al cargar eventos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (eventData) => {
        try {
            if (editingEvent) {
                await eventsAPI.update(editingEvent.id, eventData);
            } else {
                await eventsAPI.create(eventData);
            }
            await loadEvents();
            setShowForm(false);
            setEditingEvent(null);
        } catch (error) {
            throw error;
        }
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setShowForm(true);
    };

    const handleDelete = async (eventId) => {
        if (!confirm('¿Estás seguro de eliminar este evento?')) return;

        try {
            await eventsAPI.delete(eventId);
            addToast('Evento eliminado correctamente', 'success');
            await loadEvents();
        } catch (error) {
            addToast('Error al eliminar evento: ' + error.message, 'error');
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingEvent(null);
    };

    // Agrupar eventos por fecha
    const groupedEvents = events.reduce((acc, event) => {
        const date = event.event_date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(event);
        return acc;
    }, {});

    return h(Layout, { activeTab: 'profile', showFAB: true, onFABClick: () => setShowForm(true) },
        h('div', { className: 'max-w-4xl mx-auto' },
            h('div', { className: 'flex justify-between items-center mb-6' },
                h('h1', { className: 'text-3xl font-bold text-gray-900' }, 'Mis Eventos'),
                h(Button, { onClick: () => setShowForm(true) }, '+ Nuevo Evento')
            ),

            loading ? h('div', { className: 'text-center py-12' }, 'Cargando...') :
                events.length === 0 ? h(EmptyState, {
                    emoji: '📅',
                    title: 'No hay eventos',
                    message: 'Crea tu primer evento haciendo click en el botón de arriba'
                }) :
                    h('div', { className: 'space-y-6' },
                        Object.entries(groupedEvents)
                            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                            .map(([date, dateEvents]) =>
                                h('div', { key: date },
                                    h('h2', { className: 'text-lg font-semibold text-gray-700 mb-3' },
                                        new Date(date + 'T00:00:00').toLocaleDateString('es-AR', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })
                                    ),
                                    h('div', { className: 'space-y-3' },
                                        dateEvents.map(event =>
                                            h('div', { key: event.id, className: 'relative' },
                                                h(EventCard, { event }),
                                                h('div', { className: 'absolute top-2 right-2 flex gap-2' },
                                                    h('button', {
                                                        onClick: () => handleEdit(event),
                                                        className: 'bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600'
                                                    }, 'Editar'),
                                                    h('button', {
                                                        onClick: () => handleDelete(event.id),
                                                        className: 'bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600'
                                                    }, 'Eliminar')
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                    ),

            showForm && h(EventForm, {
                event: editingEvent,
                onSave: handleSave,
                onClose: handleCloseForm
            })
        )
    );
}
