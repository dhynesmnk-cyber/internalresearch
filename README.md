# Precedent Research Engine

An internal research engine for interior architecture firms that compares published precedent projects against current or upcoming projects.

## Features

- **Project Management**: Track current and upcoming projects
- **Research Runs**: Create structured research runs with facets, precedents, and evidence
- **Facet Taxonomy**: Analyse spatial composition, materials, furniture, lighting, detailing, colour, brand identity, and art styling
- **Typology Templates**: Pre-configured templates for hotel, workplace, retail, hospitality, healthcare, and education projects
- **Evidence Library**: Store and organise images, floorplans, and source documents
- **Vision Analysis**: AI-powered analysis of images and floorplans (when configured)
- **Semantic Search**: Search across saved evidence using embeddings (when configured)
- **Comparison Reports**: Generate comparison matrices and reports
- **PDF Export**: Export research reports as PDF files
- **CSV Export**: Export data for further analysis
- **Role-Based Access Control**: Admin, researcher, and viewer roles
- **Feature Flags**: Enable/disable advanced features as needed

## Tech Stack

- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Auth.js
- **Database**: PostgreSQL with pgvector
- **ORM**: Prisma
- **Queue**: Redis with BullMQ (for background jobs)
- **Storage**: Local file storage (S3-compatible adapter interface)
- **AI**: Qwen API for text generation, vision analysis, and embeddings

## Getting Started

### Prerequisites

- Node.js 20+
- Docker and Docker Compose (recommended)
- Or PostgreSQL 16+ with pgvector extension and Redis 7+

### Quick Start with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd precedent-research-engine
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Generate a secure NextAuth secret:
```bash
openssl rand -base64 32
```
Add this to your `.env` file as `NEXTAUTH_SECRET`.

4. Start the services:
```bash
docker-compose up -d
```

5. Run database migrations:
```bash
docker-compose exec app npx prisma migrate deploy
```

6. Seed the database:
```bash
docker-compose exec app npx prisma db seed
```

7. Access the application at http://localhost:3000

### Manual Setup

1. Install dependencies:
```bash
npm install
```

2. Set up PostgreSQL with pgvector:
```bash
# Ensure PostgreSQL 16+ is running with pgvector extension enabled
```

3. Set up Redis:
```bash
# Ensure Redis 7+ is running
```

4. Configure environment variables in `.env`

5. Run database migrations:
```bash
npx prisma migrate deploy
```

6. Seed the database:
```bash
npx prisma db seed
```

7. Start the development server:
```bash
npm run dev
```

8. Access the application at http://localhost:3000

## Default Users

After seeding, you can log in with these default users:

| Email | Password | Role |
|-------|----------|------|
| admin@firm.local | Admin123! | admin |
| researcher@firm.local | Researcher123! | researcher |
| viewer@firm.local | Viewer123! | viewer |

**Change these passwords immediately in production.**

## Environment Variables

See `.env.example` for all available environment variables:

- `QWEN_API_KEY`: Your Qwen API key
- `QWEN_BASE_URL`: Qwen API base URL (default: DashScope)
- `QWEN_MODEL`: Default model for text generation
- `QWEN_VISION_MODEL`: Model for vision analysis (optional)
- `QWEN_EMBEDDING_MODEL`: Model for embeddings (optional)
- `SEARCH_PROVIDER`: Search provider (manual, mock, or configured web search)
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `STORAGE_DIR`: Local storage directory
- `NEXTAUTH_SECRET`: Secret for session encryption
- `PDF_ENGINE`: PDF generation engine (print or playwright)

## Feature Flags

The following features can be enabled/disabled via the admin panel:

- `visionAnalysis`: AI-powered image and floorplan analysis
- `backgroundJobs`: Background job processing with Redis/BullMQ
- `semanticSearch`: Semantic search over evidence using embeddings
- `duplicateDetection`: Duplicate project and asset detection
- `webClipper`: Browser extension for saving sources
- `headlessPdf`: Headless PDF generation with Playwright
- `costDashboard`: Token cost and usage tracking
- `typologyTemplates`: Project type templates
- `reviewQueue`: Manual review queue for low-confidence items
- `sourceScoring`: Source quality scoring
- `csvExport`: CSV export functionality
- `rbac`: Role-based access control

## Australian English

This application uses Australian English spelling throughout the UI, reports, and documentation (e.g., "colour", "analyse", "organisation").

## Development

```bash
# Run development server
npm run dev

# Run production build
npm run build
npm start

# Run database migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# Seed database
npx prisma db seed

# Run tests
npm test
```

## License

Internal use only. All rights reserved.
