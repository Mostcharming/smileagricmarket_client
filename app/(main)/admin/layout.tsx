'use client'

import React from "react";
import { usePathname } from "next/navigation";
import AdminLayout from "@/components/ui/admin-layout";

const formatSegment = (segment: string) =>
  segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const segments = (pathname ?? "").split("/").filter(Boolean);
  const adminIndex = segments.indexOf("admin");
  const afterAdmin = adminIndex >= 0 ? segments.slice(adminIndex + 1) : segments;

  const rest = afterAdmin.filter((seg) => seg !== "dashboard");
  const breadcrumbs = ["Dashboard", ...rest.map(formatSegment)];
  const title = breadcrumbs[breadcrumbs.length - 1];

  return (
    <AdminLayout title={title} breadcrumbs={breadcrumbs}>
      {children}
    </AdminLayout>
  );
}
