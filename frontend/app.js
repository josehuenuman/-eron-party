import { h } from 'https://esm.sh/preact@10.19.3';
import { useState, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import { Login } from './pages/Login.js';
import { Dashboard } from './pages/Dashboard.js';
import { Profile } from './pages/Profile.js';
import { CalendarPage } from './pages/CalendarPage.js';
import { MaterialsPage } from './pages/MaterialsPage.js';
import { MyCourses } from './pages/MyCourses.js';
import { AdminCourses } from './pages/AdminCourses.js';
import { CoordEvents } from './pages/CoordEvents.js';
import { authAPI } from './services/api.js';

import { ToastProvider } from './components/Toast.js';

export function App() {
    return h(ToastProvider, {}, h(AppContent));
}

function AppContent() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState('dashboard');

    useEffect(() => {
        loadUser();

        const handleNavigation = () => {
            const path = window.location.pathname;
            if (path === '/profile') setCurrentPage('profile');
            else if (path === '/calendar') setCurrentPage('calendar');
            else if (path === '/materials') setCurrentPage('materials');
            else if (path === '/my-courses') setCurrentPage('my-courses');
            else if (path === '/admin/courses') setCurrentPage('admin-courses');
            else if (path === '/coord/events') setCurrentPage('coord-events');
            else setCurrentPage('dashboard');
        };

        window.addEventListener('popstate', handleNavigation);
        handleNavigation();

        return () => window.removeEventListener('popstate', handleNavigation);
    }, []);

    const loadUser = async () => {
        try {
            const result = await authAPI.me();
            setUser(result.user);
        } catch (error) {
            console.log('No hay sesión activa');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (userData) => {
        setUser(userData);
        setCurrentPage('dashboard');
    };

    const handleLogout = async () => {
        try {
            await authAPI.logout();
            setUser(null);
            setCurrentPage('dashboard');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    if (loading) {
        return h('div', { className: 'min-h-screen flex items-center justify-center' },
            h('div', { className: 'text-xl text-gray-600' }, 'Cargando...')
        );
    }

    if (!user) {
        return h(Login, { onLogin: handleLogin });
    }

    // Router con protección de rutas
    switch (currentPage) {
        case 'calendar':
            return h(CalendarPage, { user });
        case 'materials':
            return h(MaterialsPage, { user });
        case 'profile':
            return h(Profile, { user, onLogout: handleLogout });
        case 'my-courses':
            return user.role === 'parent'
                ? h(MyCourses, { user })
                : h(Dashboard, { user });
        case 'admin-courses':
            return user.role === 'admin'
                ? h(AdminCourses, { user })
                : h(Dashboard, { user });
        case 'coord-events':
            return user.role === 'coordinator'
                ? h(CoordEvents, { user })
                : h(Dashboard, { user });
        case 'dashboard':
        default:
            return h(Dashboard, { user });
    }
}
