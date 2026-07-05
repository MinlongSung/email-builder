import type { BlockTemplate } from "@/features/models/types";

// import { RowTemplatePreview } from "./RowTemplatePreview";

interface Props {
  templates: BlockTemplate[];
}

export function RowCatalog({ templates }: Props) {
  return (
    <div className="space-y-2 p-3">
      {templates.map((template) => (
        <button
          key={template.id}
          className="flex w-full items-center gap-4 rounded-lg border p-3 hover:bg-accent"
        >
          {/* <RowTemplatePreview
            widths={template.layout!}
          /> */}

          <span className="text-sm">
            {template.name}
          </span>
        </button>
      ))}
    </div>
  );
}