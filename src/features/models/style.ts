import React from "react";

// ============================================================
// SECTION 1 — PRIMITIVES
// Tipos base reutilizables en todo el modelo.
// No hacen referencia a implementaciones HTML/CSS.
// ============================================================

export type HorizontalAlign = "left" | "center" | "right";
export type VerticalAlign   = "top"  | "middle" | "bottom";
export type Direction       = "ltr"  | "rtl";
export type HeadingLevel    = 1 | 2 | 3 | 4 | 5 | 6;

// ============================================================
// SECTION 2 — SPACING
// Espacio interior (inset) y exterior (outset) de un bloque.
//
// En React preview: inset → padding CSS, outset → margin CSS.
// En email HTML: inset → padding del <td>, outset → padding
// del contenedor padre o celdas espaciadoras según el renderer.
// El modelo declara la intención; el renderer decide la táctica.
// ============================================================

export interface Spacing {
  top:    string;
  right:  string;
  bottom: string;
  left:   string;
}

// ============================================================
// SECTION 3 — BORDER
//
// Border: trazo uniforme para los 4 lados (caso más común).
// Sides<Border>: permite trazos distintos por lado.
//
// Uso recomendado:
//   border uniforme       → border: Border
//   sólo borde inferior   → borders: { bottom: Border }
//   base + override       → border + borders (borders gana por lado)
// ============================================================

export type BorderStyle = "solid" | "dashed" | "dotted" | "none";

export interface Border {
  width: string;
  style: BorderStyle;
  color: string;
}

/**
 * Control por lado. Cada campo es independiente.
 * Usado también para Spacing detallado cuando se necesita
 * mezclar shorthand con overrides por lado.
 */
export interface Sides<T> {
  top?:    T;
  right?:  T;
  bottom?: T;
  left?:   T;
}

export interface BorderRadius {
  topLeft:     string;
  topRight:    string;
  bottomLeft:  string;
  bottomRight: string;
}

// ============================================================
// SECTION 4 — BACKGROUND / FILL
// ============================================================

export type BackgroundRepeat =
  | "repeat"
  | "no-repeat"
  | "repeat-x"
  | "repeat-y";

export type BackgroundSize =
  | "contain"
  | "cover"
  | "auto"
  | { width: string; height: string };

export interface BackgroundPosition {
  horizontal: "left" | "center" | "right";
  vertical:   "top"  | "center" | "bottom";
}

export interface BackgroundImage {
  url:       string;
  repeat?:   BackgroundRepeat;
  position?: BackgroundPosition;
  size?:     BackgroundSize;
  /**
   * Color mostrado cuando el cliente no soporta imágenes de fondo.
   * Siempre recomendado. No es una instrucción de implementación:
   * es la intención del autor ("si no puedes, usa esto").
   */
  fallback?: string;
}

// ============================================================
// SECTION 5 — TYPOGRAPHY
//
// fontFamily es siempre un array (stack tipográfico).
// Nunca un string suelto — en email los fallbacks son
// obligatorios porque las webfonts no están garantizadas.
//
// Ejemplo: ["Inter", "Arial", "sans-serif"]
// El renderer genera: font-family: 'Inter', Arial, sans-serif;
// Y opcionalmente inyecta el @import de la webfont en <head>.
// ============================================================

export type FontWeight =
  | "100" | "200" | "300" | "400" | "500"
  | "600" | "700" | "800" | "900"
  | "normal" | "bold";

export type TextDecoration = "none" | "underline" | "line-through";
export type TextTransform  = "none" | "uppercase" | "lowercase" | "capitalize";

export interface Typography {
  fontFamily?:     string[];    // stack: ["Inter", "Arial", "sans-serif"]
  fontSize?:       string;
  fontWeight?:     FontWeight;
  fontStyle?:      "normal" | "italic";
  color?:          string;
  lineHeight?:     string;
  letterSpacing?:  string;
  textAlign?:      HorizontalAlign;
  textDecoration?: TextDecoration;
  textTransform?:  TextTransform;
  direction?:      Direction;
}

// ============================================================
// SECTION 6 — LINK
//
// Union discriminada por tipo de destino.
// Permite paneles distintos en el editor según el tipo
// (panel URL, panel email, panel SMS, panel teléfono).
// ============================================================

export interface HttpLink {
  type:   "http";
  url:    string;
  title?: string;
  alt?:   string;
}

export interface EmailLink {
  type:     "email";
  to:       string;
  subject?: string;
  message?: string;
}

export interface SmsLink {
  type:     "sms";
  number:   string;
  message?: string;
}

