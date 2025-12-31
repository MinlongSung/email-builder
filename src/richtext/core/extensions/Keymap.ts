import { keymap } from "prosemirror-keymap";
import {
  baseKeymap,
  chainCommands,
  liftEmptyBlock,
  newlineInCode,
  splitBlockKeepMarks,
} from "prosemirror-commands";
import type { Extension } from "@/richtext/core/types";

export const Keymap: Extension = {
  name: "baseKeymap",
  
  plugins: () => {
    return [
      keymap({
        ...baseKeymap,
        Enter: chainCommands(
          newlineInCode,
          liftEmptyBlock,
          splitBlockKeepMarks
        ),
      }),
    ];
  },
};
