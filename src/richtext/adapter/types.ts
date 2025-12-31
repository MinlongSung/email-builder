import type { Editor } from "@/richtext/core/Editor";

type Coordenates = { x: number; y: number };

export type SelectionCoordenates = {
  start: Coordenates;
  end: Coordenates;
};

export interface IProsemirrorContext {
  activeEditor: Editor | null;
  setActiveEditor: React.Dispatch<React.SetStateAction<Editor | null>>;

  selectionCoordenates: React.RefObject<SelectionCoordenates>;
  setSelectionStart: (x: number, y: number) => void;
  setSelectionEnd: (x: number, y: number) => void;
}
