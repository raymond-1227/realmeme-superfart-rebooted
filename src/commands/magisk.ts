import axios from "axios";
import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types/bot.js";

interface GitHubReleaseAsset {
  name: string;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  assets: GitHubReleaseAsset[];
}

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("magisk")
    .setDescription("Gives you information about the latest Magisk."),
  async execute(interaction) {
    const response = await axios.get<GitHubRelease>(
      "https://api.github.com/repos/topjohnwu/Magisk/releases/latest",
    );
    const body = response.data;
    const primaryAsset = body.assets[0];
    const downloadLink = primaryAsset
      ? `[${primaryAsset.name}](${primaryAsset.browser_download_url})`
      : "Unavailable";

    await interaction.reply({
      embeds: [
        {
          color: 0xffc916,
          title: "How To Magisk",
          description:
            "Have fun rooting! \n *(Disclaimer: I'm not responsible for your issues, please root carefully.)*",
          fields: [
            {
              name: "Magisk Version (Latest)",
              value: body.tag_name,
            },
            {
              name: "Download Link",
              value: downloadLink,
            },
            {
              name: "Installation",
              value: [
                "1. Download the APK via the link",
                "2. Rename the `.APK` file to `.ZIP` extension",
                "3. Flash it in TWRP/OrangeFox",
                "4. Reboot",
                "5. Open Magisk Manager",
                "6. Go to settings",
                "7. Enable Zygisk",
                "8. Download SafetyNetFix module",
                "9. Install module in Magisk Manager",
              ].join("\n"),
            },
            {
              name: "Root detection",
              value: [
                "Some apps might detect Magisk and refuse to work. Please perform these steps if that happens:",
                "1. Open Magisk Manager",
                "2. Go to settings",
                "3. Go to DenyList",
                "4. Tick the app(s) which detects root",
                "(You might need to clear the app's data and cache, too.)",
              ].join("\n"),
            },
            {
              name: "Uninstalling",
              value: [
                "Magisk Manager:",
                "1. Uninstall via Magisk Manager",
                "2. Follow further steps within the app",
                "Custom Recoveries:",
                "1. Rename the Magisk installer to `uninstaller.zip`",
                "2. Flash it in your custom recovery",
                "3. Reboot",
              ].join("\n"),
            },
            {
              name: "If you bootloop...",
              value: [
                "1. Reboot to recovery by holding Volume up and Power to reboot",
                "2. Install the Magisk_Uninstaller.zip file",
                "3. Try installing the Magisk zip file instead as the FALLBACK OPTION",
              ].join("\n"),
            },
          ],
        },
      ],
    });
  },
};

export default command;
