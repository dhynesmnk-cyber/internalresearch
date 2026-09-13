import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Full system access',
    },
  })

  const researcherRole = await prisma.role.upsert({
    where: { name: 'researcher' },
    update: {},
    create: {
      name: 'researcher',
      description: 'Can create runs and review evidence',
    },
  })

  const viewerRole = await prisma.role.upsert({
    where: { name: 'viewer' },
    update: {},
    create: {
      name: 'viewer',
      description: 'Read-only access',
    },
  })

  // Hash passwords
  const adminPassword = await bcrypt.hash('Admin123!', 10)
  const researcherPassword = await bcrypt.hash('Researcher123!', 10)
  const viewerPassword = await bcrypt.hash('Viewer123!', 10)

  // Create users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@firm.local' },
    update: {},
    create: {
      email: 'admin@firm.local',
      name: 'Admin User',
      passwordHash: adminPassword,
      role: { connect: { id: adminRole.id } },
    },
  })

  const researcherUser = await prisma.user.upsert({
    where: { email: 'researcher@firm.local' },
    update: {},
    create: {
      email: 'researcher@firm.local',
      name: 'Research User',
      passwordHash: researcherPassword,
      role: { connect: { id: researcherRole.id } },
    },
  })

  const viewerUser = await prisma.user.upsert({
    where: { email: 'viewer@firm.local' },
    update: {},
    create: {
      email: 'viewer@firm.local',
      name: 'View User',
      passwordHash: viewerPassword,
      role: { connect: { id: viewerRole.id } },
    },
  })

  console.log('Created users')

  // Create default feature flags
  const featureFlags = [
    'visionAnalysis',
    'backgroundJobs',
    'semanticSearch',
    'duplicateDetection',
    'webClipper',
    'headlessPdf',
    'costDashboard',
    'typologyTemplates',
    'reviewQueue',
    'sourceScoring',
    'csvExport',
    'rbac',
  ]

  for (const flagName of featureFlags) {
    await prisma.appSetting.upsert({
      where: { key: `feature.${flagName}` },
      update: {},
      create: {
        key: `feature.${flagName}`,
        value: 'true',
        description: `Enable ${flagName} feature`,
      },
    })
  }

  console.log('Created feature flags')

  // Create default facets
  const facets = [
    { key: 'spatial_composition', label: 'Spatial Composition', description: 'Plan organisation, zoning, circulation, spatial sequence, ceiling treatment, volume', active: true },
    { key: 'material_palette', label: 'Material Palette', description: 'Floor, wall, ceiling and joinery materials, finishes, textures', active: true },
    { key: 'furniture_product_mix', label: 'Furniture & Product Mix', description: 'Seating, tables, casegoods, feature pieces, brands, custom versus off the shelf', active: true },
    { key: 'lighting', label: 'Lighting', description: 'Decorative fixtures, layered lighting, natural light, key luminaire brands', active: true },
    { key: 'detailing_joinery', label: 'Detailing & Joinery', description: 'Custom millwork, signature details, transitions, hardware', active: true },
    { key: 'colour_texture', label: 'Colour & Texture', description: 'Palette, contrast, texture strategy', active: true },
    { key: 'brand_identity', label: 'Brand Identity', description: 'Wayfinding, brand expression, narrative, art curation', active: true },
    { key: 'art_styling', label: 'Art & Styling', description: 'Artwork, accessories, planting, styling approach', active: true },
  ]

  for (const facet of facets) {
    await prisma.facet.upsert({
      where: { key: facet.key },
      update: {},
      create: facet,
    })
  }

  console.log('Created facets')

  // Create typology templates
  const templates = [
    {
      name: 'Hotel',
      projectType: 'hotel',
      defaultHints: 'Focus on guest experience, lobby flow, room layouts, hospitality details',
      recommendedMetrics: 'guest_flow,durability,maintenance,luxury_level',
      defaultMaxPrecedents: 8,
      defaultMaxSources: 5,
      defaultMaxAssets: 20,
    },
    {
      name: 'Workplace',
      projectType: 'workplace',
      defaultHints: 'Consider collaboration spaces, privacy needs, brand expression, flexibility',
      recommendedMetrics: 'collaboration_ratio,privacy_levels,brand_integration,flexibility',
      defaultMaxPrecedents: 6,
      defaultMaxSources: 4,
      defaultMaxAssets: 15,
    },
    {
      name: 'Retail',
      projectType: 'retail',
      defaultHints: 'Customer journey, product display, checkout zones, brand immersion',
      recommendedMetrics: 'customer_flow,display_density,brand_visibility,conversion_zones',
      defaultMaxPrecedents: 8,
      defaultMaxSources: 5,
      defaultMaxAssets: 20,
    },
    {
      name: 'Hospitality',
      projectType: 'hospitality',
      defaultHints: 'Dining flow, kitchen visibility, bar design, atmosphere creation',
      recommendedMetrics: 'seating_density,service_flow,atmosphere_level,accessibility',
      defaultMaxPrecedents: 8,
      defaultMaxSources: 5,
      defaultMaxAssets: 20,
    },
    {
      name: 'Healthcare',
      projectType: 'healthcare',
      defaultHints: 'Patient comfort, clinical efficiency, wayfinding, calming environments',
      recommendedMetrics: 'patient_comfort,clinical_efficiency,wayfinding_clarity,hygiene',
      defaultMaxPrecedents: 6,
      defaultMaxSources: 4,
      defaultMaxAssets: 15,
    },
    {
      name: 'Education',
      projectType: 'education',
      defaultHints: 'Learning environments, collaboration spaces, durability, inspiration',
      recommendedMetrics: 'learning_engagement,collaboration_support,durability,inspiration',
      defaultMaxPrecedents: 6,
      defaultMaxSources: 4,
      defaultMaxAssets: 15,
    },
  ]

  for (const template of templates) {
    await prisma.typologyTemplate.create({
      data: template,
    })
  }

  console.log('Created typology templates')

  // Create sample project
  const sampleProject = await prisma.project.create({
    data: {
      name: 'Sample Office Fitout',
      projectType: 'workplace',
      location: 'Melbourne, VIC',
      brandContext: 'Tech startup focusing on collaboration and innovation',
      scaleNotes: '2000 sqm, 150 workstations',
      targetCompletion: new Date('2025-06-01'),
      constraints: 'Budget conscious, sustainable materials, flexible layout',
      notes: 'Client values open collaboration with quiet zones for focused work',
    },
  })

  console.log('Created sample project')

  // Create sample research run
  const sampleRun = await prisma.researchRun.create({
    data: {
      projectId: sampleProject.id,
      status: 'completed',
      hints: 'Modern workplace with collaborative spaces, biophilic design elements, warm material palette',
      maxPrecedents: 5,
      maxSourcesPerPrecedent: 3,
      maxAssetsPerPrecedent: 10,
      searchMode: 'manual',
      selectedFacets: ['spatial_composition', 'material_palette', 'furniture_product_mix', 'lighting'],
    },
  })

  console.log('Created sample research run')

  // Create sample precedent
  const samplePrecedent = await prisma.precedentProject.create({
    data: {
      researchRunId: sampleRun.id,
      name: 'IDEO Office, Palo Alto',
      designer: 'Clive Wilkinson Architects',
      location: 'Palo Alto, CA',
      completionYear: 2019,
      sourceUrl: 'https://example.com/ideo-office',
      relevanceNote: 'Exemplary collaborative workspace design',
      status: 'approved',
      confidence: 0.85,
      sourceScore: 75,
    },
  })

  console.log('Created sample precedent')

  // Create sample source
  await prisma.evidenceSource.create({
    data: {
      precedentProjectId: samplePrecedent.id,
      url: 'https://example.com/ideo-office',
      publisher: 'ArchDaily',
      title: 'IDEO Office Renovation by Clive Wilkinson Architects',
      accessDate: new Date(),
      sourceType: 'article',
      sourceQualityScore: 80,
    },
  })

  console.log('Created sample source')

  // Create model prices
  await prisma.modelPrice.createMany({
    data: [
      { modelName: 'qwen-plus', inputPrice: 0.002, outputPrice: 0.006, currency: 'USD' },
      { modelName: 'qwen-turbo', inputPrice: 0.001, outputPrice: 0.003, currency: 'USD' },
      { modelName: 'qwen-max', inputPrice: 0.005, outputPrice: 0.015, currency: 'USD' },
    ],
  })

  console.log('Created model prices')

  // Create default app settings
  await prisma.appSetting.upsert({
    where: { key: 'app.name' },
    update: {},
    create: { key: 'app.name', value: 'Precedent Research Engine', description: 'Application name' },
  })

  await prisma.appSetting.upsert({
    where: { key: 'app.theme' },
    update: {},
    create: { key: 'app.theme', value: 'system', description: 'Default theme' },
  })

  await prisma.appSetting.upsert({
    where: { key: 'research.defaultMaxPrecedents' },
    update: {},
    create: { key: 'research.defaultMaxPrecedents', value: '6', description: 'Default max precedents per run' },
  })

  await prisma.appSetting.upsert({
    where: { key: 'research.defaultMaxSources' },
    update: {},
    create: { key: 'research.defaultMaxSources', value: '4', description: 'Default max sources per precedent' },
  })

  await prisma.appSetting.upsert({
    where: { key: 'research.defaultMaxAssets' },
    update: {},
    create: { key: 'research.defaultMaxAssets', value: '15', description: 'Default max assets per precedent' },
  })

  console.log('Created default settings')

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
