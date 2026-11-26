import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { Client, ClientEvents } from "discord.js";
import { EVENTS_DIR } from "../config/paths.js";
import type { BotEvent } from "../types/bot.js";

function isBotEvent(value: unknown): value is BotEvent<keyof ClientEvents> {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.name === "string" &&
    typeof candidate.execute === "function"
  );
}

function registerEvent<K extends keyof ClientEvents>(
  client: Client,
  event: BotEvent<K>,
): void {
  const listener = (...args: ClientEvents[K]): void => {
    void Promise.resolve(event.execute(...args)).catch((error: unknown) => {
      console.error(`[EVENT] Unhandled error in ${String(event.name)}:`, error);
    });
  };

  if (event.once) {
    client.once(event.name, listener);
  } else {
    client.on(event.name, listener);
  }
}

export async function loadEvents(client: Client): Promise<void> {
  const entries = fs
    .readdirSync(EVENTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    const filePath = path.join(EVENTS_DIR, entry.name);
    const imported: unknown = await import(pathToFileURL(filePath).href);
    const event =
      typeof imported === "object" && imported !== null && "default" in imported
        ? (imported as { default: unknown }).default
        : undefined;

    if (isBotEvent(event)) {
      registerEvent(client, event);
    } else {
      console.warn(
        `[WARNING] The event at ${filePath} is missing a required "name" or "execute" property.`,
      );
    }
  }
}
