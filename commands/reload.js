const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Restarts the bot! (Bot developer exclusive)"),
  async execute(interaction) {
    const { client } = interaction;
    const botOwner = client.users.cache.get("410839910204047360").tag;
    if (interaction.user.id !== "410839910204047360")
      return interaction.reply({
        embeds: [
          {
            color: "#FFC916",
            title: "Bot Reloader",
            description: "Only the bot developer can perform this action!",
          },
        ],
        ephemeral: true,
      });
    await interaction.reply({
      embeds: [
        {
          color: "#FFC916",
          title: "**Bot Reloader**",
          description: "Bot is now reloading.",
        },
      ],
      ephemeral: true,
    });
    await client.destroy();
    return process.exit(0);
  },
};
