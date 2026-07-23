"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { MainHeader } from "@/components/ui";
import { FarmIcon, TrendingUpIcon } from "@/components/icons";
import { useGetDashboard } from "@/mutation/dashboard.mutation";

type StatCardProps = {
  iconType: "trend" | "plant";
  value: string;
  label: string;
  trendText: string;
};

const TrendArrowIcon = ({ className }: { className?: string }) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M2 2H8V8M8 2L2 8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StatCard = ({ iconType, value, label, trendText }: StatCardProps) => {
  return (
    <div className="rounded-[20px] border border-[#E9EAEB] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col justify-between min-h-[130px] hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300">
      <div className="flex justify-between items-center">
        <div className="w-9 h-9 rounded-full bg-[#F4F3ED] flex items-center justify-center">
          {iconType === "trend" ? (
            <TrendingUpIcon size={16} color="#4B5563" strokeWidth={2.5} />
          ) : (
            <FarmIcon size={16} color="#4B5563" strokeWidth={0.2} />
          )}
        </div>
        <span className="text-[11px] font-bold text-[#599C38] tracking-wide flex items-center gap-0.5">
          <TrendArrowIcon className="w-2.5 h-2.5 shrink-0" />
          {trendText}
        </span>
      </div>
      
      <div className="mt-4">
        <div className="text-[32px] font-bold text-gray-900 leading-none tracking-tight">
          {value}
        </div>
        <div className="text-[12px] font-medium text-gray-500 mt-1">
          {label}
        </div>
      </div>
    </div>
  );
};

type InvestmentItem = {
  id: string;
  name: string;
  category: string;
  location: string;
  status: "not_started" | "harvest" | "land_preparation" | "completed";
  statusLabel: string;
  invested: string;
  roi: string;
  payout: string;
  progress: number;
  image: string;
};

const mockInvestments: InvestmentItem[] = [
  {
    id: "inv-1",
    name: "Oakhaven Almond Grove",
    category: "VEGETABLE",
    location: "Sacramento Valley, CA",
    status: "not_started",
    statusLabel: "Not Started",
    invested: "$125,000",
    roi: "12.5%",
    payout: "Oct 12",
    progress: 62,
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "inv-2",
    name: "RubyBerry Vertical Farm",
    category: "FRUIT",
    location: "Austin, TX",
    status: "harvest",
    statusLabel: "Harvest",
    invested: "$125,000",
    roi: "12.5%",
    payout: "Oct 12",
    progress: 34,
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "inv-3",
    name: "Golden Valley Vineyard",
    category: "CEREAL",
    location: "Napa, CA",
    status: "land_preparation",
    statusLabel: "Land Preparation",
    invested: "$125,000",
    roi: "12.5%",
    payout: "Oct 12",
    progress: 84,
    image: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "inv-4",
    name: "Sierra Highlands Coffee",
    category: "GRAIN",
    location: "Boquete, Panama",
    status: "land_preparation",
    statusLabel: "Land Preparation",
    invested: "$125,000",
    roi: "12.5%",
    payout: "Oct 12",
    progress: 12,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "inv-5",
    name: "Pine Creek Orchard",
    category: "FRUIT",
    location: "Yakima Valley, WA",
    status: "completed",
    statusLabel: "Completed",
    invested: "$95,000",
    roi: "14.0%",
    payout: "Jul 10",
    progress: 100,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=600&auto=format&fit=crop"
  }
];

