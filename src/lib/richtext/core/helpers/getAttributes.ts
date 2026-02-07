import type { EditorState } from "prosemirror-state";
import { getMarkAttributes, getNodeAttributes, getSchemaTypeNameByName } from "../helpers";

export function getAttributes(
  state: EditorState,
  typeName: string
): Record<string, any> {
  const schemaType = getSchemaTypeNameByName(typeName, state.schema);

  if (schemaType === "node") {
    return getNodeAttributes(state, typeName);
  }

  if (schemaType === "mark") {
    return getMarkAttributes(state, typeName);
  }

  return {};
}
