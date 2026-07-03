import type { Editor, JSONContent } from "@tiptap/core";

export interface Coordinates {
  x: number;
  y: number;
}

export interface SelectionCoordinates {
  start: Coordinates;
  end: Coordinates;
}

export interface StartEditionProps {
  content: JSONContent;
  coordinates: SelectionCoordinates;
}

export interface RichtextContextProps {
  editor: Editor;
  startEdition: (props: StartEditionProps) => void;
  syncContent: (content: JSONContent) => void;
}
