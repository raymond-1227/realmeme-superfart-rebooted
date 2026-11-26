import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Collection } from "discord.js";
import { MESSAGES_DIR } from "../config/paths.js";
import type { MessageHandler } from "../types/bot.js";

function isMessageHandler(value: unknown): value is MessageHandler {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.match === "function" &&
    typeof candidate.execute === "function"
  );
}

export async function loadMessageHandlers(): Promise<
  Collection<string, MessageHandler>
> {
  const handlers = new Collection<string, MessageHandler>();
  const entries = fs
    .readdirSync(MESSAGES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
    .sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    const filePath = path.join(MESSAGES_DIR, entry.name);
    const imported: unknown = await import(pathToFileURL(filePath).href);
    const handler =
      typeof imported === "object" && imported !== null && "default" in imported
        ? (imported as { default: unknown }).default
        : undefined;

    if (isMessageHandler(handler)) {
      handlers.set(entry.name, handler);
    } else {
      console.warn(
        `[WARNING] The message handler at ${filePath} is missing a required "match" or "execute" function.`,
      );
    }
  }

  return handlers;
}
