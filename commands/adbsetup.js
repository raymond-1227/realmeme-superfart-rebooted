const { SlashCommandBuilder } = require("discord.js");
// NOTE: THIS DOCUMENTION IS STILL UNDER CONSTRUCTION, DO NOT USE IT YET.
module.exports = {
  data: new SlashCommandBuilder()
    .setName("adbsetup")
    .setDescription(
      "Learn how you can setup platform tools on your computer for further phone tweaking."
    )
    .addStringOption((option) =>
      option
        .setName("os")
        .setDescription("Select your operating system!")
        .addChoices({ name: "Microsoft Windows", value: "windows" })
        .addChoices({ name: "Apple macOS", value: "macos" })
        .addChoices({ name: "Linux", value: "linux" })
        .setRequired(true)
    ),
  async execute(interaction) {
    let choice = interaction.options.getString("os");
    let osName;
    let steps;
    if (choice === "windows") {
      osName = "Windows";
      steps = [
        "1. Download [Platform Tools](https://dl.google.com/android/repository/platform-tools-latest-windows.zip)",
        "2. Unzip the file you just downloaded",
        "3. Place the unzipped folder in `C:\\`",
        "4. Enable USB Debugging on your phone via developer options",
        "5. Connect your phone to your computer in MTP (file transfer) mode",
        "6. Open the Command Prompt",
        "7. Execute the following commands:",
        "```cd \\platform-tools```",
        "```adb devices```",
        "8. Check the popup on your phone, tick Always Allow, and tap Allow",
      ];
    } else if (choice === "macos") {
      osName = "macOS";
      steps = [
        "1. Open Terminal",
        "2. Execute the following commands:",
        '```/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"```',
        "```brew install --cask android-platform-tools```",
        "3. Connect your phone to your computer in MTP (file transfer) mode",
        "4. Execute the following commands:",
        "```adb devices```",
        "5. Check the popup on your phone, tick Always Allow, and tap Allow",
      ];
    } else if (choice === "linux") {
      osName = "Linux";
      steps = [
        "1. Download [Platform Tools](https://dl.google.com/android/repository/platform-tools-latest-linux.zip)",
        "2. Unzip the file you just downloaded",
        "3. Enable USB Debugging on your phone via developer options",
        "4. Connect your phone to your computer in MTP (file transfer) mode",
        "5. Open your terminal",
        "6. Execute the following commands:",
        "```sudo usermod -aG plugdev $USERNAME``` (Replace `$USERNAME` with your username)\n",
        "```cd /path/to/extracted/platform-tools```",
        "```adb devices```",
        "7. Check the popup on your phone, tick Always Allow, and tap Allow",
        "OPTIONAL: Add to path (.zshrc, .bashrc)",
        "```anno $SHELLCONFIG```",
        '```export PATH="$PATH:*adbinstall*"```',
        "Save your changes using Ctrl+X",
      ];
    }
    interaction.reply({
      embeds: [
        {
          color: 0xffc916,
          title: `How to setup Platform Tools on ${osName}`,
          description: [
            "Here are steps ways to setup Platform Tools (most users make use of ADB inside the package):",
            steps.join("\n"),
          ].join("\n"),
        },
      ],
    });
  },
};
