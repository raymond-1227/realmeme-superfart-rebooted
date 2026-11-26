import {
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import { isRuleKey, rules } from "../config/data.js";
import type { SlashCommand } from "../types/bot.js";
import {
  addRuleOption,
  buildPunishmentReason,
  replyModerationError,
  resolveTargetMember,
  sendPunishmentLog,
} from "../utils/moderation.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warns the user in the server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setContexts(InteractionContextType.Guild)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to warn")
        .setRequired(true),
    )
    .addStringOption((option) =>
      addRuleOption(option, "Select a rule for why you are warning the user"),
    )
    .addStringOption((option) =>
      option
        .setName("details")
        .setDescription("Add details to the warning if necessary"),
    ),

  async execute(interaction) {
    const { client, guild } = interaction;
    const user = interaction.options.getUser("user", true);
    const member = await resolveTargetMember(interaction, user.id);
    const rule = interaction.options.getString("rule", true);
    if (!isRuleKey(rule)) return;

    const details = interaction.options.getString("details");
    const reason = buildPunishmentReason(rule, details);

    if (!member) {
      await replyModerationError(
        interaction,
        "Couldn't get details from the given user input",
      );
      return;
    }

    if (member.user.id === client.user.id) {
      await replyModerationError(interaction, "HEY DON'T WARN ME!!!!111!!11");
      return;
    }

    if (
      interaction.member.roles.highest.position <= member.roles.highest.position
    ) {
      await replyModerationError(
        interaction,
        "You can't warn someone with a role higher than yours",
      );
      return;
    }

    await interaction.reply({
      embeds: [
        {
          color: 0x43b582,
          description: `<:botSuccess:1279326365191114784> ***${user.tag} was warned.***`,
        },
      ],
    });

    await user
      .send({
        embeds: [
          {
            color: 0xf04a47,
            description: `You were warned in ${guild.name} for ${reason}`,
          },
          {
            color: 0xffc916,
            title: rules[rule].name,
            description: rules[rule].description,
          },
        ],
      })
      .catch((error: unknown) => {
        console.error(`Could not send DM to ${user.tag}.\n`, error);
      });

    await sendPunishmentLog(client, {
      userTag: user.tag,
      actionPastTense: "warned",
      ruleKey: rule,
      details,
    });
  },
};

export default command;
