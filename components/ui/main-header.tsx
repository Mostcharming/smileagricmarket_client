'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { BellIcon, LogoIcon } from "@/components/icons";
import { getStoredUser } from "@/utils";

type MainHeaderProps = {
  activeTab: "dashboard" | "my-farms";
};

const getInitialsFromFullName = (fullName?: string) => {
  const cleanedName = fullName?.trim();

  if (!cleanedName) {
    return "SA";
  }

  const nameParts = cleanedName.split(/\s+/).filter(Boolean);
  return nameParts.length === 1
    ? nameParts[0].slice(0, 2).toUpperCase()
    : `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
};

const getStoredInitials = () => {
  const currentUser = getStoredUser();
  return getInitialsFromFullName(currentUser?.fullName);
};

const MainHeader = ({ activeTab }: MainHeaderProps) => {
  const [initials, setInitials] = useState("SA");

  useEffect(() => {
    const handleStorageChange = () => {
      setInitials(getStoredInitials());
    };

    handleStorageChange();

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const dashboardClassName = `flex px-2 pb-1 text-sm font-medium ${
    activeTab === "dashboard"
      ? "border-b-2 border-[#111827] text-[#111827]"
      : "border-b-2 border-transparent text-[#111827]"
  }`;

  const myFarmsClassName = `flex items-center px-2 pb-1 border-b-2 text-sm font-medium ${
    activeTab === "my-farms"
      ? "border-[#111827] text-[#111827]"
      : "border-transparent text-[#111827]"
  }`;

  return (
    <header className="w-full border-y border-[#E5E7EB] bg-white">
      <div className="mx-auto flex w-full max-w-7xl justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" aria-label="SmileAgrimarket Dashboard" className="inline-flex items-center py-4">
          <LogoIcon className="h-11 w-12" />
        </Link>

        <nav className="flex gap-6" aria-label="Main dashboard navigation">
          <Link href="/dashboard" className={dashboardClassName} aria-current={activeTab === "dashboard" ? "page" : undefined}>
            <div className="flex items-center gap-1">Dashboard</div>
          </Link>
          <Link href="/my-farms" className={myFarmsClassName} aria-current={activeTab === "my-farms" ? "page" : undefined}>
            My Farms
          </Link>
        </nav>

        <div className="flex items-center gap-5 py-4">
          <button
            type="button"
            className="rounded-md text-[#9CA3AF] transition hover:text-[#6B7280]"
            aria-label="Notifications"
          >
            <BellIcon size={24} color="currentColor" strokeWidth={2.2} />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D1D5DB] text-base font-medium text-[#FFFFFF]">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;