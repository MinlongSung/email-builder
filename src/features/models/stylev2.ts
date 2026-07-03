export type AlignX = "left" | "center" | "right";
export type AlignY = "top" | "middle" | "bottom";
export type Direction = "ltr" | "rtl";
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface Sides<T> {
  top: T;
  right: T;
  bottom: T;
  left: T;
}

export interface Corners<T> {
  topLeft: T;
  topRight: T;
  bottomRight: T;
  bottomLeft: T;
}

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
  horizontal: AlignX;
  vertical: "top" | "center" | "bottom";
}

export interface BackgroundImage {
  url: string;
  alt?: string;
  repeat?: BackgroundRepeat;
  position?: BackgroundPosition;
  size?: BackgroundSize;
}

export interface HttpLink {
  type: "http";
  url: string;
  title?: string;
  alt?: string;
}

export interface EmailLink {
  type: "email";
  to: string;
  subject?: string;
  message?: string;
}

export interface SmsLink {
  type: "sms";
  number: string;
  message?: string;
}

export interface PhoneLink {
  type: "phone";
  number: string;
}

export type Link = HttpLink | EmailLink | SmsLink | PhoneLink;

export interface Visibility {
  showOnPhone: boolean;
  showOnDesktop: boolean;
}

export type RichTextContent = Record<string, unknown>;

export interface SpacingProps {
  padding?: Sides<string>;
  margin?: Sides<string>;
}

export interface StyleProps {
  background?: {
    color?: string;
    image?: BackgroundImage;
  };

  border?: Border;
  radius?: Corners<string>;
  shadow?: Shadow;
  opacity?: number;
}

export interface Shadow {
  x: string;
  y: string;
  blur: string;
  spread?: string;
  color: string;
}

export interface TypographyProps {
  color?: string;
  fontFamily?: string;
  fontSize?: string;
  lineHeight?: string;
  letterSpacing?: string;
}

export interface BehaviorProps {
  link?: Link;
  visibility?: Visibility;
}

interface LayoutProps {}
export interface BlockProps {
  layout?: LayoutProps;
  spacing?: SpacingProps;
  style?: StyleProps;
  typography?: TypographyProps;
  behavior?: BehaviorProps;
}

export interface RenderLayers {
  layout?: BlockProps;
  box?: BlockProps;
  content: BlockProps;
}
