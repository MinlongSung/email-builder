import type { Block, PreviewProps } from "@/features/models/types";
import { blockRegistry } from "@/features/blocks";

export const BlockPreview = ({ block, ref }: PreviewProps<Block>) => {
  const definition = blockRegistry[block.type];
  const { Icon, label } = definition;

  return (
    <div
      ref={ref}
      className="flex aspect-square flex-col items-center justify-center rounded-lg border hover:bg-accent"
    >
      {Icon && <Icon />}

      <span className="mt-2 text-xs">{label}</span>
    </div>
  );
};
