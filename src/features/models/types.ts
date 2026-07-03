//#region Primitives
export type HorizontalAlign = "left" | "center" | "right";
export type VerticalAlign = "top" | "middle" | "bottom";
export type Direction = "ltr" | "rtl";

export type BorderStyle = "solid" | "dashed" | "dotted" | "none";

export interface Border {
  width: string;
  style: BorderStyle;
  color: string;
}

export type BackgroundRepeat = "repeat" | "no-repeat" | "repeat-x" | "repeat-y";

export type BackgroundSize =
  | "contain"
  | "cover"
  | "auto"
  | { width: string; height: string };

export interface BackgroundPosition {
  horizontal: "left" | "center" | "right";
  vertical: "top" | "center" | "bottom";
}

export interface BackgroundImage {
  url: string;
  repeat: BackgroundRepeat;
  position: BackgroundPosition;
  size: BackgroundSize;
}

export interface Spacing {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

export interface BorderRadius {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
}

interface HttpLink {
  type: "http";
  url: string;
  title?: string;
  alt?: string;
}

interface EmailLink {
  type: "email";
  to: string;
  subject?: string;
  message?: string;
}

interface SmsLink {
  type: "sms";
  number: string;
  message?: string;
}

interface PhoneLink {
  type: "phone";
  number: string;
}

export type LinkAttributes = HttpLink | EmailLink | SmsLink | PhoneLink;

export interface Visibility {
  showOn: "mobile" | "desktop" | "both";
}

export type RichTextContent = Record<string, unknown>;

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
//#endregion

const CONTENT_TYPES = ["text", "button"] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

export type BlockType = ContentType | LayoutType;

export type LayoutType = "root" | "row" | "column";

export interface BaseBlock<T = unknown> {
  id: string;
  type: BlockType;
  parentId: string | null;
  childrenIds: string[];
  props: T;
}

export interface RootProps {
  width?: string;
  padding?: Spacing;
  align?: HorizontalAlign;
  backgroundColor?: string;
  backgroundImage?: BackgroundImage;
  border?: Border;
  borderRadius?: BorderRadius;
}

export interface RootBlock extends BaseBlock<RootProps> {
  type: "root";
}

export interface RowProps {
  isResponsive?: boolean;
  gap?: string;
  padding?: Spacing;
  margin?: Spacing;
  backgroundColor?: string;
  backgroundImage?: BackgroundImage;
  border?: Border;
  borderRadius?: BorderRadius;
}

export interface RowBlock extends BaseBlock<RowProps> {
  type: "row";
}

export interface ColumnProps {
  width: string;
  padding?: Spacing;
  align?: HorizontalAlign;
  backgroundColor?: string;
  backgroundImage?: BackgroundImage;
  border?: Border;
  borderRadius?: BorderRadius;
}

export interface ColumnBlock extends BaseBlock<ColumnProps> {
  type: "column";
}

export interface TextProps {
  content: RichTextContent;
  padding?: Spacing;
}

export interface TextBlock extends BaseBlock<TextProps> {
  type: "text";
}

export interface ButtonProps {
  content: RichTextContent;
  link: LinkAttributes;

  margin?: Spacing;
  padding?: Spacing;
  align?: HorizontalAlign;
  height?: string;
  valign?: VerticalAlign;
  backgroundColor?: string;
  color?: string;
  fontFamily?: string;
  fontSize?: string;
  letterSpacing?: string;
  border?: Border;
  borderRadius?: BorderRadius;
}

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
  Render: React.ComponentType<{ block: T, children?: React.ReactNode; }>;
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

// export interface TemplateConfig {
//   title?: string;
//   preheader?: string;
// areRowsResponsive: boolean;
// direction: Direction;
// colorPalette: string[];
// links: LinkConfig;
// paragraphs: TypographyConfig;
// headings: Record<HeadingLevel, TypographyConfig>;
// buttons: ButtonConfig;
// }

export interface EmailTemplate {
  document: BlockTree;
}
