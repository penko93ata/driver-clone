import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { PostHogProvider } from "./_providers/posthog-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Drive Clone App",
  description: "Supposed to replicate Google Drive",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <PostHogProvider>
        <html lang="en" className={`${GeistSans.variable}`}>
          <body>
            {children}
            <Toaster position="top-center" richColors closeButton />
          </body>
        </html>
      </PostHogProvider>
    </ClerkProvider>
  );
}
