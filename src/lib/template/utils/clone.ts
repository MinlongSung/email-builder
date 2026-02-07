/**
 * Clona un objeto usando serialización JSON.
 * Útil para clonar objetos que contienen referencias circulares que structuredClone no puede manejar.
 */
export function clone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}