export interface PhoneLink {
  type:   "phone";
  number: string;
}

export type Link = HttpLink | EmailLink | SmsLink | PhoneLink;

// ============================================================
// SECTION 7 — VISIBILITY
//
// Control de visibilidad por contexto de renderizado.
//
// En email:
//   desktop / mobile → display:none + clases @media
//   legacy           → conditional comments <!--[if mso]>
//                      útil para bloques alternativos Outlook
// ============================================================

export interface Visibility {
  showOn: "mobile" | "desktop" | "both";
  /**
   * Si false, el bloque se oculta en clientes legacy (Outlook desktop)
   * mediante conditional comments. Útil para mostrar alternativas
   * a elementos no soportados (ej: bloque VML alternativo).
   * Por defecto: true (visible en todos los clientes).
   */
  showOnLegacy?: boolean;
}

// ============================================================
// SECTION 8 — RICH TEXT
// ============================================================

export type RichTextContent = Record<string, unknown>;

// ============================================================
// SECTION 9 — DESIGN TOKENS
// Fuente única de verdad para valores del sistema de diseño.
//
// IMPORTANTE: Los valores deben estar resueltos estáticamente.
// No usar CSS custom properties (var(--x)) en email — no funcionan
// en Outlook ni en la mayoría de clientes webmail.
// El renderer los inlinea directamente en los estilos.
// ============================================================

export interface DesignTokens {
  /** Paleta de colores. Clave: nombre semántico, valor: hex/rgb */
  colors?:        Record<string, string>;
  /** Escala tipográfica. Clave: rol semántico, valor: px/em */
  fontSizes?:     Record<string, string>;
  /** Escala de espaciado. Clave: t-shirt size, valor: px */
  spacing?:       Record<string, string>;
  /** Stacks tipográficos. Clave: rol, valor: array de familias */
  fontFamilies?:  Record<string, string[]>;
  /** Radios predefinidos. Clave: elemento, valor: px */
  borderRadius?:  Record<string, string>;
}

// ============================================================
// SECTION 10 — GLOBAL STYLES
// Estilos base heredables por todos los bloques.
// Cada bloque los sobreescribe selectivamente con sus props.
//
// Flujo de cascada (de menor a mayor especificidad):
//   globalStyles → block props → rich text inline
// ============================================================

export interface GlobalStyles {
  body?: {
    backgroundColor?: string;
    fontFamily?:      string[];
    fontSize?:        string;
    color?:           string;
    lineHeight?:      string;
  };
  link?: {
    color?:      string;
    decoration?: TextDecoration;
  };
  /**
   * Estilos base por nivel de encabezado.
   * El rich text puede sobrescribirlos inline.
   */
  headings?: Partial<Record<HeadingLevel, Pick<Typography,
    "fontSize" | "fontWeight" | "color" | "lineHeight" | "fontFamily"
  >>>;
  paragraph?: Pick<Typography, "fontSize" | "lineHeight" | "color">;
}

// ============================================================
// SECTION 11 — DOCUMENT CONFIG
// Metadatos del email como entidad.
// No son props de un bloque — pertenecen al documento.
// ============================================================

export interface DocumentConfig {
  /**
   * Ancho máximo del email.
   * Estándar de la industria: 600px.
   */
  maxWidth?:   string;
  /**
   * Breakpoint a partir del cual se aplica el layout mobile.
   * MJML default: 480px.
   */
  breakpoint?: string;
  /** Dirección de escritura del documento */
  direction?:  Direction;
  /** Código de idioma BCP 47: "es", "en", "ar", etc. */
  lang?:       string;
  /**
   * Texto de preheader (preview text del cliente de email).
   * Se renderiza como texto invisible seguido de espacios
   * para evitar que el cliente añada contenido del body.
   */
  preheader?:  string;
}

// ============================================================
// SECTION 12 — BLOCK TYPES
// ============================================================

export const CONTENT_TYPES = [
  "text",
  "button",
  "image",
  "divider",
  "spacer",
  "social",
  "video",
  "html",
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];
export type LayoutType  = "root" | "row" | "column";
export type BlockType   = ContentType | LayoutType;

// ============================================================
// SECTION 13 — BASE BLOCK
// ============================================================

export interface BaseBlock<TProps = unknown> {
  id:          string;
  type:        BlockType;
  parentId:    string | null;
  childrenIds: string[];
  props:       TProps;
}

// ============================================================
// SECTION 14 — BLOCK PROPS
//
// Principios de diseño:
//   1. Props describen la intención del autor, no cómo renderizar
//   2. Todos los campos opcionales excepto los de contenido semántico
//   3. Sin leakage: ningún prop hace referencia a HTML/CSS/MSO
//   4. border (uniforme) + borders (por lado) coexisten —
//      el renderer aplica borders por encima de border lado a lado
// ============================================================

