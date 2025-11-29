"use client"

import type { AppProps } from "next/app";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "sonner";
import "@/app/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryProvider>
      <Toaster position="top-center" />
      <Component {...pageProps} />
    </QueryProvider>
  );
}