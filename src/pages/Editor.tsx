import { useEffect } from "react";
import { exampleTemplate } from "@/data/exampleTemplate";
import { DragAndDropProvider } from "@/dnd/adapter/providers/DragAndDropProvider";
import { Canvas } from "@/layouts/Canvas";
import { Sidebar } from "@/layouts/Sidebar";
import { Topbar } from "@/layouts/Topbar";
import { PropertiesPanel } from "@/layouts/PropertiesPanel";
import { ProsemirrorProvider } from "@/richtext/adapter/providers/ProsemirrorProvider";
import { useCanvasStore } from "@/stores/useCanvasStore";
import styles from "@/pages/Editor.module.css";

export function EditorPage() {
  const setTemplate = useCanvasStore((store) => store.setTemplate);
  const template = useCanvasStore((store) => store.template);

  useEffect(() => {
    setTemplate(exampleTemplate);
  }, [setTemplate]);

  if (!template) return;

  return (
    <div className={styles.editor}>
      <Topbar />
      <DragAndDropProvider>
        <ProsemirrorProvider>
          <Canvas template={template} />
          <Sidebar />
          <PropertiesPanel />
        </ProsemirrorProvider>
      </DragAndDropProvider>
    </div>
  );
}
