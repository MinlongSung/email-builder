import { z } from "zod";

export const TextContentSchema = z.object({
  html: z.string(),
  json: z.object({}).catchall(z.unknown()),
});

export const TextBlockSchema = z.object({
  id: z.string(),
  type: z.literal("text"),
  style: z.record(z.string(), z.any()).optional(),
  content: TextContentSchema,
});

export const ButtonBlockSchema = z.object({
  id: z.string(),
  type: z.literal("button"),
  style: z.record(z.string(), z.any()).optional(),
  content: TextContentSchema,
});

export const BlockSchema = z.union([TextBlockSchema, ButtonBlockSchema]);

export const ColumnSchema = z.object({
  id: z.string(),
  width: z.number(),
  style: z.record(z.string(), z.any()).optional(),
  blocks: z.array(BlockSchema),
});

export const RowSchema = z.object({
  id: z.string(),
  type: z.literal("row"),
  style: z.record(z.string(), z.any()).optional(),
  separatorSize: z.number(),
  isResponsive: z.boolean(),
  columns: z.array(ColumnSchema),
});

export const TemplateMetadataSchema = z.object({
  createdBy: z.string(),
  createdAt: z.string(),
  updatedBy: z.string().optional(),
  updatedAt: z.string().optional(),
  language: z.string().optional(),
});

export const TemplateStylesSchema = z.object({
  width: z.number().optional(),
  style: z.record(z.string(), z.any()).optional(),
});

export const TemplateSettingsSchema = z.object({
  // TODO: agregar configuración de prosemirror
});

export const TemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  metadata: TemplateMetadataSchema,
  styles: TemplateStylesSchema.optional(),
  settings: TemplateSettingsSchema.optional(),
  rows: z.array(RowSchema),
});

// Tipado TS inferido
export type Template = z.infer<typeof TemplateSchema>;
