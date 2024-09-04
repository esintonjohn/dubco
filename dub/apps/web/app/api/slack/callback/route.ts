import { DubApiError, handleAndReturnErrorResponse } from "@/lib/api/errors";
import { getSession } from "@/lib/auth";
import { installIntegration } from "@/lib/integrations/install";
import { getSlackEnv } from "@/lib/integrations/slack/env";
import { SlackCredential } from "@/lib/integrations/slack/type";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/upstash";
import z from "@/lib/zod";
import { APP_DOMAIN_WITH_NGROK, getSearchParams } from "@dub/utils";
import { Project } from "@prisma/client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const oAuthCallbackSchema = z.object({
  code: z.string(),
  state: z.string(),
});

export const GET = async (req: Request) => {
  const env = getSlackEnv();

  let workspace: Pick<Project, "slug"> | null = null;

  try {
    const session = await getSession();

    if (!session?.user.id) {
      throw new DubApiError({
        code: "unauthorized",
        message: "Unauthorized",
      });
    }

    const { code, state } = oAuthCallbackSchema.parse(getSearchParams(req.url));

    // Find workspace that initiated the Stripe app install
    const workspaceId = await redis.get<string>(`slack:install:state:${state}`);

    if (!workspaceId) {
      throw new DubApiError({
        code: "bad_request",
        message: "Unknown state",
      });
    }

    workspace = await prisma.project.findUniqueOrThrow({
      where: {
        id: workspaceId,
      },
      select: {
        slug: true,
      },
    });

    const formData = new FormData();
    formData.append("code", code);
    formData.append("client_id", env.SLACK_CLIENT_ID);
    formData.append("client_secret", env.SLACK_CLIENT_SECRET);
    formData.append(
      "redirect_uri",
      `${APP_DOMAIN_WITH_NGROK}/api/slack/callback`,
    );

    const response = await fetch("https://slack.com/api/oauth.v2.access", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    const credentials: SlackCredential = {
      appId: data.app_id,
      botUserId: data.bot_user_id,
      scope: data.scope,
      accessToken: data.access_token,
      tokenType: data.token_type,
      authUser: data.authed_user,
      team: data.team,
    };

    await installIntegration({
      integrationSlug: "slack",
      userId: session.user.id,
      workspaceId,
      credentials,
    });
  } catch (e: any) {
    return handleAndReturnErrorResponse(e);
  }

  redirect(`/${workspace.slug}/settings/integrations/slack`);
};
