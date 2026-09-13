import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { role: true },
  });

  return user;
}

export async function hasPermission(user: { roleId: string }, permissionName: string): Promise<boolean> {
  const role = await prisma.role.findUnique({
    where: { id: user.roleId },
    include: { permissions: true },
  });

  if (!role) return false;

  return role.permissions.some(p => p.name === permissionName);
}

export async function isAdmin(user: { roleId: string }): Promise<boolean> {
  const role = await prisma.role.findUnique({
    where: { id: user.roleId },
  });

  return role?.name === "admin";
}

export async function isResearcher(user: { roleId: string }): Promise<boolean> {
  const role = await prisma.role.findUnique({
    where: { id: user.roleId },
  });

  return role?.name === "researcher" || role?.name === "admin";
}
