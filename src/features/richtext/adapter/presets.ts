import { Document } from "@tiptap/extension-document";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";
import { Bold } from "@tiptap/extension-bold";
import { Italic } from "@tiptap/extension-italic";
import { Underline } from "@tiptap/extension-underline";
import { Strike } from "@tiptap/extension-strike";
import { Heading } from "@tiptap/extension-heading";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyleKit } from "@tiptap/extension-text-style";

import { Superscript } from "@/features/richtext/extensions/marks/Superscript";
import { Subscript } from "@/features/richtext/extensions/marks/Subscript";
import { TextDirection } from "@/features/richtext/extensions/functionality/TextDirection";
import { Indentation } from "@/features/richtext/extensions/functionality/Indentation";
import { LetterSpacing } from "@/features/richtext/extensions/functionality/LetterSpacing";
import { TableKit } from "@/features/richtext/extensions/nodes/table/TableKit";
import { ListKit } from "@/features/richtext/extensions/nodes/list/ListKit";
import { Link } from "@/features/richtext/extensions/marks/link/Link";
import { InlineContent } from "@/features/richtext/extensions/InlineContent";

export const RICHTEXT_EXTENSIONS = [
  Document,
  Paragraph,
  Text,
  Bold,
  Italic,
  Underline,
  Strike,
  Superscript,
  Subscript,
  Heading,
  Link.configure({ openOnClick: false }),
  ListKit,
  TableKit,
  TextDirection,
  Indentation,
  TextStyleKit,
  LetterSpacing,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  InlineContent,
];
