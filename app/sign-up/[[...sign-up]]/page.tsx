import { SignUp } from "@clerk/nextjs";

function getSafeRedirect(value?: string) {
  if (value?.startsWith("/create")) return value;
  return "/create";
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams?: Promise<{ redirect_url?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const redirectUrl = getSafeRedirect(params.redirect_url);

  return (
    <main className="grid min-h-screen place-items-center bg-[#050305] px-6 py-12 text-white">
      <SignUp forceRedirectUrl={redirectUrl} />
    </main>
  );
}
