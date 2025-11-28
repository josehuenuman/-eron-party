import { format, parseISO, isToday, isTomorrow, startOfWeek, endOfWeek } from 'https://esm.sh/date-fns@3.0.0';
import { es } from 'https://esm.sh/date-fns@3.0.0/locale';

/**
 * Formatear fecha para mostrar
 * @param {string} dateString - Fecha en formato YYYY-MM-DD
 * @returns {string} Fecha formateada
 */
export function formatDate(dateString) {
    try {
        const date = parseISO(dateString);

        if (isToday(date)) return 'Hoy';
        if (isTomorrow(date)) return 'Mañana';

        return format(date, "EEEE d 'de' MMMM", { locale: es });
    } catch (error) {
        return dateString;
    }
}

/**
 * Formatear hora
 * @param {string} timeString - Hora en formato HH:mm
 * @returns {string} Hora formateada
 */
export function formatTime(timeString) {
    if (!timeString) return '';
    return timeString.substring(0, 5); // HH:mm
}

/**
 * Obtener inicio de semana (lunes)
 */
export function getWeekStart() {
    return format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
}

/**
 * Obtener fin de semana (domingo)
 */
export function getWeekEnd() {
    return format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
}

/**
 * Formatear fecha corta (DD/MM)
 */
export function formatShortDate(dateString) {
    try {
        const date = parseISO(dateString);
        return format(date, 'dd/MM');
    } catch (error) {
        return dateString;
    }
}

/**
 * Generar archivo .ics para agregar al calendario
 * @param {object} event - Datos del evento
 * @returns {string} Contenido del archivo .ics
 */
export function generateICS(event) {
    const startDate = event.event_date.replace(/-/g, '');
    const startTime = event.start_time ? event.start_time.replace(/:/g, '') + '00' : '000000';
    const endTime = event.end_time ? event.end_time.replace(/:/g, '') + '00' : '235959';

    const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ColegioSync//ES
BEGIN:VEVENT
UID:${event.id}@colegiosync
DTSTAMP:${startDate}T${startTime}
DTSTART:${startDate}T${startTime}
DTEND:${startDate}T${endTime}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ''}
LOCATION:${event.location || ''}
END:VEVENT
END:VCALENDAR`;

    return ics;
}

/**
 * Descargar archivo .ics
 */
export function downloadICS(event) {
    const icsContent = generateICS(event);
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title}.ics`;
    link.click();
    URL.revokeObjectURL(url);
}
