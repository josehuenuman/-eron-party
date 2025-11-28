import { h } from 'https://esm.sh/preact@10.19.3';

export function Button({ children, variant = 'primary', size = 'md', onClick, type = 'button', className = '', disabled = false }) {
    const baseClasses = 'btn';
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        danger: 'btn-danger'
    };

    const sizeClasses = {
        sm: 'text-sm px-3 py-1.5',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-6 py-3'
    };

    return h('button', {
        type,
        className: `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        onClick: disabled ? undefined : onClick,
        disabled
    }, children);
}
