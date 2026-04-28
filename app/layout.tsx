import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import SiteNav from "@/components/SiteNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Send With Love",
  description: "Create beautiful, personal letters for birthdays, mothers, love, and more in seconds.",
  // openGraph: {
  //   title: "Send With Love",
  //   description:
  //     "Create meaningful letters for any occasion in seconds.",
  //   url: "https://sendwithlove.app",
  //   siteName: "Send With Love",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(255, 0, 128, 0.12), transparent 60%), #000",
          color: "#fff",
        }}
      >
        <SiteNav />
        {children}
        <Analytics />
      </body>
    </html>
    </ClerkProvider>
  );
}
