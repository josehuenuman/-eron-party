
import { h } from 'https://esm.sh/preact@10.19.3';
import { useState, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import { Layout } from '../components/Layout.js';
import { Modal } from '../components/Modal.js';
import { EventCard } from '../components/EventCard.js';
import { Button } from '../components/Button.js';
import { EventForm } from '../components/EventForm.js';
import { eventsAPI } from '../services/api.js';
import { useToast } from '../components/Toast.js';

export function CalendarPage({ user }) {
    const { addToast } = useToast();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [dayEvents, setDayEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadEvents();
    }, [currentDate]);

    const loadEvents = async () => {
        setLoading(true);
        try {
            const result = await eventsAPI.list();
            console.log('Loaded events:', result.events);
            setEvents(result.events || []);
        } catch (error) {
            console.error('Error loading events:', error);
            addToast('Error al cargar eventos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveEvent = async (eventData) => {
        try {
            console.log('Saving event:', eventData);
            await eventsAPI.create(eventData);
            await loadEvents();
            setShowForm(false);
            addToast('Evento creado correctamente', 'success');
        } catch (error) {
            console.error('Error saving event:', error);
            addToast('Error al crear evento: ' + error.message, 'error');
        }
    };

    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Días del mes anterior
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Días del mes actual
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const getEventsForDay = (date) => {
        if (!date) return [];
        // Comparación segura usando strings locales YYYY-MM-DD
        // Ajustamos la fecha a local para evitar problemas de zona horaria
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        console.log(`Checking date: ${dateStr}`);
        return events.filter(e => e.event_date === dateStr);
    };

    const handleDayClick = (date) => {
        if (!date) return;
        const eventsForDay = getEventsForDay(date);
        setSelectedDay(date);
        setDayEvents(eventsForDay);
    };

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const isToday = (date) => {
        if (!date) return false;
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const days = getDaysInMonth();
    const monthName = currentDate.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
    const canCreateEvents = user?.role === 'coordinator' || user?.role === 'admin';

    return h(Layout, {
        activeTab: 'calendar',
        showFAB: canCreateEvents,
        onFABClick: () => setShowForm(true)
    },
        h('div', { className: 'max-w-4xl mx-auto' },
            // Header
            h('div', { className: 'flex justify-between items-center mb-6' },
                h(Button, { variant: 'secondary', onClick: previousMonth }, '← Anterior'),
                h('h1', { className: 'text-2xl font-bold text-gray-900 capitalize' }, monthName),
                h(Button, { variant: 'secondary', onClick: nextMonth }, 'Siguiente →')
            ),

            // Calendar Grid
            loading ? h('div', { className: 'text-center py-12' }, 'Cargando...') :
                h('div', { className: 'bg-white rounded-lg shadow overflow-hidden' },
                    // Días de la semana
                    h('div', { className: 'grid grid-cols-7 gap-px bg-gray-200' },
                        ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day =>
                            h('div', {
                                key: day,
                                className: 'bg-gray-50 p-2 text-center text-sm font-semibold text-gray-700'
                            }, day)
                        )
                    ),

                    // Días del mes
                    h('div', { className: 'grid grid-cols-7 gap-px bg-gray-200' },
                        days.map((date, index) => {
                            const dayEvents = date ? getEventsForDay(date) : [];
                            const hasEvents = dayEvents.length > 0;

                            return h('div', {
                                key: index,
                                className: `bg-white p-2 min-h-[80px] ${date ? 'cursor-pointer hover:bg-gray-50' : ''
                                    } ${isToday(date) ? 'bg-blue-50' : ''}`,
                                onClick: () => date && handleDayClick(date)
                            },
                                date && h('div', {},
                                    h('div', { className: `text-sm font-medium ${isToday(date) ? 'text-blue-600' : 'text-gray-900'}` },
                                        date.getDate()
                                    ),
                                    hasEvents && h('div', { className: 'mt-1 flex flex-wrap gap-1' },
                                        dayEvents.slice(0, 3).map((event, i) => {
                                            const course = event.courses?.[0];
                                            return h('div', {
                                                key: i,
                                                className: 'w-2 h-2 rounded-full',
                                                style: { backgroundColor: course?.color || '#3B82F6' },
                                                title: event.title
                                            });
                                        }),
                                        dayEvents.length > 3 && h('span', { className: 'text-xs text-gray-500' }, `+${dayEvents.length - 3}`)
                                    )
                                )
                            );
                        })
                    )
                ),

            // Modal de eventos del día
            selectedDay && h(Modal, {
                isOpen: true,
                onClose: () => setSelectedDay(null),
                title: selectedDay.toLocaleDateString('es-AR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            },
                dayEvents.length === 0 ?
                    h('p', { className: 'text-gray-500 text-center py-4' }, 'No hay eventos este día') :
                    h('div', { className: 'space-y-3' },
                        dayEvents.map(event =>
                            h(EventCard, { key: event.id, event })
                        )
                    )
            ),

            // Modal de creación de evento
            showForm && h(EventForm, {
                onSave: handleSaveEvent,
                onClose: () => setShowForm(false)
            })
        )
    );
}
