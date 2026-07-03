import type { Node, ResolvedPos } from '@tiptap/pm/model';

export const isParagraph = (node?: Node) => node?.type.name === 'paragraph';
export const isHeading = (node?: Node): boolean => node?.type.name === 'heading';

export const isParagraphOrHeading = (node: Node) => isParagraph(node) || isHeading(node);

export const isHeadingLevel = (node: Node | undefined, level?: number): boolean => {
  if (!isHeading(node)) return false;
  return node?.attrs.level === level;
};

export const isList = (node: Node) => {
  return node.type.name === 'bulletList' || node.type.name === 'orderedList';
};

export const isRootList = (node: Node, parent?: Node) => {
  return isList(node) && !isListItem(parent ?? null);
};

export const isListItem = (node: Node | null) => node?.type.name === 'listItem';

export type NodeContext = {
  node: Node;
  pos: number;
  depth: number;
  $pos: ResolvedPos;
  parent?: Node;
};

export type Predicate = (context: NodeContext) => boolean;

export function findAncestorNode($pos: ResolvedPos, predicate: Predicate): NodeContext | null {
  for (let depth = $pos.depth; depth > 0; depth--) {
    const node = $pos.node(depth);
    const pos = $pos.before(depth);
    const parent = $pos.node(depth - 1);

    const context = {
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
