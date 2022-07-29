const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("How to check my available commands!"),
  async execute(interaction) {
    interaction.reply({
      embeds: [
        {
          color: 0x0ccab6,
          title: "**Need Command Help?**",
          description:
            "Type `/` in the message box and select my avatar on the sidebar to check all my available commands!",
        },
      ],
      ephemeral: true,
    });
  },
};
