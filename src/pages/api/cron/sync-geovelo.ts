import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import StravaClient from "@/lib/clients/strava";
import GeoveloClient from "@/lib/clients/geovelo";
import { IStravaActivity } from "@/interfaces/types";
import { Account, User } from "@prisma/client";
import { StravaSportType } from "@/enums/strava-sport-type";

const stravaClient = new StravaClient();
const geoveloClient = new GeoveloClient();

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (
    !process.env.CRON_SECRET ||
    request.headers["authorization"] !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  // Get all users
  const users = await getUsers();

  // Get all strava activities for each user
  for (const user of users) {
    syncByUser(user);
  }

  response.status(200).json({ success: true });
}

async function syncByUser(user: User & { accounts: Account[] }) {
  const stravaToken = await getStravaToken(user);
  if (!stravaToken) {
    return;
  }

  // Get 2 days ago
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() - 2);

  // If the last sync date is greater than 2 days, we set yesterday to the last sync date
  let lastSync = user.lastSyncAt;
  if (!lastSync || lastSync > maxDate) {
    lastSync = maxDate;
  }

  const activities = await stravaClient.fetchActivities(stravaToken, {
    after: lastSync,
  });
  if (!activities || !activities.length) {
    return;
  }

  for (const activity of activities) {
    await importGPXByActivity(activity, user, stravaToken);
  }

  // Update the last sync date
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastSyncAt: new Date(),
    },
  });
}

async function importGPXByActivity(
  activity: IStravaActivity,
  user: User,
  stravaToken: string,
): Promise<void> {
  // If the activity is not a cycling activity, skip it
  if (!(Object.values(StravaSportType) as string[]).includes(activity.type)) {
    return;
  }

  // If the activity does not contain a GPX trace, skip it
  if (activity.start_latlng.length !== 2) {
    return;
  }

  const gpx = await stravaClient.fetchActivityGPX(stravaToken, activity);
  if (!gpx) {
    return;
  }

  try {
    await geoveloClient.importGPX(user.geoveloToken!, activity.name, gpx);
  } catch (err) {
    /* ignore */
  }
}

async function getStravaToken(
  user: User & { accounts: Account[] },
): Promise<string | null> {
  const stravaAccount = user.accounts.find(
    (account) => account.provider === "strava",
  );
  if (!stravaAccount || !stravaAccount.refresh_token) {
    return null;
  }

  const newStravaToken = await stravaClient.refreshToken(
    stravaAccount.refresh_token,
  );
  if (!newStravaToken) {
    return null;
  }

  // Update user account
  await prisma.account.updateMany({
    where: {
      providerAccountId: stravaAccount.providerAccountId,
    },
    data: {
      access_token: newStravaToken.access_token,
      refresh_token: newStravaToken.refresh_token,
      expires_at: newStravaToken.expires_at,
      updatedAt: new Date(),
    },
  });

  return newStravaToken.access_token;
}

function getUsers() {
  return prisma.user.findMany({
    where: {
      isVerified: true,
      syncEnabled: true,
      geoveloToken: {
        not: null,
      },
    },
    include: {
      accounts: {
        where: {
          provider: "strava",
        },
      },
    },
  });
}
