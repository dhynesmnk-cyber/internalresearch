import { prisma } from "./prisma";

export async function logAudit(
  userId: string | null,
  action: string,
  entityType: string,
  entityId: string | null,
  changeSummary?: string,
  ipAddress?: string
) {
  return prisma.auditLog.create({
    data: {
      userId,
      action,
      entityType,
      entityId,
      changeSummary,
      ipAddress,
    },
  });
}

export async function getAuditLogs(filters?: {
  userId?: string;
  entityType?: string;
  action?: string;
  limit?: number;
}) {
  return prisma.auditLog.findMany({
    where: filters,
    include: { user: { select: { id: true, email: true, name: true } } },
    orderBy: { timestamp: "desc" },
    take: filters?.limit ?? 100,
  });
}
