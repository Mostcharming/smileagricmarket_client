import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "sonner";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

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
      <body
        className={roboto.className}
      >
        <QueryProvider>
          <Toaster position="top-center" />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
