import {
  REST,
  Routes,
  type RESTGetAPIApplicationGuildCommandsResult,
} from "discord.js";
import { requireEnv, validateDeployEnv } from "./config/env.js";

validateDeployEnv();

const clientId = requireEnv("CLIENT_ID");
const guildId = requireEnv("GUILD_ID");
const token = requireEnv("DISCORD_BOT_TOKEN");

const rest = new REST().setToken(token);

try {
  console.log("Started removing guild application (/) commands.");

  const data = (await rest.get(
    Routes.applicationGuildCommands(clientId, guildId),
  )) as RESTGetAPIApplicationGuildCommandsResult;

  await Promise.all(
    data.map((command) =>
      rest.delete(
        Routes.applicationGuildCommand(clientId, guildId, command.id),
      ),
    ),
  );

  console.log("Successfully removed guild application (/) commands.");
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
