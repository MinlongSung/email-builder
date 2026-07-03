import type {
  BackgroundImage,
  Border,
  BorderRadius,
  Spacing,
} from "@/features/models/types";

const PROPERTY_MAP = {
  padding: "padding",
  margin: "margin",

  backgroundColor: "backgroundColor",

  border: "border",
  borderRadius: "borderRadius",

  width: "width",
  height: "height",

  color: "color",

  fontFamily: "fontFamily",
  fontSize: "fontSize",
  letterSpacing: "letterSpacing",
} satisfies Record<string, keyof React.CSSProperties>;

function isSpacing(value: unknown): value is Spacing {
  return (
    typeof value === "object" &&
    value !== null &&
    "top" in value &&
    "right" in value &&
    "bottom" in value &&
    "left" in value
  );
}

function isBorder(value: unknown): value is Border {
  return (
    typeof value === "object" &&
    value !== null &&
    "width" in value &&
    "style" in value &&
    "color" in value
  );
}

function isBorderRadius(value: unknown): value is BorderRadius {
  return (
    typeof value === "object" &&
    value !== null &&
    "topLeft" in value &&
    "topRight" in value &&
    "bottomLeft" in value &&
    "bottomRight" in value
  );
}

function isBackgroundImage(value: unknown): value is BackgroundImage {
  return (
    typeof value === "object" &&
    value !== null &&
    "url" in value &&
    "repeat" in value &&
    "position" in value &&
    "size" in value
  );
}

function serialize(value: unknown) {
  if (isSpacing(value)) {
    return `${value.top} ${value.right} ${value.bottom} ${value.left}`;
  }

  if (isBorder(value)) {
    return `${value.width} ${value.style} ${value.color}`;
  }

  if (isBorderRadius(value)) {
    return `${value.topLeft} ${value.topRight} ${value.bottomRight} ${value.bottomLeft}`;
  }

  if (isBackgroundImage(value)) {
    return {
      backgroundImage: `url("${value.url}")`,
      backgroundRepeat: value.repeat,
      backgroundPosition: `${value.position.horizontal} ${value.position.vertical}`,
      backgroundSize:
        typeof value.size === "string"
          ? value.size
          : `${value.size.width} ${value.size.height}`,
    };
  }

  return value;
}

export function createStyle<T extends object>(props: T): React.CSSProperties {
  const style: React.CSSProperties = {};

  for (const [key, value] of Object.entries(props)) {
    if (value == null) continue;

    const cssProperty = PROPERTY_MAP[key];

    if (!cssProperty) continue;

    const serialized = serialize(value);

    if (
      typeof serialized === "object" &&
      serialized !== null &&
      !Array.isArray(serialized)
    ) {
      Object.assign(style, serialized);
    } else {
      style[cssProperty] = serialized as never;
    }
  }

  return style;
}
