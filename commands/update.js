const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("update").setDescription("Just shut up and update your phone."),
  async execute(interaction) {
    await interaction.reply({
      embeds: [
        {
          color: 0xffc916,
          title: "Should I update my phone?",
          description: "**STOP ASKING if it's safe to update your phone.**",
          fields: [
            {
              name: "Why?",
              value: "**No, one, cares.** Even you ask any staff 10,000 times, we'll still tell you to update it.",
            },
            {
              name: "What?",
              value: [
                "realme is also one of the companies that has the slowest update rollout speed, so if you receive update, **just don't hesitate and UPDATE.**",
                "realme releases multiple phones per year, so NOT EVERYONE KNOWS IF YOUR ROM HAS WEIRD PROBLEMS, we are all suffering from extreme amount of bugs, you're not the special one with a ton of gaming performance drop or fast draining batteries, literally a lot of people here does.",
              ].join("\n"),
            },
          ],
        },
      ],
    });
  },
};
