import type { Extension } from "../types";

const DEFAULT_PRIORITY = 100;

/**
 * Ordena las extensiones por prioridad.
 * Mayor prioridad = se ejecuta primero
 * 
 * @example
 * const extensions = [
 *   { name: 'base', priority: 100 },
 *   { name: 'table', priority: 200 },
 * ]
 * sortExtensions(extensions) // → [table, base]
 */
export function sortExtensions(extensions: Extension[]): Extension[] {
  return [...extensions].sort((a, b) => {
    const priorityA = a.priority ?? DEFAULT_PRIORITY;
    const priorityB = b.priority ?? DEFAULT_PRIORITY;

    // Mayor prioridad primero (orden descendente)
    if (priorityA > priorityB) {
      return -1;
    }

    if (priorityA < priorityB) {
      return 1;
    }

    return 0;
  });
}
