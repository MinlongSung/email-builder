import { useContext, useState } from "react";
import { BlockWrapperContext } from "@/features/blocks/shared/BlockWrapperContext";
import { Toolbar } from "@/features/blocks/shared/Toolbar";

interface Props extends React.ComponentProps<"div"> {}

export function ToolbarAccess({ className }: Props) {
  const {
    setToolbarAccessFloatingRef,
    toolbarAccessFloatingStyles,
    setToolbarReferenceRef,
  } = useContext(BlockWrapperContext);

  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className={className}
      ref={setToolbarAccessFloatingRef}
      style={toolbarAccessFloatingStyles}
      onClick={() => setIsHovering(true)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div ref={setToolbarReferenceRef}>menu</div>
      {isHovering && <Toolbar />}
    </div>
  );
}
