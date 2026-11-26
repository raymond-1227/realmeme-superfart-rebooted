import type { Collection } from "discord.js";
import type { MessageHandler, SlashCommand } from "./bot.js";

declare module "discord.js" {
  interface Client<Ready extends boolean = boolean> {
    commands: Collection<string, SlashCommand>;
    messages: Collection<string, MessageHandler>;
  }
}
