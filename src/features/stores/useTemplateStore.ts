import { create } from "zustand";
import type { EmailTemplate } from "@/features/models/types";

interface State {
  template: EmailTemplate | null;
  setTemplate: (template: EmailTemplate) => void;
}

export const useTemplateStore = create<State>()((set) => ({
  template: null,
  setTemplate: (template) => set({ template }),
}));
