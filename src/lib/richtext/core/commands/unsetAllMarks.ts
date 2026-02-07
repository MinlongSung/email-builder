import type { RawCommands } from "../types";

declare module "../types" {
  interface Commands<ReturnType> {
    unsetAllMarks: {
      unsetAllMarks: () => ReturnType;
    };
  }
}

export const unsetAllMarks: RawCommands["unsetAllMarks"] =
  () =>
  ({ tr }) => {
    const { selection } = tr;
    const { empty, ranges } = selection;

    if (empty) {
      return true;
    }

    ranges.forEach((range) => {
      tr.removeMark(range.$from.pos, range.$to.pos);
    });

    return true;
  };
