const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("flicker")
    .setDescription("What it means when your phone flickers."),
  async execute(interaction) {
    await interaction.reply({
      embeds: [
        {
          color: 0xffc916,
          title: "How to reset OTA updater?",
          description:
            "Congratulations, you've debloated the weather service (`com.coloros.weather.service`) which causes the lock screen to flicker. You may want to try reinstall the .ozip file but if that doesn't work, you have no choice other than to format data.\nHowever, if your phone has the MediaTek chipset, chances are that ADB root will work in stock recovery, allowing you to pull your data before formatting.",
          fields: [
            {
              name: "Important Notice",
              value:
                'Assuming that you\'ve ticked "Always allow" on ADB prompt while your system was still working, then you may proceed.',
            },
            {
              name: "Instructions",
              value: [
                "Run the following commands on ADB shell:",
                "1. Enter recovery by force shutdown the phone (hold down `volume up` + `power button`) and as soon as the phone goes off, enter the recovery mode (by holding down `volume down` + `power button`)",
                "2. On your terminal / command prompt, enter the following commands:",
                "```sh\nadb kill-server\n```",
                "```sh\nadb root\n```",
                '3. Now, to pull your data, you have to decrypt it by choosing "install from storage" on the recovery menu and enter your password.',
                "4. Pull your data by this command:",
                "```sh\nadb pull /data/media/0\n```",
                "5. That's it! Note that this only pull your files that is stored on internal storage, not app data. You can now format data.",
              ].join("\n"),
            },
          ],
        },
      ],
    });
  },
};
