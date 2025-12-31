import { DRAGGABLES_REGISTRY } from "@/components/blocks";
import { useEditorStore } from "@/stores/useEditorStore";
import { useUIStore } from "@/stores/useUIStore";

export const PropertiesPanel = () => {
  const selectedId = useUIStore((store) => store.selectedId);
  const getElementById = useEditorStore((store) => store.getElementById);
  if (!selectedId) return null;
  const element = getElementById(selectedId);
  if (!element) return null;
  
  return (
    <aside>
      {DRAGGABLES_REGISTRY[element.type].propertiesPanel(element as never)}
    </aside>
  );
};
