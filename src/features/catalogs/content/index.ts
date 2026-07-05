import type { BlockTemplate } from "@/features/models/types";
import { textTemplate } from "@/features/catalogs/content/text";
import { buttonTemplate } from "@/features/catalogs/content/button";

export const CONTENT_TEMPLATES: BlockTemplate[] = [
  textTemplate,
  buttonTemplate,
];
