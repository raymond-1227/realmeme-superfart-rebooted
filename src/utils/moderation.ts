import {
  type APIApplicationCommandOptionChoice,
  type ChatInputCommandInteraction,
  type Client,
  type GuildMember,
  MessageFlags,
  type SlashCommandStringOption,
} from "discord.js";
import { rules, type RuleKey } from "../config/data.js";
import { requireEnv } from "../config/env.js";

export const RULE_CHOICES: readonly APIApplicationCommandOptionChoice<RuleKey>[] = [
  { name: "Rule 1 - Pings", value: "rule1" },
  { name: "Rule 2 - NSFW", value: "rule2" },
  { name: "Rule 3 - Insults", value: "rule3" },
  { name: "Rule 4 - Spam", value: "rule4" },
  { name: "Rule 5 - Impersonation", value: "rule5" },
  { name: "Rule 6 - Doxxing", value: "rule6" },
  { name: "Rule 7 - Advertisements", value: "rule7" },
  { name: "Rule 8 - Repetitive Question", value: "rule8" },
  { name: "Rule 9 - Off Topic", value: "rule9" },
  { name: "Rule 10 - Bot Abuse", value: "rule10" },
  { name: "Rule 11 - Illegal Software", value: "rule11" },
  { name: "Rule 12 - Rule Updates", value: "rule12" },
  { name: "Rule 13 - Use English", value: "rule13" },
  { name: "Rule 14 - Discord ToS / Community Guidelines", value: "rule14" },
  { name: "Rule 15 - Other", value: "rule15" },
];

export function addRuleOption(
  option: SlashCommandStringOption,
  description: string,
): SlashCommandStringOption {
  return option
    .setName("rule")
    .setDescription(description)
    .addChoices(...RULE_CHOICES)
    .setRequired(true);
}

export function buildPunishmentReason(
  ruleKey: RuleKey,
  details: string | null,
): string {
  const rule = rules[ruleKey];
  return details ? `${rule.name}: ${details}` : rule.name;
}

export async function resolveTargetMember(
  interaction: ChatInputCommandInteraction<"cached">,
  userId: string,
): Promise<GuildMember | null> {
  return (
    interaction.guild.members.cache.get(userId) ??
    (await interaction.guild.members.fetch(userId).catch(() => null))
  );
}

export async function replyModerationError(
  interaction: ChatInputCommandInteraction<"cached">,
  message: string,
  includeTimestamp = false,
): Promise<void> {
  await interaction.reply({
    embeds: [
      {
        color: 0xf04a47,
        description: `<:botError:1279326378075885599> ${message}`,
        ...(includeTimestamp ? { timestamp: new Date().toISOString() } : {}),
      },
    ],
    flags: MessageFlags.Ephemeral,
  });
}

export async function sendPunishmentLog(
  client: Client,
  params: {
    userTag: string;
    actionPastTense: "banned" | "kicked" | "warned";
    ruleKey: RuleKey;
    details: string | null;
  },
): Promise<void> {
  const rule = rules[params.ruleKey];
  try {
    const logChannel = await client.channels.fetch(
      requireEnv("PUNISHMENT_LOG_CHANNEL_ID"),
    );

    if (logChannel?.isSendable()) {
      await logChannel.send({
        embeds: [
          {
            color: 0xf04a47,
            title: "Punishment System",
            description: `${params.userTag} was ${params.actionPastTense}.`,
            fields: [
              {
                name: "Rule Violated",
                value: rule.name,
              },
              {
                name: "Rule Description",
                value: rule.description,
              },
              {
                name: "Additional Details",
                value: params.details || "N/A",
              },
            ],
          },
        ],
      });
    }
  } catch (error) {
    console.error("Failed to send punishment log:", error);
  }
}
