import { h } from 'https://esm.sh/preact@10.19.3';
import { useState, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import { Layout } from '../components/Layout.js';
import { Button } from '../components/Button.js';
import { authAPI, pushAPI } from '../services/api.js';
import { pushService } from '../services/push-service.js';

export function Profile({ user, onLogout }) {
    const [preferences, setPreferences] = useState({
        notification_evening: true,
        notification_morning: true,
        notification_time_evening: '20:00',
        notification_time_morning: '07:00',
        notification_only_important: false
    });
    const [pushEnabled, setPushEnabled] = useState(false);
    const [loadingPush, setLoadingPush] = useState(false);

    useEffect(() => {
        if (user) {
            setPreferences({
                notification_evening: user.notification_evening === 1,
                notification_morning: user.notification_morning === 1,
                notification_time_evening: user.notification_time_evening || '20:00',
                notification_time_morning: user.notification_time_morning || '07:00',
                notification_only_important: user.notification_only_important === 1
            });
            checkPushStatus();
        }
    }, [user]);

    const checkPushStatus = async () => {
        const subscription = await pushService.getSubscription();
        setPushEnabled(!!subscription);
    };

    const handlePushToggle = async () => {
        setLoadingPush(true);
        try {
            if (pushEnabled) {
                await pushService.unsubscribe();
                setPushEnabled(false);
            } else {
                await pushService.subscribe();
                setPushEnabled(true);
            }
        } catch (error) {
            console.error('Error toggling push:', error);
            alert('Error al cambiar estado de notificaciones: ' + error.message);
        } finally {
            setLoadingPush(false);
        }
    };

    const handleSavePreferences = async () => {
        try {
            await pushAPI.updatePreferences({
                notification_evening: preferences.notification_evening ? 1 : 0,
                notification_morning: preferences.notification_morning ? 1 : 0,
                notification_time_evening: preferences.notification_time_evening,
                notification_time_morning: preferences.notification_time_morning,
                notification_only_important: preferences.notification_only_important ? 1 : 0
            });
            alert('Preferencias guardadas');
        } catch (error) {
            console.error('Error al guardar preferencias:', error);
            alert('Error al guardar preferencias');
        }
    };

    return h(Layout, { activeTab: 'profile' },
        h('div', { className: 'max-w-2xl mx-auto' },
            h('h1', { className: 'text-3xl font-bold text-gray-900 mb-6' }, 'Perfil'),

            // Info del usuario
            h('div', { className: 'card mb-6' },
                h('h2', { className: 'text-xl font-semibold mb-4' }, 'Información'),
                h('div', { className: 'space-y-2' },
                    h('p', {},
                        h('span', { className: 'font-medium' }, 'Nombre: '),
                        h('span', { className: 'text-gray-700' }, user?.name)
                    ),
                    h('p', {},
                        h('span', { className: 'font-medium' }, 'Email: '),
                        h('span', { className: 'text-gray-700' }, user?.email)
                    ),
                    h('p', {},
                        h('span', { className: 'font-medium' }, 'Rol: '),
                        h('span', { className: 'text-gray-700' },
                            user?.role === 'admin' ? 'Administrador' :
                                user?.role === 'coordinator' ? 'Coordinador' : 'Padre'
                        )
                    )
                )
            ),

            // Preferencias de notificaciones
            h('div', { className: 'card mb-6' },
                h('h2', { className: 'text-xl font-semibold mb-4' }, 'Notificaciones'),

                h('div', { className: 'space-y-4' },
                    // Push Notifications Toggle
                    h('div', { className: 'flex items-center justify-between border-b pb-4 mb-4' },
                        h('div', {},
                            h('span', { className: 'font-medium block' }, 'Notificaciones Push'),
                            h('span', { className: 'text-sm text-gray-500' }, 'Recibir alertas en este dispositivo')
                        ),
                        h('button', {
                            onClick: handlePushToggle,
                            className: `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${pushEnabled ? 'bg-blue-600' : 'bg-gray-200'}`
                        },
                            h('span', {
                                className: `inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pushEnabled ? 'translate-x-6' : 'translate-x-1'}`
                            })
                        )
                    ),

                    h('label', { className: 'flex items-center justify-between' },
                        h('span', {}, 'Recordatorio en la noche'),
                        h('input', {
                            type: 'checkbox',
                            className: 'checkbox',
                            checked: preferences.notification_evening,
                            onChange: (e) => setPreferences({ ...preferences, notification_evening: e.target.checked })
                        })
                    ),

                    preferences.notification_evening && h('div', { className: 'ml-4' },
                        h('label', { className: 'block text-sm text-gray-600 mb-1' }, 'Hora:'),
                        h('input', {
                            type: 'time',
                            className: 'input',
                            value: preferences.notification_time_evening,
                            onChange: (e) => setPreferences({ ...preferences, notification_time_evening: e.target.value })
                        })
                    ),

                    h('label', { className: 'flex items-center justify-between' },
                        h('span', {}, 'Recordatorio en la mañana'),
                        h('input', {
                            type: 'checkbox',
                            className: 'checkbox',
                            checked: preferences.notification_morning,
                            onChange: (e) => setPreferences({ ...preferences, notification_morning: e.target.checked })
                        })
                    ),

                    preferences.notification_morning && h('div', { className: 'ml-4' },
                        h('label', { className: 'block text-sm text-gray-600 mb-1' }, 'Hora:'),
                        h('input', {
                            type: 'time',
                            className: 'input',
                            value: preferences.notification_time_morning,
                            onChange: (e) => setPreferences({ ...preferences, notification_time_morning: e.target.value })
                        })
                    ),

                    h('label', { className: 'flex items-center justify-between' },
                        h('span', {}, 'Solo eventos importantes/urgentes'),
                        h('input', {
                            type: 'checkbox',
                            className: 'checkbox',
                            checked: preferences.notification_only_important,
                            onChange: (e) => setPreferences({ ...preferences, notification_only_important: e.target.checked })
                        })
                    )
                ),

                h('div', { className: 'mt-6' },
                    h(Button, { onClick: handleSavePreferences }, 'Guardar Preferencias')
                )
            ),

            // Navegación adicional
            user?.role === 'parent' && h('div', { className: 'card mb-6' },
                h('a', {
                    href: '/my-courses',
                    onClick: (e) => { e.preventDefault(); window.history.pushState({}, '', '/my-courses'); window.dispatchEvent(new PopStateEvent('popstate')); },
                    className: 'block py-3 text-blue-600 font-medium'
                }, '📚 Mis Cursos →')
            ),

            user?.role === 'admin' && h('div', { className: 'card mb-6' },
                h('a', {
                    href: '/admin/courses',
                    onClick: (e) => { e.preventDefault(); window.history.pushState({}, '', '/admin/courses'); window.dispatchEvent(new PopStateEvent('popstate')); },
                    className: 'block py-3 text-blue-600 font-medium'
                }, '⚙️ Gestionar Cursos →')
            ),

            user?.role === 'coordinator' && h('div', { className: 'card mb-6' },
                h('a', {
                    href: '/coord/events',
                    onClick: (e) => { e.preventDefault(); window.history.pushState({}, '', '/coord/events'); window.dispatchEvent(new PopStateEvent('popstate')); },
                    className: 'block py-3 text-blue-600 font-medium'
                }, '📅 Mis Eventos →')
            ),

            // Logout
            h('div', { className: 'card' },
                h(Button, {
                    variant: 'danger',
                    className: 'w-full',
                    onClick: onLogout
                }, 'Cerrar Sesión')
            )
        )
    );
}
