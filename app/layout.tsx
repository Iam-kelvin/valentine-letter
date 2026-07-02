import {
  Caveat,
  Cormorant_Garamond,
  Dancing_Script,
  Geist,
  Geist_Mono,
  Pacifico,
  Playfair_Display,
} from "next/font/google";
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

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
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
        className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} ${caveat.variable} ${playfair.variable} ${cormorant.variable} ${pacifico.variable} antialiased`}
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(255, 0, 128, 0.12), transparent 60%), linear-gradient(180deg, #13040a, #060304)",
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
