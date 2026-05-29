'use client'

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { InfoIcon } from "@/components/icons";
import { Input, MainHeader, Select, ProfileCompletion } from "@/components/ui";
import { getStoredUser } from "@/utils";
import type { profileSchema, SelectOptions } from "@/types";

const bankOptions: SelectOptions[] = [
  { label: "Access Bank", value: "access_bank" },
  { label: "First Bank", value: "first_bank" },
  { label: "GTBank", value: "gtbank" },
  { label: "UBA", value: "uba" },
  { label: "Zenith Bank", value: "zenith_bank" },
];

const getInitials = (fullName?: string) => {
  const cleanedName = fullName?.trim();

  if (!cleanedName) {
    return "JM";
  }

  const parts = cleanedName.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const SettingsPage = () => {
  const [storedUser, setStoredUser] = useState<profileSchema | null>(() => getStoredUser());
  const [bank, setBank] = useState("access_bank");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState(() => storedUser?.fullName ?? "");

  useEffect(() => {
    const handleStorageChange = () => {
      const user = getStoredUser();
      setStoredUser(user);

      if (user?.fullName) {
        setAccountName(user.fullName);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const initials = useMemo(() => getInitials(storedUser?.fullName || accountName), [accountName, storedUser?.fullName]);
  const completion = 64;

  return (
    <div className="min-h-screen bg-[#EFF8E8]">
      <MainHeader />

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-[13px] text-[#A0A79A]">
          <Link href="/dashboard" className="hover:text-[#6B7280]">
            Home
          </Link>
          <span className="px-1">/</span>
          <Link href="/profile" className="hover:text-[#6B7280]">
            Profile
          </Link>
          <span className="px-1">/</span>
          <span className="font-medium text-[#78806F]">Account Details</span>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_264px] lg:items-start">
          <section className="rounded-[18px] border border-[#DFE7D3] bg-white px-6 py-7 shadow-[0_3px_8px_rgba(21,28,11,0.03)] sm:px-8 sm:py-8">
            <h1 className="text-[21px] font-semibold text-[#374151]">Account Details</h1>

            <div className="mt-8 flex items-center rounded-2xl bg-[#F8ECD2] px-4 py-3 text-[15px] leading-6 text-[#2E3640]">
              <InfoIcon className="mr-3 shrink-0" />
              <p>Ensure you enter correct information here to prevent errors when paying you</p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_1fr]">
              <Select
                label="Select Bank"
                labelClassName="!text-[#9CA39A]"
                value={bank}
                onChange={(event) => setBank(event.target.value)}
                options={bankOptions}
                placeholder="Select Bank"
                minWidth="100%"
                className="rounded-md border-[#D1D7C9] bg-white px-3 py-4 text-[#1F2937]"
              />
              <Input id="account-number" label="Account Number" value={accountNumber} onChange={(event) => setAccountNumber(event.target.value)} />
            </div>

            <div className="mt-4">
              <Input id="account-name" label="Enter Account Name" value={accountName} onChange={(event) => setAccountName(event.target.value)} />
            </div>

            <button
              type="button"
              className="mt-8 inline-flex min-w-44 items-center justify-center rounded-md bg-[#5DA334] px-6 py-2 text-[15px] font-semibold text-white shadow-[0_2px_0_rgba(0,0,0,0.04)] transition hover:bg-[#4E912A]"
            >
              Save
            </button>
          </section>

          <ProfileCompletion
            completion={completion}
            items={[
              { label: "Basic details", status: "Complete", tone: "bg-[#EAF6DF] text-[#7AB44A]", complete: true },
              { label: "KYC Verification", status: "Pending", tone: "bg-[#F3F4F6] text-[#78716C]" },
              { label: "Wallet/Account", status: "Setup", tone: "bg-[#EAF6DF] text-[#7AB44A]", href: "/settings" },
            ]}
          />
        </div>
      </main>

      <div className="pointer-events-none fixed right-4 top-16 hidden h-0 w-0 sm:block" aria-hidden="true">
        <span className="sr-only">{initials}</span>
      </div>
    </div>
  );
};

export default SettingsPage;