import { h } from 'https://esm.sh/preact@10.19.3';
import { useState, useEffect } from 'https://esm.sh/preact@10.19.3/hooks';
import { Layout } from '../components/Layout.js';
import { EmptyState } from '../components/EmptyState.js';
import { materialsAPI } from '../services/api.js';
import { formatDate } from '../utils/dates.js';

export function MaterialsPage() {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMaterials();
    }, []);

    const loadMaterials = async () => {
        setLoading(true);
        try {
            const result = await materialsAPI.list();
            setMaterials(result.materials || []);
        } catch (error) {
            console.error('Error loading materials:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleCheck = async (materialId) => {
        try {
            await materialsAPI.toggleCheck(materialId);
            // Actualizar localmente
            setMaterials(prev =>
                prev.map(m =>
                    m.id === materialId ? { ...m, checked: m.checked === 1 ? 0 : 1 } : m
                )
            );
        } catch (error) {
            console.error('Error toggling material:', error);
        }
    };

    // Agrupar por evento
    const groupedMaterials = materials.reduce((acc, material) => {
        const key = `${material.event_id}-${material.event_title}`;
        if (!acc[key]) {
            acc[key] = {
                event_id: material.event_id,
                event_title: material.event_title,
                event_date: material.event_date,
                materials: []
            };
        }
        acc[key].materials.push(material);
        return acc;
    }, {});

    const sortedGroups = Object.values(groupedMaterials).sort((a, b) =>
        a.event_date.localeCompare(b.event_date)
    );

    return h(Layout, { activeTab: 'materials' },
        h('div', { className: 'max-w-4xl mx-auto' },
            h('h1', { className: 'text-3xl font-bold text-gray-900 mb-6' }, 'Materiales'),

            loading ? h('div', { className: 'text-center py-12' }, 'Cargando...') :
                materials.length === 0 ? h(EmptyState, {
                    emoji: '🎒',
                    title: '¡Todo listo!',
                    message: 'No hay materiales pendientes para los próximos 7 días'
                }) :
                    h('div', { className: 'space-y-6' },
                        sortedGroups.map(group =>
                            h('div', { key: group.event_id, className: 'card' },
                                h('div', { className: 'mb-4' },
                                    h('h2', { className: 'text-lg font-semibold text-gray-900' }, group.event_title),
                                    h('p', { className: 'text-sm text-gray-500' }, formatDate(group.event_date))
                                ),
                                h('div', { className: 'space-y-3' },
                                    group.materials.map(material =>
                                        h('label', {
                                            key: material.id,
                                            className: 'flex items-start gap-3 cursor-pointer group'
                                        },
                                            h('input', {
                                                type: 'checkbox',
                                                checked: material.checked === 1,
                                                onChange: () => handleToggleCheck(material.id),
                                                className: 'mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                                            }),
                                            h('div', { className: 'flex-1' },
                                                h('p', {
                                                    className: `text-gray-900 ${material.checked === 1 ? 'line-through text-gray-400' : ''}`
                                                }, material.description),
                                                material.quantity > 1 && h('p', {
                                                    className: 'text-sm text-gray-500'
                                                }, `Cantidad: ${material.quantity}`)
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
        )
    );
}
