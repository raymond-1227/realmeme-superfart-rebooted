import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

// Compiled layout: dist/config/paths.js -> DIST_ROOT = dist/, PROJECT_ROOT = repo root
export const DIST_ROOT = path.resolve(currentDir, "..");
export const PROJECT_ROOT = path.resolve(currentDir, "..", "..");
export const ENV_FILE = path.join(PROJECT_ROOT, ".env");
export const MISC_DIR = path.join(PROJECT_ROOT, "misc");
export const COMMANDS_DIR = path.join(DIST_ROOT, "commands");
export const EVENTS_DIR = path.join(DIST_ROOT, "events");
export const MESSAGES_DIR = path.join(DIST_ROOT, "messages");
