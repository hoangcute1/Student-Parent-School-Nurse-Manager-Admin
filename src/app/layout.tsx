import type { Metadata } from "next";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/components/auth-provider";

export const metadata: Metadata = {
  title: "Y tế học đường",
  description: "Created with v0",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
