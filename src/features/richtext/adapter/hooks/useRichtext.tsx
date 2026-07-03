import { useContext } from "react";
import { RichtextContext } from "@/features/richtext/adapter/contexts/RichtextContext";

export const useRichtext = () => {
  const ctx = useContext(RichtextContext);
  if (!ctx) {
    throw new Error("useRichtext must be used within RichtextProvider");
  }
  return ctx;
};
