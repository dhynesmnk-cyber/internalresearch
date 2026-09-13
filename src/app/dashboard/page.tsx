import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { SiteLayout } from "@/components/site-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Building2 } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const recentRuns = await prisma.researchRun.findMany({
    take: 10,
    include: {
      project: true,
      precedentProjects: true,
      evidenceAssets: true,
    },
    orderBy: { createdAt: "desc" },
  })

  const projectsCount = await prisma.project.count()
  const runsCount = await prisma.researchRun.count()
  const precedentsCount = await prisma.precedentProject.count()

  return (
    <SiteLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Link href="/runs/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Research Run
            </Button>
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectsCount}</div>
              <p className="text-xs text-muted-foreground">Active projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Research Runs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{runsCount}</div>
              <p className="text-xs text-muted-foreground">Total runs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Precedents</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{precedentsCount}</div>
              <p className="text-xs text-muted-foreground">Catalogued precedents</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Research Runs</h2>
          {recentRuns.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No research runs yet. Create your first run to get started.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {recentRuns.map((run) => (
                <Card key={run.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{run.project.name}</CardTitle>
                        <CardDescription>
                          Created {new Date(run.createdAt).toLocaleDateString("en-AU")} • {run.status}
                        </CardDescription>
                      </div>
                      <Link href={`/runs/${run.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{run.precedentProjects.length} precedents</span>
                      <span>{run.evidenceAssets.length} assets</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  )
}
