import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Collection } from "discord.js";
import { COMMANDS_DIR } from "../config/paths.js";
import type { SlashCommand } from "../types/bot.js";

function isSlashCommand(value: unknown): value is SlashCommand {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  const data = candidate.data as Record<string, unknown> | undefined;
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.name === "string" &&
    typeof data.toJSON === "function" &&
    typeof candidate.execute === "function"
  );
}

export async function loadCommands(): Promise<Collection<string, SlashCommand>> {
  const commands = new Collection<string, SlashCommand>();
  const entries = fs
    .readdirSync(COMMANDS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    const filePath = path.join(COMMANDS_DIR, entry.name);
    const imported: unknown = await import(pathToFileURL(filePath).href);
    const command =
      typeof imported === "object" && imported !== null && "default" in imported
        ? (imported as { default: unknown }).default
        : undefined;

    if (isSlashCommand(command)) {
      commands.set(command.data.name, command);
    } else {
      console.warn(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }

  return commands;
}
