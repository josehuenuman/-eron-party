import { h } from 'https://esm.sh/preact@10.19.3';
import { useState, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import { Layout } from '../components/Layout.js';
import { Button } from '../components/Button.js';
import { Input } from '../components/Input.js';
import { EmptyState } from '../components/EmptyState.js';
import { coursesAPI, subscriptionsAPI } from '../services/api.js';

export function MyCourses() {
    const [courses, setCourses] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState(null);
    const [childAlias, setChildAlias] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [coursesResult, subsResult] = await Promise.all([
                coursesAPI.list(),
                subscriptionsAPI.list()
            ]);
            setCourses(coursesResult.courses || []);
            setSubscriptions(subsResult.subscriptions || []);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (courseId) => {
        try {
            await subscriptionsAPI.create({
                course_id: courseId,
                child_alias: childAlias
            });
            await loadData();
            setSubscribing(null);
            setChildAlias('');
        } catch (error) {
            alert('Error al suscribirse: ' + error.message);
        }
    };

    const handleUnsubscribe = async (subscriptionId) => {
        if (!confirm('¿Deseas desuscribirte de este curso?')) return;

        try {
            await subscriptionsAPI.delete(subscriptionId);
            await loadData();
        } catch (error) {
            alert('Error al desuscribirse: ' + error.message);
        }
    };

    const isSubscribed = (courseId) => {
        return subscriptions.some(sub => sub.course_id === courseId);
    };

    const getSubscription = (courseId) => {
        return subscriptions.find(sub => sub.course_id === courseId);
    };

    return h(Layout, { activeTab: 'profile' },
        h('div', { className: 'max-w-4xl mx-auto' },
            h('h1', { className: 'text-3xl font-bold text-gray-900 mb-6' }, 'Mis Cursos'),

            // Cursos suscritos
            h('div', { className: 'mb-8' },
                h('h2', { className: 'text-xl font-semibold text-gray-800 mb-4' }, 'Cursos Suscritos'),
                subscriptions.length === 0 ? h(EmptyState, {
                    emoji: '📚',
                    title: 'No estás suscrito a ningún curso',
                    message: 'Suscríbete a los cursos de tus hijos para recibir recordatorios'
                }) :
                    h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                        subscriptions.map(sub =>
                            h('div', { key: sub.id, className: 'card' },
                                h('div', { className: 'flex items-center justify-between' },
                                    h('div', { className: 'flex items-center gap-3' },
                                        h('div', {
                                            className: 'w-4 h-4 rounded-full',
                                            style: { backgroundColor: sub.course_color }
                                        }),
                                        h('div', {},
                                            h('h3', { className: 'font-semibold text-gray-900' }, sub.course_name),
                                            sub.child_alias && h('p', { className: 'text-sm text-gray-500' }, sub.child_alias)
                                        )
                                    ),
                                    h('button', {
                                        onClick: () => handleUnsubscribe(sub.id),
                                        className: 'text-red-600 hover:text-red-800 text-sm font-medium'
                                    }, 'Desuscribir')
                                )
                            )
                        )
                    )
            ),

            // Cursos disponibles
            h('div', {},
                h('h2', { className: 'text-xl font-semibold text-gray-800 mb-4' }, 'Cursos Disponibles'),
                loading ? h('div', { className: 'text-center py-12' }, 'Cargando...') :
                    h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                        courses
                            .filter(course => !isSubscribed(course.id))
                            .map(course =>
                                h('div', { key: course.id, className: 'card' },
                                    h('div', { className: 'flex items-center justify-between' },
                                        h('div', { className: 'flex items-center gap-3' },
                                            h('div', {
                                                className: 'w-4 h-4 rounded-full',
                                                style: { backgroundColor: course.color }
                                            }),
                                            h('div', {},
                                                h('h3', { className: 'font-semibold text-gray-900' }, course.name),
                                                h('p', { className: 'text-sm text-gray-500' }, `Año ${course.year}`)
                                            )
                                        ),
                                        subscribing === course.id ?
                                            h('div', { className: 'flex gap-2 items-center' },
                                                h('input', {
                                                    type: 'text',
                                                    className: 'input text-sm w-32',
                                                    placeholder: 'Nombre hijo',
                                                    value: childAlias,
                                                    onChange: (e) => setChildAlias(e.target.value)
                                                }),
                                                h('button', {
                                                    onClick: () => handleSubscribe(course.id),
                                                    className: 'text-green-600 hover:text-green-800 text-sm font-medium'
                                                }, '✓'),
                                                h('button', {
                                                    onClick: () => setSubscribing(null),
                                                    className: 'text-gray-600 hover:text-gray-800 text-sm font-medium'
                                                }, '✕')
                                            ) :
                                            h('button', {
                                                onClick: () => setSubscribing(course.id),
                                                className: 'text-blue-600 hover:text-blue-800 text-sm font-medium'
                                            }, 'Suscribirse')
                                    )
                                )
                            )
                    )
            )
        )
    );
}
