import { useContext } from "react";
import { BlockWrapperContext } from "@/features/blocks/shared/BlockWrapperContext";

export function Toolbar() {
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
