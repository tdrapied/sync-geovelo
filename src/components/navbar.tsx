import { getRequiredAuthSession } from "@/lib/auth";
import UserNavbar from "@/components/user-navbar";
import useTranslation from "next-translate/useTranslation";

export default async function Component() {
  const { t } = useTranslation("common");
  const session = await getRequiredAuthSession();

  return (
    <header className="flex items-center">
      <nav className="container h-14 flex items-center justify-between z-10">
        <div className="text-xl font-bold">{t("title")}</div>
        <UserNavbar
          username={session.user.name ?? ""}
          image={session.user.image ?? undefined}
        />
      </nav>
    </header>
  );
}
