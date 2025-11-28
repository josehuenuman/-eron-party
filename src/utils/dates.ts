/**
 * Obtener fecha de hoy en formato YYYY-MM-DD
 * Zona horaria: Argentina (UTC-3)
 */
export function getToday(): string {
    const now = new Date();
    // Ajustar a zona horaria Argentina (UTC-3)
    const offset = -3 * 60; // -180 minutos
    const localTime = new Date(now.getTime() + offset * 60 * 1000);

    return localTime.toISOString().split('T')[0];
}

/**
 * Obtener fecha de inicio de la semana (lunes)
 */
export function getWeekStart(): string {
    const today = new Date(getToday());
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Si es domingo (0), retroceder 6 días
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);

    return monday.toISOString().split('T')[0];
}

/**
 * Obtener fecha de fin de la semana (domingo)
 */
export function getWeekEnd(): string {
    const weekStart = new Date(getWeekStart());
    const sunday = new Date(weekStart);
    sunday.setDate(weekStart.getDate() + 6);

    return sunday.toISOString().split('T')[0];
}

/**
 * Sumar días a una fecha
 */
export function addDays(date: string, days: number): string {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
}

/**
 * Comparar si una fecha es antes, igual o después de otra
 */
export function compareDates(date1: string, date2: string): number {
    if (date1 < date2) return -1;
    if (date1 > date2) return 1;
    return 0;
}
