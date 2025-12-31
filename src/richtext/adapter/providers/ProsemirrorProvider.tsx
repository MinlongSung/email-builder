import { useRef, useState, type PropsWithChildren } from "react";

import { ProsemirrorContext } from "@/richtext/adapter/contexts/ProsemirrorContext";
import type { Editor } from "@/richtext/core/Editor";
import type { SelectionCoordenates } from "@/richtext/adapter/types";

export const ProsemirrorProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);
  const selectionCoordenates = useRef<SelectionCoordenates>({
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  });

  const setSelectionStart = (x: number, y: number) => {
    selectionCoordenates.current.start.x = x;
    selectionCoordenates.current.start.y = y;
  };

  const setSelectionEnd = (x: number, y: number) => {
    selectionCoordenates.current.end.x = x;
    selectionCoordenates.current.end.y = y;
  };
  return (
    <ProsemirrorContext.Provider
      value={{
        activeEditor,
        setActiveEditor,

        selectionCoordenates,
        setSelectionStart,
        setSelectionEnd,
      }}
    >
      {children}
    </ProsemirrorContext.Provider>
  );
};
