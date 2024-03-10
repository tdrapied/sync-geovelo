import { getRequiredAuthSession } from "@/lib/auth";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import CardCentered from "@/components/atoms/card-centered";
import GeoveloConfigCard from "@/components/atoms/geovelo-config-card";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";
import React from "react";

export default async function Dashboard() {
  const { t } = useTranslation("common");

  const session = await getRequiredAuthSession();
  const user = await prisma.user.findFirstOrThrow({
    where: { id: session.user.id },
  });

  if (!user.isVerified) {
    return (
      <CardCentered>
        <CardHeader>
          <CardTitle>{t("card-title-unverified")}</CardTitle>
          <CardDescription>
            <Trans
              i18nKey="common:card-description-unverified"
              components={{
                br: <br />,
              }}
            />
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
