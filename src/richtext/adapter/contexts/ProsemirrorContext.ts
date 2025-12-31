import { createContext } from "react";
import type { IProsemirrorContext } from "@/richtext/adapter/types";

export const ProsemirrorContext = createContext<IProsemirrorContext | null>(
  null
);
