import { Document } from "../../core/extensions/nodes/Document";
import { Text } from "../../core/extensions/nodes/Text";
import { Paragraph } from "../../core/extensions/nodes/Paragraph";
import { Heading } from "../../core/extensions/nodes/Heading";
import { Bold } from "../../core/extensions/marks/Bold";
import { Italic } from "../../core/extensions/marks/Italic";
import { Strike } from "../../core/extensions/marks/Strike";
import { Subscript } from "../../core/extensions/marks/Subscript";
import { Superscript } from "../../core/extensions/marks/Superscript";
import { Underline } from "../../core/extensions/marks/Underline";
import { TextAlign } from "../../core/extensions/TextAlign";
import { TextDirection } from "../../core/extensions/TextDirection";
import { BulletList } from "../../core/extensions/nodes/lists/BulletList";
import { OrderedList } from "../../core/extensions/nodes/lists/OrderedList";
import { ListItem } from "../../core/extensions/nodes/lists/ListItem";
import { Indentation } from "../../core/extensions/Indentation";
import { FontSize } from "../../core/extensions/textStyles/FontSize";
import { FontFamily } from "../../core/extensions/textStyles/FontFamily";
import { Color } from "../../core/extensions/textStyles/Color";
import { BackgroundColor } from "../../core/extensions/textStyles/BackgroundColor";
import { LineHeight } from "../../core/extensions/textStyles/LineHeight";
import { LetterSpacing } from "../../core/extensions/textStyles/LetterSpacing";
import { Table } from "../../core/extensions/nodes/table/Table";
import { TableRow } from "../../core/extensions/nodes/table/TableRow";
import { TableCell } from "../../core/extensions/nodes/table/TableCell";
import { TableHeader } from "../../core/extensions/nodes/table/TableHeader";
import { Link } from "../../core/extensions/marks/link/Link";
import { EmojiSymbols } from "../../core/extensions/EmojiSymbols";
import type { Extension } from "../../core/types";
import { HardBreak } from "../../core/extensions/HardBreak";
import { levels, type Level, type TemplateConfig } from "$lib/template/types";
import type { GlobalConfig } from "$lib/richtext/core/extensions/types";

function extractExtensionConfig(config: Partial<TemplateConfig>, prop: string) {
  const extracted: GlobalConfig = {};
  const paragraphValue = (config?.paragraph as any)?.[prop] ?? undefined;
  if (paragraphValue !== undefined) extracted.paragraph = paragraphValue;

  const headings: Partial<Record<Level, string>> = {};
  levels.forEach(level => {
    const headingValue = (config.heading?.level as any)?.[level]?.[prop];

    if (headingValue !== undefined) headings[level] = headingValue;
  });
  if (Object.keys(headings).length) extracted.heading = headings;

  const linkValue = (config.link as any)?.[prop];
  if (linkValue !== undefined) extracted.link = linkValue;

  return Object.keys(extracted).length ? extracted : undefined;
}

export function buildTextExtensions(config: Partial<TemplateConfig>): Extension[] {
  const marks: Extension[] = [
    Bold,
    Italic,
    Strike,
    Subscript,
    Superscript,
    Underline,
    Link({ isUnderlined: config?.link?.isUnderlined }),
  ];

  const nodes: Extension[] = [
    Document(),
    Text,
    Paragraph,
    Heading,
    BulletList,
    OrderedList,
    ListItem,
    Table,
    TableRow,
    TableCell,
    TableHeader,
  ];

  const miscellaneous: Extension[] = [
    TextAlign,
    TextDirection,
    Indentation,
    FontSize(extractExtensionConfig(config, "fontSize")),
    FontFamily(extractExtensionConfig(config, "fontFamily")),
    LineHeight(extractExtensionConfig(config, "lineHeight")),
    LetterSpacing(extractExtensionConfig(config, "letterSpacing")),
    Color(extractExtensionConfig(config, "color")),
    BackgroundColor,
    EmojiSymbols,
  ];

  return [...marks, ...nodes, ...miscellaneous];
}

export function buildButtonExtensions() {
  const nodes: Extension[] = [
    Document({ content: "(text | hardBreak)*" }),
    Text,
    HardBreak,
  ];

  return [...nodes];
}
