import { Editor } from '$lib/richtext/core/Editor';
import { buildTextExtensions } from '$lib/richtext/adapter/utils/buildExtensions';
import { traverseInRange } from '$lib/richtext/core/extensions/utils/traverseInRange';
import type { TemplateConfig, TextContent } from '$lib/template/types';
import type { Predicate, NodeCallback } from '$lib/richtext/core/extensions/types';

/**
 * Servicio headless de ProseMirror para transformaciones batch
 * Separado del editor interactivo para evitar conflictos de estado
 */
class RichtextService {
    private editor: Editor | null = null;

    /**
     * Inicializa el editor headless con la configuración del template
     */
    initialize(config: Partial<TemplateConfig>) {
        if (this.editor) {
            this.editor.destroy();
        }

        this.editor = new Editor({
            extensions: buildTextExtensions(config),
            content: ''
        });
    }

    /**
     * Aplica transformaciones a contenido sin afectar el editor activo
     */
    applyTransform(
        content: TextContent,
        predicate: Predicate,
        callback: NodeCallback
    ): TextContent {
        if (!this.editor) {
            throw new Error('RichtextService not initialized. Call initialize() first.');
        }

        // Cargar contenido en el editor
        this.editor.commands.setContent(content.json);

        // Crear transacción
        const tr = this.editor.state.tr;

        // Aplicar transformación usando función existente
        traverseInRange({
            state: this.editor.state,
            from: 0,
            to: this.editor.state.doc.content.size,
            tr,
            predicate,
            callback,
            includeMarks: true
        });

        // Dispatch transacción
        this.editor.view.dispatch(tr);

        // Retornar resultado transformado
        return {
            html: this.editor.getHTML(),
            json: this.editor.getJSON()
        };
    }

    /**
     * Actualiza la configuración y reinicializa el editor
     */
    updateConfig(config: Partial<TemplateConfig>) {
        this.initialize(config);
    }

    /**
     * Libera recursos
     */
    destroy() {
        if (this.editor) {
            this.editor.destroy();
            this.editor = null;
        }
    }

    /**
     * Verifica si está listo para usar
     */
    get isReady() {
        return this.editor !== null;
    }
}

// Singleton: una sola instancia compartida
export const richtextService = new RichtextService();
