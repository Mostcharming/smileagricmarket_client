'use client'

import Link from "next/link";
import { useState } from "react";
import KycModal from "../../components/modal/kycModal";
import { Button, MainHeader } from "../../components/ui";
import { FarmIcon, InfoIcon } from "@/components/icons";
import { useGetDashboard, useSubmitKyc } from "@/mutation";
import type { DashboardSummaryResponse, SelectOptions } from "@/types";
import { formatNumberWithCommas } from "@/utils";
import { toast } from "sonner";

type VerificationStatus = "not_verified" | "in_progress" | "verified";
type RoleTab = "farmer" | "investor";

type StatCard = {
  label: string;
  value: string;
  tone: "primary" | "muted";
  currency?: boolean;
};

const buildSummaryCards = (summary?: DashboardSummaryResponse): Record<RoleTab, StatCard[]> => ({
  farmer: [
    {
      label: "Total Farms Listed",
      value: String(summary?.totalFarmsListed ?? 0),
      tone: "primary",
    },
    {
      label: "Completed Farm Projects",
      value: String(summary?.completedFarmProjects ?? 0),
      tone: "primary",
    },
    {
      label: "Expected Investments",
      value: String(summary?.totalExpectedInvestment ?? 0),
      tone: "muted",
      currency: true,
    },
    {
      label: "Investments Received",
      value: String(summary?.totalInvestmentReceived ?? 0),
      tone: "muted",
      currency: true,
    },
  ],
  investor: [
    {
      label: "Total Farms Invested",
      value: String(summary?.totalFarmsListed ?? 0),
      tone: "primary",
    },
    {
      label: "Active Investments",
      value: String(summary?.completedFarmProjects ?? 0),
      tone: "primary",
    },
    {
      label: "Expected Returns",
      value: String(summary?.totalExpectedInvestment ?? 0),
      tone: "muted",
      currency: true,
    },
    {
      label: "Returns Received",
      value: String(summary?.totalInvestmentReceived ?? 0),
      tone: "muted",
      currency: true,
    },
  ],
});

const Dashboard = () => {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("not_verified");
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<RoleTab>("farmer");
  const [number, setNumber] = useState("");
  const [identification, setIdentification] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const { data, isLoading, isError, error } = useGetDashboard();
  const { mutate, isPending } = useSubmitKyc();

  const identificationOptions: SelectOptions[] = [
    { label: "National ID Card", value: "national_id" },
    { label: "International Passport", value: "passport" },
    { label: "Driver's License", value: "driver_license" },
    { label: "Taxpayer Identification Number", value: "tin" },
    { label: "Permanent Voter's Card", value: "voter_card" },
  ];

  const handleKycDone = () => {
    if (!photo) {
      toast.error("Please upload a photo");
      return;
    }

    const formData = new FormData();
    formData.append("identificationType", identification);
    formData.append("identificationNumber", number);
    formData.append("selfie", photo);

    mutate(formData, {
      onSuccess: () => {
        toast.success("KYC submitted successfully");
        setIsKycModalOpen(false);
        setVerificationStatus("in_progress");
        setNumber("");
        setIdentification("");
        setPhoto(null);
      },
      onError: (submitError) => {
        toast.error(submitError?.message || "Failed to submit KYC");
      },
    });
  };

  const summaryCardsByRole = buildSummaryCards(data?.data?.summary);
  const statCards = summaryCardsByRole[activeRole];

  return (
    <div className="min-h-screen w-full">
      <MainHeader activeTab="dashboard" />

      {verificationStatus === "not_verified" && (
        <div className="w-full bg-[#E9EBEF]">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <InfoIcon className="shrink-0" />
              <span className="text-sm text-[#1F2937] sm:text-base">
                You are not verified yet. Please proceed to verify your profile to list your farms.
              </span>
            </div>
            <Button
              variant="primary"
              className="rounded-md px-4! py-2! text-xs font-semibold tracking-[0.02em]"
              onClick={() => setIsKycModalOpen(true)}
            >
              VERIFY YOUR PROFILE
            </Button>
          </div>
        </div>
      )}

      {verificationStatus === "in_progress" && (
        <div className="w-full bg-[#E9EBEF]">
          <div className="mx-auto flex items-center justify-center gap-3 px-4 py-3">
            <InfoIcon className="shrink-0" />
            <span className="text-sm text-[#1F2937] sm:text-base">Your verification is in progress</span>
          </div>
        </div>
      )}

      {verificationStatus === "verified" && (
        <div className="w-full bg-[#D6F3E9]">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-3">
            <div className="flex items-center gap-3">
              <InfoIcon className="shrink-0" />
              <span className="text-lg font-semibold text-[#121926]">Verification Approved!</span>
            </div>
            <span className="pl-9 text-sm text-[#1F2937]">
              Your verification has been approved. You now have access to all features on the smileagrimarket platform
            </span>
            <Link href="/my-farms" className="pl-9">
              <Button
                variant="primary"
                className="w-fit rounded-md px-4! py-2! text-xs font-semibold tracking-[0.02em]"
              >
                LIST YOUR FARM
              </Button>
            </Link>
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-12">
        <div className="mb-6 inline-flex w-full max-w-[320px] rounded-lg bg-[#D4DFCF] p-0.5">
          <button
            type="button"
            onClick={() => setActiveRole("farmer")}
            className={`flex-1 rounded-md px-6 py-1 text-base font-medium transition ${
              activeRole === "farmer"
                ? "bg-white text-[#2A2E31] shadow-sm shadow-[#0A0D1214]"
                : "bg-transparent text-[#3F4742] cursor-pointer"
            }`}
          >
            Farmer
          </button>
          <button
            type="button"
            onClick={() => setActiveRole("investor")}
            className={`flex-1 rounded-md px-6 py-1 text-base font-medium transition ${
              activeRole === "investor"
                ? "bg-white text-[#2A2E31] shadow-sm shadow-[#0A0D1214]"
                : "bg-transparent text-[#3F4742] cursor-pointer"
            }`}
          >
            Investor
          </button>
        </div>

        {isError && (
          <div className="mb-6 rounded-xl border border-[#F2C3C3] bg-[#FFF4F4] px-4 py-3 text-sm text-[#A04444]">
            {error instanceof Error ? error.message : "Unable to load dashboard data right now."}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-[142px] animate-pulse rounded-lg border border-[#E9EAEB] bg-white p-5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => (
              <div key={`${activeRole}-${card.label}`} className="min-h-[120px] rounded-lg border border-[#E9EAEB] bg-white shadow-xs p-5">
                <div className="flex items-center gap-2 text-sm font-medium text-[#222834]">
                  <FarmIcon
                    size={24}
                    color={card.tone === "primary" ? "#5B9F39" : "#98A0B3"}
                    strokeWidth={0.2}
                  />
                  <span>{card.label}</span>
                </div>
                <div className="flex items-center mt-7 text-[44px] leading-none font-semibold text-[#1A1E2B]">
                  {card.currency && <span className="text-[20px] -mt-3">₦</span>}
                  <span>{formatNumberWithCommas(card.value)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <KycModal
        isOpen={isKycModalOpen}
        onClose={() => setIsKycModalOpen(false)}
        number={number}
        setNumber={setNumber}
        identification={identification}
        setIdentification={setIdentification}
        identificationOptions={identificationOptions}
        photo={photo}
        setPhoto={setPhoto}
        isPending={isPending}
        onDone={handleKycDone}
      />
    </div>
  );
};

export default Dashboard;
