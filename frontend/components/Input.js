import { h } from 'https://esm.sh/preact@10.19.3';

export function Input({ label, type = 'text', value, onChange, placeholder, required, error, className = '' }) {
    return h('div', { className: `mb-4 ${className}` },
        label && h('label', { className: 'block text-sm font-medium text-gray-700 mb-1' },
            label,
            required && h('span', { className: 'text-red-500' }, ' *')
        ),
        h('input', {
            type,
            className: `input ${error ? 'border-red-500' : ''}`,
            value,
            onInput: (e) => onChange(e.target.value),
            placeholder,
            required
        }),
        error && h('p', { className: 'text-sm text-red-600 mt-1' }, error)
    );
}
