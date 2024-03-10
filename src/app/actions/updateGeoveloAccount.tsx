"use server";

import GeoveloClient from "@/lib/clients/geovelo";
import { IGeoveloUser } from "@/interfaces/types";
import { PrismaClient } from "@prisma/client";

const geoveloClient = new GeoveloClient();
const prisma = new PrismaClient();

export async function updateGeoveloAccount(
  userId: string,
  geoveloUserId: string,
  token: string,
): Promise<IGeoveloUser | null> {
  const profile = await geoveloClient.fetchProfile(geoveloUserId, token);
  if (!profile) {
    return null;
  }

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        geoveloUserId: geoveloUserId,
        geoveloUsername: profile.username,
        geoveloToken: token,
      },
    });
  } catch (error) {
    return null;
  }

  return profile;
}
