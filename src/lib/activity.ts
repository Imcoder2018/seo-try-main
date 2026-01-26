import { prisma } from "@/lib/prisma";

type ActivityAction =
  | "audit_created"
  | "audit_completed"
  | "content_generated"
  | "content_published"
  | "client_added"
  | "client_updated"
  | "client_switched"
  | "member_invited"
  | "member_removed"
  | "agency_created"
  | "onboarding_completed"
  | "login"
  | "settings_updated";

interface TrackActivityParams {
  userId: string;
  action: ActivityAction;
  entityType?: string;
  entityId?: string;
  description?: string;
  metadata?: Record<string, any>;
  clientId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function trackActivity(params: TrackActivityParams) {
  try {
    await prisma.userActivity.create({
      data: {
        userId: params.userId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        description: params.description,
        metadata: params.metadata,
        clientId: params.clientId,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to track activity:", error);
  }
}

export function getActivityDescription(action: ActivityAction): string {
  const descriptions: Record<ActivityAction, string> = {
    audit_created: "Started a new SEO audit",
    audit_completed: "Completed an SEO audit",
    content_generated: "Generated new content",
    content_published: "Published content to WordPress",
    client_added: "Added a new client",
    client_updated: "Updated client information",
    client_switched: "Switched active client",
    member_invited: "Invited a team member",
    member_removed: "Removed a team member",
    agency_created: "Created an agency",
    onboarding_completed: "Completed onboarding",
    login: "Logged in",
    settings_updated: "Updated settings",
  };

  return descriptions[action] || action;
}
