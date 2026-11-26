import {
  REST,
  Routes,
  type RESTPutAPIApplicationGuildCommandsResult,
} from "discord.js";
import { requireEnv, validateDeployEnv } from "./config/env.js";
import { loadCommands } from "./loaders/commands.js";

validateDeployEnv();

const clientId = requireEnv("CLIENT_ID");
const guildId = requireEnv("GUILD_ID");
const token = requireEnv("DISCORD_BOT_TOKEN");

const loadedCommands = await loadCommands();
const body = [...loadedCommands.values()].map((command) =>
  command.data.toJSON(),
);

const rest = new REST().setToken(token);

try {
  console.log(
    `Started reloading ${body.length} guild application (/) commands.`,
  );

  const data = (await rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    { body },
  )) as RESTPutAPIApplicationGuildCommandsResult;

  console.log(
    `Successfully reloaded ${data.length} guild application (/) commands.`,
  );
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
