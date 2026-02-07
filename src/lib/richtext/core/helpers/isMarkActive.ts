import type { EditorState } from "prosemirror-state";
import { objectIncludes } from "../helpers";

export function isMarkActive(
  state: EditorState,
  typeName: string | null,
  attributes: Record<string, any> = {}
): boolean {
  const { empty, ranges } = state.selection;
  const type = typeName ? state.schema.marks[typeName] : null;

  if (empty) {
    return !!(state.storedMarks || state.selection.$from.marks())
      .filter((mark) => {
        if (!type) {
          return true;
        }

        return type.name === mark.type.name;
      })
      .find((mark) => objectIncludes(mark.attrs, attributes, { strict: false }));
  }

  let selectionRange = 0;
  const markRanges: Array<{ mark: any; from: number; to: number }> = [];

  ranges.forEach(({ $from, $to }) => {
    const from = $from.pos;
    const to = $to.pos;

    state.doc.nodesBetween(from, to, (node, pos) => {
      if (!node.isText && !node.marks.length) {
        return;
      }

      const relativeFrom = Math.max(from, pos);
      const relativeTo = Math.min(to, pos + node.nodeSize);
      const range = relativeTo - relativeFrom;

      selectionRange += range;

      markRanges.push(
        ...node.marks.map((mark) => ({
          mark,
          from: relativeFrom,
          to: relativeTo,
        }))
      );
    });
  });

  if (selectionRange === 0) {
    return false;
  }

  // Calcular rango de marks que coinciden
  const matchedRange = markRanges
    .filter((markRange) => {
      if (!type) {
        return true;
      }

      return type.name === markRange.mark.type.name;
    })
    .filter((markRange) =>
      objectIncludes(markRange.mark.attrs, attributes, { strict: false })
    )
    .reduce((sum, markRange) => sum + markRange.to - markRange.from, 0);

  // Calcular rango de marks que excluyen el mark buscado
  const excludedRange = markRanges
    .filter((markRange) => {
      if (!type) {
        return true;
      }

      return (
        markRange.mark.type !== type && markRange.mark.type.excludes(type)
      );
    })
    .reduce((sum, markRange) => sum + markRange.to - markRange.from, 0);

  const range = matchedRange > 0 ? matchedRange + excludedRange : matchedRange;

  return range >= selectionRange;
}
