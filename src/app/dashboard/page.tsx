import { getRequiredAuthSession } from "@/lib/auth";

export default async function Dashboard() {
  const session = await getRequiredAuthSession();

  return (
    <div className="container mt-10">
      <h1 className="text-4xl font-bold">Hello, {session.user?.name} !</h1>
      <div className="flex justify-center items-center h-96 text-2xl">
        In progress ...
      </div>
    </div>
  );
}
