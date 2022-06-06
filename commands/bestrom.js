const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bestrom")
    .setDescription("THERE IS NO BEST ROM OMFG STOP"),
  async execute(interaction) {
    await interaction.reply({
      embeds: [
        {
          color: "#FFC916",
          title: "Best ROM",
          description: "___**There is no such best ROM.**___ One person's favorite ROM won't be the same as someone else's favorite ROM. The real best ROM is the one which you enjoy using the most, find the most stable, and has the features you want to use.",
        },
      ],
    });
  },
};
