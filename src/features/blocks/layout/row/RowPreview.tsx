import type { PreviewProps, RowBlock } from "@/features/models/types";

export const RowPreview = ({
  ref,
  children,
}: PreviewProps<RowBlock>) => {
  return (
    <div
      ref={ref}
      className="flex items-center gap-2 rounded-lg border p-3 hover:bg-accent min-w-54"
    >
      {children}
    </div>
  );
};
