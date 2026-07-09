import { useContext } from "react";
import { BlockWrapperContext } from "@/features/blocks/shared/BlockWrapperContext";
import { useHistory } from "@/features/document/adapter/hooks/useHistory";
import { DuplicateTreeCommand } from "@/features/document/core/commands/duplicate/DuplicateTreeCommand";
import { RemoveTreeCommand } from "@/features/document/core/commands/remove/RemoveTreeCommand";

export function Toolbar() {
  const { block, setDragRef, setToolbarFloatingRef, toolbarFloatingStyles } =
    useContext(BlockWrapperContext);

  const { execute } = useHistory();

  const handleDuplicate = () => {
    execute(new DuplicateTreeCommand([block.id]), {
      action: "duplicate",
      targets: [],
    });
  };

  const handleRemove = () => {
    execute(new RemoveTreeCommand([block.id]), {
      action: "delete",
      targets: [],
    });
  };

  return (
    <div
      ref={setToolbarFloatingRef}
      style={toolbarFloatingStyles}
      className="flex flex-col"
    >
      <div ref={setDragRef} className="w-40 p-2.5 bg-red-300">
        Drag me
      </div>
      <button onClick={handleDuplicate}>Duplicate</button>
      <button onClick={handleRemove}>Remove</button>
    </div>
  );
}
