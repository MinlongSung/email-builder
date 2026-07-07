import type { BlockTemplate } from "@/features/models/types";
import { CatalogItem } from "@/features/components/CatalogItem";
interface Props {
  templates: BlockTemplate[];
}

export function RowCatalog({ templates }: Props) {
  return (
    <div className="w-full space-y-2 p-3">
      {templates.map((template) => (
        <CatalogItem key={template.id} template={template} />
      ))}
    </div>
  );
}
