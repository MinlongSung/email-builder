<script lang="ts">
	import { getHistoryContext } from '$lib/history/contexts/historyContext.svelte';
	import { UpdateRootCommand } from '$lib/commands/structures/root/UpdateRootCommand';
	import { PRESETS } from '$lib/richtext/adapter/types';
	import { getTemplateContext } from '$lib/template/contexts/templateContext.svelte';
	import { levels, type RootEntity, type TemplateConfig } from '$lib/template/types';
	import { debounce } from '$lib/template/utils/debounce';
	import type { Command } from '$lib/commands/Command';
	import { UpdateBlockCommand } from '$lib/commands/blocks/UpdateBlockCommand';
	import { BatchCommand } from '$lib/commands/BatchCommands';
	import { UpdateTemplateConfigCommand } from '$lib/commands/config/UpdateTemplateConfigCommand';
	import { richtextService } from '$lib/richtext/adapter/services/RichtextService.svelte';
	import { isParagraph, isHeadingLevel } from '$lib/richtext/core/extensions/utils/textNodeChecks';
	import { isLink } from '$lib/richtext/core/extensions/marks/link/utils/isLink';
	import type { Level } from '$lib/template/types';
	import { onMount } from 'svelte';
	import TypographyControls from './settingsTab/TypographyControls.svelte';
	import LinkControls from './settingsTab/LinkControls.svelte';
	import ButtonControls from './settingsTab/ButtonControls.svelte';

	const templateStore = getTemplateContext();
	const historyContext = getHistoryContext();
	const templateConfig = $derived(templateStore.template.config);

	const root = $derived(templateStore.template.root);
	let width = $derived(root.width || 600);
	let backgroundColor = $derived(root.style?.['background-color'] || '#ffffff');

	onMount(() => {
		richtextService.initialize(templateConfig);
	});

	const handleRootUpdate = debounce((updates: Partial<RootEntity>) => {
		const command = new UpdateRootCommand({
			store: templateStore,
			updates
		});
		historyService.executeCommand(command, {
			type: 'root.update.width'
		});
	}, 300);

	const handleWidthUpdate = (e: Event) => {
		handleRootUpdate({ width: +e.currentTarget.value });
	};

	const handleBackgroundColorUpdate = (e: Event) => {
		handleRootUpdate({
			style: {
				...root.style,
				'background-color': e.currentTarget.value
			}
		});
	};

	const handleParagraphConfigUpdate = debounce((name: string, value: string) => {
		if (!richtextService.isReady) return;

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
			const newContent = richtextService.applyTransform(
				entity.content,
				({ node }) => isParagraph(node),
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

	const handleHeadingBlockConfigUpdate = debounce((level: Level, name: string, value: string) => {
		if (!richtextService.isReady) return;

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
			const newContent = richtextService.applyTransform(
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
		if (!richtextService.isReady) return;

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
			const newContent = richtextService.applyTransform(
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
			const command = new UpdateBlockCommand({
				store: templateStore,
				coordinates,
				updates: {
					style: {
						...entity.style,
						[name]: value
					}
				}
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
