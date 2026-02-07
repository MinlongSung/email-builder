/**
 * Verifica si un objeto incluye todas las propiedades de otro objeto
 */
export function objectIncludes(
  obj1: Record<string, any>,
  obj2: Record<string, any>,
  options: { strict: boolean } = { strict: true }
): boolean {
  const keys = Object.keys(obj2);

  if (keys.length === 0) {
    return true;
  }

  return keys.every((key) => {
    if (options.strict) {
      return obj2[key] === obj1[key];
    }

    // Non-strict: check if value exists and matches
    return obj1[key] !== undefined && obj1[key] === obj2[key];
  });
}
