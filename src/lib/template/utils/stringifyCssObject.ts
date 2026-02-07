export function stringifyCssObject(
	style?: Record<string, string | number>
): string | undefined {
	if (!style) return undefined;

	return Object.entries(style)
		.map(([key, value]) => `${key}: ${value}`)
		.join('; ');
}
