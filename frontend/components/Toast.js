import { h, createContext } from 'https://esm.sh/preact@10.19.3';
import { useState, useContext, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 3000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return h(ToastContext.Provider, { value: { addToast } },
        children,
        h('div', { className: 'fixed bottom-4 right-4 z-50 flex flex-col gap-2' },
            toasts.map(toast =>
                h(Toast, { key: toast.id, ...toast, onClose: () => removeToast(toast.id) })
            )
        )
    );
}

export function useToast() {
    return useContext(ToastContext);
}

function Toast({ message, type, onClose }) {
    const bgColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };

    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };

    return h('div', {
        className: `${bgColors[type] || bgColors.info} text-white px-4 py-3 rounded shadow-lg flex items-center gap-3 min-w-[300px] animate-slide-up cursor-pointer`,
        onClick: onClose
    },
        h('span', {}, icons[type]),
        h('span', { className: 'flex-1 font-medium' }, message)
    );
}
