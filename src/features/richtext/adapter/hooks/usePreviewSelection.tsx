import { useRef } from "react";

import type { SelectionCoordinates } from "@/features/richtext/adapter/types";

interface Params {
  onSelectionEnd: (coords: SelectionCoordinates) => void;
}

export function usePreviewSelection({ onSelectionEnd }: Params) {
  const pointerIdRef = useRef<number | null>(null);

  const coordsRef = useRef<SelectionCoordinates>({
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  });

  const startSelection = (e: React.PointerEvent) => {
    pointerIdRef.current = e.pointerId;

    coordsRef.current.start = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const endSelection = (e: React.PointerEvent) => {
    if (pointerIdRef.current !== e.pointerId) return;

    pointerIdRef.current = null;

    coordsRef.current.end = {
      x: e.clientX,
      y: e.clientY,
    };

    onSelectionEnd(coordsRef.current);
  };

  const cancelSelection = () => {
    pointerIdRef.current = null;

    coordsRef.current = {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 0 },
    };
  };

  return {
    startSelection,
    endSelection,
    cancelSelection,
  };
}
