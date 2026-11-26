import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { devices, isDeviceKey } from "../config/data.js";
import type { SlashCommand } from "../types/bot.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("telegram")
    .setDescription("Links to devices' Telegram groups.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addStringOption((option) =>
      option
        .setName("device")
        .setDescription("Select the device that you want to get the link for.")
        .addChoices(
          { name: "realme 1", value: "realme1" },
          { name: "realme 2 / C1", value: "realme2nc1" },
          { name: "realme 2 Pro", value: "realme2pro" },
          { name: "realme 3 / 3i", value: "realme3n3i" },
          { name: "realme 3 Pro", value: "realme3pro" },
          { name: "realme 5", value: "realme5" },
          {
            name: "realme 6 / 6s / 6i India / 7 / narzo 20 Pro / 30 4G",
            value: "rm6785",
          },
          { name: "realme 6i Global", value: "realme6iglobal" },
          { name: "realme 7 Pro", value: "realme7pro" },
          { name: "realme C2", value: "realmec2" },
          { name: "realme C3 / Narzo 10A", value: "realmec3nnarzo10a" },
          { name: "realme C11 / C12 / C15", value: "realmec11nc12nc15" },
          { name: "realme GT Master", value: "realmegtmaster" },
          { name: "realme GT Neo 2", value: "realmegtneo2" },
          { name: "realme X2 Pro", value: "realmex2pro" },
          { name: "realme X3 / SuperZoom", value: "realmex3nsuperzoom" },
          { name: "realme X7 Max / GT Neo", value: "realmex7maxngtneo" },
          { name: "realme X50 Pro", value: "realmex50pro" },
        )
        .setRequired(true),
    ),

  async execute(interaction) {
    const deviceKey = interaction.options.getString("device", true);
    if (!isDeviceKey(deviceKey)) return;

    const device = devices[deviceKey];

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
              value: device.name,
            },
            {
              name: "Telegram Channel",
              value: device.channel || "N/A",
            },
            {
              name: "Telegram Group",
              value: device.group || "N/A",
            },
          ],
        },
      ],
    });
  },
};

export default command;
