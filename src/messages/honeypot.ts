import { PermissionFlagsBits } from "discord.js";
import { rules } from "../config/data.js";
import { requireEnv } from "../config/env.js";
import type { MessageHandler } from "../types/bot.js";
import { sendPunishmentLog } from "../utils/moderation.js";

const handler: MessageHandler = {
  exclusive: true,

  match(message) {
    return (
      message.inGuild() &&
      message.channel.id === requireEnv("HONEYPOT_CHANNEL_ID")
    );
  },

  async execute(message) {
    if (!message.inGuild()) return;

    if (message.member?.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return;
    }

    const details =
      "You sent a message in the honeypot channel, so we assumed you were a bot.";
    const reason = `${rules.rule4.name}: ${details}`;

    await message.author
      .send({
        embeds: [
          {
            color: 0xf04a47,
            description: `You were banned from ${message.guild.name} | ${reason}`,
          },
          {
            color: 0xffc916,
            title: rules.rule4.name,
            description: rules.rule4.description,
          },
          {
            color: 0xffc916,
            description:
              "Appeal the ban: <https://forms.gle/nUdK1PsqJx1Lwtq56>",
          },
        ],
      })
      .catch((error: unknown) => console.error(error));

    await message.delete().catch((error: unknown) => console.error(error));

    await message.guild.members.ban(message.author.id, {
      reason,
    });

    await sendPunishmentLog(message.client, {
      userTag: message.author.tag,
      actionPastTense: "banned",
      ruleKey: "rule4",
      details,
    });

    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const channels = await message.guild.channels.fetch();

    for (const [channelId, channel] of channels) {
      if (!channel || !channel.isTextBased()) continue;

      try {
        const fetchedMessages = await channel.messages.fetch({ limit: 100 });
        const spammerMessages = fetchedMessages.filter(
          (msg) =>
            msg.author.id === message.author.id &&
            msg.createdTimestamp > oneHourAgo,
        );

        if (spammerMessages.size > 0) {
          await channel.bulkDelete(spammerMessages, true);
        }
      } catch (error) {
        console.error(
          `Failed to fetch or delete messages in channel ${channelId}:`,
          error,
        );
      }
    }
  },
};

export default handler;
