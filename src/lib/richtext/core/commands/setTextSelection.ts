import { TextSelection } from "prosemirror-state";
import type { RawCommands } from "../types";

declare module "../types" {
  interface Commands<ReturnType> {
    setTextSelection: {
      /**
       * Creates a TextSelection.
       * @param position The position of the selection.
       * @example editor.commands.setTextSelection(10)
       */
      setTextSelection: (position: number | Range) => ReturnType;
    };
  }
}

export const setTextSelection: RawCommands["setTextSelection"] =
  (position) =>
  ({ state, dispatch }) => {
    if (dispatch) {
      const { tr } = state;
      const { doc } = tr;
      const { from, to } =
        typeof position === "number"
          ? { from: position, to: position }
          : position;
      const minPos = TextSelection.atStart(doc).from;
      const maxPos = TextSelection.atEnd(doc).to;
      const resolvedFrom = minMax(from, minPos, maxPos);
      const resolvedEnd = minMax(to, minPos, maxPos);
      const selection = TextSelection.create(doc, resolvedFrom, resolvedEnd);

      tr.setSelection(selection);
      dispatch(tr);
    }

    return true;
  };

export function minMax(value = 0, min = 0, max = 0): number {
  return Math.min(Math.max(value, min), max);
}
