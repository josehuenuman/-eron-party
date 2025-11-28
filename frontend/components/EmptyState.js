import { h } from 'https://esm.sh/preact@10.19.3';

export function EmptyState({ emoji, title, message }) {
    return h('div', { className: 'text-center py-12' },
        h('div', { className: 'text-6xl mb-4' }, emoji),
        h('h3', { className: 'text-xl font-semibold text-gray-700 mb-2' }, title),
        h('p', { className: 'text-gray-500' }, message)
    );
}
