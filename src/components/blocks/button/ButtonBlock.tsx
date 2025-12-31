import { UpdateBlockCommand } from "@/history/commands/UpdateBlockCommand";
import type { ButtonBlockEntity } from "@/entities/template";
import { ProsemirrorEditor } from "@/richtext/adapter/components/ProsemirrorEditor";
import { ProsemirrorPreview } from "@/richtext/adapter/components/ProsemirrorPreview";
import type { Editor } from "@/richtext/core/Editor";
import { historyService } from "@/history/services/historyService";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { useEditorStore } from "@/stores/useEditorStore";
import { useUIStore } from "@/stores/useUIStore";

interface ButtonBlockProps {
  block: ButtonBlockEntity;
}

export const ButtonBlock: React.FC<ButtonBlockProps> = ({ block }) => {
  const selectedId = useUIStore((store) => store.selectedId);

  const template = useEditorStore((state) => state.template);
  const setTemplate = useEditorStore((state) => state.setTemplate);
  const getBlockCoordinates = useEditorStore(
    (state) => state.getBlockCoordinates
  );

  const handleUpdate = useDebouncedCallback((editor: Editor) => {
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
