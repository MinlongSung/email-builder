import type {
  SelectionContext,
  TraverseOptions,
} from "../../extensions/types";

export function traverseInRange({
  state,
  from,
  to,
  tr,
  predicate,
  callback,
  includeMarks = false,
}: TraverseOptions) {
  state.doc.nodesBetween(from, to, (node, pos, parent) => {
    const $pos = state.doc.resolve(pos + 1);
    const baseContext: SelectionContext = {
      node,
      pos,
      state,
      parent: parent ?? undefined,
      depth: $pos.depth,
      $pos,
    };

    if (predicate(baseContext)) {
      callback(baseContext, tr);
    }

    if (includeMarks) {
      node.marks.forEach((mark) => {
        const markContext = { ...baseContext, mark };
        if (predicate(markContext)) callback(markContext, tr);
      });
    }
  });
}
