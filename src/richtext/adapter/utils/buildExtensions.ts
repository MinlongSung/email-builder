import { Commands } from "@/richtext/core/extensions/Commands";
import { Keymap } from "@/richtext/core/extensions/Keymap";
import { Document } from "@/richtext/core/extensions/nodes/Document";
import { Text } from "@/richtext/core/extensions/nodes/Text";
import { Paragraph } from "@/richtext/core/extensions/nodes/Paragraph";
import { Heading } from "@/richtext/core/extensions/nodes/Heading";
import { Bold } from "@/richtext/core/extensions/marks/Bold";
import { Italic } from "@/richtext/core/extensions/marks/Italic";
import { Strike } from "@/richtext/core/extensions/marks/Strike";
import { Subscript } from "@/richtext/core/extensions/marks/Subscript";
import { Superscript } from "@/richtext/core/extensions/marks/Superscript";
import { Underline } from "@/richtext/core/extensions/marks/Underline";
import { TextAlign } from "@/richtext/core/extensions/TextAlign";
import { TextDirection } from "@/richtext/core/extensions/TextDirection";
import { BulletList } from "@/richtext/core/extensions/nodes/lists/BulletList";
import { OrderedList } from "@/richtext/core/extensions/nodes/lists/OrderedList";
import { ListItem } from "@/richtext/core/extensions/nodes/lists/ListItem";
import { Indentation } from "@/richtext/core/extensions/Indentation";
import { FontSize } from "@/richtext/core/extensions/textStyles/FontSize";
import { FontFamily } from "@/richtext/core/extensions/textStyles/FontFamily";
import { Color } from "@/richtext/core/extensions/textStyles/Color";
import { BackgroundColor } from "@/richtext/core/extensions/textStyles/BackgroundColor";
import { LineHeight } from "@/richtext/core/extensions/textStyles/LineHeight";
import { LetterSpacing } from "@/richtext/core/extensions/textStyles/LetterSpacing";
import { Table } from "@/richtext/core/extensions/nodes/table/Table";
import { TableRow } from "@/richtext/core/extensions/nodes/table/TableRow";
import { TableCell } from "@/richtext/core/extensions/nodes/table/TableCell";
import { TableHeader } from "@/richtext/core/extensions/nodes/table/TableHeader";
import { Link } from "@/richtext/core/extensions/marks/link/Link";
import { EmojiSymbols } from "@/richtext/core/extensions/EmojiSymbols";
import type { Extension } from "@/richtext/core/types";
import type { TemplateSettings } from "@/entities/template";
import { HardBreak } from "@/richtext/core/extensions/HardBreak";

export function buildTextExtensions(settings: TemplateSettings): Extension[] {
  const { paragraph, heading, link } = settings;
  const marks: Extension[] = [
    Bold,
    Italic,
    Strike,
    Subscript,
    Superscript,
    Underline,
    Link({ isUnderlined: link.isUnderlined }),
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
    Commands,
    Keymap,
    TextAlign,
    TextDirection,
    Indentation,
    FontSize({
      paragraph: paragraph.fontSize,
      heading: {
        1: heading.level[1].fontSize,
        2: heading.level[2].fontSize,
        3: heading.level[3].fontSize,
        4: heading.level[4].fontSize,
        5: heading.level[5].fontSize,
        6: heading.level[6].fontSize,
      },
    }),
    FontFamily({
      paragraph: paragraph.fontFamily,
      heading: {
        1: heading.level[1].fontFamily,
        2: heading.level[2].fontFamily,
        3: heading.level[3].fontFamily,
        4: heading.level[4].fontFamily,
        5: heading.level[5].fontFamily,
        6: heading.level[6].fontFamily,
      },
    }),
    LineHeight({
      paragraph: paragraph.lineHeight,
      heading: {
        1: heading.level[1].lineHeight,
        2: heading.level[2].lineHeight,
        3: heading.level[3].lineHeight,
        4: heading.level[4].lineHeight,
        5: heading.level[5].lineHeight,
        6: heading.level[6].lineHeight,
      },
    }),
    LetterSpacing({
      paragraph: paragraph.letterSpacing,
      heading: {
        1: heading.level[1].letterSpacing,
        2: heading.level[2].letterSpacing,
        3: heading.level[3].letterSpacing,
        4: heading.level[4].letterSpacing,
        5: heading.level[5].letterSpacing,
        6: heading.level[6].letterSpacing,
      },
    }),
    Color({
      paragraph: paragraph.color,
      heading: {
        1: heading.level[1].color,
        2: heading.level[2].color,
        3: heading.level[3].color,
        4: heading.level[4].color,
        5: heading.level[5].color,
        6: heading.level[6].color,
      },
      link: link.color,
    }),
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

  const miscellaneous: Extension[] = [Commands, Keymap];

  return [...nodes, ...miscellaneous];
}
