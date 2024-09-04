import { prisma } from "@/lib/prisma";

interface InstallIntegrationArgs {
  userId: string;
  workspaceId: string;
  integrationSlug: string;
  credentials?: Record<string, any>;
}

// Install an integration for a user in a workspace
export const installIntegration = async ({
  userId,
  workspaceId,
  integrationSlug,
  credentials,
}: InstallIntegrationArgs) => {
  const integration = await prisma.integration.findUniqueOrThrow({
    where: {
      slug: integrationSlug,
    },
    select: {
      id: true,
    },
  });

  await prisma.installedIntegration.upsert({
    create: {
      userId,
      projectId: workspaceId,
      integrationId: integration.id,
      credentials,
    },
    update: {
      credentials,
    },
    where: {
      userId_integrationId_projectId: {
        userId,
        projectId: workspaceId,
        integrationId: integration.id,
      },
    },
  });

  console.info(
    `Installed integration ${integrationSlug} for user ${userId} in workspace ${workspaceId}`,
  );
};
