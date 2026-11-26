import { Client, GatewayIntentBits, Partials } from "discord.js";
import { requireEnv, validateBotEnv } from "./config/env.js";
import { loadCommands } from "./loaders/commands.js";
import { loadEvents } from "./loaders/events.js";
import { loadMessageHandlers } from "./loaders/messages.js";

validateBotEnv();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  allowedMentions: {
    parse: ["users", "roles"],
    repliedUser: true,
  },
});

client.commands = await loadCommands();
client.messages = await loadMessageHandlers();
await loadEvents(client);

console.log("Ready event listeners:", {
  ready: client.listenerCount("ready"),
  clientReady: client.listenerCount("clientReady"),
});

await client.login(requireEnv("DISCORD_BOT_TOKEN"));
