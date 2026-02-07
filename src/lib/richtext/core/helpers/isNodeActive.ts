import type { EditorState } from "prosemirror-state";
import { objectIncludes } from "../helpers";

export function isNodeActive(
  state: EditorState,
  typeName: string | null,
  attributes: Record<string, any> = {}
): boolean {
  const { from, to, empty } = state.selection;
  const type = typeName ? state.schema.nodes[typeName] : null;

  const nodeRanges: Array<{ node: any; from: number; to: number }> = [];

  state.doc.nodesBetween(from, to, (node, pos) => {
    if (node.isText) {
      return;
    }

    const relativeFrom = Math.max(from, pos);
    const relativeTo = Math.min(to, pos + node.nodeSize);

    nodeRanges.push({
      node,
      from: relativeFrom,
      to: relativeTo,
    });
  });

  const selectionRange = to - from;
  const matchedNodeRanges = nodeRanges
    .filter((nodeRange) => {
      if (!type) {
        return true;
      }

      return type.name === nodeRange.node.type.name;
    })
    .filter((nodeRange) =>
      objectIncludes(nodeRange.node.attrs, attributes, { strict: false })
    );

  if (empty) {
    return !!matchedNodeRanges.length;
  }

  const range = matchedNodeRanges.reduce(
    (sum, nodeRange) => sum + nodeRange.to - nodeRange.from,
    0
  );

  return range >= selectionRange;
}
