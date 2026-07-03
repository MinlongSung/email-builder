import { cn } from "@/components/utils/cn";

export const DropLine = ({ isTopHalf }: { isTopHalf: boolean }) => {
  return (
    <div
      className={cn(
        "absolute h-0.5 w-full bg-blue-500 pointer-events-none z-20",
        isTopHalf ? "top-0" : "top-full",
      )}
    />
  );
};
