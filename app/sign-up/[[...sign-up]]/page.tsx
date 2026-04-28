import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#050305] px-6 py-12 text-white">
      <SignUp forceRedirectUrl="/create" />
    </main>
  );
}
