// ======================================================
// DOCUMENT
// ======================================================

export interface EmailDocument {
  schemaVersion: number;

  rootBlockId: string;

  blocks: BaseBlock[];
}

// ======================================================
// BLOCK
// ======================================================
const CONTENT_TYPES = ["text", "button"] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

export type BlockType = ContentType | LayoutType;

export type LayoutType = "root" | "row" | "column";

export interface BaseBlock<TContent = unknown> {
  id: string;

  type: BlockType;

  parentId: string | null;

  childrenIds: string[];

  props: BlockProps<TContent>;
}

// ======================================================
// BLOCK PROPS
// ======================================================

export interface BlockProps<TContent = unknown> {
  /**
   * Block-specific data.
   */
  content: TContent;

  /**
   * Positioning.
   */
  layout?: Layout;

  /**
   * Visual styles.
   */
  style?: Style;

  /**
   * Interactive behaviour.
   */
  behavior?: Behavior;

  /**
   * Responsive overrides.
   */
  responsive?: Responsive;

  /**
   * Editor only.
   */
  metadata?: Metadata;
}

// ======================================================
// LAYOUT
// ======================================================

export interface Layout {
  width?: Length;

  height?: Length;

  margin?: Spacing;

  padding?: Spacing;

  align?: HorizontalAlignment;

  verticalAlign?: VerticalAlignment;

  direction: Direction;
}

// ======================================================
// STYLE
// ======================================================

export interface Style {
  background?: Background;

  border?: Border;

  typography?: Typography;
}

// ======================================================
// BEHAVIOUR
// ======================================================

export interface Behavior {
  link?: Link;

  visibility?: Visibility;
}

// ======================================================
// RESPONSIVE
// ======================================================

export interface Responsive {
  mobile?: {
    layout?: Partial<Layout>;

    style?: Partial<Style>;

    behavior?: Partial<Behavior>;
  };
}

// ======================================================
// METADATA
// ======================================================

export interface Metadata {
  /**
   * Friendly name shown in the editor.
   */
  label?: string;

  /**
   * Anchor identifier for internal links.
   *
   * Example:
   * https://example.com/newsletter#pricing
   */
  anchor?: string;
}

// ======================================================
// PRIMITIVES
// ======================================================

export type Length = number | `${number}px` | `${number}%` | "auto";

export type Color = string;

export type Url = string;

// ======================================================
// SPACING
// ======================================================

export type Spacing = Length | Insets;

export interface Insets {
  top?: Length;

  right?: Length;

  bottom?: Length;

  left?: Length;
}

// ======================================================
// ALIGNMENT
// ======================================================

export type HorizontalAlignment = "left" | "center" | "right";

export type VerticalAlignment = "top" | "middle" | "bottom";

// ======================================================
// BACKGROUND
// ======================================================

interface Background {
  color?: Color;
  image?: BackgroundImage;
}

export interface BackgroundImage {
  url: Url;

  repeat?: BackgroundRepeat;

  position?: BackgroundPosition;

  size?: BackgroundSize;
}

export type BackgroundRepeat = "repeat" | "no-repeat" | "repeat-x" | "repeat-y";

export type BackgroundPosition =
  | "left"
  | "center"
  | "right"
  | "top"
  | "bottom"
  | BackgroundPositionValue;

export interface BackgroundPositionValue {
  x: HorizontalAlignment;
  y: VerticalAlignment;
}

export type BackgroundSize =
  | "auto"
  | "cover"
  | "contain"
  | Length
  | BackgroundDimensions;

export interface BackgroundDimensions {
  width?: Length;

  height?: Length;
}
// ======================================================
// BORDER
// ======================================================

export interface Border {
  width?: BorderWidth;

  style?: BorderStyle;

  color?: Color;

  radius?: BorderRadius;
}

export type BorderWidth = Length | BorderWidths;

export interface BorderWidths {
  top?: Length;

  right?: Length;

  bottom?: Length;

  left?: Length;
}

export type BorderRadius = Length | CornerRadius;

export interface CornerRadius {
  topLeft?: Length;

  topRight?: Length;

  bottomRight?: Length;

  bottomLeft?: Length;
}

export type BorderStyle = "solid" | "dashed" | "dotted";

// ======================================================
// TYPOGRAPHY
// ======================================================

export interface Typography {
  fontFamily?: string;

  fontSize?: Length;

  fontWeight?: FontWeight;

  fontStyle?: FontStyle;

  lineHeight?: Length;

  letterSpacing?: Length;

  color?: Color;

  textAlign?: HorizontalAlignment;

  textDecoration?: TextDecoration;

  textTransform?: TextTransform;
}

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type FontStyle = "normal" | "italic";

export type TextDecoration = "none" | "underline" | "line-through";

export type TextTransform = "none" | "uppercase" | "lowercase" | "capitalize";

// ======================================================
// LINK
// ======================================================

export type Link = HttpLink | EmailLink | PhoneLink | SmsLink | AnchorLink;

interface BaseLink {
  /**
   * Advisory information about the link.
   */
  title?: string;
}

export interface HttpLink extends BaseLink {
  type: "http";

  href: Url;

  target?: "_self" | "_blank";

  rel?: string;
}

export interface EmailLink extends BaseLink {
  type: "email";

  to: string;

  subject?: string;

  body?: string;
}

export interface PhoneLink extends BaseLink {
  type: "phone";

  number: string;
}

export interface SmsLink extends BaseLink {
  type: "sms";

  number: string;

  body?: string;
}

export interface AnchorLink extends BaseLink {
  type: "anchor";

  id: string;
}

// ======================================================
// VISIBILITY
// ======================================================

export interface Visibility {
  desktop?: boolean;

  mobile?: boolean;
}

export type Direction = "ltr" | "rtl";
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

// ======================================================
// CONTENT
// ======================================================

export interface HasContent<T> {
  content: T;
}

// ======================================================
// LAYOUT
// ======================================================

export interface HasLayout {
  layout?: Layout;
}

// ======================================================
// STYLE
// ======================================================

export interface HasStyle {
  style?: Style;
}

// ======================================================
// LINK
// ======================================================

export interface HasLink {
  link?: Link;
}

// ======================================================
// VISIBILITY
// ======================================================

export interface HasVisibility {
  visibility?: Visibility;
}

// ======================================================
// RESPONSIVE
// ======================================================

export interface HasResponsive {
  responsive?: Responsive;
}

// ======================================================
// METADATA
// ======================================================

export interface HasMetadata {
  metadata?: Metadata;
}

