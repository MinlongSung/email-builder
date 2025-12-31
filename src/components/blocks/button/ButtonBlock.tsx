import { UpdateBlockCommand } from "@/history/commands/UpdateBlockCommand";
import type { ButtonBlockEntity } from "@/entities/template";
import { ProsemirrorEditor } from "@/richtext/adapter/components/ProsemirrorEditor";
import { ProsemirrorPreview } from "@/richtext/adapter/components/ProsemirrorPreview";
import type { Editor } from "@/richtext/core/Editor";
import { historyService } from "@/history/services/historyService";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { useUIStore } from "@/stores/useUIStore";

interface ButtonBlockProps {
  block: ButtonBlockEntity;
}

export const ButtonBlock: React.FC<ButtonBlockProps> = ({ block }) => {
  const selectedId = useUIStore((store) => store.selectedId);

  // Fix unstable dependencies: access store imperatively inside callback
  const handleUpdate = useDebouncedCallback((editor: Editor) => {
    const state = useCanvasStore.getState();
    const { template, setTemplate, getBlockCoordinates } = state;

    if (!template) return;
    const blockCoordinates = getBlockCoordinates(block.id);
    if (blockCoordinates === null) return;

    const command = new UpdateBlockCommand({
      ...blockCoordinates,
      template,
      setTemplate,
      type: "block.update",
      updates: {
        content: {
          html: editor.getHTML(),
          json: editor.getJSON(),
        },
      },
    });
    historyService.executeCommand(command);
  }, 300);

  return (
    <a style={block.style}>
      {selectedId === block.id ? (
        <ProsemirrorEditor
          content={block.content.json}
          onUpdate={handleUpdate}
        />
      ) : (
        <ProsemirrorPreview content={block.content.html} />
      )}
    </a>
  );
};
