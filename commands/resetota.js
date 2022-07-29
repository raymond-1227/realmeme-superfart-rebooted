const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resetota")
    .setDescription("Learn how you can reset OTA updater on your phone."),
  async execute(interaction) {
    await interaction.reply({
      embeds: [
        {
          color: 0xffc916,
          title: "How to reset OTA updater?",
          description: [
            "1. Open Terminal / Command Prompt",
            "1. Execute the following commands",
            "```sh\nadb shell\n```",
            "```sh\npm uninstall -k --user 0 com.oppo.ota\n```",
            "```sh\npm uninstall -k --user 0 com.oppo.otaui\n```",
            "```sh\ncmd package install-existing --user 0 com.oppo.ota\n```",
            "```sh\ncmd package install-existing --user 0 com.oppo.otaui\n```",
          ].join("\n"),
        },
      ],
    });
  },
};