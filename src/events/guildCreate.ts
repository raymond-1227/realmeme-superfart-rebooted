import { Events } from "discord.js";
import { requireEnv } from "../config/env.js";
import { defineEvent } from "../types/bot.js";

export default defineEvent({
  name: Events.GuildCreate,
  async execute(guild) {
    if (guild.id !== requireEnv("GUILD_ID")) {
      console.log(`Leaving unauthorized guild: ${guild.name} (${guild.id})`);
      await guild.leave();
    }
  },
});
