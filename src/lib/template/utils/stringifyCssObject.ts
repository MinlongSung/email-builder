/**
 * Convierte camelCase a kebab-case
 * backgroundColor -> background-color
 */
function camelToKebab(str: string): string {
	return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

/**
 * Convierte un objeto de estilos a string CSS
 * Convierte automáticamente las keys de camelCase a kebab-case
 */
export function stringifyCssObject(
	style?: Record<string, string | number>
): string | undefined {
	if (!style) return undefined;

	return Object.entries(style)
		.map(([key, value]) => `${camelToKebab(key)}: ${value}`)
		.join('; ');
}
