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

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <CardCentered>
      <CardHeader>
        <CardTitle>Quelque chose n'a pas fonctionné !</CardTitle>
        <CardDescription>Veuillez réessayer ultérieurement.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button onClick={() => reset()}>Recommencer</Button>
      </CardFooter>
    </CardCentered>
  );
}
