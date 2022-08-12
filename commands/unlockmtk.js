const { SlashCommandBuilder } = require("discord.js");
// NOTE: THIS DOCUMENTION IS STILL UNDER CONSTRUCTION, DO NOT USE IT YET.
module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlockmtk")
    .setDescription(
      "Gives you information about how you can unlock bootloader for MTK chipset devices."
    ),
  async execute(interaction) {
    interaction.reply({
      embeds: [
        {
          color: 0xffc916,
          title: "MTK Bootloader Unlock",
          description:
            "Have fun unlocking bootloader! \n *(Disclaimer: I'm not responsible for your issues, please unlock carefully.)*",
          fields: [
            {
              name: "For Windows users",
              value: [
                "1. Install [Python](https://www.python.org/downloads/windows)",
                "2. Install [Git SCM](https://git-scm.com/download/win) (Optional)",
                "3. Install [UsbDk](https://github.com/daynix/UsbDk/releases)",
                "4. Open Command Prompt",
                "5. Execute the following commands:",
                "```\ngit clone https://github.com/bkerler/mtkclient.git\n**OR**\nDownload from (https://github.com/bkerler/mtkclient/archive/refs/tags/1.52.zip)[github]\n```",
                "```\ncd mtkclient\n```",
                "```\npip3 install -r requirements.txt\n```",
                "```\npy mtk da seccfg unlock\n```",
                "6. Connect your device in BROM mode by holding down both volume buttons and connect the USB cable",
              ].join("\n"),
            },
            {
              name: "For Linux users (Ubuntu's recommended as author said)",
              value: [
                "*(Note: I will only provide how to install for Ubuntu as for now)*",
                "1. Open Command Prompt",
                "2. Execute the following commands:",
                "```\nsudo apt install python3 git libusb-1.0-0 python3-pip\n``` (Git is optional)",
                "```\ngit clone https://github.com/bkerler/mtkclient.git\n**OR**\nDownload from (https://github.com/bkerler/mtkclient/archive/refs/tags/1.52.zip)[github]\n```",
                "```\ncd mtkclient\n```",
                "```\npip3 install -r requirements.txt\n```",
                "```\npython3 setup.py build\n```",
                "```\npython3 setup.py install\n```",
                "```\npy mtk da seccfg unlock\n```",
                "3. Connect your device in BROM mode by holding down both volume buttons and connect the USB cable",
              ].join("\n"),
            },
            {
              name: "For macOS users",
              value: [
                "1. Open Terminal",
                "5. Execute the following commands:",
                "```\nbrew install python3 git libusb\n``` (Git is optional)",
                "```\ngit clone https://github.com/bkerler/mtkclient.git\n**OR**\nDownload from (https://github.com/bkerler/mtkclient/archive/refs/tags/1.52.zip)[github]\n```",
                "```\ncd mtkclient\n```",
                "```\npip3 install -r requirements.txt\n```",
                "```\npython3 setup.py build\n```",
                "```\npython3 setup.py install\n```",
                "```\npy mtk da seccfg unlock\n```",
                "6. Connect your device in BROM mode by holding down both volume buttons and connect the USB cable",
              ].join("\n"),
            },
          ],
        },
      ],
    });
  },
};
