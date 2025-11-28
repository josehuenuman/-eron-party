import { h } from 'https://esm.sh/preact@10.19.3';
import { useState, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import { Modal } from './Modal.js';
import { Button } from './Button.js';
import { Input } from './Input.js';
import { COURSE_COLORS } from '../utils/constants.js';

export function CourseForm({ course, onSave, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        color: COURSE_COLORS[0].value,
        year: new Date().getFullYear()
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (course) {
            setFormData({
                name: course.name || '',
                color: course.color || COURSE_COLORS[0].value,
                year: course.year || new Date().getFullYear()
            });
        }
    }, [course]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return h(Modal, { isOpen: true, onClose, title: course ? 'Editar Curso' : 'Nuevo Curso' },
        h('form', { onSubmit: handleSubmit, className: 'space-y-4' },
            // Nombre
            h(Input, {
                label: 'Nombre del curso',
                value: formData.name,
                onChange: (value) => setFormData({ ...formData, name: value }),
                required: true,
                placeholder: 'Ej: Sala de 4 años A'
            }),

            // Año
            h(Input, {
                label: 'Año',
                type: 'number',
                value: formData.year,
                onChange: (value) => setFormData({ ...formData, year: parseInt(value) }),
                required: true,
                min: 2020,
                max: 2030
            }),

            // Color
            h('div', {},
                h('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Color'),
                h('div', { className: 'grid grid-cols-5 gap-2' },
                    COURSE_COLORS.map(colorOption =>
                        h('button', {
                            key: colorOption.value,
                            type: 'button',
                            onClick: () => setFormData({ ...formData, color: colorOption.value }),
                            className: `h-12 rounded border-2 ${formData.color === colorOption.value
                                    ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-900'
                                    : 'border-gray-300'
                                }`,
                            style: { backgroundColor: colorOption.value },
                            title: colorOption.name
                        })
                    )
                ),
                h('p', { className: 'text-sm text-gray-500 mt-2' },
                    'Color seleccionado: ',
                    h('span', {
                        className: 'badge text-white ml-1',
                        style: { backgroundColor: formData.color }
                    }, formData.name || 'Vista previa')
                )
            ),

            // Error
            error && h('div', { className: 'bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded' },
                error
            ),

            // Botones
            h('div', { className: 'flex gap-2 pt-4' },
                h(Button, { type: 'submit', disabled: loading },
                    loading ? 'Guardando...' : 'Guardar Curso'
                ),
                h(Button, { type: 'button', variant: 'secondary', onClick: onClose },
                    'Cancelar'
                )
            )
        )
    );
}
