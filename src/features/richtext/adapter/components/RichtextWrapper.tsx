import React from "react";

import { cn } from "@/components/utils/cn";

import type { SelectionCoordinates } from "@/features/richtext/adapter/types";
import { usePreviewSelection } from "@/features/richtext/adapter/hooks/usePreviewSelection";

interface Props extends React.ComponentProps<"div"> {
  onTextSelection: (coordinates: SelectionCoordinates) => void;
  children?: React.ReactNode;
}

export const RichtextWrapper = ({
  children,
  className,
  onTextSelection,
  ...props
}: Props) => {
  const { startSelection, endSelection, cancelSelection } = usePreviewSelection(
    {
      onSelectionEnd: onTextSelection,
    },
  );

  return (
    <div
      {...props}
      className={cn("tiptap", className)}
      onPointerDown={startSelection}
      onPointerUp={endSelection}
      onPointerLeave={cancelSelection}
      onPointerCancel={cancelSelection}
    >
      {children}
    </div>
  );
};
