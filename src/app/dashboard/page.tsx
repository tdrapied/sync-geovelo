import { getRequiredAuthSession } from "@/lib/auth";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import CardCentered from "@/components/atoms/card-centered";

export default async function Dashboard() {
  const session = await getRequiredAuthSession();
  const user = await prisma.user.findFirstOrThrow({
    where: { id: session.user.id },
  });

  if (!user.isVerified) {
    return (
      <CardCentered>
        <CardHeader>
          <CardTitle>Unverified account</CardTitle>
          <CardDescription>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </CardDescription>
        </CardHeader>
      </CardCentered>
    );
  }

  return (
    <div className="container mt-10">
      <h1 className="text-4xl font-bold">Hello, {session.user?.name} !</h1>
      <div className="flex justify-center items-center h-96 text-2xl">
        In progress ...
      </div>
    </div>
  );
}
