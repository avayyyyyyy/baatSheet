import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkLoaded, ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "बातSheet",
  description: "Created By Shubhankit Jain",
};

// Extend the JSX.IntrinsicElements interface to include custom elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "widget-web-component": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        projectid: string;
      };
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="min-h-screen h-screen flex flex-col">
        <head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
        </head>
        <body className={inter.className}>
          <ClerkLoaded>
            {children}
            <Analytics />
          </ClerkLoaded>
          <Toaster richColors duration={3000} closeButton />

          <div style={{ position: "fixed", bottom: "30px", right: "20px" }}>
            <widget-web-component projectid="clzl198je0003rr5il2rmpohk"></widget-web-component>
          </div>
          <script
            async
            src="https://opinify-widget-w24d.vercel.app/widget.umd.js"
          ></script>
        </body>
      </html>
    </ClerkProvider>
  );
}
