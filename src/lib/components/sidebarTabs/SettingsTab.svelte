<script lang="ts">
	import { getHistoryContext } from '$lib/history/contexts/historyContext.svelte';
	import { UpdateRootCommand } from '$lib/commands/structures/root/UpdateRootCommand';
	import { getTemplateContext } from '$lib/template/contexts/templateContext.svelte';
	import { levels, type RootEntity, type TemplateConfig } from '$lib/template/types';
	import { debounce } from '$lib/template/utils/debounce';
	import type { Command } from '$lib/commands/Command';
	import { UpdateBlockCommand } from '$lib/commands/blocks/UpdateBlockCommand';
	import { BatchCommand } from '$lib/commands/BatchCommands';
	import { UpdateTemplateConfigCommand } from '$lib/commands/config/UpdateTemplateConfigCommand';

	import { isHeadingLevel } from '$lib/richtext/core/extensions/utils/textNodeChecks';
	import { isLink } from '$lib/richtext/core/extensions/marks/link/utils/isLink';
	import type { Level } from '$lib/template/types';
	import TypographyControls from './settingsTab/TypographyControls.svelte';
	import LinkControls from './settingsTab/LinkControls.svelte';
	import ButtonControls from './settingsTab/ButtonControls.svelte';
	import { getRichtextContext } from '$lib/richtext/adapter/contexts/richtextContext.svelte';
	import {
		transformTextBlock,
		transformButtonBlock
	} from '$lib/template/nodes/utils/blockTransformers.svelte';

	const templateStore = getTemplateContext();
	const historyService = getHistoryContext();
	const richtextStore = getRichtextContext();
	const templateConfig = $derived(templateStore.template.config);

	const root = $derived(templateStore.template.root);
	let width = $derived(root.width || 600);
	let backgroundColor = $derived(root.style?.['background-color'] || '#ffffff');

	const handleRootUpdate = debounce((updates: Partial<RootEntity>) => {
		const command = new UpdateRootCommand({
			store: templateStore,
			updates
		});
		historyService.executeCommand(command, {
			type: 'root.update.width'
		});
	}, 300);

	const handleWidthUpdate = (
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		handleRootUpdate({ width: +e.currentTarget.value });
	};

	const handleBackgroundColorUpdate = (
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		handleRootUpdate({
			style: {
				...root.style,
				'background-color': e.currentTarget.value
			}
		});
	};

	const handleParagraphConfigUpdate = debounce((name: string, value: string) => {
		const updatedConfig: Partial<TemplateConfig> = {
			...templateConfig,
			paragraph: {
				...templateConfig.paragraph,
				[name]: value
			}
		};

		const blocks = templateStore.getBlocksByTypes(['text']);
		const commands: Command[] = [];

		blocks.forEach(({ entity, coordinates }) => {
			const command = transformTextBlock({
				block: entity,
				coordinates,
				templateStore,
				richtextStore,
				templateConfig: updatedConfig
			});
			if (command) commands.push(command);
		});

		if (!commands.length) return;

		const batchCommands = new BatchCommand([
			new UpdateTemplateConfigCommand({
				store: templateStore,
				updates: updatedConfig
			}),
			...commands
		]);

		historyService.executeCommand(batchCommands, {
			type: 'template.global.styles'
		});
	}, 300);

	const handleHeadingBlockConfigUpdate = debounce((level: Level, name: string, value: string) => {
		const updatedConfig: Partial<TemplateConfig> = {
			...templateConfig,
			heading: {
				level: {
					...templateConfig.heading?.level,
					[level]: {
						...templateConfig.heading?.level?.[level],
						[name]: value
					}
				}
			}
		};

		const blocks = templateStore.getBlocksByTypes(['text']);
		const commands: Command[] = [];
		blocks.forEach(({ entity, coordinates }) => {
			const newContent = richtextStore.applyTransform(
				entity.content,
				({ node }) => isHeadingLevel(node, level),
				({ node, pos }, tr) => {
					if (!node) return;
					tr.setNodeMarkup(pos, undefined, {
						...node.attrs,
						[name]: value
					});
				}
			);
			const command = new UpdateBlockCommand({
				store: templateStore,
				coordinates,
				updates: { content: newContent }
			});
			commands.push(command);
		});
		if (!commands.length) return;

		const batchCommands = new BatchCommand([
			new UpdateTemplateConfigCommand({
				store: templateStore,
				updates: updatedConfig
			}),
			...commands
		]);

		historyService.executeCommand(batchCommands, {
			type: 'template.global.styles'
		});
	}, 300);

	const handleLinkConfigUpdate = debounce((name: string, value: string | boolean) => {
		const updatedConfig: Partial<TemplateConfig> = {
			...templateConfig,
			link: {
				...templateConfig.link,
				[name]: value
			}
		};

		const blocks = templateStore.getBlocksByTypes(['text']);
		const commands: Command[] = [];
		blocks.forEach(({ entity, coordinates }) => {
			const newContent = richtextStore.applyTransform(
				entity.content,
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
							[name]: value
						})
					);
				}
			);
			const command = new UpdateBlockCommand({
				store: templateStore,
				coordinates,
				updates: { content: newContent }
			});
			commands.push(command);
		});
		if (!commands.length) return;

		const batchCommands = new BatchCommand([
			new UpdateTemplateConfigCommand({
				store: templateStore,
				updates: updatedConfig
			}),
			...commands
		]);

		historyService.executeCommand(batchCommands, {
			type: 'template.global.styles'
		});
	}, 300);

	const handleButtonConfigUpdate = debounce((name: string, value: string) => {
		const updatedConfig: Partial<TemplateConfig> = {
			...templateConfig,
			button: {
				...templateConfig.button,
				[name]: value
			}
		};

		const blocks = templateStore.getBlocksByTypes(['button']);
		const commands: Command[] = [];

		blocks.forEach(({ entity, coordinates }) => {
			const command = transformButtonBlock({
				block: entity,
				coordinates,
				templateStore,
				richtextStore,
				templateConfig: updatedConfig
			});
			if (command) commands.push(command);
		});

		if (!commands.length) return;

		const batchCommands = new BatchCommand([
			new UpdateTemplateConfigCommand({
				store: templateStore,
				updates: updatedConfig
			}),
			...commands
		]);

		historyService.executeCommand(batchCommands, {
			type: 'template.global.styles'
		});
	}, 300);
