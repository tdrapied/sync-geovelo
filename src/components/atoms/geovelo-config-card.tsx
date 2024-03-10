"use client";

import React, { useState } from "react";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CardCentered from "@/components/atoms/card-centered";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { updateGeoveloAccount } from "@/app/actions/updateGeoveloAccount";
import { IGeoveloUser } from "@/interfaces/types";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";

const formSchema = z.object({
  id: z.string().min(1),
  token: z.string().min(1),
});

export default function GeoveloConfigCard({ userId }: { userId: string }) {
  const { t } = useTranslation("common");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [geoveloProfile, setGeoveloProfile] = useState<IGeoveloUser | null>(
    null,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      token: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(false);

    try {
      const profile = await updateGeoveloAccount(
        userId,
        values.id,
        values.token,
      );
      if (!profile) {
        setError(true);
        return;
      }

      setGeoveloProfile(profile);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (geoveloProfile) {
    return (
      <CardCentered>
        <CardHeader>
          <CardTitle>{t("card-title-geovelo-success")}</CardTitle>
          <CardDescription>
            <Trans
              i18nKey="common:card-description-geovelo-success"
              values={{
                username: geoveloProfile.username,
              }}
              components={{
                b: <b />,
                br: <br />,
              }}
            />
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => window.location.reload()}>{t("next")}</Button>
        </CardFooter>
      </CardCentered>
    );
  }

  return (
    <CardCentered>
      <CardHeader>
        <CardTitle>{t("card-title-geovelo-config")}</CardTitle>
        <CardDescription>
          <Trans
            i18nKey="common:card-description-geovelo-config"
            components={{
              br: <br />,
            }}
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("user-id")}</FormLabel>
                  <FormControl>
                    <Input placeholder="123456789" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("token")}</FormLabel>
                  <FormControl>
                    <Input placeholder="XXXXXXXXXXXX" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {error && <p className="text-red-500">{t("invalid-id")}</p>}

            <Button type="submit" disabled={loading}>
              {t("submit")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </CardCentered>
  );
}
