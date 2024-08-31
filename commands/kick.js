const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const rules = require("../misc/rules.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks the user from the server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to kick")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("rule")
        .setDescription("Select a rule why you are banning the user")
        .addChoices({ name: "Rule 1 - Pings", value: "rule1" })
        .addChoices({ name: "Rule 2 - NSFW", value: "rule2" })
        .addChoices({ name: "Rule 3 - Insults", value: "rule3" })
        .addChoices({ name: "Rule 4 - Spam", value: "rule4" })
        .addChoices({ name: "Rule 5 - Impersonation", value: "rule5" })
        .addChoices({ name: "Rule 6 - Doxxing", value: "rule6" })
        .addChoices({ name: "Rule 7 - Advertisements", value: "rule7" })
        .addChoices({ name: "Rule 8 - Repetitive Question", value: "rule8" })
        .addChoices({ name: "Rule 9 - Off Topic", value: "rule9" })
        .addChoices({ name: "Rule 10 - Bot Abuse", value: "rule10" })
        .addChoices({ name: "Rule 11 - Illegal Software", value: "rule11" })
        .addChoices({ name: "Rule 12 - Rule Updates", value: "rule12" })
        .addChoices({ name: "Rule 13 - Use English", value: "rule13" })
        .addChoices({
          name: "Rule 14 - Discord ToS / Community Guidelines",
          value: "rule14",
        })
        .addChoices({ name: "Rule 15 - Other", value: "rule15" })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("details")
        .setDescription("Add details to the kick if necessary")
    ),

  async execute(interaction) {
    const { client, guild } = interaction;
    let user = await interaction.options.getUser("user");
    let member =
      (await interaction.guild.members.cache.get(user.id)) ||
      (await interaction.guild.members.fetch(user.id).catch((err) => {}));
    let rule = interaction.options.getString("rule");
    let details = interaction.options.getString("details");
    let reason;

    if (details == null) {
      reason = rules[rule].name;
    } else {
      reason = rules[rule].name + ": " + details;
    }

    if (!member)
      return interaction.reply({
        embeds: [
          {
            color: 0xf04a47,
            description: "<:botError:1279326378075885599> Couldn't get details from the given user input",
          },
        ],
        ephemeral: true,
      });

    if (member.user.id === client.user.id)
      return interaction.reply({
        embeds: [
          {
            color: 0xf04a47,
            description: "<:botError:1279326378075885599> HEY DON'T KICK ME!!!!111!!11",
          },
        ],
        ephemeral: true,
      });

    if (!member.kickable)
      return interaction.reply({
        embeds: [
          {
            color: 0xf04a47,
            description: "<:botError:1279326378075885599> I can't kick that user",
          },
        ],
        ephemeral: true,
      });

    if (
      interaction.member.roles.highest.position <= member.roles.highest.position
    )
      return interaction.reply({
        embeds: [
          {
            color: 0xf04a47,
            description:
              "<:botError:1279326378075885599> You can't kick someone with a role higher than yours",
          },
        ],
        ephemeral: true,
      });
    await interaction.reply({
      embeds: [
        {
          color: 0x43b582,
          description: `<:botSuccess:1279326365191114784> ***${user.tag} was kicked.***`,
        },
      ],
    });
    await user
      .send({
        embeds: [
          {
            color: 0xf04a47,
            description: `You were kicked from ${guild.name} for ${reason}`,
          },
          {
            color: 0xffc916,
            title: rules[rule].name,
            description: rules[rule].description,
          },
        ],
      })
      .catch((error) => {
        console.error(error);
      });
    await member.kick({ reason: reason });
    await client.channels.cache.get("1001166932407496754").send({
      embeds: [
        {
          color: 0xf04a47,
          title: "Punishment System",
          description: `${user.tag} was kicked.`,
          fields: [
            {
              name: "Rule Violated",
              value: rules[rule].name,
            },
            {
              name: "Rule Description",
              value: rules[rule].description,
            },
            {
              name: "Additional Details",
              value: details || "N/A",
            },
          ],
        },
      ],
    });
  },
};
