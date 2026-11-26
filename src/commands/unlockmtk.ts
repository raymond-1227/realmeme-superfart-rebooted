import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types/bot.js";

type OsKey = "windows" | "macos" | "linux";

const OS_GUIDES: Record<OsKey, { osName: string; steps: readonly string[] }> = {
  windows: {
    osName: "Windows",
    steps: [
      "1. Install [Python](https://www.python.org/downloads/windows)",
      "2. Install [Git SCM](https://git-scm.com/download/win) (Optional)",
      "3. Install [UsbDk](https://github.com/daynix/UsbDk/releases)",
      "4. Open Command Prompt",
      "5. Execute the following commands:",
      "```git clone https://github.com/bkerler/mtkclient.git```",
      "**OR** download from [GitHub](https://github.com/bkerler/mtkclient/archive/refs/tags/2.0.1.zip)",
      "```cd mtkclient```",
      "```pip3 install -r requirements.txt```",
      "```py mtk da seccfg unlock```",
      "6. Connect your device in BROM mode by holding down both volume buttons and connect the USB cable",
    ],
  },
  macos: {
    osName: "macOS",
    steps: [
      "1. Open Terminal",
      "2. Execute the following commands:",
      "```brew install python3 git libusb``` (Git is optional)",
      "```git clone https://github.com/bkerler/mtkclient.git```",
      "**OR** download from [GitHub](https://github.com/bkerler/mtkclient/archive/refs/tags/2.0.1.zip)",
      "```cd mtkclient```",
      "```pip3 install -r requirements.txt```",
      "```python3 setup.py build```",
      "```python3 setup.py install```",
      "```py mtk da seccfg unlock```",
      "3. Connect your device in BROM mode by holding down both volume buttons and connect the USB cable",
    ],
  },
  linux: {
    osName: "Linux",
    steps: [
      "Note: As for now, the tutorial is only available for Debian-based Linux distributions.",
      "1. Open Command Prompt",
      "2. Execute the following commands:",
      "```sudo apt install python3 git libusb-1.0-0 python3-pip``` (Git is optional)",
      "```git clone https://github.com/bkerler/mtkclient.git```",
      "**OR** download from [GitHub](https://github.com/bkerler/mtkclient/archive/refs/tags/2.0.1.zip)",
      "```cd mtkclient```",
      "```pip3 install -r requirements.txt```",
      "```python3 setup.py build```",
      "```python3 setup.py install```",
      "```py mtk da seccfg unlock```",
      "3. Connect your device in BROM mode by holding down both volume buttons and connect the USB cable",
    ],
  },
};

function isOsKey(value: string): value is OsKey {
  return Object.hasOwn(OS_GUIDES, value);
}

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("unlockmtk")
    .setDescription(
      "Gives you information about how you can unlock bootloader for MTK chipset devices.",
    )
    .addStringOption((option) =>
      option
        .setName("os")
        .setDescription("Select your operating system!")
        .addChoices(
          { name: "Microsoft Windows", value: "windows" },
          { name: "Apple macOS", value: "macos" },
          { name: "Linux", value: "linux" },
        )
        .setRequired(true),
    ),
  async execute(interaction) {
    const choice = interaction.options.getString("os", true);
    if (!isOsKey(choice)) return;

    const { osName, steps } = OS_GUIDES[choice];

    await interaction.reply({
      embeds: [
        {
          color: 0xffc916,
          title: `How to Unlock Bootloader with MTKClient on ${osName}`,
          description: [
            "Here's how you can unlock your bootloader using MTKClient.",
            steps.join("\n"),
          ].join("\n"),
          footer: {
            text: "*Disclaimer: I'm not responsible for your issues, please unlock carefully.*",
          },
        },
      ],
    });
  },
};

export default command;
