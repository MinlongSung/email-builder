import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { traverseInRange } from "../../../../extensions/utils/traverseInRange";
import { isLink } from "../utils/isLink";

export function linkHighlight(): Plugin {
  return new Plugin({
    key: new PluginKey("link-highlight"),
    props: {
      decorations(state) {
        const { from, to } = state.selection;
        const markType = state.schema.marks.link;
        if (!markType) return DecorationSet.empty;

        const decorations: Decoration[] = [];
        const processed = new Set<string>();

        traverseInRange({
          state,
          from,
          to,
          tr: state.tr,
          includeMarks: true,
          predicate: ({ mark }) => isLink(mark),
          callback: ({ mark, pos, node }) => {
            if (!mark) return;

            const start = pos;
            const end = pos + node.nodeSize;
            const key = `${start}-${end}`;
            if (!processed.has(key)) {
              decorations.push(
                Decoration.inline(start, end, {
                  class: "selection-within-link",
                })
              );
              processed.add(key);
            }
          },
        });

        return DecorationSet.create(state.doc, decorations);
      },
    },
  });
}
