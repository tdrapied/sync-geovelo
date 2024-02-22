import { getRequiredAuthSession } from "@/lib/auth";
import UserNavbar from "@/components/user-navbar";

export default async function Component() {
  const session = await getRequiredAuthSession();

  return (
    <nav className="container h-14 flex items-center justify-between">
      <div className="text-xl font-bold">sync-geovelo</div>
      <UserNavbar
        username={session?.user?.name ?? ""}
        image={session?.user?.image ?? undefined}
      />
    </nav>
  );
}
