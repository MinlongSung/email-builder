import type { Block, PreviewProps } from "@/features/models/types";
import { blockRegistry } from "@/features/blocks";
import { cn } from "@/components/utils/cn";

export const BlockPreview = ({
  block,
  ref,
  className,
}: PreviewProps<Block>) => {
  const definition = blockRegistry[block.type];
  const { Icon, label } = definition;

  return (
    <div
      ref={ref}
      className={cn(
        "flex aspect-square flex-col items-center justify-center rounded-lg border hover:bg-accent",
        className,
      )}
    >
      {Icon && <Icon />}

      <span className="mt-2 text-xs">{label}</span>
    </div>
  );
};
