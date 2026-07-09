import {
  useHistoryStore,
  type CommandMetadata,
  type HistoryEntry,
} from "@/features/stores/useHistoryStore";
import { useTemplateStore } from "@/features/stores/useTemplateStore";
import { generateId } from "@/features/utils/generateId";
import { useCallback } from "react";
import type { Command } from "@/features/document/core/commands/Command";

export const useHistory = () => {
  const template = useTemplateStore((s) => s.template);
  const setTemplate = useTemplateStore((s) => s.setTemplate);

  const timeline = useHistoryStore((s) => s.timeline);
  const currentIndex = useHistoryStore((s) => s.currentIndex);

  const push = useHistoryStore((s) => s.push);

  const stepUndo = useHistoryStore((s) => s.undo);
  const stepRedo = useHistoryStore((s) => s.redo);

  const canUndo = useHistoryStore((s) => s.canUndo);
  const canRedo = useHistoryStore((s) => s.canRedo);

  const goTo = useHistoryStore((s) => s.goTo);

  const execute = useCallback(
    (
      command: Command,
      metadata: Omit<CommandMetadata, "entryId" | "timestamp">,
    ) => {
      if (!template) return;

      const document = command.execute(template.document);

      setTemplate({
        ...template,
        document,
      });

      const entry: HistoryEntry = {
        command,
        metadata: {
          ...metadata,
          entryId: generateId(),
          timestamp: Date.now(),
        },
      };

      push(entry);
    },
    [template, setTemplate, push],
  );

  const undo = useCallback(() => {
    if (!template) return;

    const entry = stepUndo();

    if (!entry) return;

    const document = entry.command.undo(template.document);

    setTemplate({
      ...template,
      document,
    });
  }, [template, setTemplate, stepUndo]);

  const redo = useCallback(() => {
    if (!template) return;

    const entry = stepRedo();

    if (!entry) return;

    const document = entry.command.execute(template.document);

    setTemplate({
      ...template,
      document,
    });
  }, [template, setTemplate, stepRedo]);

  const navigateTo = useCallback(
    (index: number) => {
      if (!template) return;

      if (index === currentIndex) return;

      const entries = goTo(index);

      if (!entries.length) return;

      let document = template.document;

      if (index < currentIndex) {
        for (const entry of entries) {
          document = entry.command.undo(document);
        }
      } else {
        for (const entry of entries) {
          document = entry.command.execute(document);
        }
      }

      setTemplate({
        ...template,
        document,
      });
    },
    [template, currentIndex, goTo, setTemplate],
  );

  return {
    execute,
    undo,
    redo,
    navigateTo,
    timeline,
    currentIndex,
    canUndo,
    canRedo,
  };
};
