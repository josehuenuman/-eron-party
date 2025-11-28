import { h } from 'https://esm.sh/preact@10.19.3';
import { useState, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import { Modal } from './Modal.js';
import { Button } from './Button.js';
import { Input } from './Input.js';
import { EVENT_TYPES, PRIORITY_LEVELS } from '../utils/constants.js';
import { coursesAPI } from '../services/api.js';

import { useToast } from './Toast.js';

export function EventForm({ event, onSave, onClose }) {
    const { addToast } = useToast();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_type: 'event',
        event_date: '',
        start_time: '',
        priority: 'normal',
        location: '',
        location_url: '',
        visibility: 'public',
        courses: [],
        materials: []
    });

    const [courses, setCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCourses();
        if (event) {
            setFormData({
                title: event.title || '',
                description: event.description || '',
                event_type: event.event_type || 'event',
                event_date: event.event_date || '',
                start_time: event.start_time || '',
                priority: event.priority || 'normal',
                location: event.location || '',
                location_url: event.location_url || '',
                visibility: event.visibility || 'public',
                courses: event.courses?.map(c => c.id) || [],
                materials: event.materials || []
            });
            setSelectedCourses(event.courses?.map(c => c.id) || []);
        }
    }, [event]);

    const loadCourses = async () => {
        try {
            const result = await coursesAPI.list();
            setCourses(result.courses || []);
        } catch (err) {
            console.error('Error loading courses:', err);
            addToast('Error al cargar cursos', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onSave({
                ...formData,
                course_ids: selectedCourses
            });
            addToast(event ? 'Evento actualizado correctamente' : 'Evento creado correctamente', 'success');
            onClose();
        } catch (err) {
            setError(err.message);
            addToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const toggleCourse = (courseId) => {
        setSelectedCourses(prev =>
            prev.includes(courseId)
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId]
        );
    };

    const addMaterial = () => {
        setFormData(prev => ({
            ...prev,
            materials: [...prev.materials, { description: '', quantity: 1 }]
        }));
    };

    const removeMaterial = (index) => {
        setFormData(prev => ({
            ...prev,
            materials: prev.materials.filter((_, i) => i !== index)
        }));
    };

    const updateMaterial = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            materials: prev.materials.map((m, i) =>
                i === index ? { ...m, [field]: value } : m
            )
        }));
    };

    const selectedEventType = EVENT_TYPES.find(t => t.value === formData.event_type);

    return h(Modal, { isOpen: true, onClose, title: event ? 'Editar Evento' : 'Nuevo Evento' },
        h('form', { onSubmit: handleSubmit, className: 'space-y-4' },
            // Título
            h(Input, {
                label: 'Título',
                value: formData.title,
                onChange: (value) => setFormData({ ...formData, title: value }),
                required: true,
                placeholder: 'Ej: Reunión de padres'
            }),

            // Tipo de evento
            h('div', {},
                h('label', { className: 'block text-sm font-medium text-gray-700 mb-1' },
                    'Tipo de evento ',
                    selectedEventType && h('span', { className: 'text-2xl' }, selectedEventType.emoji)
                ),
                h('select', {
                    className: 'input',
                    value: formData.event_type,
                    onChange: (e) => setFormData({ ...formData, event_type: e.target.value })
                },
                    EVENT_TYPES.map(type =>
                        h('option', { key: type.value, value: type.value }, type.label)
                    )
                )
            ),

            // Fecha y hora
            h('div', { className: 'grid grid-cols-2 gap-4' },
                h(Input, {
                    label: 'Fecha',
                    type: 'date',
                    value: formData.event_date,
                    onChange: (value) => setFormData({ ...formData, event_date: value }),
                    required: true
                }),
                formData.event_type !== 'material' && h(Input, {
                    label: 'Hora de inicio',
                    type: 'time',
                    value: formData.start_time,
                    onChange: (value) => setFormData({ ...formData, start_time: value })
                })
            ),

            // Prioridad
            formData.event_type !== 'material' && h('div', {},
                h('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Prioridad'),
                h('select', {
                    className: 'input',
                    value: formData.priority,
                    onChange: (e) => setFormData({ ...formData, priority: e.target.value })
                },
                    PRIORITY_LEVELS.map(level =>
                        h('option', { key: level.value, value: level.value }, level.label)
                    )
                )
            ),

            // Descripción
            h('div', {},
                h('label', { className: 'block text-sm font-medium text-gray-700 mb-1' }, 'Descripción'),
                h('textarea', {
                    className: 'input',
                    rows: 3,
                    value: formData.description,
                    onChange: (e) => setFormData({ ...formData, description: e.target.value }),
                    placeholder: 'Detalles adicionales...'
                })
            ),

            // Cursos
            h('div', {},
                h('label', { className: 'block text-sm font-medium text-gray-700 mb-2' }, 'Cursos'),
                h('div', { className: 'space-y-2 max-h-40 overflow-y-auto border rounded p-2' },
                    courses.map(course =>
                        h('label', { key: course.id, className: 'flex items-center gap-2 cursor-pointer' },
                            h('input', {
                                type: 'checkbox',
                                checked: selectedCourses.includes(course.id),
                                onChange: () => toggleCourse(course.id),
                                className: 'checkbox'
                            }),
                            h('span', {
                                className: 'badge text-white',
                                style: { backgroundColor: course.color }
                            }, course.name)
                        )
                    )
                )
            ),

            // Materiales
            (formData.event_type === 'material' || formData.materials.length > 0 || true) && h('div', {},
                h('div', { className: 'flex justify-between items-center mb-2' },
                    h('label', { className: 'block text-sm font-medium text-gray-700' }, 'Materiales necesarios'),
                    h(Button, {
                        type: 'button',
                        variant: 'secondary',
                        size: 'sm',
                        onClick: addMaterial
                    }, '+ Agregar')
                ),
                h('div', { className: 'space-y-2' },
                    formData.materials.map((material, index) =>
                        h('div', { key: index, className: 'flex gap-2' },
                            h('input', {
                                type: 'text',
                                className: 'input flex-1',
                                value: material.description,
                                onChange: (e) => updateMaterial(index, 'description', e.target.value),
                                placeholder: 'Ej: Cartulina roja'
                            }),
                            h('input', {
                                type: 'number',
                                className: 'input w-20',
                                value: material.quantity,
                                onChange: (e) => updateMaterial(index, 'quantity', parseInt(e.target.value) || 1),
                                min: 1
                            }),
                            h('button', {
                                type: 'button',
                                onClick: () => removeMaterial(index),
                                className: 'text-red-600 hover:text-red-800'
                            }, '✕')
                        )
                    )
                )
            ),

            // Ubicación
            formData.event_type !== 'material' && h('div', { className: 'grid grid-cols-2 gap-4' },
                h(Input, {
                    label: 'Ubicación',
                    value: formData.location,
                    onChange: (value) => setFormData({ ...formData, location: value }),
                    placeholder: 'Ej: Salón de actos'
                }),
                h(Input, {
                    label: 'URL de ubicación',
                    type: 'url',
                    value: formData.location_url,
                    onChange: (value) => setFormData({ ...formData, location_url: value }),
                    placeholder: 'https://maps.google.com/...'
                })
            ),

            // Error
            error && h('div', { className: 'bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded' },
                error
            ),

            // Botones
            h('div', { className: 'flex gap-2 pt-4' },
                h(Button, { type: 'submit', disabled: loading },
                    loading ? 'Guardando...' : 'Guardar Evento'
                ),
                h(Button, { type: 'button', variant: 'secondary', onClick: onClose },
                    'Cancelar'
                )
            )
        )
    );
}
