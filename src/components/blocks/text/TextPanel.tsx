import type { TextBlockEntity } from "@/entities/template";

import { BasicTextStyleFormats } from "@/richtext/adapter/components/toolbar/BasicTextStyleFormats";
import { ScriptFormats } from "@/richtext/adapter/components/toolbar/ScriptFormats";
import { HeadingFormats } from "@/richtext/adapter/components/toolbar/HeadingsFormats";
import { UnorderedListFormats } from "@/richtext/adapter/components/toolbar/UnorderedListFormats";
import { OrderedListFormats } from "@/richtext/adapter/components/toolbar/OrderedListFormats";
import { TextAlignmentFormats } from "@/richtext/adapter/components/toolbar/TextAlignmentFormats";
import { TextDirectionFormats } from "@/richtext/adapter/components/toolbar/TextDirectionFormats";
import { IndentFormats } from "@/richtext/adapter/components/toolbar/IndentFormats";
import { LinkFormats } from "@/richtext/adapter/components/toolbar/LinkFormats";
import { FontStyleFormats } from "@/richtext/adapter/components/toolbar/FontStyleFormats";
import { LineHeightFormats } from "@/richtext/adapter/components/toolbar/LineHeightFormats";
import { TableFormats } from "@/richtext/adapter/components/toolbar/TableFormats";
import { ClearFormats } from "@/richtext/adapter/components/toolbar/ClearFormats";
import { EmojieSymbolFormats } from "@/richtext/adapter/components/toolbar/EmojieSymbolFormats";

export const TextPanel = ({ block }: { block: TextBlockEntity }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5" }}>
      {/* Formato de texto básico */}
      <BasicTextStyleFormats />

      {/* Superscript / Subscript */}
      <ScriptFormats />

      {/* Headings y Paragraph */}
      <HeadingFormats />

      {/* Bullet Lists */}
      <UnorderedListFormats />

      {/* Ordered Lists */}
      <OrderedListFormats />

      {/* Text Align */}
      <TextAlignmentFormats />

      {/* Text Direction */}
      <TextDirectionFormats />

      {/* Indent */}
      <IndentFormats />

      {/* Text Style - Font Size */}
      <FontStyleFormats />

      {/* Line Height */}
      <LineHeightFormats />

      {/* Link */}
      <LinkFormats />

      {/* Table */}
      <TableFormats />

      {/* Emojis & Special Characters */}
      <EmojieSymbolFormats />

      {/* Clear Formatting */}
      <ClearFormats />
    </div>
  );
};
