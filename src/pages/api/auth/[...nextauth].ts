import { PrismaClient } from "@prisma/client";
import NextAuth, { AuthOptions } from "next-auth";
import StravaProvider from "next-auth/providers/strava";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    StravaProvider({
      clientId: process.env.STRAVA_ID as string,
      clientSecret: process.env.STRAVA_SECRET as string,
      authorization: {
        params: {
          scope: "read_all",
        },
      },
      token: {
        async request({ client, params, checks, provider }) {
          const tokens = await client.oauthCallback(
            provider.callbackUrl,
            params,
            checks,
          );

          // Remove "athlete" field from tokens
          delete tokens.athlete;

          return {
            tokens: tokens,
          };
        },
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      return {
        ...session,
        user: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      };
    },
  },
};

export default NextAuth(authOptions);
