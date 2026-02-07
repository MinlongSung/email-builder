import type { EditorState } from "prosemirror-state";

export function getNodeAttributes(
  state: EditorState,
  typeName: string
): Record<string, any> {
  const type = state.schema.nodes[typeName];

  if (!type) {
    return {};
  }

  const { from } = state.selection;
  const $from = state.doc.resolve(from);

  // Buscar el nodo más cercano del tipo especificado
  for (let d = $from.depth; d >= 0; d--) {
    const node = $from.node(d);

    if (node.type === type) {
      return { ...node.attrs };
    }
  }

  return {};
}
