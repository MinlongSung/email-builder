import type { Command } from "$lib/commands/Command";
import { UpdateBlockCommand } from "$lib/commands/blocks/UpdateBlockCommand";
import { isParagraph } from "$lib/richtext/core/extensions/utils/textNodeChecks";
import type { RichtextStore } from "$lib/richtext/adapter/contexts/richtextContext.svelte";
import type { TemplateStore } from "$lib/template/contexts/templateContext.svelte";
import type { BlockCoordinates, BlockEntity, TemplateConfig } from "$lib/template/types";

export interface TransformContext {
	block: BlockEntity;
	coordinates: BlockCoordinates;
	templateStore: TemplateStore;
	richtextStore: RichtextStore;
	templateConfig: Partial<TemplateConfig>;
}

export type BlockTransformer = (context: TransformContext) => Command | null;

export const transformTextBlock = (context: TransformContext): Command | null => {
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

export const transformButtonBlock = (context: TransformContext): Command | null => {
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
