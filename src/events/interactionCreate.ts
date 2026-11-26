import { Events, MessageFlags } from "discord.js";
import { defineEvent } from "../types/bot.js";

export default defineEvent({
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    if (!interaction.inCachedGuild()) {
      await interaction.reply({
        embeds: [
          {
            color: 0xf04a47,
            description:
              "This bot only intends to work for r/realme, not in DMs.\nPlease use the bot in the server: https://discord.gg/5D6UPMTdjy",
          },
        ],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);

      const errorPayload = {
        embeds: [
          {
            color: 0x0ccab6,
            title: "Error Occurred",
            description:
              "There was an error while executing this command!\n```" +
              String(error) +
              "```",
          },
        ],
        content: "",
        flags: MessageFlags.Ephemeral as const,
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorPayload).catch(console.error);
      } else {
        await interaction.reply(errorPayload).catch(console.error);
      }
    }
  },
});
