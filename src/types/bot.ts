import type {
  ChatInputCommandInteraction,
  ClientEvents,
  Message,
  OmitPartialGroupDMChannel,
  SharedSlashCommand,
} from "discord.js";

export interface SlashCommand {
  data: SharedSlashCommand;
  execute(interaction: ChatInputCommandInteraction<"cached">): Promise<void>;
}

export type BotMessage = OmitPartialGroupDMChannel<Message>;

export interface MessageHandler {
  exclusive?: boolean;
  match(message: BotMessage): boolean;
  execute(message: BotMessage): Promise<void>;
}

export interface BotEvent<K extends keyof ClientEvents = keyof ClientEvents> {
  name: K;
  once?: boolean;
  execute(...args: ClientEvents[K]): Promise<void> | void;
}

export function defineEvent<K extends keyof ClientEvents>(
  event: BotEvent<K>,
): BotEvent<K> {
  return event;
}
