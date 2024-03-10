"use client";

import React from "react";
import { Card } from "@/components/ui/card";

export default function CardCentered({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-8 absolute bottom-0 left-0 right-0 top-0 grid place-items-center">
      <Card className="py-4 w-full max-w-2xl">{children}</Card>
    </div>
  );
}
