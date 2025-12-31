import { useState, useEffect, useRef } from "react";
import type { Editor } from "@/richtext/core/Editor";

export interface UseEditorStateOptions<T = any> {
  editor: Editor | null;
  selector: (editor: Editor) => T;
}

/**
 * Hook simple para suscribirse a cambios del editor state
 * Maneja internamente la memoización del selector
 */
export function useEditorState<T>(options: UseEditorStateOptions<T>): T | null {
  const { editor, selector } = options;

  // Usar ref para el selector - siempre usa la versión más reciente
  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  const [state, setState] = useState<T | null>(() =>
    editor ? selectorRef.current(editor) : null
  );

  useEffect(() => {
    if (!editor) {
      setState(null);
      return;
    }

    // Actualizar estado inicial
    setState(selectorRef.current(editor));

    // Suscribirse a cambios
    const handleTransaction = () => {
      setState(selectorRef.current(editor));
    };

    editor.on("transaction", handleTransaction);

    return () => {
      editor.off("transaction", handleTransaction);
    };
  }, [editor]); // ← Solo depende de editor, NO de selector

  return state;
}