export default function MyPortfolio() {
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">("all");
  const [lastUpdated, setLastUpdated] = useState("Nov 16");

  const { data: dashboardResponse } = useGetDashboard();

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    setLastUpdated(new Date().toLocaleDateString("en-US", options));
  }, []);

  const summary = dashboardResponse?.data?.summary;

  const stats = useMemo(() => {
    const formattedExpectedReturns = summary?.totalExpectedInvestment 
      ? `₦${(summary.totalExpectedInvestment / 1000000).toFixed(2)}M`
      : "₦8.45M";

    const formattedEarnedReturns = summary?.totalInvestmentReceived
      ? `₦${(summary.totalInvestmentReceived / 1000000).toFixed(2)}M`
      : "₦8.45M";

    // Use a helper total invested matching expected returns if no api data
    const formattedTotalInvested = summary 
      ? `₦${((summary.totalExpectedInvestment || 0) + (summary.totalInvestmentReceived || 0)).toFixed(2)}M`
      : "₦8.45M";

    // If API returns zero or undefined, fallback to mockup values
    const isMockFallback = !summary || (summary.totalExpectedInvestment === 0 && summary.totalInvestmentReceived === 0);

    return {
      totalInvested: isMockFallback ? "₦8.45M" : (formattedTotalInvested === "₦0.00M" ? "₦8.45M" : formattedTotalInvested),
      farmsInvested: isMockFallback ? "248" : String(summary.totalFarmsListed || "248"),
      totalExpectedReturns: isMockFallback ? "₦8.45M" : (formattedExpectedReturns === "₦0.00M" ? "₦8.45M" : formattedExpectedReturns),
      earnedReturns: isMockFallback ? "₦8.45M" : (formattedEarnedReturns === "₦0.00M" ? "₦8.45M" : formattedEarnedReturns),
    };
  }, [summary]);

  const filteredInvestments = useMemo(() => {
    return mockInvestments.filter((item) => {
      if (activeTab === "all") return true;
      if (activeTab === "active") return item.status !== "completed";
      if (activeTab === "completed") return item.status === "completed";
      return true;
    });
  }, [activeTab]);

  return (
    <div className="min-h-screen w-full bg-[#F6F9FB]">
      <MainHeader activeTab="my-portfolio" />

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] tracking-tight">
            My Portfolio
          </h1>
          <p className="mt-1 text-sm text-[#9CA3AF] font-medium">
            Last Updated {lastUpdated}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard
            iconType="trend"
            value={stats.totalInvested}
            label="Total Invested"
            trendText="+0.240% MoM"
          />
          <StatCard
            iconType="plant"
            value={stats.farmsInvested}
            label="Farms Invested"
            trendText="+12 this week"
          />
          <StatCard
            iconType="trend"
            value={stats.totalExpectedReturns}
            label="Total Expected Returns"
            trendText="+0.240% MoM"
          />
          <StatCard
            iconType="trend"
            value={stats.earnedReturns}
            label="Earned Returns"
            trendText="+0.240% MoM"
          />
        </div>

        {/* Investments Header with Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#111827] tracking-tight">
              My Investments
            </h2>
            <p className="mt-0.5 text-xs text-[#9CA3AF] font-medium">
              Click any position to track milestones.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {(["all", "active", "completed"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-xs font-bold transition-all cursor-pointer rounded-full border ${
                  activeTab === tab
                    ? "bg-white text-gray-900 border-gray-200 shadow-xs"
                    : "bg-transparent text-gray-400 border-transparent hover:text-gray-900"
                }`}
              >
                {tab === "all" ? "All" : tab === "active" ? "Active" : "Completed"}
              </button>
            ))}
          </div>
        </div>

        {/* Investments List */}
        {filteredInvestments.length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-[#DCE7D1] bg-white p-12 text-center">
            <p className="text-sm font-semibold text-[#6B7280]">
              No investments found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredInvestments.map((item) => (
              <Link
                key={item.id}
                href={`/invest/${item.id}`}
                className="group flex flex-col sm:flex-row bg-white border border-[#E5E7EB] rounded-[20px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                {/* Image Section */}
                <div className="relative w-full h-[160px] sm:w-[160px] sm:h-auto shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white text-[9px] font-extrabold text-gray-900 px-2 py-0.5 rounded-md tracking-wider uppercase">
                    {item.category}
                  </span>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Top Row with Title & Status */}
                    <div className="flex justify-between items-start gap-3">
                      <h3 className="font-bold text-[17px] text-gray-900 tracking-tight leading-tight line-clamp-1">
                        {item.name}
                      </h3>
                      <span
                        className={`shrink-0 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          item.status === "completed"
                            ? "bg-[#EFF6FF] text-[#1D4ED8]"
                            : item.status === "not_started"
                            ? "bg-[#F3F4F6] text-[#4B5563]"
                            : "bg-[#ECFDF5] text-[#059669]"
                        }`}
                      >
                        {item.statusLabel}
                      </span>
                    </div>

                    {/* Location */}
                    <p className="text-xs font-medium text-gray-400 mt-1">
                      {item.location}
                    </p>

                    {/* Fields Grid */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100">
                      <div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Invested
                        </div>
                        <div className="text-[14px] font-bold text-gray-900">
                          {item.invested}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                          ROI
                        </div>
                        <div className="text-[14px] font-bold text-[#059669]">
                          {item.roi}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Payout
                        </div>
                        <div className="text-[14px] font-bold text-gray-900">
                          {item.payout}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Section (Inline Horizontal Row) */}
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
                      Progress
                    </span>
                    <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#185B37] rounded-full transition-all duration-500"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-gray-500 shrink-0">
                      {item.progress}%
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
