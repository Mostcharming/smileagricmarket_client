"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { InfoIcon } from "@/components/icons";
import { Input, MainHeader, Select, ProfileCompletion } from "@/components/ui";
import { getStoredUser, setStoredUser as setStoredUserInStorage } from "@/utils";
import type { profileSchema, SelectOptions } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetWebBanks,
  useGetWebProfile,
  useGetWebProfileCompletionStatus,
  useGetWebProfileWallet,
  useSetupWebProfileWallet,
} from "@/mutation";
import { toast } from "sonner";

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

const completeTone = "bg-[#EAF6DF] text-[#7AB44A]";
const pendingTone = "bg-[#F3F4F6] text-[#78716C]";

const mapProfileToStoredUser = (profile?: {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  gender?: string;
  profileImageUrl?: string;
  profileImage?: string;
  bio?: string;
  isPhoneVerified?: boolean;
  kycStatus?: string;
  kycInfo?: Record<string, unknown>;
  wallet?: unknown;
}): profileSchema | null => {
  if (!profile) {
    return null;
  }

  return {
    id: profile.id,
    fullName: profile.fullName,
    email: profile.email,
    phoneNumber: profile.phoneNumber,
    gender: profile.gender,
    profileImage: profile.profileImageUrl ?? profile.profileImage,
    profileImageUrl: profile.profileImageUrl,
    bio: profile.bio,
    isPhoneVerified: profile.isPhoneVerified,
    kycStatus: profile.kycStatus,
    kycInfo: profile.kycInfo,
    wallet: profile.wallet,
  };
};

const SettingsPage = () => {
  const [storedUser, setStoredUser] = useState<profileSchema | null>(null);
  const queryClient = useQueryClient();
  const { data: profileResponse } = useGetWebProfile();
  const { data: walletResponse } = useGetWebProfileWallet();
  const { data: banksResponse, isLoading: isBanksLoading } = useGetWebBanks();
  const { data: completionResponse } = useGetWebProfileCompletionStatus();
  const { mutate: setupWallet, isPending: isSavingWallet } = useSetupWebProfileWallet();

  const profileSeed = useMemo(
    () => mapProfileToStoredUser(profileResponse?.data) ?? storedUser,
    [profileResponse?.data, storedUser]
  );

  useEffect(() => {
    setStoredUser(getStoredUser());

    const handleStorageChange = () => {
      setStoredUser(getStoredUser());
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (profileSeed) {
      setStoredUserInStorage(profileSeed);
    }
  }, [profileSeed]);

  const initials = useMemo(() => getInitials(profileSeed?.fullName), [profileSeed?.fullName]);
  const completion = completionResponse?.data?.completionPercentage ?? 64;
  const bankOptions: SelectOptions[] = useMemo(
    () => (banksResponse?.data ?? []).map((bankEntry) => ({ label: bankEntry.name, value: bankEntry.name })),
    [banksResponse?.data]
  );
  const walletComplete = Boolean(completionResponse?.data?.profileStatus?.walletSetup);
  const walletFormKey = walletResponse?.data
    ? [walletResponse.data.id, walletResponse.data.bankName, walletResponse.data.accountNumber, walletResponse.data.accountName].join("|")
    : `stored-${profileSeed?.id ?? "wallet-form"}`;

  const WalletForm = () => {
    const [bank, setBank] = useState(walletResponse?.data?.bankName ?? "");
    const [accountNumber, setAccountNumber] = useState(walletResponse?.data?.accountNumber ?? "");
    const [accountName, setAccountName] = useState(walletResponse?.data?.accountName ?? profileSeed?.fullName ?? "");

    const handleSaveWallet = () => {
      setupWallet(
        {
          bankName: bank,
          accountNumber,
          accountName,
        },
        {
          onSuccess: async (response) => {
            const nextUser: profileSchema = {
              ...(profileSeed ?? { id: response.data.userId, fullName: accountName, email: "" }),
              fullName: accountName,
              wallet: response.data,
            };

            setStoredUser(nextUser);
            setStoredUserInStorage(nextUser);
            await queryClient.invalidateQueries({ queryKey: ["webProfile"] });
            await queryClient.invalidateQueries({ queryKey: ["webProfileWallet"] });
            await queryClient.invalidateQueries({ queryKey: ["webProfileCompletionStatus"] });
            await queryClient.refetchQueries({ queryKey: ["webProfile"] });
            await queryClient.refetchQueries({ queryKey: ["webProfileWallet"] });
            await queryClient.refetchQueries({ queryKey: ["webProfileCompletionStatus"] });
            toast.success(response.message || "Wallet setup successfully");
          },
          onError: (error) => {
            toast.error(error.message || "Failed to save wallet details");
          },
        }
      );
    };

    return (
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
            emptyState={isBanksLoading ? "Loading banks..." : "No banks available"}
          />
          <Input id="account-number" label="Account Number" value={accountNumber} onChange={(event) => setAccountNumber(event.target.value)} />
        </div>

        <div className="mt-4">
          <Input id="account-name" label="Enter Account Name" value={accountName} onChange={(event) => setAccountName(event.target.value)} />
        </div>

        <button
          type="button"
          onClick={handleSaveWallet}
          disabled={isSavingWallet}
          className="mt-8 inline-flex min-w-44 items-center justify-center rounded-md bg-[#5DA334] px-6 py-2 text-[15px] font-semibold text-white shadow-[0_2px_0_rgba(0,0,0,0.04)] transition hover:bg-[#4E912A] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSavingWallet ? "Saving..." : "Save"}
        </button>
      </section>
    );
  };

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
          <WalletForm key={walletFormKey} />

          <ProfileCompletion
            completion={completion}
            items={[
              {
                label: "Basic details",
                status: completionResponse?.data?.profileStatus?.fullName ? "Complete" : "Pending",
                tone: completionResponse?.data?.profileStatus?.fullName ? completeTone : pendingTone,
                complete: Boolean(completionResponse?.data?.profileStatus?.fullName),
              },
              {
                label: "KYC Verification",
                status: completionResponse?.data?.profileStatus?.kycVerification ? "Complete" : "Pending",
                tone: completionResponse?.data?.profileStatus?.kycVerification ? completeTone : pendingTone,
                complete: Boolean(completionResponse?.data?.profileStatus?.kycVerification),
              },
              {
                label: "Wallet/Account",
                status: walletComplete ? "Setup" : "Pending",
                tone: walletComplete ? completeTone : pendingTone,
                href: "/settings",
                complete: walletComplete,
              },
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