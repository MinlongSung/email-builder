import type { Command } from "$lib/commands/Command";
import { UpdateBlockCommand } from "$lib/commands/blocks/UpdateBlockCommand";
import { isParagraph, isHeadingLevel } from "$lib/richtext/core/extensions/utils/textNodeChecks";
import { isLink } from "$lib/richtext/core/extensions/marks/link/utils/isLink";
import type { RichtextStore } from "$lib/richtext/adapter/contexts/richtextContext.svelte";
import type { TemplateStore } from "$lib/template/contexts/templateContext.svelte";
import type { BlockCoordinates, BlockEntity, TemplateConfig, Level } from "$lib/template/types";

export interface TransformContext {
	block: BlockEntity;
	coordinates: BlockCoordinates;
	templateStore: TemplateStore;
	richtextStore: RichtextStore;
	templateConfig: Partial<TemplateConfig>;
}

export type BlockTransformer = (context: TransformContext) => Command | null;

export const transformParagraph = (context: TransformContext): Command | null => {
	const { block, coordinates, templateStore, richtextStore, templateConfig } = context;
	const paragraphConfig = templateConfig.paragraph;
	if (!paragraphConfig) return null;

	const { color, fontSize, fontFamily, letterSpacing, lineHeight } = paragraphConfig;
	const hasConfig = color || fontSize || fontFamily || letterSpacing || lineHeight;
	if (!hasConfig) return null;

	const newContent = richtextStore.applyTransform(
		block.content,
		({ node }) => isParagraph(node),
		({ node, pos }, tr) => {
			if (!node) return;
			const attrs = { ...node.attrs };
			if (fontFamily) attrs.fontFamily = fontFamily;
			if (fontSize) attrs.fontSize = fontSize;
			if (lineHeight) attrs.lineHeight = lineHeight;
			if (letterSpacing) attrs.letterSpacing = letterSpacing;
			if (color) attrs.color = color;
			tr.setNodeMarkup(pos, undefined, attrs);
		}
	);

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

export interface HeadingTransformContext extends TransformContext {
	level: Level;
}

export const transformHeading = (context: HeadingTransformContext): Command | null => {
	const { block, coordinates, templateStore, richtextStore, templateConfig, level } = context;
	const headingConfig = templateConfig.heading?.level?.[level];
	if (!headingConfig) return null;

	const { color, fontSize, fontFamily, letterSpacing, lineHeight } = headingConfig;
	const hasConfig = color || fontSize || fontFamily || letterSpacing || lineHeight;
	if (!hasConfig) return null;

	const newContent = richtextStore.applyTransform(
		block.content,
		({ node }) => isHeadingLevel(node, level),
		({ node, pos }, tr) => {
			if (!node) return;
			const attrs = { ...node.attrs };
			if (fontFamily) attrs.fontFamily = fontFamily;
			if (fontSize) attrs.fontSize = fontSize;
			if (lineHeight) attrs.lineHeight = lineHeight;
			if (letterSpacing) attrs.letterSpacing = letterSpacing;
			if (color) attrs.color = color;
			tr.setNodeMarkup(pos, undefined, attrs);
		}
	);

	return new UpdateBlockCommand({
		store: templateStore,
		coordinates,
		updates: { content: newContent }
	});
};

export const transformLink = (context: TransformContext): Command | null => {
	const { block, coordinates, templateStore, richtextStore, templateConfig } = context;
	const linkConfig = templateConfig.link;
	if (!linkConfig) return null;

	const hasConfig = Object.keys(linkConfig).length > 0;
	if (!hasConfig) return null;

	const newContent = richtextStore.applyTransform(
		block.content,
		({ mark }) => isLink(mark),
		({ mark, node, pos, state }, tr) => {
			if (!mark || !node || !state) return;

			const linkType = state.schema.marks.link;
			const start = pos;
			const end = pos + node.nodeSize;

			tr.removeMark(start, end, linkType);
			tr.addMark(
				start,
				end,
				linkType.create({
					...mark.attrs,
					...linkConfig
				})
			);
		}
	);

	return new UpdateBlockCommand({
		store: templateStore,
		coordinates,
		updates: { content: newContent }
	});
};
