import { ChannelType } from "discord.js";
import type { MessageHandler } from "../types/bot.js";

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const handler: MessageHandler = {
  exclusive: true,

  match(message) {
    return message.channel.type === ChannelType.DM;
  },

  async execute(message) {
    if (message.channel.type !== ChannelType.DM) return;

    await message.channel.sendTyping();
    await delay(1000);

    await message.reply(
      "This bot only intends to work for r/realme, not in DMs.\nPlease use the bot in the server: https://discord.gg/5D6UPMTdjy",
    );
  },
};

export default handler;