// --- ROOT ---
// Contenedor raíz del email. Un único root por documento.
// En email = <table> de ancho completo wrapeando todo.
export interface RootProps {
  padding?:         Spacing;
  align?:           HorizontalAlign;
  backgroundColor?: string;
  backgroundImage?: BackgroundImage;
  border?:          Border;
  borderRadius?:    BorderRadius;
}

// --- ROW ---
// Fila horizontal. Contiene columnas.
// isResponsive: true → columnas se apilan en mobile.
// El renderer decide la estrategia (media queries, hybrid, fluid).
export interface RowProps {
  isResponsive?:    boolean;
  gap?:             string;
  padding?:         Spacing;
  margin?:          Spacing;
  align?:           HorizontalAlign;
  valign?:          VerticalAlign;
  backgroundColor?: string;
  backgroundImage?: BackgroundImage;
  border?:          Border;
  borders?:         Sides<Border>;
  borderRadius?:    BorderRadius;
  visibility?:      Visibility;
}

// --- COLUMN ---
// Celda dentro de un Row. En email = <td>.
// Sin width → el renderer distribuye equitativamente (1/n).
export interface ColumnProps {
  width?:           string;
  padding?:         Spacing;
  align?:           HorizontalAlign;
  valign?:          VerticalAlign;
  backgroundColor?: string;
  backgroundImage?: BackgroundImage;
  border?:          Border;
  borders?:         Sides<Border>;
  borderRadius?:    BorderRadius;
}

// --- TEXT ---
// Bloque de texto enriquecido.
// typography: estilos base del bloque. El rich text los hereda
// y puede sobrescribirlos inline (negrita, color, enlace, etc.)
export interface TextProps {
  content:      RichTextContent;
  padding?:     Spacing;
  typography?:  Typography;
  visibility?:  Visibility;
}

// --- BUTTON ---
// Bloque de llamada a la acción.
// En email se implementa como tabla con link, nunca como <button>.
// width: "auto" | "full" | CssLength (ej: "200px", "100%")
export interface ButtonProps {
  content:          RichTextContent;
  link:             Link;
  padding?:         Spacing;
  margin?:          Spacing;
  align?:           HorizontalAlign;
  valign?:          VerticalAlign;
  width?:           string;
  height?:          string;
  typography?:      Typography;
  backgroundColor?: string;
  border?:          Border;
  borders?:         Sides<Border>;
  borderRadius?:    BorderRadius;
  visibility?:      Visibility;
}

// --- IMAGE ---
// width/height como number (no string) porque en email
// son atributos HTML del <img>, no propiedades CSS.
// El renderer usa estos valores para generar width="600" height="400".
export interface ImageProps {
  src:           string;
  alt:           string;
  width?:        number;
  height?:       number;
  link?:         Link;
  padding?:      Spacing;
  margin?:       Spacing;
  align?:        HorizontalAlign;
  border?:       Border;
  borders?:      Sides<Border>;
  borderRadius?: BorderRadius;
  visibility?:   Visibility;
}

// --- DIVIDER ---
// La línea divisoria es en realidad un border.
// Se usa border para definir el trazo del divisor.
export interface DividerProps {
  border?:      Border;
  width?:       string;
  padding?:     Spacing;
  align?:       HorizontalAlign;
  visibility?:  Visibility;
}

// --- SPACER ---
// Espacio vertical entre bloques.
// height es requerido: es el único dato semántico del bloque.
export interface SpacerProps {
  height:      string;
  visibility?: Visibility;
}

// --- SOCIAL ---
export type SocialPlatform =
  | "twitter" | "x"
  | "facebook"
  | "instagram"
  | "linkedin"
  | "youtube"
  | "tiktok"
  | "pinterest"
  | "snapchat"
  | "whatsapp"
  | "telegram"
  | "custom";

export interface SocialLink {
  platform:            SocialPlatform;
  url:                 string;
  /** Texto accesible para lectores de pantalla */
  label:               string;
  /**
   * URL del icono. Recomendado: imagen hosteada (no inline SVG).
   * En email, los SVG inline tienen soporte inconsistente.
   */
  iconUrl?:            string;
  /** Nombre del icono cuando platform === "custom" */
  customPlatformName?: string;
}

export interface SocialProps {
  links:        SocialLink[];
  iconSize?:    number;
  gap?:         string;
  layout?:      "horizontal" | "vertical";
  padding?:     Spacing;
  align?:       HorizontalAlign;
  visibility?:  Visibility;
}

