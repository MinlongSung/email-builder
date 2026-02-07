import type { EditorState } from "prosemirror-state";

export function getMarkAttributes(
  state: EditorState,
  typeName: string
): Record<string, any> {
  const type = state.schema.marks[typeName];

  if (!type) {
    return {};
  }

  const { from, to, empty } = state.selection;

  const marks = empty
    ? state.storedMarks || state.selection.$from.marks()
    : state.doc.rangeHasMark(from, to, type);

  if (!marks) {
    return {};
  }

  const mark = Array.isArray(marks)
    ? marks.find((m) => m.type === type)
    : marks;

  return mark ? { ...mark.attrs } : {};
}
