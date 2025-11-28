import { h } from 'https://esm.sh/preact@10.19.3';
import { Navbar } from './Navbar.js';

export function Layout({ children, activeTab, showFAB, onFABClick }) {
    return h('div', { className: 'min-h-screen bg-gray-50 pb-20' },
        h('div', { className: 'container mx-auto px-4 py-6' },
            children
        ),

        h(Navbar, { activeTab }),

        // FAB (Floating Action Button) - solo para coordinadores
        showFAB && onFABClick && h('button', {
            onClick: onFABClick,
            className: 'fab',
            'aria-label': 'Crear evento'
        }, '+')
    );
}
