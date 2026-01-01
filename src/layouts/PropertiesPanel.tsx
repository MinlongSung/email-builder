import { DRAGGABLES_REGISTRY } from "@/components/blocks";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { useUIStore } from "@/stores/useUIStore";

export const PropertiesPanel = () => {
  const selectedId = useUIStore((store) => store.selectedId);
  const getElementById = useCanvasStore((store) => store.getElementById);

  // Get element if selected, otherwise null
  const element = selectedId ? getElementById(selectedId) : null;

  // Always render the panel, but animate in/out with classes
  const isOpen = !!element;

  return (
    <aside
      data-no-dismiss
      className={`${"propertiesPanel"} ${isOpen ? "open" : "close"}`}
      aria-hidden={!isOpen}
    >
      <div style={{ display: "flex" }}>
        {element &&
          DRAGGABLES_REGISTRY[element.type].propertiesPanel(element as any)}
      </div>
    </aside>
  );
};
