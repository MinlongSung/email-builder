import type { ButtonBlock, TextBlock } from "@/features/models/types";
import type { Editor } from "@tiptap/core";

export interface Coordinates {
  x: number;
  y: number;
}

export interface SelectionCoordinates {
  start: Coordinates;
  end: Coordinates;
}

export interface SetEditorProps {
  block: TextBlock | ButtonBlock;
  coordinates: SelectionCoordinates;
}

export interface RichtextContextProps {
  editor: Editor | null;
  activeBlock: TextBlock | ButtonBlock | null;
  setEditor: (props: SetEditorProps) => void;
}
