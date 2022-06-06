const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("faq")
    .setDescription("Get a bunch of frequently asked questions and their answers."),
  async execute(interaction) {
    interaction.reply({
      embeds: [
        {
          color: "RANDOM",
          title: "**realme FAQs**",
          description: "Here are some questions you might ask!",
          fields: [
            {
              name: "I installed a custom ROM but I am bootlooping/stuck on the boot animation.",
              value: "Boot to recovery and format data.",
            },
            {
              name: "How do I create a backup?",
              value:
                "Boot to recovery, select Backup, select **every** partition, and swipe. We strongly recommend copying the Fox/TWRP folder to a PC for safe keeping afterwards.",
            },
            {
              name: "My phone in TWRP does not show up on PC when I plug it in",
              value:
                "Go to the home screen of TWRP, tap Mount and tap Disable MTP, then Enable MTP.",
            },
            {
              name: "How do I update a custom ROM or realme UI safely?",
              value:
                "**1.** Make a backup\n**2.** Install the latest zip or ozip\n**3.** When successful, tap **Wipe Cache / Dalvik**.\n**4.** If you are on a custom ROM, you may need to flash Magisk or Google Apps (GApps) again.",
            },
            {
              name: "How do I backup my apps and app data if I want to change ROMs or back to realme UI?",
              value:
                "You can use Migrate from the Google Play Store, once you open the app, it will give you instructions, you need root access for Migrate.",
            },
            {
              name: "(SafetyNet) How do I access my banking apps or other apps that block me from using them when rooted?",
              value: "Type `/magisk` to find out.",
            },
            {
              name: "How do I force 90Hz in apps in realme UI?",
              value:
                "Run this command in ADB (You need to do this every reboot): `su -c service call SurfaceFlinger 1035 i32 0`",
            },
            {
              name: "How do I theme apps?",
              value: "Use Swift Installer (Requires root)",
            },
            {
              name: "Which devices get support for how long?",
              value:
                "Most realme devices should get 2 years of support (which includes 2 major system upgrades, e.g. Android 10-12), but some devices may get 1 year of support.",
            },
            {
              name: "Should I debloat realme UI?",
              value:
                "It is not recommended to debloat realme UI as it can break a lot of functions of it, and in some cases you wont be able to boot into realme UI until you factory reset through recovery mode.",
            },
            {
              name: "How do I force reboot my device?",
              value: "Hold the volume up and power buttons.",
            },
          ],
        },
      ],
      ephemeral: true,
    });
  },
};
