import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkLoaded, ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BaatSheet",
  description: "Created By Shubhankit Jain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className="min-h-screen h-screen overfow-hidden flex flex-col"
      >
        <body className={inter.className}>
          <ClerkLoaded>{children}</ClerkLoaded>
        </body>
        <Toaster richColors duration={5000} />
      </html>
    </ClerkProvider>
  );
}