// --- VIDEO ---
// En email no hay <video>. Se implementa como imagen thumbnail
// con icono de play encima y un link al video externo.
// Al hacer click se abre en el navegador.
export interface VideoProps {
  thumbnailSrc:  string;
  thumbnailAlt:  string;
  videoUrl:      string;
  playIconUrl?:  string;
  width?:        number;
  height?:       number;
  padding?:      Spacing;
  align?:        HorizontalAlign;
  border?:       Border;
  borderRadius?: BorderRadius;
  visibility?:   Visibility;
}

// --- HTML ---
// Bloque de HTML personalizado (escape hatch).
// El renderer lo incrusta sin modificaciones.
// No hay garantía de compatibilidad cross-client.
export interface HtmlProps {
  content:     string;
  padding?:    Spacing;
  visibility?: Visibility;
}

// ============================================================
// SECTION 15 — TYPED BLOCKS
// ============================================================

export interface RootBlock    extends BaseBlock<RootProps>    { type: "root";    }
export interface RowBlock     extends BaseBlock<RowProps>     { type: "row";     }
export interface ColumnBlock  extends BaseBlock<ColumnProps>  { type: "column";  }
export interface TextBlock    extends BaseBlock<TextProps>    { type: "text";    }
export interface ButtonBlock  extends BaseBlock<ButtonProps>  { type: "button";  }
export interface ImageBlock   extends BaseBlock<ImageProps>   { type: "image";   }
export interface DividerBlock extends BaseBlock<DividerProps> { type: "divider"; }
export interface SpacerBlock  extends BaseBlock<SpacerProps>  { type: "spacer";  }
export interface SocialBlock  extends BaseBlock<SocialProps>  { type: "social";  }
export interface VideoBlock   extends BaseBlock<VideoProps>   { type: "video";   }
export interface HtmlBlock    extends BaseBlock<HtmlProps>    { type: "html";    }

export type Block =
  | RootBlock
  | RowBlock
  | ColumnBlock
  | TextBlock
  | ButtonBlock
  | ImageBlock
  | DividerBlock
  | SpacerBlock
  | SocialBlock
  | VideoBlock
  | HtmlBlock;

// ============================================================
// SECTION 16 — BLOCK TREE
// ============================================================

export interface BlockTree {
  rootIds: string[];
  blocks:  Record<string, Block>;
}

// ============================================================
// SECTION 17 — BLOCK DEFINITION
// Metadatos del bloque para el editor (UI, drag&drop, etc.)
// Separado de los props: es configuración del editor, no del email.
// ============================================================

export interface BlockDefinition<T extends Block = Block> {
  type:         T["type"];
  accepts:      readonly BlockType[];
  isDraggable:  boolean;
  isDroppable:  boolean;
  isSelectable: boolean;
  isHoverable:  boolean;
  Render:       React.ComponentType<{ block: T; children?: React.ReactNode }>;
  icon?:        React.ReactNode;
  label?:       string;
  Card?:        React.ComponentType<{ block: T }>;
}

// ============================================================
// SECTION 18 — ACCEPTANCE RULES
// Qué tipos de bloque puede contener cada contenedor.
// ============================================================

export const ACCEPTED_COLUMN_TYPES: readonly ContentType[] = CONTENT_TYPES;

export const ACCEPTED_ROOT_TYPES = [
  "row",
] as const satisfies readonly LayoutType[];

// ============================================================
// SECTION 19 — BLOCK TEMPLATE
// Plantilla de bloque reutilizable. Produce un BlockTree.
// ============================================================

export interface BlockTemplate {
  id:     string;
  name:   string;
  create: () => BlockTree;
}

// ============================================================
// SECTION 20 — EMAIL TEMPLATE
// La entidad raíz del sistema.
//
// version: para gestionar migraciones futuras del schema.
//   Si el modelo cambia (cosa que debería ser excepcional),
//   el migrador lee version y transforma el documento al nuevo formato.
//   Los bloques existentes nunca se rompen: los campos nuevos
//   son siempre opcionales y los renderers los ignoran si no los conocen.
//
// config: metadatos del documento (preheader, lang, maxWidth...)
// tokens: valores primitivos del sistema de diseño (opcional)
// globalStyles: estilos base heredables por los bloques (opcional)
// document: el árbol de bloques con el contenido real
// ============================================================

export interface EmailTemplate {
  version:       number;
  config:        DocumentConfig;
  tokens?:       DesignTokens;
  globalStyles?: GlobalStyles;
  document:      BlockTree;
}