import type { Block } from "@/features/models/types";

export interface BlockWrapperContextProps {
  block: Block;
  setDragRef: (node: HTMLElement | null) => void;
  setToolbarAccessFloatingRef: (node: HTMLElement | null) => void;
  toolbarAccessFloatingStyles: React.CSSProperties;
  setToolbarReferenceRef: (node: HTMLElement | null) => void;
  setToolbarFloatingRef: (node: HTMLElement | null) => void;
  toolbarFloatingStyles: React.CSSProperties;
}
