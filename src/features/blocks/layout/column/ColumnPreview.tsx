import type { ColumnBlock, PreviewProps } from "@/features/models/types";
import { toCss } from "@/features/blocks/shared/utils";

export const ColumnPreview = ({ block }: PreviewProps<ColumnBlock>) => {
  const { width } = toCss(block.props);

  return <div className="bg-red-600 h-6" style={{ width }} />;
};
