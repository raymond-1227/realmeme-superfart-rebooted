import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types/bot.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  async execute(interaction) {
    await interaction.reply({
      embeds: [
        {
          color: 0xffc916,
          title: "Ping?",
          description: "Pong!",
        },
      ],
    });
  },
};

export default command;
