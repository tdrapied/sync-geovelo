import { getRequiredAuthSession } from "@/lib/auth";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import CardCentered from "@/components/atoms/card-centered";
import GeoveloConfigCard from "@/components/atoms/geovelo-config-card";

export default async function Dashboard() {
  const session = await getRequiredAuthSession();
  const user = await prisma.user.findFirstOrThrow({
    where: { id: session.user.id },
  });

  if (!user.isVerified) {
    return (
      <CardCentered>
        <CardHeader>
          <CardTitle>Compte non vérifié</CardTitle>
          <CardDescription>
            Votre compte n'a pas encore été vérifié. <br />
            Un administrateur doit vérifier votre compte avant de pouvoir
            utiliser l'application.
          </CardDescription>
        </CardHeader>
      </CardCentered>
    );
  }

  if (!user.geoveloToken) {
    return <GeoveloConfigCard userId={session.user.id} />;
  }

  return (
    <div className="container mt-10">
      <h1 className="text-4xl font-bold">Bonjour, {session.user?.name} !</h1>
      <div className="flex justify-center items-center h-96 text-2xl">
        In progress ...
      </div>
    </div>
  );
}
