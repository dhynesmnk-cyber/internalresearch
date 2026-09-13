import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export async function initializeRoles() {
  const roles = [
    { name: "admin", description: "Full system access" },
    { name: "researcher", description: "Can create runs and review evidence" },
    { name: "viewer", description: "Read-only access" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }
}

export async function initializePermissions() {
  const permissions = [
    { name: "manage_users", description: "Manage users and roles" },
    { name: "manage_settings", description: "Manage application settings" },
    { name: "manage_templates", description: "Manage typology templates" },
    { name: "create_run", description: "Create research runs" },
    { name: "approve_precedents", description: "Approve precedent projects" },
    { name: "review_evidence", description: "Review evidence and extractions" },
    { name: "export_reports", description: "Export PDF and CSV reports" },
    { name: "manage_tokens", description: "Manage API and clipper tokens" },
    { name: "view_cost_dashboard", description: "View cost dashboard" },
    { name: "manage_jobs", description: "Manage background jobs" },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }
}

export async function assignPermissionsToRoles() {
  // Admin gets all permissions
  const adminRole = await prisma.role.findUnique({ where: { name: "admin" } });
  const researcherRole = await prisma.role.findUnique({ where: { name: "researcher" } });
  const viewerRole = await prisma.role.findUnique({ where: { name: "viewer" } });

  const allPermissions = await prisma.permission.findMany();

  if (adminRole) {
    await prisma.role.update({
      where: { id: adminRole.id },
      data: {
        permissions: {
          connect: allPermissions.map(p => ({ id: p.id })),
        },
      },
    });
  }

  // Researcher gets most permissions except manage_users and manage_settings
  if (researcherRole) {
    const researcherPermissions = allPermissions.filter(
      p => !["manage_users", "manage_settings"].includes(p.name)
    );
    await prisma.role.update({
      where: { id: researcherRole.id },
      data: {
        permissions: {
          connect: researcherPermissions.map(p => ({ id: p.id })),
        },
      },
    });
  }

  // Viewer only gets export_reports
  if (viewerRole) {
    const viewerPermissions = allPermissions.filter(
      p => p.name === "export_reports"
    );
    await prisma.role.update({
      where: { id: viewerRole.id },
      data: {
        permissions: {
          connect: viewerPermissions.map(p => ({ id: p.id })),
        },
      },
    });
  }
}

export async function seedDefaultUser() {
  const adminRole = await prisma.role.findUnique({ where: { name: "admin" } });

  if (!adminRole) return;

  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@firm.local" },
  });

  if (existingAdmin) return;

  const passwordHash = await bcrypt.hash("Admin123!", 10);

  await prisma.user.create({
    data: {
      email: "admin@firm.local",
      name: "Admin User",
      passwordHash,
      roleId: adminRole.id,
    },
  });

  console.log("Created default admin user: admin@firm.local / Admin123!");
}

export async function initializeRBAC() {
  await initializeRoles();
  await initializePermissions();
  await assignPermissionsToRoles();
  await seedDefaultUser();
}
