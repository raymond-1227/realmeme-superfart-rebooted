const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("switch")
    .setDescription("Fuck realme, you deserve a better choice.")
    .addStringOption((option) =>
      option
        .setName("series")
        .setDescription("Select a phone to switch to!")
        .addChoices({ name: "Apple iPhone", value: "iphone" })
        .addChoices({ name: "Google Pixel", value: "pixel" })
        .addChoices({ name: "Samsung Galaxy", value: "galaxy" })
        .setRequired(true)
    ),

  async execute(interaction) {
    let choice = interaction.options.getString("series");
    let phoneName;
    let videoUrl;
    let guideUrl;
    if (choice === "iphone") {
      phoneName = "iPhone";
      videoUrl = "https://www.youtube.com/watch?v=8GDkLsR1ErI";
      guideUrl = "https://www.apple.com/iphone/switch";
    } else if (choice === "pixel") {
      phoneName = "Pixel";
      videoUrl = "https://www.youtube.com/watch?v=dVE76JOrOcQ";
      guideUrl = "https://guidebooks.google.com/pixel/transfer-your-data/how-to-switch-from-android";
    } else if (choice === "galaxy") {
      phoneName = "Galaxy";
      videoUrl = "https://www.youtube.com/watch?v=91pDaubXd5E";
      guideUrl = "https://www.samsung.com/us/support/switch-to-galaxy/android";
    }

    interaction.reply({
      embeds: [
        {
          color: 0xffc916,
          title: `Switching to ${phoneName}`,
          description: `Here are some useful resources on switching to **${phoneName}**!`,
          fields: [
            {
              name: "Video Guide",
              value: `[Click here to watch!](${videoUrl})`,
            },
            {
              name: "Website Guide",
              value: `[Click here to read more!](${guideUrl})`,
            },
          ],
        },
      ],
    });
  },
};
