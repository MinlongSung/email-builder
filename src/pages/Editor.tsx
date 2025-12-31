import { useEffect } from "react";
import { exampleTemplate } from "@/data/exampleTemplate";
import { DragAndDropProvider } from "@/dnd/adapter/providers/DragAndDropProvider";
import { Canvas } from "@/layouts/Canvas";
import { Sidebar } from "@/layouts/Sidebar";
import { Topbar } from "@/layouts/Topbar";
import { ProsemirrorProvider } from "@/richtext/adapter/providers/ProsemirrorProvider";
import { useEditorStore } from "@/stores/useEditorStore";
import styles from "@/pages/Editor.module.css";

export function EditorPage() {
  const setTemplate = useEditorStore((store) => store.setTemplate);
  const template = useEditorStore((store) => store.template);

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
        </ProsemirrorProvider>
        <Sidebar />
      </DragAndDropProvider>
    </div>
  );
}
