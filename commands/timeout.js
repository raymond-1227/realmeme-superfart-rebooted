const { SlashCommandBuilder } = require("discord.js");
const { PermissionFlagsBits } = require("discord-api-types/v10");
const ms = require("ms");
const rules = require("../misc/rules.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user from interacting with the server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to timeout")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("Set a time for the timeout")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("rule")
        .setDescription("Select a rule why you are kicking the user")
        .addChoices({ name: "Rule 1 - Pings", value: "rule1" })
        .addChoices({ name: "Rule 2 - NSFW", value: "rule2" })
        .addChoices({ name: "Rule 3 - Insults", value: "rule3" })
        .addChoices({ name: "Rule 4 - Spam", value: "rule4" })
        .addChoices({ name: "Rule 5 - Impersonation", value: "rule5" })
        .addChoices({ name: "Rule 6 - Doxxing", value: "rule6" })
        .addChoices({ name: "Rule 7 - Advertisements", value: "rule7" })
        .addChoices({ name: "Rule 8 - Repetitive Question", value: "rule8" })
        .addChoices({ name: "Rule 9 - Bot Abuse", value: "rule9" })
        .addChoices({ name: "Rule 10 - Illegal Software", value: "rule10" })
        .addChoices({ name: "Rule 11 - Rule Updates", value: "rule11" })
        .addChoices({ name: "Rule 12 - Use English", value: "rule12" })
        .addChoices({
          name: "Rule 13 - Discord ToS / Community Guidelines",
          value: "rule13",
        })
        .addChoices({ name: "Rule 14 - Other", value: "rule14" })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("details")
        .setDescription("Add details to the kick if necessary.")
    ),

  async execute(interaction) {
    const { client, guild } = interaction;
    let user = await interaction.options.getUser("user");
    let member =
      (await interaction.guild.members.cache.get(user.id)) ||
      (await interaction.guild.members.fetch(user.id).catch((err) => {}));
    let rule = interaction.options.getString("rule");
    let details = interaction.options.getString("details");
    let time = ms(interaction.options.getString("time"));
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
            title: "Punishment System",
            description: "Couldn't get details from the given user input!",
            timestamp: new Date().toISOString(),
          },
        ],
        ephemeral: true,
      });

    if (member.user.id === client.user.id)
      return interaction.reply({
        embeds: [
          {
            color: 0xf04a47,
            title: "Punishment System",
            description: "can you even timeout a discord bot...",
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
            title: "Punishment System",
            description:
              "You can't timeout someone with a role higher than yours!",
          },
        ],
        ephemeral: true,
      });

    if (!time)
      return interaction.reply({
        embeds: [
          {
            color: 0xf04a47,
            title: "Punishment System",
            description: "The time you provided is not valid!",
          },
        ],
        ephemeral: true,
      });

    await interaction.reply({
      embeds: [
        {
          color: 0x43b582,
          description: `<:botSuccess:956980119086465124> ***${user.tag} was timed out*** | ${reason}`,
        },
      ],
    });
    await user.send({
      embeds: [
        {
          color: 0xf04a47,
          description: `You were timed out from ${guild.name} | ${reason}`,
        },
        {
          color: 0xffc916,
          title: rules[rule].name,
          description: rules[rule].description,
        },
      ],
    });
    await member.timeout(time, reason);
  },
};
