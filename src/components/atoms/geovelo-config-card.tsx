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

const formSchema = z.object({
  id: z.string().min(1),
  token: z.string().min(1),
});

export default function GeoveloConfigCard({ userId }: { userId: string }) {
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
          <CardTitle>Compte Geovelo ajouté</CardTitle>
          <CardDescription>
            Vous êtes maintenant relié avec le compte
            <b>{geoveloProfile.username}</b>.
            <br />
            Vous pouvez dorénavant utiliser l'application.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => window.location.reload()}>Suivant</Button>
        </CardFooter>
      </CardCentered>
    );
  }

  return (
    <CardCentered>
      <CardHeader>
        <CardTitle>Configurez votre compte Geovelo</CardTitle>
        <CardDescription>
          Pour commencer, veuillez configurer votre compte Geovelo. <br />
          Pour ce faire, renseignez votre token.
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
                  <FormLabel>ID de l'utilisateur</FormLabel>
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
                  <FormLabel>Token</FormLabel>
                  <FormControl>
                    <Input placeholder="XXXXXXXXXXXX" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {error && <p className="text-red-500">Identifiant invalide</p>}

            <Button type="submit" disabled={loading}>
              Valider
            </Button>
          </form>
        </Form>
      </CardContent>
    </CardCentered>
  );
}
