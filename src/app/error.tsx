"use client";

import { useEffect } from "react";
import {
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CardCentered from "@/components/atoms/card-centered";
import { Button } from "@/components/ui/button";
import useTranslation from "next-translate/useTranslation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation("common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <CardCentered>
      <CardHeader>
        <CardTitle>{t("card-title-error")}</CardTitle>
        <CardDescription>{t("card-description-error")}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button onClick={() => reset()}>{t("reset")}</Button>
      </CardFooter>
    </CardCentered>
  );
}
