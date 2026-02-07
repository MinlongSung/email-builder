import type { Node } from "prosemirror-model";
import type {
  SelectionContext,
  TraverseOptions,
} from "../../extensions/types";

export function traverseInRangeRecursively(options: TraverseOptions) {
  const {
    state,
    tr,
    from = 0,
    to = state.doc.content.size,
    predicate,
    callback,
    includeMarks = false,
  } = options;

  function recurse(node: Node, pos: number, parent?: Node) {
    const $pos = state.doc.resolve(pos + 1);
    const baseContext: SelectionContext = {
      node,
      pos,
      state,
      parent,
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

    let offset = 0;
    node.forEach((child) => {
      const childPos = pos + 1 + offset;
      // Solo procesar si el nodo hijo está dentro del rango
      if (childPos < to) {
        recurse(child, childPos, node);
      }
      offset += child.nodeSize;
    });
  }

  state.doc.nodesBetween(from, to, (node, pos, parent) => {
    recurse(node, pos, parent ?? undefined);
    // Retornar false evita recorrer hijos automáticamente, ya que lo hacemos recursivamente
    return false;
  });
}
