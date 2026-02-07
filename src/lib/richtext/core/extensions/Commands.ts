import type { Extension } from "../types";
import * as commands from "../commands";

export const Commands: Extension = {
  name: "commands",

  commands: () => ({
    ...commands,
  }),
};
