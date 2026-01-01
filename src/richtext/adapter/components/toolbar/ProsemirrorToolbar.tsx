import { useProsemirror } from "@/richtext/adapter/hooks/useProsemirror";
import { useEditorState } from "@/richtext/adapter/hooks/useEditorState";
import { tableCoordinatesPluginKey } from "@/richtext/core/extensions/nodes/table/plugins/tableCoordinates";
import { BasicTextStyleFormats } from "./BasicTextStyleFormats";
import { ScriptFormats } from "./ScriptFormats";
import { HeadingFormats } from "./HeadingsFormats";
import { UnorderedListFormats } from "./UnorderedListFormats";
import { OrderedListFormats } from "./OrderedListFormats";
import { TextAlignmentFormats } from "./TextAlignmentFormats";
import { TextDirectionFormats } from "./TextDirectionFormats";
import { IndentFormats } from "./IndentFormats";
import { LinkFormats } from "./LinkFormats";
import { FontStyleFormats } from "./FontStyleFormats";
import { LineHeightFormats } from "./LineHeightFormats";
import { TableFormats } from "./TableFormats";
import { ClearFormats } from "./ClearFormats";
import { EmojieSymbolFormats } from "./EmojieSymbolFormats";
import { cellSelectionPluginKey } from "@/richtext/core/extensions/nodes/table/plugins/cellSelection";
import type { Attrs } from "prosemirror-model";

export interface ProsemirrorState {
  table: {
    rect: DOMRect | null;
    cellAttrs: Attrs | null;
    canMergeCells: boolean;
    canSplitCell: boolean;
  };
  marks: {
    bold: boolean;
    italic: boolean;
    strike: boolean;
    underline: boolean;
    subscript: boolean;
    superscript: boolean;
  };
  isLink: boolean;
  isParagraph: boolean;
  heading: {
    h1: boolean;
    h2: boolean;
    h3: boolean;
    h4: boolean;
    h5: boolean;
    h6: boolean;
  };
  bulletList: {
    disc: boolean;
    circle: boolean;
    square: boolean;
  };
  orderedList: {
    decimal: boolean;
    lowerAlpha: boolean;
    upperAlpha: boolean;
    lowerRoman: boolean;
    upperRoman: boolean;
  };
  textAlign: {
    left: boolean;
    center: boolean;
    right: boolean;
    justify: boolean;
  };
  direction: {
    ltr: boolean;
    rtl: boolean;
  };
  canOutdent: boolean;
}

export const ProsemirrorToolbar = () => {
  const { activeEditor: editor } = useProsemirror();

  const editorState = useEditorState({
    editor,
    selector: (editor) => {
      // Get table rect from plugin state
      const tableCoordinatesState = tableCoordinatesPluginKey.getState(
        editor.state
      );
      const tableRect = tableCoordinatesState?.rect || null;
      const cellSelectionState = cellSelectionPluginKey.getState(editor.state);

      return {
        table: {
          rect: tableRect,
          cellAttrs: cellSelectionState?.cellAttrs || null,
          canMergeCells: editor.can().mergeCells(),
          canSplitCell: editor.can().splitCell(),
        },

        /* ===== Marks ===== */
        marks: {
          bold: editor.isActive("bold"),
          italic: editor.isActive("italic"),
          strike: editor.isActive("strike"),
          underline: editor.isActive("underline"),
          subscript: editor.isActive("subscript"),
          superscript: editor.isActive("superscript"),
        },
        isLink: editor.isActive("link"),

        /* ===== Blocks ===== */
        isParagraph: editor.isActive("paragraph"),
        heading: {
          h1: editor.isActive("heading", { level: 1 }),
          h2: editor.isActive("heading", { level: 2 }),
          h3: editor.isActive("heading", { level: 3 }),
          h4: editor.isActive("heading", { level: 4 }),
          h5: editor.isActive("heading", { level: 5 }),
          h6: editor.isActive("heading", { level: 6 }),
        },

        /* ===== Lists ===== */
        bulletList: {
          disc: editor.isActive("bulletList", { listStyleType: "disc" }),
          circle: editor.isActive("bulletList", { listStyleType: "circle" }),
          square: editor.isActive("bulletList", { listStyleType: "square" }),
        },

        orderedList: {
          decimal: editor.isActive("orderedList", {
            listStyleType: "decimal",
          }),
          lowerAlpha: editor.isActive("orderedList", {
            listStyleType: "lower-alpha",
          }),
          upperAlpha: editor.isActive("orderedList", {
            listStyleType: "upper-alpha",
          }),
          lowerRoman: editor.isActive("orderedList", {
            listStyleType: "lower-roman",
          }),
          upperRoman: editor.isActive("orderedList", {
            listStyleType: "upper-roman",
          }),
        },

        /* ===== Alignment ===== */
        textAlign: {
          left: editor.isActive({ textAlign: "left" }),
          center: editor.isActive({ textAlign: "center" }),
          right: editor.isActive({ textAlign: "right" }),
          justify: editor.isActive({ textAlign: "justify" }),
        },

        /* ===== Direction ===== */
        direction: {
          ltr: editor.isActive({ dir: "ltr" }),
          rtl: editor.isActive({ dir: "rtl" }),
        },

        canOutdent: editor.can().setIndentation(-15),
      };
    },
  });

  if (!editor || !editorState) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5" }}>
      {/* Formato de texto básico */}
      <BasicTextStyleFormats editor={editor} editorState={editorState} />

      {/* Superscript / Subscript */}
      <ScriptFormats editor={editor} editorState={editorState} />

      {/* Headings y Paragraph */}
      <HeadingFormats editor={editor} editorState={editorState} />

      {/* Bullet Lists */}
      <UnorderedListFormats editor={editor} editorState={editorState} />

      {/* Ordered Lists */}
      <OrderedListFormats editor={editor} editorState={editorState} />

      {/* Text Align */}
      <TextAlignmentFormats editor={editor} editorState={editorState} />

      {/* Text Direction */}
      <TextDirectionFormats editor={editor} editorState={editorState} />

      {/* Indent */}
      <IndentFormats editor={editor} editorState={editorState} />

      {/* Text Style - Font Size */}
      <FontStyleFormats editor={editor} editorState={editorState} />

      {/* Line Height */}
      <LineHeightFormats editor={editor} editorState={editorState} />

      {/* Link */}
      <LinkFormats editor={editor} editorState={editorState} />

      {/* Table */}
      <TableFormats editor={editor} editorState={editorState} />

      {/* Emojis & Special Characters */}
      <EmojieSymbolFormats editor={editor} editorState={editorState} />

      {/* Clear Formatting */}
      <ClearFormats editor={editor} editorState={editorState} />
    </div>
  );
};
