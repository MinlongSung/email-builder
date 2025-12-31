import { useContext } from "react";
import { ProsemirrorContext } from "@/richtext/adapter/contexts/ProsemirrorContext";

export const useProsemirror = () => {
  const context = useContext(ProsemirrorContext);
  if (!context) {
    throw new Error(
      "useProsemirrorEditor must be used inside ProsemirrorProvider"
    );
  }
  return context;
};
