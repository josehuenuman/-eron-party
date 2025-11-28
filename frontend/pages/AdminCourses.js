import { h } from 'https://esm.sh/preact@10.19.3';
import { useState, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import { Layout } from '../components/Layout.js';
import { CourseForm } from '../components/CourseForm.js';
import { EmptyState } from '../components/EmptyState.js';
import { Button } from '../components/Button.js';
import { coursesAPI } from '../services/api.js';

export function AdminCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        setLoading(true);
        try {
            const result = await coursesAPI.list();
            setCourses(result.courses || []);
        } catch (error) {
            console.error('Error loading courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (courseData) => {
        try {
            if (editingCourse) {
                await coursesAPI.update(editingCourse.id, courseData);
            } else {
                await coursesAPI.create(courseData);
            }
            await loadCourses();
            setShowForm(false);
            setEditingCourse(null);
        } catch (error) {
            throw error;
        }
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setShowForm(true);
    };

    const handleDelete = async (courseId) => {
        if (!confirm('¿Estás seguro de eliminar este curso? Los eventos asociados no se eliminarán.')) return;

        try {
            await coursesAPI.delete(courseId);
            await loadCourses();
        } catch (error) {
            alert('Error al eliminar curso: ' + error.message);
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingCourse(null);
    };

    return h(Layout, { activeTab: 'profile' },
        h('div', { className: 'max-w-4xl mx-auto' },
            h('div', { className: 'flex justify-between items-center mb-6' },
                h('h1', { className: 'text-3xl font-bold text-gray-900' }, 'Gestión de Cursos'),
                h(Button, { onClick: () => setShowForm(true) }, '+ Nuevo Curso')
            ),

            loading ? h('div', { className: 'text-center py-12' }, 'Cargando...') :
                courses.length === 0 ? h(EmptyState, {
                    emoji: '📚',
                    title: 'No hay cursos',
                    message: 'Crea el primer curso haciendo click en el botón de arriba'
                }) :
                    h('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                        courses.map(course =>
                            h('div', { key: course.id, className: 'card' },
                                h('div', { className: 'flex items-center justify-between' },
                                    h('div', { className: 'flex items-center gap-3' },
                                        h('div', {
                                            className: 'w-4 h-4 rounded-full',
                                            style: { backgroundColor: course.color }
                                        }),
                                        h('div', {},
                                            h('h3', { className: 'font-semibold text-gray-900' }, course.name),
                                            h('p', { className: 'text-sm text-gray-500' }, `Año ${course.year}`)
                                        )
                                    ),
                                    h('div', { className: 'flex gap-2' },
                                        h('button', {
                                            onClick: () => handleEdit(course),
                                            className: 'text-blue-600 hover:text-blue-800 text-sm font-medium'
                                        }, 'Editar'),
                                        h('button', {
                                            onClick: () => handleDelete(course.id),
                                            className: 'text-red-600 hover:text-red-800 text-sm font-medium'
                                        }, 'Eliminar')
                                    )
                                )
                            )
                        )
                    ),

            showForm && h(CourseForm, {
                course: editingCourse,
                onSave: handleSave,
                onClose: handleCloseForm
            })
        )
    );
}
