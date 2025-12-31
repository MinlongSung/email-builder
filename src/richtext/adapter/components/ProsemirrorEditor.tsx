import { useLayoutEffect, useRef } from "react";
import { useProsemirror } from "@/richtext/adapter/hooks/useProsemirror";
import { Commands } from "@/richtext/core/extensions/Commands";
import { Keymap } from "@/richtext/core/extensions/Keymap";
import { Document } from "@/richtext/core/extensions/nodes/Document";
import { Text } from "@/richtext/core/extensions/nodes/Text";
import { Paragraph } from "@/richtext/core/extensions/nodes/Paragraph";
import { Heading } from "@/richtext/core/extensions/nodes/Heading";
import type { EditorContent, Extension } from "@/richtext/core/types";
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
import { Editor } from "@/richtext/core/Editor";
import { Link } from "@/richtext/core/extensions/marks/link/Link";
import { EmojiSymbols } from "@/richtext/core/extensions/EmojiSymbols";

interface ProsemirrorEditorProps {
  content: EditorContent;
  onUpdate: (editor: Editor) => void;
}

const marks: Extension[] = [
  Bold,
  Italic,
  Strike,
  Subscript,
  Superscript,
  Underline,
  Link,
];

const nodes: Extension[] = [
  Document,
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
  FontSize,
  FontFamily,
  LineHeight,
  LetterSpacing,
  Color,
  BackgroundColor,
  EmojiSymbols,
];

export const ProsemirrorEditor = ({
  content,
  onUpdate,
}: ProsemirrorEditorProps) => {
  const { setActiveEditor, selectionCoordenates } = useProsemirror();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<Editor | null>(null);

  useLayoutEffect(() => {
    if (!mountRef.current) return;

    const editor = new Editor({
      domElement: mountRef.current,
      extensions: [...marks, ...nodes, ...miscellaneous],
      content,
      onUpdate: ({ editor }) => onUpdate(editor),
    });

    editorRef.current = editor;

    editor.commands.setContent(content);
    const { start, end } = selectionCoordenates.current;
    const from = editor.view.posAtCoords({ left: start.x, top: start.y })?.pos;
    const to = editor.view.posAtCoords({ left: end.x, top: end.y })?.pos;
    if (from && to) editor.commands.setTextSelection({ from, to });
    editor.commands.focus();

    setActiveEditor(editor);

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} />;
};
