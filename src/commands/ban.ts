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
    .setName("ban")
    .setDescription("Bans the user from the server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setContexts(InteractionContextType.Guild)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to ban")
        .setRequired(true),
    )
    .addStringOption((option) =>
      addRuleOption(option, "Select a rule for why you are banning the user"),
    )
    .addStringOption((option) =>
      option
        .setName("details")
        .setDescription("Add details to the ban if necessary"),
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
      await replyModerationError(interaction, "HEY DON'T BAN ME!!!!111!!11");
      return;
    }

    if (!member.bannable) {
      await replyModerationError(interaction, "I can't ban that user");
      return;
    }

    if (
      interaction.member.roles.highest.position <= member.roles.highest.position
    ) {
      await replyModerationError(
        interaction,
        "You can't ban someone with a role higher than yours",
      );
      return;
    }

    await interaction.reply({
      embeds: [
        {
          color: 0x43b582,
          description: `<:botSuccess:1279326365191114784> ***${user.tag} was banned.***`,
        },
      ],
    });

    await user
      .send({
        embeds: [
          {
            color: 0xf04a47,
            description: `You were banned from ${guild.name} | ${reason}`,
          },
          {
            color: 0xffc916,
            title: rules[rule].name,
            description: rules[rule].description,
          },
          {
            color: 0xffc916,
            description:
              "Appeal the ban: <https://forms.gle/nUdK1PsqJx1Lwtq56>",
          },
        ],
      })
      .catch((error: unknown) => {
        console.error(error);
      });

    await member.ban({ reason });

    await sendPunishmentLog(client, {
      userTag: user.tag,
      actionPastTense: "banned",
      ruleKey: rule,
      details,
    });
  },
};

export default command;
