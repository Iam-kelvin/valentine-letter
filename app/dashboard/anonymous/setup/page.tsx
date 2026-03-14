import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAnonymousProfileByUserId } from "@/lib/anonymous-db";
import SetupForm from "./setup-form";
import {
  anonPageStyle,
  anonWrapStyle,
  anonHeroStyle,
  anonBadgeStyle,
  anonTitleStyle,
  anonSubtitleStyle,
} from "@/lib/anonymous-ui";

export default async function SetupAnonymousPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/anonymous/sign-in");
  }

  const profile = await getAnonymousProfileByUserId(userId);
  if (profile) {
    redirect("/dashboard/anonymous");
  }

  return (
    <main style={anonPageStyle}>
      <div style={anonWrapStyle}>
        <div style={anonHeroStyle}>
          <div style={anonBadgeStyle}>✨ Setup</div>
          <h1 style={anonTitleStyle}>Set up your anonymous link</h1>
          <p style={anonSubtitleStyle}>
            Choose a username to create your public inbox link.
          </p>
        </div>

        <SetupForm />
      </div>
    </main>
  );
}