import type { TextBlockEntity } from "@/entities/template";
import { ProsemirrorEditor } from "@/richtext/adapter/components/ProsemirrorEditor";
import { ProsemirrorPreview } from "@/richtext/adapter/components/ProsemirrorPreview";
import type { Editor } from "@/richtext/core/Editor";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { useCanvasStore } from "@/stores/useCanvasStore";
import { useUIStore } from "@/stores/useUIStore";
import { UpdateBlockCommand } from "@/commands/blocks/UpdateBlockCommand";
import { historyService } from "@/history/services/historyService";
import { generateId } from "@/utils/generateId";

interface TextBlockProps {
  block: TextBlockEntity;
}

export const TextBlock: React.FC<TextBlockProps> = ({ block }) => {
  const selectedId = useUIStore((store) => store.selectedId);

  const handleUpdate = useDebouncedCallback((editor: Editor) => {
    const state = useCanvasStore.getState();
    const { getTemplate, setTemplate, getBlockCoordinates } = state;

    const blockCoordinates = getBlockCoordinates(block.id);
    if (blockCoordinates === null) return;

    const command = new UpdateBlockCommand({
      ...blockCoordinates,
      getTemplate,
      setTemplate,
      updates: {
        content: {
          html: editor.getHTML(),
          json: editor.getJSON(),
        },
      },
    });
    historyService.executeCommand(command, {
      id: generateId(),
      type: "block.update",
      timestamp: Date.now(),
    });
  }, 300);

  return (
    <>
      {selectedId === block.id ? (
        <ProsemirrorEditor
          content={block.content.json}
          onUpdate={handleUpdate}
        />
      ) : (
        <ProsemirrorPreview content={block.content.html} />
      )}
    </>
  );
};
