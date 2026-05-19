import type { Metadata } from "next";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmileAgrimarket",
  description: "SmileAgrimarket",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <Toaster position="top-center" />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
