import type { ResolvedPos } from "prosemirror-model";
import type { SelectionContext, Predicate } from "../../extensions/types";

export function findAncestorNode(
  $pos: ResolvedPos,
  predicate: Predicate
): SelectionContext | null {
  for (let depth = $pos.depth; depth > 0; depth--) {
    const node = $pos.node(depth);
    const pos = $pos.before(depth);
    const parent = $pos.node(depth - 1);

    const context: SelectionContext = {
      node,
      pos,
      depth,
      parent,
      $pos,
    };

    if (predicate(context)) {
      return context;
    }
  }

  return null;
}
