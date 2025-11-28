import { h } from 'https://esm.sh/preact@10.19.3';

export function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return h('div', { className: 'modal-overlay fade-in', onClick: onClose },
        h('div', {
            className: 'modal-content slide-up',
            onClick: (e) => e.stopPropagation()
        },
            h('div', { className: 'flex justify-between items-center mb-4' },
                h('h2', { className: 'text-2xl font-bold text-gray-900' }, title),
                h('button', {
                    className: 'text-gray-400 hover:text-gray-600 text-2xl font-bold',
                    onClick: onClose
                }, '×')
            ),
            h('div', {}, children)
        )
    );
}
