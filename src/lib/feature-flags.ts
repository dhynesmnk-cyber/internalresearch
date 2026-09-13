import { prisma } from "./prisma";

const FEATURE_FLAGS = [
  { name: "visionAnalysis", description: "Enable AI vision analysis for images and floorplans" },
  { name: "backgroundJobs", description: "Use Redis/BullMQ for background job processing" },
  { name: "semanticSearch", description: "Enable semantic search over saved evidence using embeddings" },
  { name: "duplicateDetection", description: "Detect duplicate projects and assets" },
  { name: "webClipper", description: "Enable browser clipper integration" },
  { name: "headlessPdf", description: "Use Playwright for headless PDF generation" },
  { name: "costDashboard", description: "Show token cost and run cost dashboard" },
  { name: "typologyTemplates", description: "Enable typology templates for project types" },
  { name: "reviewQueue", description: "Manual review queue for low confidence assets" },
  { name: "sourceScoring", description: "Source quality scoring for each source and precedent" },
  { name: "csvExport", description: "CSV export alongside PDF export" },
  { name: "rbac", description: "Role based access control with admin, researcher and viewer roles" },
] as const;

export type FeatureFlagName = typeof FEATURE_FLAGS[number]["name"];

export async function getFeatureFlags() {
  const existingFlags = await prisma.featureFlag.findMany({
    select: { name: true, enabled: true },
  });

  const flagMap = new Map(existingFlags.map(f => [f.name, f.enabled]));

  return FEATURE_FLAGS.map(flag => ({
    name: flag.name,
    description: flag.description,
    enabled: flagMap.get(flag.name) ?? false,
  }));
}

export async function isFeatureEnabled(flagName: FeatureFlagName): Promise<boolean> {
  const flag = await prisma.featureFlag.findUnique({
    where: { name: flagName },
  });

  if (!flag) {
    // Default to disabled for new flags
    return false;
  }

  return flag.enabled;
}

export async function setFeatureFlag(flagName: string, enabled: boolean) {
  return prisma.featureFlag.upsert({
    where: { name: flagName },
    update: { enabled },
    create: { name: flagName, enabled },
  });
}

export async function initializeFeatureFlags() {
  for (const flag of FEATURE_FLAGS) {
    await prisma.featureFlag.upsert({
      where: { name: flag.name },
      update: {},
      create: {
        name: flag.name,
        description: flag.description,
        enabled: false,
      },
    });
  }
}
