const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("debloat")
    .setDescription("My phone is full of bloatware, help me."),
  async execute(interaction) {
    await interaction.reply({
      embeds: [
        {
          color: 0xffc916,
          title: "How to Debloat Your Android",
          description: "Here's a great software for you to debloat with!",
          fields: [
            {
              name: "[Universal Android Debloater GUI](https://github.com/0x192/universal-android-debloater/)",
              value: [
                "1. Install Platform Tools",
                "2. Download the software [Universal Android Debloater GUI](https://github.com/0x192/universal-android-debloater/releases)",
                "3. Follow the instructions via the repository page README to install it",
              ].join("\n"),
            },
          ],
        },
      ],
    });
  },
};
