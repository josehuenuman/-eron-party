import { h } from 'https://esm.sh/preact@10.19.3';

export function Navbar({ active }) {
    const items = [
        { id: 'dashboard', label: 'Hoy', icon: '📅', href: '/' },
        { id: 'calendar', label: 'Calendario', icon: '📆', href: '/calendar' },
        { id: 'materials', label: 'Materiales', icon: '🎒', href: '/materials' },
        { id: 'profile', label: 'Perfil', icon: '👤', href: '/profile' }
    ];

    return h('nav', { className: 'bottom-nav' },
        items.map(item =>
            h('a', {
                key: item.id,
                href: item.href,
                className: `bottom-nav-item ${active === item.id ? 'active' : ''}`
            },
                h('span', { className: 'text-2xl' }, item.icon),
                h('span', {}, item.label)
            )
        )
    );
}
