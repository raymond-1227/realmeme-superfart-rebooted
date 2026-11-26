import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types/bot.js";

type PhoneSeriesKey = "iphone" | "pixel" | "galaxy";

const PHONE_SERIES: Record<
  PhoneSeriesKey,
  { phoneName: string; videoUrl: string; guideUrl: string }
> = {
  iphone: {
    phoneName: "iPhone",
    videoUrl: "https://www.youtube.com/watch?v=8GDkLsR1ErI",
    guideUrl: "https://www.apple.com/iphone/switch",
  },
  pixel: {
    phoneName: "Pixel",
    videoUrl: "https://www.youtube.com/watch?v=dVE76JOrOcQ",
    guideUrl:
      "https://guidebooks.google.com/pixel/transfer-your-data/how-to-switch-from-android",
  },
  galaxy: {
    phoneName: "Galaxy",
    videoUrl: "https://www.youtube.com/watch?v=91pDaubXd5E",
    guideUrl: "https://www.samsung.com/us/support/switch-to-galaxy/android",
  },
};

function isPhoneSeriesKey(value: string): value is PhoneSeriesKey {
  return Object.hasOwn(PHONE_SERIES, value);
}

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("switch")
    .setDescription("Fuck realme, you deserve a better choice.")
    .addStringOption((option) =>
      option
        .setName("series")
        .setDescription("Select a phone to switch to!")
        .addChoices(
          { name: "Apple iPhone", value: "iphone" },
          { name: "Google Pixel", value: "pixel" },
          { name: "Samsung Galaxy", value: "galaxy" },
        )
        .setRequired(true),
    ),

  async execute(interaction) {
    const choice = interaction.options.getString("series", true);
    if (!isPhoneSeriesKey(choice)) return;

    const { phoneName, videoUrl, guideUrl } = PHONE_SERIES[choice];

    await interaction.reply({
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

export default command;
