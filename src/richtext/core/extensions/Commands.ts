import type { Extension } from "@/richtext/core/types";
import * as commands from "@/richtext/core/commands";

export const Commands: Extension = {
  name: "commands",

  commands: () => ({
    ...commands,
  }),
};
