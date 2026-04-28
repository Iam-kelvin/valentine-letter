import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#050305] px-6 py-12 text-white">
      <SignIn forceRedirectUrl="/create" />
    </main>
  );
}
