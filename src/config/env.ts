import dotenv from "dotenv";
import { ENV_FILE } from "./paths.js";

dotenv.config({
  path: ENV_FILE,
  quiet: true,
});

export type EnvKey =
  | "DISCORD_BOT_TOKEN"
  | "OWNER_ID"
  | "CLIENT_ID"
  | "GUILD_ID"
  | "HONEYPOT_CHANNEL_ID"
  | "PUNISHMENT_LOG_CHANNEL_ID"
  | "GOOGLE_AI_STUDIO_API_KEY";

const BOT_REQUIRED_ENV_KEYS: readonly EnvKey[] = [
  "DISCORD_BOT_TOKEN",
  "OWNER_ID",
  "CLIENT_ID",
  "GUILD_ID",
  "HONEYPOT_CHANNEL_ID",
  "PUNISHMENT_LOG_CHANNEL_ID",
  "GOOGLE_AI_STUDIO_API_KEY",
];

const DEPLOY_REQUIRED_ENV_KEYS: readonly EnvKey[] = [
  "DISCORD_BOT_TOKEN",
  "CLIENT_ID",
  "GUILD_ID",
];

export function requireEnv(key: EnvKey): string {
  const value = process.env[key];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function validateEnv(keys: readonly EnvKey[]): void {
  const missing = keys.filter((key) => {
    const value = process.env[key];
    return !value || value.trim().length === 0;
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(", ")}`,
    );
  }
}

export function validateBotEnv(): void {
  validateEnv(BOT_REQUIRED_ENV_KEYS);
}

export function validateDeployEnv(): void {
  validateEnv(DEPLOY_REQUIRED_ENV_KEYS);
}
