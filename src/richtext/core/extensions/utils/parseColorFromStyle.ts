/**
 * Parse color value from element's style attribute, preserving hex format.
 * Prefers raw style attribute over computed style to preserve original format
 * (e.g., #rrggbb instead of rgb(...)).
 *
 * @param element - DOM element to parse
 * @param property - CSS property name (e.g., "color", "background-color")
 * @returns Color value with quotes removed, or null if not found
 */
export function parseColorFromStyle(
  element: HTMLElement,
  property: string
): string | null {
  // Prefer raw style attribute to preserve hex format
  const styleAttr = element.getAttribute("style");

  if (styleAttr) {
    const decls = styleAttr
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);

    // Pick last declaration (child takes priority over parent)
    for (let i = decls.length - 1; i >= 0; i -= 1) {
      const parts = decls[i].split(":");
      if (parts.length >= 2) {
        const prop = parts[0].trim().toLowerCase();
        const val = parts.slice(1).join(":").trim();
        if (prop === property) {
          return val.replace(/['"]+/g, "");
        }
      }
    }
  }

  // Fallback to computed style (will be RGB)
  const computedValue = element.style.getPropertyValue(property);
  return computedValue ? computedValue.replace(/['"]+/g, "") : null;
}
