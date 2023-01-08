const { SlashCommandBuilder } = require("discord.js");
// NOTE: THIS DOCUMENTION IS STILL UNDER CONSTRUCTION, DO NOT USE IT YET.
module.exports = {
  data: new SlashCommandBuilder()
    .setName("adbsetup")
    .setDescription(
      "Learn how you can setup platform tools on your computer for further phone tweaking."
    ),
  async execute(interaction) {
    interaction.reply({
      embeds: [
        {
          color: 0xffc916,
          title: "How to setup Platform Tools",
          description: "Here are different ways to setup Platform Tools (most users make use of ADB inside the package):",
          fields: [
            {
              name: "For Windows Users",
              value: [
                "1. Download [Platform Tools](https://dl.google.com/android/repository/platform-tools-latest-windows.zip)",
                "2. Unzip the file you just downloaded",
                "3. Place the unzipped folder in `C:\\`",
                "4. Enable USB Debugging on your phone via developer options",
                "5. Connect your phone to your computer in MTP (file transfer) mode",
                "6. Open the Command Prompt",
                "7. Execute the following commands:",
                "```\ncd \\platform-tools\n```",
                "```\nadb devices\n```",
                "8. Check the popup on your phone, tick Always Allow, and tap Allow",
              ].join("\n"),
            },
            {
              name: "For Linux Users",
              value: [
                "1. Download [Platform Tools](https://dl.google.com/android/repository/platform-tools-latest-linux.zip)",
                "2. Unzip the file you just downloaded",
                "3. Enable USB Debugging on your phone via developer options",
                "4. Connect your phone to your computer in MTP (file transfer) mode",
                "5. Open your terminal",
                "6. Execute the following commands:",
                "```\nsudo usermod -aG plugdev $USERNAME``` (Replace `$USERNAME` with your username)\n",
                "```\ncd /path/to/extracted/platform-tools\n```",
                "```\nadb devices\n```",
                "7. Check the popup on your phone, tick Always Allow, and tap Allow",
                "8. OPTIONAL: Add to path (.zshrc, .bashrc)\n",
                "```\nanno $SHELLCONFIG\n```",
                "Now add\n```export PATH=\"$PATH:*adbinstall*\"```\n",
                "Save your changes using Ctrl+X",
                
                
              ].join("\n"),
            },
            {
              name: "For macOS users",
              value: [
                "1. Open Terminal",
                "2. Execute the following commands:",
                "```\n/bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.)\"\n```",
                "```\nbrew install --cask android-platform-tools\n```",
                "3. Connect your phone to your computer in MTP (file transfer) mode",
                "4. Execute the following commands:",
                "```\nadb devices\n```",
                "5. Check the popup on your phone, tick Always Allow, and tap Allow",
              ].join("\n"),
            },
          ],
        },
      ],
    });
  },
};