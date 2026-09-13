import { prisma } from "./prisma";

const DEFAULT_TEMPLATES = [
  {
    name: "Hotel",
    projectType: "hotel",
    defaultFacets: ["spatial_composition", "material_palette", "furniture_product_mix", "lighting", "detailing_joinery", "colour_texture", "brand_identity"],
    defaultHints: {
      brand: "",
      location: "",
      scale: "Number of rooms, public spaces, F&B outlets",
      budgetBand: "luxury | premium | midscale | economy",
      notes: "Focus on guest experience journey, lobby arrival, room typologies",
    },
    recommendedMetrics: ["room size", "lobby area per room", "F&B seat count", "ceiling heights"],
    recommendedSourceTypes: ["design magazine", "architect portfolio", "hotel website", "interior design publication"],
    reportSectionEmphasis: {
      guestRooms: "high",
      publicSpaces: "high",
      foodAndBeverage: "medium",
      spa: "low",
    },
    defaultLimits: { maxPrecedents: 5, maxSources: 4, maxAssets: 15 },
  },
  {
    name: "Workplace",
    projectType: "workplace",
    defaultFacets: ["spatial_composition", "material_palette", "furniture_product_mix", "lighting", "detailing_joinery", "colour_texture"],
    defaultHints: {
      brand: "",
      location: "",
      scale: "Number of staff, desk count, meeting rooms",
      budgetBand: "premium | standard | fitout grade",
      notes: "Focus on collaboration zones, focus areas, amenity spaces",
    },
    recommendedMetrics: ["desk density", "meeting room ratio", "amenity area percent", "ceiling heights"],
    recommendedSourceTypes: ["design magazine", "architect portfolio", "workplace design publication"],
    reportSectionEmphasis: {
      openPlan: "high",
      meetingRooms: "high",
      amenitySpaces: "medium",
      reception: "medium",
    },
    defaultLimits: { maxPrecedents: 5, maxSources: 3, maxAssets: 12 },
  },
  {
    name: "Retail",
    projectType: "retail",
    defaultFacets: ["spatial_composition", "material_palette", "lighting", "colour_texture", "brand_identity"],
    defaultHints: {
      brand: "",
      location: "",
      scale: "Store area, frontage width",
      budgetBand: "flagship | standard | pop-up",
      notes: "Focus on customer journey, product display, checkout zone",
    },
    recommendedMetrics: ["sales floor area", "display density", "ceiling heights", "frontage width"],
    recommendedSourceTypes: ["design magazine", "retail design blog", "brand press release"],
    reportSectionEmphasis: {
      entrance: "high",
      salesFloor: "high",
      fittingRooms: "medium",
      checkout: "medium",
    },
    defaultLimits: { maxPrecedents: 6, maxSources: 3, maxAssets: 10 },
  },
  {
    name: "Hospitality",
    projectType: "hospitality",
    defaultFacets: ["spatial_composition", "material_palette", "furniture_product_mix", "lighting", "detailing_joinery", "colour_texture", "brand_identity"],
    defaultHints: {
      brand: "",
      location: "",
      scale: "Seat count, service style",
      budgetBand: "fine dining | casual | bar",
      notes: "Focus on dining experience, kitchen visibility, bar design",
    },
    recommendedMetrics: ["seat density", "bar length", "ceiling heights", "kitchen ratio"],
    recommendedSourceTypes: ["design magazine", "hospitality design publication", "food magazine"],
    reportSectionEmphasis: {
      diningArea: "high",
      bar: "high",
      kitchen: "low",
      outdoor: "medium",
    },
    defaultLimits: { maxPrecedents: 5, maxSources: 4, maxAssets: 12 },
  },
  {
    name: "Healthcare",
    projectType: "healthcare",
    defaultFacets: ["spatial_composition", "material_palette", "lighting", "colour_texture", "brand_identity"],
    defaultHints: {
      brand: "",
      location: "",
      scale: "Bed count, clinic rooms, specialty areas",
      budgetBand: "public | private | specialist",
      notes: "Focus on patient experience, wayfinding, infection control materials",
    },
    recommendedMetrics: ["room size", "waiting area capacity", "ceiling heights", "corridor width"],
    recommendedSourceTypes: ["healthcare design magazine", "architect portfolio", "facility case study"],
    reportSectionEmphasis: {
      waitingAreas: "high",
      treatmentRooms: "high",
      consultationRooms: "medium",
      reception: "medium",
    },
    defaultLimits: { maxPrecedents: 4, maxSources: 3, maxAssets: 10 },
  },
  {
    name: "Education",
    projectType: "education",
    defaultFacets: ["spatial_composition", "material_palette", "furniture_product_mix", "lighting", "detailing_joinery"],
    defaultHints: {
      brand: "",
      location: "",
      scale: "Student capacity, classroom count",
      budgetBand: "university | private school | public",
      notes: "Focus on learning environments, collaboration spaces, technology integration",
    },
    recommendedMetrics: ["classroom size", "student density", "collaboration space ratio", "ceiling heights"],
    recommendedSourceTypes: ["education design magazine", "architect portfolio", "institutional case study"],
    reportSectionEmphasis: {
      classrooms: "high",
      commonAreas: "high",
      library: "medium",
      outdoorLearning: "low",
    },
    defaultLimits: { maxPrecedents: 4, maxSources: 3, maxAssets: 10 },
  },
];

export async function initializeTypologyTemplates() {
  for (const template of DEFAULT_TEMPLATES) {
    await prisma.typologyTemplate.upsert({
      where: { projectType: template.projectType },
      update: {},
      create: {
        name: template.name,
        projectType: template.projectType,
        defaultFacets: template.defaultFacets,
        defaultHints: template.defaultHints,
        recommendedMetrics: template.recommendedMetrics,
        recommendedSourceTypes: template.recommendedSourceTypes,
        reportSectionEmphasis: template.reportSectionEmphasis,
        defaultLimits: template.defaultLimits,
      },
    });
  }
}

export async function getTypologyTemplates() {
  return prisma.typologyTemplate.findMany({
    where: { isArchived: false },
    orderBy: { name: "asc" },
  });
}

export async function getTypologyTemplateByType(projectType: string) {
  return prisma.typologyTemplate.findUnique({
    where: { projectType },
  });
}
