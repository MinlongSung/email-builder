import { createContext } from "react";
import type { BlockWrapperContextProps } from "@/features/blocks/shared/types";

export const BlockWrapperContext = createContext<BlockWrapperContextProps | null>(null);
