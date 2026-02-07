import type { RawCommands } from "../types";

declare module "../types" {
  interface Commands<ReturnType> {
    blur: {
      /**
       * Remove focus from the editor.
       * @example editor.commands.blur()
       */
      blur: () => ReturnType;
    };
  }
}

export const blur: RawCommands["blur"] =
  () =>
  ({ view }) => {
    requestAnimationFrame(() => {
      if (view) {
        (view.dom as HTMLElement).blur();
        // Browsers should remove the caret on blur but safari does not
        window?.getSelection()?.removeAllRanges();
      }
    });

    return true;
  };
