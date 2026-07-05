import { useContext, useMemo, useState } from "react";
import { autoUpdate, flip, useFloating } from "@floating-ui/react";

import { cn } from "@/components/utils/cn";
import { gap } from "@/features/floating-ui/middlewares/gap";

import type { Block } from "@/features/models/types";
import { blockRegistry } from "@/features/blocks";
import { useDraggable } from "@/features/dnd/adapter/hooks/useDraggable";
import { useDroppable } from "@/features/dnd/adapter/hooks/useDroppable";
import { useEditorStore } from "@/features/stores/useEditorStore";
import { DropLine } from "@/features/dnd/adapter/components/DropLine";
import { BlockWrapperContext } from "@/features/blocks/shared/BlockWrapperContext";

interface Props extends React.ComponentProps<"div"> {
  block: Block;
}

export function BlockWrapper({ block, children, className, ...props }: Props) {
  const { accepts, isDraggable, isSelectable, isHoverable } =
    blockRegistry[block.type];

  const { setNodeRef: setDragRef } = useDraggable({
    id: block.id,
    data: { type: block.type },
    disabled: !isDraggable,
  });

  const {
    setNodeRef: setDropRef,
    isOver,
    isTopHalf,
    isDragging,
    isBeingDragged,
  } = useDroppable({
    id: block.id,
    data: { accepts },
  });

  const setSelectedBlockId = useEditorStore((s) => s.setSelectedBlockId);
  const selectedBlockId = useEditorStore((s) => s.selectedBlockId);
  const isSelected = !isDragging && selectedBlockId === block.id;

  const setHoveredBlockId = useEditorStore((s) => s.setHoveredBlockId);
  const hoveredBlockId = useEditorStore((s) => s.hoveredBlockId);
  const isHovered = !isDragging && hoveredBlockId === block.id;

  const {
    refs: toolbarAccessRefs,
    floatingStyles: toolbarAccessFloatingStyles,
  } = useFloating({
    placement: "right",
    whileElementsMounted: autoUpdate,
    middleware: [gap({ padding: 10 }), flip({ fallbackPlacements: ["left"] })],
  });

  const { refs: toolbarRefs, floatingStyles: toolbarFloatingStyles } =
    useFloating({
      placement: "bottom-end",
      whileElementsMounted: autoUpdate,
      middleware: [
        gap({ padding: 10 }),
        flip({ fallbackPlacements: ["top-end"] }),
      ],
    });

  const contextValue = useMemo(
    () => ({
      block,
      setDragRef,
      setToolbarAccessFloatingRef: toolbarAccessRefs.setFloating,
      toolbarAccessFloatingStyles,
      setToolbarReferenceRef: toolbarRefs.setReference,
      setToolbarFloatingRef: toolbarRefs.setFloating,
      toolbarFloatingStyles,
    }),
    [
      block,
      setDragRef,
      toolbarAccessRefs.setFloating,
      toolbarAccessFloatingStyles,
      toolbarRefs.setFloating,
      toolbarFloatingStyles,
    ],
  );

  const handleClick = (e: React.MouseEvent) => {
    if (!isSelectable) return;
    e.stopPropagation();
    if (isSelected) return;
    setSelectedBlockId(block.id);
  };

  const handleMouseOver = (e: React.MouseEvent) => {
    if (!isHoverable) return;
    e.stopPropagation();
    if (isHovered) return;
    setHoveredBlockId(block.id);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (!isHoverable) return;
    e.stopPropagation();
    if (!isHovered) return;
    setHoveredBlockId(null);
  };

  return (
    <BlockWrapperContext.Provider value={contextValue}>
      <div
        data-block-type={block.type}
        ref={(e) => {
          setDropRef(e);
          toolbarAccessRefs.setReference(e);
        }}
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative",
          isBeingDragged && "opacity-70",
          isHovered && "z-10 outline-2 outline-purple-500",
          isSelected && "z-20 outline-2 outline-blue-500",
          className,
        )}
        {...props}
      >
        {children}
        {isHovered && isDraggable && <ToolbarAccess />}
        {isOver && !isBeingDragged && <DropLine isTopHalf={isTopHalf} />}
      </div>
    </BlockWrapperContext.Provider>
  );
}

function ToolbarAccess() {
  const {
    setToolbarAccessFloatingRef,
    toolbarAccessFloatingStyles,
    setToolbarReferenceRef,
  } = useContext(BlockWrapperContext);

  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      ref={setToolbarAccessFloatingRef}
      style={toolbarAccessFloatingStyles}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div ref={setToolbarReferenceRef}>menu</div>
      {isHovering && <Toolbar />}
    </div>
  );
}

function Toolbar() {
  const { setDragRef, setToolbarFloatingRef, toolbarFloatingStyles } =
    useContext(BlockWrapperContext);

  return (
    <div ref={setToolbarFloatingRef} style={toolbarFloatingStyles}>
      <div ref={setDragRef} className="w-20 bg-red-300">
        Drag me
      </div>
    </div>
  );
}
