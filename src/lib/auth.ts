import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";

export const getRequiredAuthSession = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/api/auth/signin");
  }

  return session as {
    user: {
      id: string;
      name: string;
      image?: string;
    };
  };
};
