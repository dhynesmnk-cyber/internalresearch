import { prisma } from "./prisma";

const DEFAULT_FACETS = [
  {
    key: "spatial_composition",
    label: "Spatial Composition",
    description: "Plan organisation, zoning, circulation, spatial sequence, ceiling treatment, volume",
    isSelectedByDefault: true,
    sortOrder: 1,
  },
  {
    key: "material_palette",
    label: "Material Palette",
    description: "Floor, wall, ceiling and joinery materials, finishes, textures",
    isSelectedByDefault: true,
    sortOrder: 2,
  },
  {
    key: "furniture_product_mix",
    label: "Furniture & Product Mix",
    description: "Seating, tables, casegoods, feature pieces, brands, custom versus off the shelf",
    isSelectedByDefault: true,
    sortOrder: 3,
  },
  {
    key: "lighting",
    label: "Lighting",
    description: "Decorative fixtures, layered lighting, natural light, key luminaire brands",
    isSelectedByDefault: true,
    sortOrder: 4,
  },
  {
    key: "detailing_joinery",
    label: "Detailing & Joinery",
    description: "Custom millwork, signature details, transitions, hardware",
    isSelectedByDefault: true,
    sortOrder: 5,
  },
  {
    key: "colour_texture",
    label: "Colour & Texture",
    description: "Palette, contrast, texture strategy",
    isSelectedByDefault: true,
    sortOrder: 6,
  },
  {
    key: "brand_identity",
    label: "Brand Identity",
    description: "Wayfinding, brand expression, narrative, art curation",
    isSelectedByDefault: false,
    sortOrder: 7,
  },
  {
    key: "art_styling",
    label: "Art & Styling",
    description: "Artwork, accessories, planting, styling approach",
    isSelectedByDefault: false,
    sortOrder: 8,
  },
];

export async function initializeFacets() {
  for (const facet of DEFAULT_FACETS) {
    await prisma.facet.upsert({
      where: { key: facet.key },
      update: {},
      create: facet,
    });
  }
}

export async function getActiveFacets() {
  return prisma.facet.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getFacetByKey(key: string) {
  return prisma.facet.findUnique({
    where: { key },
  });
}
