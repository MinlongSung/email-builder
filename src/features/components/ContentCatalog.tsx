import type { BlockTemplate } from "@/features/models/types";
import { CatalogItem } from "@/features/components/CatalogItem";

interface Props {
  templates: BlockTemplate[];
}

export function ContentCatalog({ templates }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 p-3 w-full">
      {templates.map((template) => (
        <CatalogItem key={template.id} template={template} />
      ))}
    </div>
  );
}
