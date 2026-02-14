import type { Command } from "$lib/commands/Command";
import { UpdateBlockCommand } from "$lib/commands/blocks/UpdateBlockCommand";
import { isParagraph, isParagraphOrHeading, isHeading } from "$lib/richtext/core/extensions/utils/textNodeChecks";
import { isLink } from "$lib/richtext/core/extensions/marks/link/utils/isLink";
import type { RichtextStore } from "$lib/richtext/adapter/contexts/richtextContext.svelte";
import type { TemplateStore } from "$lib/template/contexts/templateContext.svelte";
import { headings, levelToHeading, type BlockCoordinates, type BlockEntity, type TemplateConfig, type TypographyConfig } from "$lib/template/types";
import type { Attrs } from "prosemirror-model";
import type { Level } from "$lib/richtext/core/extensions/nodes/Heading";

export interface TransformContext {
	block: BlockEntity;
	coordinates: BlockCoordinates;
	templateStore: TemplateStore;
	richtextStore: RichtextStore;
	templateConfig: Partial<TemplateConfig>;
}

export type BlockTransformer = (context: TransformContext) => Command | null;

export const transformText = (context: TransformContext): Command | null => {
	const { block, coordinates, templateStore, richtextStore, templateConfig } = context;

	const { paragraph, link } = templateConfig;
	const hasParagraphConfig = paragraph && Object.keys(paragraph).length > 0;
	const hasHeadingConfig = headings.some(heading => {
		const config = templateConfig[heading];
		return config && Object.keys(config).length > 0;
	});
	const hasLinkConfig = link && Object.keys(link).length > 0;

	if (!hasParagraphConfig && !hasHeadingConfig && !hasLinkConfig) return null;

	const applyTypographyAttrs = (nodeAttrs: Attrs, config: Partial<TypographyConfig>) => {
		const attrs = { ...nodeAttrs };
		const { fontFamily, fontSize, lineHeight, letterSpacing, color } = config;
		if (fontFamily) attrs.fontFamily = fontFamily;
		if (fontSize) attrs.fontSize = fontSize;
		if (lineHeight) attrs.lineHeight = lineHeight;
		if (letterSpacing) attrs.letterSpacing = letterSpacing;
		if (color) attrs.color = color;
		return attrs;
	};

	let hasChanges = false;

	const newContent = richtextStore.applyTransform(
		block.content,
		({ node, mark }) => isParagraphOrHeading(node) || isLink(mark),
		({ node, mark, pos, state }, tr) => {
			if (node && isParagraph(node) && hasParagraphConfig) {
				const attrs = applyTypographyAttrs(node.attrs, paragraph);
				tr.setNodeMarkup(pos, undefined, attrs);
				hasChanges = true;
				return;
			}

			if (node && isHeading(node) && hasHeadingConfig) {
				const level = node.attrs.level as Level;
				const heading = levelToHeading(level);
				const headingConfig = templateConfig[heading];
				if (headingConfig) {
					const attrs = applyTypographyAttrs(node.attrs, headingConfig);
					tr.setNodeMarkup(pos, undefined, attrs);
					hasChanges = true;
				}
				return;
			}

			if (mark && node && state && isLink(mark) && hasLinkConfig) {
				const linkType = state.schema.marks.link;
				const start = pos;
				const end = pos + node.nodeSize;

				tr.removeMark(start, end, linkType);
				tr.addMark(start, end, linkType.create({
					...mark.attrs,
					...link
				}));
				hasChanges = true;
			}
		}
	);

	if (!hasChanges) return null;

	return new UpdateBlockCommand({
		store: templateStore,
		coordinates,
		updates: { content: newContent }
	});
};

export const transformButton = (context: TransformContext): Command | null => {
	const { block, coordinates, templateStore, templateConfig } = context;
	const buttonConfig = templateConfig.button;
	if (!buttonConfig || Object.keys(buttonConfig).length === 0) return null;

	return new UpdateBlockCommand({
		store: templateStore,
		coordinates,
		updates: {
			style: {
				...block.style,
				...buttonConfig
			}
		}
	});
};
