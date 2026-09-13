import { prisma } from "./prisma";

const DEFAULT_SETTINGS = {
  appName: "Precedent Research Engine",
  defaultTheme: "system",
  defaultPageSize: 20,
  timezone: "Australia/Sydney",
  defaultMaxPrecedents: 5,
  defaultMaxSources: 3,
  defaultMaxAssets: 10,
  recencyWindowMonths: 60,
  scaleTolerancePercent: 20,
} as const;

export type SettingKey = keyof typeof DEFAULT_SETTINGS;

export async function getSetting<T>(key: SettingKey, defaultValue?: T): Promise<T | null> {
  const setting = await prisma.appSetting.findUnique({
    where: { key },
  });

  if (!setting) {
    return defaultValue ?? (DEFAULT_SETTINGS[key] as T) ?? null;
  }

  // Parse the value based on the default type
  const defaultVal = DEFAULT_SETTINGS[key];
  if (typeof defaultVal === "number") {
    return parseFloat(setting.value) as unknown as T;
  }

  return setting.value as T;
}

export async function getSettings(): Promise<Record<string, string>> {
  const settings = await prisma.appSetting.findMany();
  const result: Record<string, string> = {};

  for (const setting of settings) {
    if (!setting.isSecret) {
      result[setting.key] = setting.value;
    }
  }

  // Add defaults for missing settings
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    if (!(key in result)) {
      result[key] = String(value);
    }
  }

  return result;
}

export async function setSetting(key: string, value: string, isSecret = false) {
  return prisma.appSetting.upsert({
    where: { key },
    update: { value, isSecret },
    create: { key, value, isSecret },
  });
}

export async function initializeDefaultSettings() {
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await prisma.appSetting.upsert({
      where: { key },
      update: {},
      create: {
        key,
        value: String(value),
        isSecret: false,
      },
    });
  }
}

export function getEnvVar(key: string): string | undefined {
  return process.env[key];
}

export function isEnvOverridden(key: string): boolean {
  const envValue = process.env[key.toUpperCase().replace(/_/g, "_")];
  return envValue !== undefined && envValue !== "";
}
