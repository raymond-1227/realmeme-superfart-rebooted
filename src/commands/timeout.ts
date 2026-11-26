import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import ms, { type StringValue } from "ms";
import { isRuleKey, rules } from "../config/data.js";
import type { SlashCommand } from "../types/bot.js";
import {
  addRuleOption,
  buildPunishmentReason,
  replyModerationError,
  resolveTargetMember,
} from "../utils/moderation.js";

const MAX_TIMEOUT_MS = 28 * 24 * 60 * 60 * 1000;

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user from interacting with the server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to timeout")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("Set a time for the timeout")
        .setRequired(true),
    )
    .addStringOption((option) =>
      addRuleOption(
        option,
        "Select a rule for why you are timing out the user",
      ),
    )
    .addStringOption((option) =>
      option
        .setName("details")
        .setDescription("Add details to the timeout if necessary"),
    ),

  async execute(interaction) {
    const { client, guild } = interaction;
    const user = interaction.options.getUser("user", true);
    const member = await resolveTargetMember(interaction, user.id);
    const rule = interaction.options.getString("rule", true);
    if (!isRuleKey(rule)) return;

    const details = interaction.options.getString("details");
    const reason = buildPunishmentReason(rule, details);

    const rawTime = interaction.options.getString("time", true);
    const time = ms(rawTime as StringValue);

    if (!member) {
      await replyModerationError(
        interaction,
        "Couldn't get details from the given user input!",
        true,
      );
      return;
    }

    if (member.user.id === client.user.id) {
      await replyModerationError(
        interaction,
        "bruh why are you trying to timeout a discord bot",
      );
      return;
    }

    if (!member.moderatable) {
      await replyModerationError(interaction, "I can't timeout that user");
      return;
    }

    if (
      interaction.member.roles.highest.position <= member.roles.highest.position
    ) {
      await replyModerationError(
        interaction,
        "You can't timeout someone with a role higher than yours",
      );
      return;
    }

    if (
      typeof time !== "number" ||
      !Number.isFinite(time) ||
      time <= 0 ||
      time > MAX_TIMEOUT_MS
    ) {
      await replyModerationError(
        interaction,
        "The time you provided is not valid",
      );
      return;
    }

    await interaction.reply({
      embeds: [
        {
          color: 0x43b582,
          description: `<:botSuccess:1279326365191114784> ***${user.tag} was timed out*** | ${reason}`,
        },
      ],
    });

    await user
      .send({
        embeds: [
          {
            color: 0xf04a47,
            description: `You were timed out from ${guild.name} for ${reason}`,
          },
          {
            color: 0xffc916,
            title: rules[rule].name,
            description: rules[rule].description,
          },
        ],
      })
      .catch((error: unknown) => {
        console.error(`Could not send DM to ${user.tag}.`, error);
      });

    await member.timeout(time, reason);
  },
};

export default command;
