import {
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { requireEnv } from "../config/env.js";
import type { SlashCommand } from "../types/bot.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Restarts the bot! (Bot developer exclusive)")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const { client } = interaction;
    console.log(interaction.user.id);

    if (interaction.user.id !== requireEnv("OWNER_ID")) {
      await interaction.reply({
        embeds: [
          {
            color: 0xffc916,
            title: "Bot Reloader",
            description: "Only the bot developer can perform this action!",
          },
        ],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.reply({
      embeds: [
        {
          color: 0xffc916,
          title: "Bot Reloader",
          description: "Bot is now reloading.",
        },
      ],
      flags: MessageFlags.Ephemeral,
    });
    await client.destroy();
    process.exit(0);
  },
};

export default command;
