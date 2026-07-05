import type { BlockTemplate } from "@/features/models/types";

interface Props {
  templates: BlockTemplate[];
}

export function ContentCatalog({ templates }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 p-3 w-full">
      {templates.map((template) => (
        <button
          key={template.id}
          className="flex aspect-square flex-col items-center justify-center rounded-lg border hover:bg-accent"
        >
          {template.icon}

          <span className="mt-2 text-xs">{template.name}</span>
        </button>
      ))}
    </div>
  );
}