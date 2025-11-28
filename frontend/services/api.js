import { API_BASE_URL } from '../utils/constants.js';

/**
 * Wrapper para fetch con credentials
 */
async function apiCall(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Error de red' }));
        throw new Error(error.error || 'Error en la solicitud');
    }

    return response.json();
}

// Auth
export const authAPI = {
    register: (data) => apiCall('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => apiCall('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => apiCall('/auth/logout', { method: 'POST' }),
    me: () => apiCall('/auth/me'),
};

// Courses
export const coursesAPI = {
    list: () => apiCall('/courses'),
    create: (data) => apiCall('/courses', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiCall(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiCall(`/courses/${id}`, { method: 'DELETE' }),
};

// Events
export const eventsAPI = {
    list: () => apiCall('/events'),
    today: () => apiCall('/events/today'),
    week: () => apiCall('/events/week'),
    upcoming: () => apiCall('/events/upcoming'),
    get: (id) => apiCall(`/events/${id}`),
    create: (data) => apiCall('/events', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiCall(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiCall(`/events/${id}`, { method: 'DELETE' }),
    markRead: (id) => apiCall(`/events/${id}/read`, { method: 'POST' }),
};

// Subscriptions
export const subscriptionsAPI = {
    list: () => apiCall('/subscriptions'),
    create: (data) => apiCall('/subscriptions', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id) => apiCall(`/subscriptions/${id}`, { method: 'DELETE' }),
};

// Materials
export const materialsAPI = {
    list: () => apiCall('/materials'),
    toggleCheck: (id) => apiCall(`/materials/${id}/check`, { method: 'POST' }),
};

// Push
export const pushAPI = {
    subscribe: (subscription) => apiCall('/push/subscribe', { method: 'POST', body: JSON.stringify({ subscription }) }),
    unsubscribe: () => apiCall('/push/unsubscribe', { method: 'DELETE' }),
    updatePreferences: (data) => apiCall('/push/preferences', { method: 'PUT', body: JSON.stringify(data) }),
};
