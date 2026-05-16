'use client'

import React from "react";
import { useParams, usePathname } from "next/navigation";
import AdminLayout from "@/components/ui/admin-layout";
import { useGetAdminFarmById } from "@/mutation";

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
  const params = useParams();

  const segments = (pathname ?? "").split("/").filter(Boolean);
  const adminIndex = segments.indexOf("admin");
  const afterAdmin = adminIndex >= 0 ? segments.slice(adminIndex + 1) : segments;
  const farmId = typeof params?.farmId === "string" ? params.farmId : undefined;
  const isFarmDetailPage = afterAdmin[0] === "farms" && afterAdmin.length > 1 && !!farmId;

  const { data: farmData } = useGetAdminFarmById(isFarmDetailPage ? farmId : undefined);

  const rest = afterAdmin.filter((seg) => seg !== "dashboard");
  const breadcrumbs = [
    "Dashboard",
    ...rest.slice(0, -1).map(formatSegment),
    isFarmDetailPage ? farmData?.name || "Farm details" : formatSegment(rest[rest.length - 1] || ""),
  ].filter(Boolean);
  const title = breadcrumbs[breadcrumbs.length - 1];

  return (
    <AdminLayout title={title} breadcrumbs={breadcrumbs}>
      {children}
    </AdminLayout>
  );
}
