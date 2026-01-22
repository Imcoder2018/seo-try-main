import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SsoCallbackPage() {
  const user = await currentUser();
  
  if (user) {
    // User is authenticated, redirect to home or history page
    redirect("/");
  }
  
  // If no user, redirect to sign-in
  redirect("/sign-in");
}
