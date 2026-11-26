import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types/bot.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("contribution")
    .setDescription(
      "About the creators of the bot and its open source links.",
    ),
  async execute(interaction) {
    const { client } = interaction;
    await interaction.reply({
      embeds: [
        {
          color: 0xffc916,
          title: "Contributions",
          description: "The open source information about this bot.",
          thumbnail: {
            url: client.user.displayAvatarURL(),
          },
          fields: [
            {
              name: "Current Maintainer",
              value: "[rhsu](https://github.com/raymond-1227)",
            },
            {
              name: "Original Creator",
              value: "[davwheat](https://github.com/davwheat)",
            },
            {
              name: "Open Source",
              value:
                "[raymond-1227/realmeme-superfart-rebooted](https://github.com/raymond-1227/realmeme-superfart-rebooted)",
            },
            {
              name: "Want to Contribute?",
              value:
                "Fork `raymond-1227/realmeme-superfart-rebooted` and make a pull request with your code edits!",
            },
          ],
        },
      ],
    });
  },
};

export default command;
