import { MessageFlags, SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types/bot.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("How to check my available commands!"),
  async execute(interaction) {
    await interaction.reply({
      embeds: [
        {
          color: 0x0ccab6,
          title: "**Need Command Help?**",
          description:
            "Type `/` in the message box and select my avatar on the sidebar to check all my available commands!",
        },
      ],
      flags: MessageFlags.Ephemeral,
    });
  },
};

export default command;
