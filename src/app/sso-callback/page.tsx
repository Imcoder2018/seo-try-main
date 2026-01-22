import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SsoCallbackPage() {
  const user = await currentUser();

  if (user) {
    redirect("/");
  }

  redirect("/sign-in");
}
