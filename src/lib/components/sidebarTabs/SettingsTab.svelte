<script lang="ts">
	import { getHistoryContext } from '$lib/history/contexts/historyContext.svelte';
	import { UpdateRootCommand } from '$lib/commands/structures/root/UpdateRootCommand';
	import { getTemplateContext } from '$lib/template/contexts/templateContext.svelte';
	import { headings, type RootEntity, type TemplateConfig } from '$lib/template/types';
	import { debounce } from '$lib/template/utils/debounce';
	import type { Command } from '$lib/commands/Command';
	import { BatchCommand } from '$lib/commands/BatchCommands';
	import { UpdateTemplateConfigCommand } from '$lib/commands/config/UpdateTemplateConfigCommand';
	import type { Align, BlockType, Heading, TextDirection } from '$lib/template/types';
	import TypographyControls from './settingsTab/TypographyControls.svelte';
	import LinkControls from './settingsTab/LinkControls.svelte';
	import ButtonControls from './settingsTab/ButtonControls.svelte';
	import { getRichtextContext } from '$lib/richtext/adapter/contexts/richtextContext.svelte';
	import {
		transformText,
		transformButton
	} from '$lib/template/nodes/utils/blockTransformers.svelte';
	import ColorPicker from '$lib/components/ui/colorPicker/ColorPicker.svelte';

	const templateStore = getTemplateContext();
	const historyService = getHistoryContext();
	const richtextStore = getRichtextContext();
	const templateConfig = $derived(templateStore.template.config);

	const root = $derived(templateStore.template.root);
	let width = $derived(root.width || 600);
	let dir = $derived(root.dir || 'ltr');
	let align = $derived(root.align || 'left');
	let backgroundColor = $derived(root.bgcolor || '#ffffff');
	let targetTextType = $state<'paragraph' | Heading>('paragraph');

	const handleRootUpdate = debounce((updates: Partial<RootEntity>) => {
		const command = new UpdateRootCommand({
			store: templateStore,
			updates
		});
		historyService.executeCommand(command, {
			type: 'root.update.width'
		});
	}, 300);

	const handleWidthUpdate = (width: number) => handleRootUpdate({ width });
	const handleTextDirectionUpdate = (dir?: TextDirection) => handleRootUpdate({ dir });
	const handleContentAlignUpdate = (align?: Align) => handleRootUpdate({ align });
	const handleBackgroundColorUpdate = (color?: string) => handleRootUpdate({ bgcolor: color });

	const handleTemplateConfigUpdate = debounce(
		(target: 'paragraph' | Heading | 'link' | 'button', name: string, value: string | boolean) => {
			const updatedConfig: Partial<TemplateConfig> = {
				...templateConfig,
				[target]: {
					...templateConfig[target],
					[name]: value
				}
			};

			const isButton = target === 'button';
			const blockTypes: BlockType[] = isButton ? ['button'] : ['text'];
			const transformer = isButton ? transformButton : transformText;

			const commands: Command[] = [];
			const blocks = templateStore.getBlocksByTypes(blockTypes);
			blocks.forEach(({ entity, coordinates }) => {
				const command = transformer({
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
		},
		300
	);
</script>

<div class="panel">
	<h3>Settings</h3>
	<p>Template settings</p>

	<p>Width</p>
	<input
		type="number"
		bind:value={width}
		oninput={(e) => handleWidthUpdate(+e.currentTarget.value)}
	/>

	<p>Background Color</p>
	<ColorPicker value={backgroundColor} onchange={handleBackgroundColorUpdate} />

	<p>Text direction</p>
	<button
		type="button"
		class:selected={dir === 'ltr'}
		onclick={() => handleTextDirectionUpdate('ltr')}
	>
		LTR
	</button>
	<button
		type="button"
		class:selected={dir === 'rtl'}
		onclick={() => handleTextDirectionUpdate('rtl')}
	>
		RTL
	</button>

	<p>Content align</p>
	<button
		type="button"
		class:selected={align === 'left'}
		onclick={() => handleContentAlignUpdate('left')}
	>
		Left
	</button>
	<button
		type="button"
		class:selected={align === 'center'}
		onclick={() => handleContentAlignUpdate('center')}
	>
		Center
	</button>

	<h4>Typography Styles</h4>

	<div class="element-selector">
		<button
			class="element-btn"
			class:active={targetTextType === 'paragraph'}
			onclick={() => (targetTextType = 'paragraph')}
		>
			P
		</button>
		{#each headings as heading}
			<button
				class="element-btn"
				class:active={targetTextType === heading}
				onclick={() => (targetTextType = heading)}
			>
				{heading.toUpperCase()}
			</button>
		{/each}
	</div>

	<TypographyControls
		config={templateConfig?.[targetTextType]}
		onUpdate={(name, value) => handleTemplateConfigUpdate(targetTextType, name, value)}
	/>

	<h4>Link Styles</h4>
	<LinkControls
		config={templateConfig?.link}
		onUpdate={(name, value) => handleTemplateConfigUpdate('link', name, value)}
	/>

	<h4>Button Styles</h4>
	<ButtonControls
		config={templateConfig?.button}
		onUpdate={(name, value) => handleTemplateConfigUpdate('button', name, value)}
	/>
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

	.panel p {
		margin: 0;
		font-size: 14px;
		color: #666;
	}

	.element-selector {
		display: flex;
		gap: 6px;
		padding: 8px;
		background: #f8f9fa;
		border-radius: 6px;
		flex-wrap: wrap;
	}

	.element-btn {
		padding: 6px 12px;
		font-size: 13px;
		font-weight: 500;
		border: 1px solid #d0d0d0;
		background: #ffffff;
		color: #666;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.15s ease;
		min-width: 40px;
	}

	.element-btn:hover {
		border-color: #999;
		background: #fafafa;
	}

	.element-btn.active {
		background: #3b82f6;
		color: #ffffff;
		border-color: #3b82f6;
	}

	.selected {
		background-color: red;
	}
</style>
