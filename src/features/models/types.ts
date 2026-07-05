const CONTENT_TYPES = ["text", "button"] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

export type BlockType = ContentType | LayoutType;

export type LayoutType = "root" | "row" | "column";
export type RichTextContent = Record<string, unknown>;
export interface BaseBlock<T = unknown> {
  id: string;
  type: BlockType;
  parentId: string | null;
  childrenIds: string[];
  props: T;
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
  behaviour?: Behaviour;

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

  maxWidth?: Length;

  maxHeight?: Length;

  gap?: Length;

  margin?: Spacing;

  padding?: Spacing;

  align?: HorizontalAlignment;

  verticalAlign?: VerticalAlignment;

  direction?: Direction;
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

export interface Behaviour {
  link?: Link;

  visibility?: Visibility;
}

// ======================================================
// RESPONSIVE
// ======================================================

export interface Responsive {
  mobile?: {
    stack?: boolean;

    layout?: Partial<Layout>;

    style?: Partial<Style>;

    behaviour?: Partial<Behaviour>;
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

export type Length = `${number}px` | `${number}%` | "auto";

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

export interface Background {
  color?: Color;
  image?: BackgroundImage;
  gradient?: BackgroundGradient;
}

export interface BackgroundImage {
  url: Url;

  repeat?: BackgroundRepeat;

  position?: BackgroundPosition;

  size?: BackgroundSize;
}

export interface BackgroundGradient {
  value: string;
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

export interface HasBehaviour {
  behaviour?: Behaviour;
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

// ======================================================
// Props
// ======================================================

export interface RootProps
  extends HasLayout, HasStyle, HasResponsive, HasMetadata {}

export interface RootBlock extends BaseBlock<RootProps> {
  type: "root";
}

export interface RowProps
  extends HasLayout, HasStyle, HasBehaviour, HasResponsive, HasMetadata {
  isResponsive?: boolean;
}

export interface RowBlock extends BaseBlock<RowProps> {
  type: "row";
}

export interface ColumnProps
  extends HasLayout, HasStyle, HasBehaviour, HasResponsive, HasMetadata {}

export interface ColumnBlock extends BaseBlock<ColumnProps> {
  type: "column";
}

export interface TextProps
  extends
    HasContent<RichTextContent>,
    HasLayout,
    HasStyle,
    HasBehaviour,
    HasResponsive,
    HasMetadata {}

export interface TextBlock extends BaseBlock<TextProps> {
  type: "text";
}

export interface ButtonProps
  extends
    HasContent<RichTextContent>,
    HasLayout,
    HasStyle,
    HasBehaviour,
    HasResponsive,
    HasMetadata {}

export interface ButtonBlock extends BaseBlock<ButtonProps> {
  type: "button";
}

export type Block =
  | RootBlock
  | RowBlock
  | ColumnBlock
  | TextBlock
  | ButtonBlock;

export interface BlockDefinition<T extends Block = Block> {
  type: T["type"];
  accepts: readonly BlockType[];
  isDraggable: boolean;
  isSelectable: boolean;
  isHoverable: boolean;
  Render: React.ComponentType<{ block: T; children?: React.ReactNode }>;
  icon?: React.ReactNode;
  label?: string;
  Card?: React.ComponentType<{ block: T }>;
}

export interface BlockTree {
  rootIds: string[];
  blocks: Record<string, Block>;
}

export interface BlockTemplate {
  id: string;
  name: string;
  create: () => BlockTree;
}

export interface EmailTemplate {
  document: BlockTree;
}
export type Viewport = "desktop" | "mobile";

export interface Subtree {
  rootId: string;
  blocks: Record<string, Block>;
}