import { createContext } from "react";
import type { RichtextContextProps } from "@/features/richtext/adapter/types";

export const RichtextContext = createContext<RichtextContextProps | null>(null);
