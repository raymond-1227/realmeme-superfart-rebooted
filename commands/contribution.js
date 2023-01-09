require("dotenv").config();
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("contribution")
    .setDescription("About the creators of the bot and its open source links."),
  async execute(interaction) {
    const { client } = interaction;
    interaction.reply({
      embeds: [
        {
          color: 0xffc916,
          title: "Contributions",
          description: "The open source information about this bot.",
          thumbnail: {
            url: client.user.displayAvatarURL,
          },
          fields: [
            {
              name: "Current Maintainers",
              value: [
                "[Raymond#2829](https://github.com/raymond-1227)",
                "[flumpy#8654](https://github.com/flandolf)",
              ].join("\n"),
            },
            {
              name: "Original Creator",
              value: "[MrJeeves#1234](https://github.com/davwheat)",
            },
            {
              name: "Open Source",
              value: [
                "[raymond-1227/realmeme-superfart-rebooted](https://github.com/raymond-1227/realmeme-superfart-rebooted)",
                "[davwheat/realmeme-superfart-bot](https://github.com/davwheat/realmeme-superfart-bot)",
              ].join("\n"),
            },
            {
              name: "Want to Contribute?",
              value: "Fork `raymond-1227/realmeme-superfart-rebooted` and make a pull request with your code edits!",
            },
          ],
        },
      ],
    });
  },
};
