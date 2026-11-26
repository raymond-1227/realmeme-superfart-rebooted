import fs from "node:fs";
import path from "node:path";
import { MISC_DIR } from "./paths.js";

export type RuleKey =
  | "rule1"
  | "rule2"
  | "rule3"
  | "rule4"
  | "rule5"
  | "rule6"
  | "rule7"
  | "rule8"
  | "rule9"
  | "rule10"
  | "rule11"
  | "rule12"
  | "rule13"
  | "rule14"
  | "rule15";

export interface RuleEntry {
  name: string;
  description: string;
}

export type RulesMap = Record<RuleKey, RuleEntry>;

export type DeviceKey =
  | "realme1"
  | "realme2nc1"
  | "realme2pro"
  | "realme3n3i"
  | "realme3pro"
  | "realme5"
  | "rm6785"
  | "realme6iglobal"
  | "realme7pro"
  | "realmec2"
  | "realmec3nnarzo10a"
  | "realmec11nc12nc15"
  | "realmegtmaster"
  | "realmegtneo2"
  | "realmex2pro"
  | "realmex3nsuperzoom"
  | "realmex7maxngtneo"
  | "realmex50pro";

export interface DeviceEntry {
  name: string;
  channel: string | null;
  group: string | null;
}

export type DevicesMap = Record<DeviceKey, DeviceEntry>;

function readJsonFile<T>(fileName: string): T {
  const filePath = path.join(MISC_DIR, fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as T;
}

export const rules: RulesMap = readJsonFile<RulesMap>("rules.json");
export const devices: DevicesMap = readJsonFile<DevicesMap>("devices.json");
export const LTT_INTRO_PATH = path.join(MISC_DIR, "lttintro.mp3");

export function isRuleKey(value: string): value is RuleKey {
  return Object.hasOwn(rules, value);
}

export function isDeviceKey(value: string): value is DeviceKey {
  return Object.hasOwn(devices, value);
}
