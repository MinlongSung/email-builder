import type {
  Background,
  BackgroundPositionValue,
  Border,
  ColumnProps,
  CornerRadius,
  HasLayout,
  HasStyle,
  Insets,
  Layout,
  Spacing,
  Style,
  Typography,
  Viewport,
} from "@/features/models/types";

export interface RenderContext {
  viewport: Viewport;
}

export function toCss(
  props: HasLayout & HasStyle,
  ...overrides: Array<
    React.CSSProperties | false | null | undefined
  >
): React.CSSProperties {
  return Object.assign(
    {},
    layoutToCss(props.layout),
    styleToCss(props.style),
    ...overrides.filter(Boolean),
  );
}

export function createColumnContentCss(
  props: ColumnProps,
): React.CSSProperties {
  return {
    ...layoutToCss(props.layout),
    ...styleToCss(props.style),
  };
}

// ======================================================
// LAYOUT
// ======================================================

function layoutToCss(layout?: Layout): React.CSSProperties {
  if (!layout) return {};

  return {
    width: layout.width,
    height: layout.height,

    maxWidth: layout.maxWidth,
    maxHeight: layout.maxHeight,

    margin: spacingToCss(layout.margin),
    padding: spacingToCss(layout.padding),

    gap: layout.gap,

    textAlign: layout.align,
    verticalAlign: layout.verticalAlign,

    direction: layout.direction,
  };
}

// ======================================================
// STYLE
// ======================================================

function styleToCss(style?: Style): React.CSSProperties {
  if (!style) return {};

  return {
    ...backgroundToCss(style.background),
    ...borderToCss(style.border),
    ...typographyToCss(style.typography),
  };
}

// ======================================================
// BACKGROUND
// ======================================================

function backgroundToCss(background?: Background): React.CSSProperties {
  if (!background) return {};

  const style: React.CSSProperties = {};

  if (background.color) {
    style.backgroundColor = background.color;
  }

  if (background.image) {
    style.backgroundImage = `url("${background.image.url}")`;

    style.backgroundRepeat = background.image.repeat;

    if (background.image.position) {
      style.backgroundPosition = backgroundPositionToCss(
        background.image.position,
      );
    }

    if (background.image.size) {
      style.backgroundSize = backgroundSizeToCss(background.image.size);
    }
  }

  if (background.gradient) {
    style.backgroundImage = background.gradient.value;
  }

  return style;
}

// ======================================================
// BORDER
// ======================================================

function borderToCss(border?: Border): React.CSSProperties {
  if (!border) return {};

  return {
    border:
      border.width && border.style && border.color
        ? `${borderWidthToCss(border.width)} ${border.style} ${border.color}`
        : undefined,

    borderRadius: borderRadiusToCss(border.radius),
  };
}

// ======================================================
// TYPOGRAPHY
// ======================================================

function typographyToCss(
  typography?: Typography,
): React.CSSProperties {
  if (!typography) return {};

  return {
    color: typography.color,

    fontFamily: typography.fontFamily,

    fontSize: typography.fontSize,

    fontWeight: typography.fontWeight,

    fontStyle: typography.fontStyle,

    lineHeight: typography.lineHeight,

    letterSpacing: typography.letterSpacing,

    textAlign: typography.textAlign,

    textDecoration: typography.textDecoration,

    textTransform: typography.textTransform,
  };
}

// ======================================================
// HELPERS
// ======================================================

function spacingToCss(spacing?: Spacing): string | undefined {
  if (!spacing) return undefined;

  if (typeof spacing === "string") {
    return spacing;
  }

  return insetsToCss(spacing);
}

function insetsToCss(insets: Insets): string {
  return [
    insets.top ?? "0",
    insets.right ?? "0",
    insets.bottom ?? "0",
    insets.left ?? "0",
  ].join(" ");
}

function borderWidthToCss(width: Border["width"]): string | undefined {
  if (!width) return undefined;

  if (typeof width === "string") {
    return width;
  }

  return [
    width.top ?? "0",
    width.right ?? "0",
    width.bottom ?? "0",
    width.left ?? "0",
  ].join(" ");
}

function borderRadiusToCss(
  radius?: Border["radius"],
): string | undefined {
  if (!radius) return undefined;

  if (typeof radius === "string") {
    return radius;
  }

  return cornerRadiusToCss(radius);
}

function cornerRadiusToCss(radius: CornerRadius): string {
  return [
    radius.topLeft ?? "0",
    radius.topRight ?? "0",
    radius.bottomRight ?? "0",
    radius.bottomLeft ?? "0",
  ].join(" ");
}

function backgroundPositionToCss(
  position: Background["image"]["position"],
): string {
  if (typeof position === "string") {
    return position;
  }

  const value = position as BackgroundPositionValue;

  return `${value.x} ${value.y}`;
}

function backgroundSizeToCss(
  size: NonNullable<Background["image"]>["size"],
): string {
  if (typeof size === "string") {
    return size;
  }

  return `${size.width ?? "auto"} ${size.height ?? "auto"}`;
}