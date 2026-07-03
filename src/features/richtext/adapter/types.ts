import type { Editor, JSONContent } from "@tiptap/core";

export interface Coordinates {
  x: number;
  y: number;
}

export interface SelectionCoordinates {
  start: Coordinates;
  end: Coordinates;
}

export interface MountEditorProps {
  editorId: string;
  content: JSONContent;
  coordinates: SelectionCoordinates;
}

export interface RichtextContextProps {
  editor: Editor | null;
  editorId: string;
  mountEditor: (props: MountEditorProps) => void;
}
