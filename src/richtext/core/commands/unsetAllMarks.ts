import type { RawCommands } from "@/richtext/core/types";

declare module "@/richtext/core/types" {
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
