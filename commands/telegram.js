const { SlashCommandBuilder } = require("discord.js");
const { PermissionFlagsBits } = require("discord-api-types/v10");
const devices = require("../misc/devices.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("telegram")
    .setDescription("Links to devices' Telegram groups.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addStringOption((option) =>
      option
        .setName("device")
        .setDescription("Select the device that you want to get the link for.")
        .addChoices({ name: "realme 1", value: "realme1" })
        .addChoices({ name: "realme 2 / C1", value: "realme2nc1" })
        .addChoices({ name: "realme 2 Pro", value: "realme2pro" })
        .addChoices({ name: "realme 3 / 3i", value: "realme3n3i" })
        .addChoices({ name: "realme 3 Pro", value: "realme3pro" })
        .addChoices({ name: "realme 5", value: "realme5" })
        .addChoices({
          name: "realme 6 / 6s / 6i India / 7 / narzo 20 Pro / 30 4G",
          value: "rm6785",
        })
        .addChoices({ name: "realme 6i Global", value: "realme6iglobal" })
        .addChoices({ name: "realme 7 Pro", value: "realme7pro" })
        .addChoices({ name: "realme C2", value: "realmec2" })
        .addChoices({
          name: "realme C3 / Narzo 10A",
          value: "realmec3nnarzo10a",
        })
        .addChoices({
          name: "realme C11 / C12 / C15",
          value: "realmec11nc12nc15",
        })
        .addChoices({ name: "realme GT Master", value: "realmegtmaster" })
        .addChoices({ name: "realme GT Neo 2", value: "realmegtneo2" })
        .addChoices({ name: "realme X2 Pro", value: "realmex2pro" })
        .addChoices({ name: "realme GT Master", value: "realmegtmaster" })
        .addChoices({
          name: "realme X3 / SuperZoom",
          value: "realmex3nsuperzoom",
        })
        .addChoices({
          name: "realme X7 Max / GT Neo",
          value: "realmex7maxngtneo",
        })
        .addChoices({ name: "realme X50 Pro", value: "realmex50pro" })
        .setRequired(true)
    ),

  async execute(interaction) {
    let device = interaction.options.getString("device");

    await interaction.reply({
      embeds: [
        {
          color: 0xffc916,
          title: "Telegram Links",
          description:
            "Here are the Telegram links for the device you selected!",
          fields: [
            {
              name: "Device(s)",
              value: devices[device].name,
            },
            {
              name: "Telegram Channel",
              value: devices[device].channel || "N/A",
            },
            {
              name: "Telegram Group",
              value: devices[device].group || "N/A",
            },
          ],
        },
      ],
    });
  },
};
