import type { RawCommands } from "../types";

declare module "../types" {
  interface Commands<ReturnType> {
    focus: {
      /**
       * Focus the editor.
       * @example editor.commands.focus()
       */
      focus: () => ReturnType;
    };
  }
}

export const focus: RawCommands["focus"] =
  () =>
  ({ view }) => {
    requestAnimationFrame(() => {
      if (view) {
        view.focus();
      }
    });

    return true;
  };
