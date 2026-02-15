export interface HSV {
	h: number; // 0-360
	s: number; // 0-1
	v: number; // 0-1
}

export interface RGB {
	r: number; // 0-255
	g: number; // 0-255
	b: number; // 0-255
}

export function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(value, max));
}

export function hsvToRgb({ h, s, v }: HSV): RGB {
	h = ((h % 360) + 360) % 360;
	const c = v * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = v - c;

	let r = 0,
		g = 0,
		b = 0;

	if (h < 60) {
		r = c;
		g = x;
	} else if (h < 120) {
		r = x;
		g = c;
	} else if (h < 180) {
		g = c;
		b = x;
	} else if (h < 240) {
		g = x;
		b = c;
	} else if (h < 300) {
		r = x;
		b = c;
	} else {
		r = c;
		b = x;
	}

	return {
		r: Math.round((r + m) * 255),
		g: Math.round((g + m) * 255),
		b: Math.round((b + m) * 255)
	};
}

export function rgbToHsv({ r, g, b }: RGB): HSV {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const d = max - min;

	let h = 0;
	if (d !== 0) {
		if (max === r) {
			h = 60 * (((g - b) / d) % 6);
		} else if (max === g) {
			h = 60 * ((b - r) / d + 2);
		} else {
			h = 60 * ((r - g) / d + 4);
		}
	}

	if (h < 0) h += 360;

	const s = max === 0 ? 0 : d / max;
	const v = max;

	return { h, s, v };
}

export function rgbToHex({ r, g, b }: RGB): string {
	const toHex = (n: number) => n.toString(16).padStart(2, '0');
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexToRgb(hex: string): RGB | null {
	const match = hex.replace('#', '').match(/^([0-9a-f]{6})$/i);
	if (!match) return null;

	const int = parseInt(match[1], 16);
	return {
		r: (int >> 16) & 255,
		g: (int >> 8) & 255,
		b: int & 255
	};
}

export function hsvToHex(hsv: HSV): string {
	return rgbToHex(hsvToRgb(hsv));
}

export function hexToHsv(hex: string): HSV | null {
	const rgb = hexToRgb(hex);
	if (!rgb) return null;
	return rgbToHsv(rgb);
}

export function isValidHex(hex: string): boolean {
	return /^#?[0-9a-f]{6}$/i.test(hex);
}

/**
 * Calcula la luminosidad relativa de un color RGB usando la fórmula WCAG.
 * La luminosidad relativa es un valor entre 0 (negro) y 1 (blanco).
 *
 * Documentación WCAG: https://www.w3.org/WAI/GL/wiki/Relative_luminance
 *
 * @param rgb - Objeto RGB con valores r, g, b entre 0-255
 * @returns Luminosidad relativa entre 0 y 1
 *
 * @example
 * const white = { r: 255, g: 255, b: 255 };
 * getRelativeLuminance(white); // retorna ~1
 *
 * const black = { r: 0, g: 0, b: 0 };
 * getRelativeLuminance(black); // retorna 0
 */
export function getRelativeLuminance(rgb: RGB): number {
	const { r, g, b } = rgb;

	// Convertir cada canal a valores lineales según la fórmula WCAG
	const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((val) => {
		// Si el valor es menor o igual a 0.03928, dividir por 12.92
		// De lo contrario, aplicar la fórmula gamma
		return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
	});

	// Calcular luminosidad relativa con los pesos de cada canal
	// Estos pesos reflejan la sensibilidad del ojo humano a cada color
	return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Determina si debe usar texto oscuro o claro sobre un color de fondo
 * para mantener un contraste legible.
 *
 * Si la luminosidad del fondo es mayor a 0.5, usa texto oscuro.
 * Si es menor o igual a 0.5, usa texto claro.
 *
 * @param hex - Color hexadecimal (ejemplo: "#ff0000")
 * @returns true si debe usar texto oscuro, false si debe usar texto claro
 *
 * @example
 * shouldUseDarkText("#ffffff"); // true (fondo claro → texto oscuro)
 * shouldUseDarkText("#000000"); // false (fondo oscuro → texto claro)
 * shouldUseDarkText("#b45f06"); // true o false dependiendo de la luminosidad
 */
export function shouldUseDarkText(hex: string): boolean {
	const rgb = hexToRgb(hex);

	// Si el hex es inválido, por defecto usar texto oscuro
	if (!rgb) return true;

	const luminance = getRelativeLuminance(rgb);

	// Usar texto oscuro si el fondo es claro (luminosidad > 0.5)
	return luminance > 0.5;
}
