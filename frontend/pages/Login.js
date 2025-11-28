import { h } from 'https://esm.sh/preact@10.19.3';
import { useState } from 'https://esm.sh/preact@10.19.3/hooks';
import { Input } from '../components/Input.js';
import { Button } from '../components/Button.js';
import { authAPI } from '../services/api.js';

export function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await authAPI.login({ email, password });
            onLogin(result.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return h('div', { className: 'min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100' },
        h('div', { className: 'card max-w-md w-full mx-4' },
            h('div', { className: 'text-center mb-8' },
                h('h1', { className: 'text-3xl font-bold text-gray-900 mb-2' }, '📚 ColegioSync'),
                h('p', { className: 'text-gray-600' }, 'Recordatorios escolares para familias')
            ),

            h('form', { onSubmit: handleSubmit },
                h(Input, {
                    label: 'Email',
                    type: 'email',
                    value: email,
                    onChange: setEmail,
                    placeholder: 'tu@email.com',
                    required: true
                }),

                h(Input, {
                    label: 'Contraseña',
                    type: 'password',
                    value: password,
                    onChange: setPassword,
                    placeholder: '••••••••',
                    required: true
                }),

                error && h('div', { className: 'bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4' },
                    error
                ),

                h(Button, {
                    type: 'submit',
                    className: 'w-full',
                    disabled: loading
                }, loading ? 'Iniciando sesión...' : 'Iniciar Sesión')
            ),

            h('div', { className: 'mt-6 p-4 bg-blue-50 rounded-lg text-sm' },
                h('p', { className: 'font-semibold text-gray-700 mb-2' }, 'Usuarios de prueba:'),
                h('ul', { className: 'space-y-1 text-gray-600' },
                    h('li', {}, '👨‍💼 Admin: admin@colegio.com / admin123'),
                    h('li', {}, '👩‍🏫 Coordinador: coordinador@colegio.com / coord123'),
                    h('li', {}, '👨‍👩‍👧 Padre: padre@test.com / padre123')
                )
            )
        )
    );
}
