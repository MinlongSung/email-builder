/**
 * Crea una función debounced que retrasa la invocación hasta que hayan pasado
 * `delay` milisegundos desde la última vez que fue invocada.
 *
 * @param fn - La función a debounce
 * @param delay - El retraso en milisegundos
 * @returns La función debounced
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}
