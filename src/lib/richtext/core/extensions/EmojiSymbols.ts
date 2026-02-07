import type { Extension } from "../types";

declare module "../types" {
  interface Commands<ReturnType> {
    emojiSymbols: {
      /**
       * Insert an emoji or special character at current position
       */
      insertSymbol: (symbol: string) => ReturnType;
    };
  }
}

export const EmojiSymbols: Extension<"emojiSymbols"> = {
  name: "emojiSymbols",

  commands: () => ({
    insertSymbol:
      (symbol) =>
      ({ state, dispatch, tr }) => {
        if (dispatch) {
          const { from, to } = state.selection;
          tr.insertText(symbol, from, to);
          dispatch(tr);
        }

        return true;
      },
  }),
};
