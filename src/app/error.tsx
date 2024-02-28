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
        <CardTitle>Something went wrong!</CardTitle>
        <CardDescription>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button onClick={() => reset()}>Try again</Button>
      </CardFooter>
    </CardCentered>
  );
}