</script>

<div class="panel">
	<h3>Settings</h3>
	<p>Template settings</p>

	<p>Width</p>
	<input type="number" bind:value={width} oninput={handleWidthUpdate} />

	<p>Background Color</p>
	<input type="color" bind:value={backgroundColor} oninput={handleBackgroundColorUpdate} />

	<h4>Paragraph Styles</h4>
	<TypographyControls config={templateConfig?.paragraph} onUpdate={handleParagraphConfigUpdate} />

	<h4>Heading Styles</h4>

	{#each levels as level}
		<div class="heading-section">
			<h5>Heading {level}</h5>
			<TypographyControls
				config={templateConfig?.heading?.level?.[level]}
				onUpdate={(name, value) => handleHeadingBlockConfigUpdate(level, name, value)}
			/>
		</div>
	{/each}

	<h4>Link Styles</h4>
	<LinkControls config={templateConfig?.link} onUpdate={handleLinkConfigUpdate} />

	<h4>Button Styles</h4>
	<ButtonControls config={templateConfig?.button} onUpdate={handleButtonConfigUpdate} />
</div>

<style>
	.panel {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.panel h3 {
		margin: 0;
		font-size: 16px;
		font-weight: 600;
		color: #333;
	}

	.panel h4 {
		margin: 16px 0 8px 0;
		padding-top: 16px;
		font-size: 15px;
		font-weight: 600;
		color: #333;
		border-top: 1px solid #e0e0e0;
	}

	.panel h4:first-of-type {
		margin-top: 8px;
		padding-top: 8px;
		border-top: none;
	}

	.panel h5 {
		margin: 0 0 8px 0;
		font-size: 14px;
		font-weight: 600;
		color: #555;
	}

	.panel p {
		margin: 0;
		font-size: 14px;
		color: #666;
	}

	.heading-section {
		padding: 12px;
		background: #f8f9fa;
		border-radius: 6px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
</style>
