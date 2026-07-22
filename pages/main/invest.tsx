"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import clsx from "clsx";
import { EyeIcon, FilterIcon, SearchIcon } from "@/components/icons";
import { MainHeader, Select } from "@/components/ui";
import { useGetFarms } from "@/mutation/farms.mutation";
import { useGetFarmCategories, useGetDashboard } from "@/mutation/dashboard.mutation";
import { formatNumberWithCommas } from "@/utils";
import { FarmResponse } from "@/types";

// Standard options for select filters
const riskOptions = [
  { label: "Risk Level: All", value: "" },
  { label: "Low Risk", value: "LOW RISK" },
  { label: "Medium Risk", value: "MEDIUM RISK" },
  { label: "High Risk", value: "HIGH RISK" },
];

const durationOptions = [
  { label: "Duration: All", value: "" },
  { label: "Under 6 Months", value: "under_6" },
  { label: "6 - 12 Months", value: "6_12" },
  { label: "Over 12 Months", value: "over_12" },
];

const roiOptions = [
  { label: "ROI: All", value: "" },
  { label: "Under 15%", value: "under_15" },
  { label: "15% - 25%", value: "15_25" },
  { label: "Over 25%", value: "over_25" },
];

const fundingStatusOptions = [
  { label: "Status: All", value: "" },
  { label: "Active", value: "active" },
  { label: "Fully Funded", value: "fully_funded" },
];

const FarmFieldArt = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#f2d266_0%,#9cc85a_25%,#5b8f34_52%,#2e541f_100%)]" />
    <div className="absolute inset-0 bg-[repeating-linear-gradient(110deg,rgba(18,58,24,0.78)_0_10px,rgba(92,145,54,0.08)_10px_22px,rgba(18,58,24,0.78)_22px_34px)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,232,146,0.5)_0%,rgba(255,232,146,0)_28%)]" />
    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(10,30,13,0.18)_100%)]" />
  </div>
);

const FieldImage = ({ farm }: { farm: any }) => {
  const imageUrl = farm.pictures?.[0] || farm.images?.[0];
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={farm.name}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }
  return <FarmFieldArt />;
};

const FieldCard = ({ farm }: { farm: any }) => {
  return (
    <Link
      href={farm.href}
      className="block overflow-hidden rounded-[18px] border border-[#DCE7D1] bg-white shadow-[0_2px_10px_rgba(17,24,39,0.04)] transition-transform hover:-translate-y-0.5"
    >
      <article>
        <div className="relative h-[208px]">
          <FieldImage farm={farm} />
          <div className="absolute left-3 bottom-3 rounded-full bg-[#CC7D4B] px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            {farm.roi}% ROI • {farm.duration} MO
          </div>
          <div className="absolute right-3 top-3 rounded-full bg-white opacity-70 px-2.5 py-1 text-[11px] font-semibold text-[#111811] shadow-sm">
            Verified
          </div>
        </div>

        <div className="px-4 pb-4 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-[18px] font-bold leading-tight text-[#1C2420]">{farm.name}</h3>
              <p className="mt-1 text-[13px] text-[#6C756B]">
                <span>{farm.location}</span>
                <span className="px-1.5">•</span>
                <span>{farm.crop}</span>
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[#EDF4E5] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#72815B]">
              {farm.risk}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between gap-3 text-sm text-[#59625B]">
            <div className="flex items-center gap-2">
              <div className="rounded-full flex items-center justify-center bg-[#EFEDE4] text-[#111811] text-[9px] p-1 font-bold">
                AO
              </div>
              <span>{farm.manager}</span>
            </div>
            <span className="text-[#6E7A66]">★ 94</span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 text-[13px] text-[#5B655C]">
            <span className="font-bold text-[#2E3830]">
              {farm.invested} <span className="font-normal text-[#8A938B]">of {farm.total}</span>
            </span>
            <span>{farm.investors}</span>
          </div>

          <div className="mt-2 h-2 rounded-full bg-[#E6ECDC]">
            <div className="h-2 rounded-full bg-[#55713B]" style={{ width: `${Math.min(farm.progress, 100)}%` }} />
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#929A92]">Min invest</div>
              <div className="mt-0.5 text-[16px] font-semibold text-[#1F2A21]">{farm.minInvest}</div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-[#1F2E16] px-4 py-2 text-sm font-semibold text-white shadow-[0_6px_14px_rgba(31,46,22,0.18)] transition hover:bg-[#2A3D1D]">
              View details
              <span aria-hidden="true">→</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.12em] text-[#9AA29A]">
            <div className="flex items-center gap-2"><EyeIcon size={16} />{farm.inspected}</div>
            <span>{farm.funded}</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

const FieldRow = ({ farm }: { farm: any }) => {
  return (
    <Link
      href={farm.href}
      className="block overflow-hidden rounded-[18px] border border-[#DCE7D1] bg-white shadow-[0_2px_10px_rgba(17,24,39,0.04)] transition-transform hover:-translate-y-0.5"
    >
      <article className="flex flex-col md:flex-row items-stretch">
        <div className="relative w-full md:w-[240px] h-[160px] md:h-auto min-h-[160px] shrink-0">
          <FieldImage farm={farm} />
          <div className="absolute left-3 bottom-3 rounded-full bg-[#CC7D4B] px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            {farm.roi}% ROI • {farm.duration} MO
          </div>
          <div className="absolute right-3 top-3 rounded-full bg-white opacity-70 px-2.5 py-1 text-[11px] font-semibold text-[#111811] shadow-sm">
            Verified
          </div>
        </div>

        <div className="flex-1 p-5 flex flex-col justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-[20px] font-bold leading-tight text-[#1C2420]">{farm.name}</h3>
              <p className="mt-1 text-[13px] text-[#6C756B]">
                <span>{farm.location}</span>
                <span className="px-1.5">•</span>
                <span>{farm.crop}</span>
              </p>
            </div>
            <div>
              <span className="shrink-0 rounded-full bg-[#EDF4E5] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#72815B]">
                {farm.risk}
              </span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 items-center">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between text-[12px] text-[#5B655C] mb-1">
                <span className="font-bold text-[#2E3830]">
                  {farm.invested} <span className="font-normal text-[#8A938B]">of {farm.total}</span>
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#E6ECDC]">
                <div className="h-2 rounded-full bg-[#55713B]" style={{ width: `${Math.min(farm.progress, 100)}%` }} />
              </div>
              <div className="mt-1 flex justify-between text-[11px] text-[#9AA29A]">
                <span>{farm.funded}</span>
                <span>{farm.investors}</span>
              </div>
            </div>

            {/* Min Invest */}
            <div className="sm:text-center">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#929A92]">Min invest</div>
              <div className="mt-0.5 text-[16px] font-semibold text-[#1F2A21]">{farm.minInvest}</div>
            </div>

            {/* View Button */}
            <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-3">
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#9AA29A] flex items-center gap-1.5">
                <EyeIcon size={16} />
                {farm.inspected}
              </span>
              <div className="inline-flex items-center whitespace-nowrap gap-2 rounded-full bg-[#1F2E16] px-4 py-2 text-sm font-semibold text-white shadow-[0_6px_14px_rgba(31,46,22,0.18)] transition hover:bg-[#2A3D1D]">
                View details
                <span aria-hidden="true">→</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

const SkeletonCard = () => (
  <div className="animate-pulse rounded-[18px] border border-[#DCE7D1] bg-white p-4 shadow-[0_2px_10px_rgba(17,24,39,0.02)]">
    <div className="h-[180px] w-full rounded-xl bg-[#E6ECDC]/60" />
    <div className="mt-4 h-5 w-2/3 rounded bg-[#E6ECDC]/60" />
    <div className="mt-2 h-4 w-1/2 rounded bg-[#E6ECDC]/60" />
    <div className="mt-5 h-8 w-full rounded bg-[#E6ECDC]/60" />
    <div className="mt-3 flex justify-between">
      <div className="h-4 w-1/4 rounded bg-[#E6ECDC]/60" />
      <div className="h-4 w-1/4 rounded bg-[#E6ECDC]/60" />
    </div>
  </div>
);

// Map API response to deterministic cards
const getDeterministicFarmDetails = (farm: FarmResponse) => {
  const code = farm.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) + farm.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const roi = 14 + (code % 12); // ROI: 14% to 25%
  const duration = 6 + (code % 13); // Duration: 6 to 18 months
  const riskLevels = ["LOW RISK", "MEDIUM RISK", "HIGH RISK"];
  const risk = riskLevels[code % riskLevels.length];
  const inspectedDays = 1 + (code % 5);
  const totalVal = 5000000 + (code % 16) * 1000000; // Total Goal: 5M to 20M
  const progress = farm.stats?.completionPercentage ?? (35 + (code % 61)); // Progress: 35% to 95%
  const investedVal = Math.round((progress / 100) * totalVal);
  const minInvestVal = 10000 + (code % 10) * 10000; // Min Invest: 10K to 100K

  return {
    roi,
    duration,
    risk,
    inspectedDays,
    totalVal,
    progress,
    investedVal,
    minInvestVal,
  };
};

const InvestPage = () => {
  // Filters and search states
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRisk, setSelectedRisk] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedRoi, setSelectedRoi] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedFundingStatus, setSelectedFundingStatus] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Fetch farm categories
  const { data: categoriesResponse } = useGetFarmCategories();
  // Fetch dashboard stats for total raised / listed
  const { data: dashboardResponse } = useGetDashboard();

  // Fetch farms list from API
  const { data: farmsResponse, isLoading: isFarmsLoading } = useGetFarms({
    page: 1,
    limit: 100, // retrieve larger list to allow rich filtering
    search: debouncedSearch || undefined,
    category: selectedCategory || undefined,
  });

  // dynamic location list derived from loaded farms
  const locationOptions = useMemo(() => {
    const rawFarms = farmsResponse?.data?.farms ?? [];
    const locSet = new Set<string>();
    rawFarms.forEach((f) => {
      if (f.location) {
        const parts = f.location.split(",");
        const locName = parts[0].trim();
        if (locName) locSet.add(locName);
      }
    });
    return [
      { label: "Location: All", value: "" },
      ...Array.from(locSet).map((loc) => ({
        label: loc,
        value: loc,
      })),
    ];
  }, [farmsResponse]);

  const categoryOptions = useMemo(() => {
    const rawCategories = categoriesResponse?.data?.categories ?? [];
    return [
      { label: "Category: All", value: "" },
      ...rawCategories.map((c) => ({
        label: c.name || "Unnamed",
        value: c.id || "",
      })),
    ];
  }, [categoriesResponse]);

  // Popular category selectors
  const popularCategoriesList = useMemo(() => {
    const rawCategories = categoriesResponse?.data?.categories ?? [];
    if (rawCategories.length > 0) {
      return rawCategories.slice(0, 5);
    }
    return [
      { id: "cassava", name: "Cassava" },
      { id: "poultry", name: "Poultry" },
      { id: "rice", name: "Rice" },
      { id: "cocoa", name: "Cocoa" },
      { id: "tomato", name: "Greenhouse tomato" },
    ];
  }, [categoriesResponse]);

  // Handle active filters badge counting
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory) count++;
    if (selectedRisk) count++;
    if (selectedDuration) count++;
    if (selectedRoi) count++;
    if (selectedLocation) count++;
    if (selectedFundingStatus) count++;
    return count;
  }, [selectedCategory, selectedRisk, selectedDuration, selectedRoi, selectedLocation, selectedFundingStatus]);

  // Reset filters
  const clearAllFilters = () => {
    setSelectedCategory("");
    setSelectedRisk("");
    setSelectedDuration("");
    setSelectedRoi("");
    setSelectedLocation("");
    setSelectedFundingStatus("");
    setSearchInput("");
    setDebouncedSearch("");
  };

  // Stats calculation
  const stats = useMemo(() => {
    const summary = dashboardResponse?.data?.summary;
    const formatAmount = (val?: number) => {
      if (!val) return "₦0";
      if (val >= 1000000000) return `₦${(val / 1000000000).toFixed(1)}B`;
      if (val >= 1000000) return `₦${(val / 1000000).toFixed(1)}M`;
      return `₦${val.toLocaleString("en-NG")}`;
    };
    return [
      {
        value: String(summary?.totalFarmsListed ?? 248),
        label: "active opportunities",
      },
      {
        value: formatAmount(summary?.totalInvestmentReceived ?? 1200000000),
        label: "raised this quarter",
      },
    ];
  }, [dashboardResponse]);

  // Filter & map raw api farms
  const filteredFarms = useMemo(() => {
    const rawFarms = farmsResponse?.data?.farms ?? [];
    return rawFarms
      .map((farm) => {
        const details = getDeterministicFarmDetails(farm);
        return {
          id: farm.id,
          href: `/invest/${farm.id}`,
          name: farm.name,
          location: farm.location || "Nigeria",
          crop: farm.Category?.name || "Cassava",
          manager: "Smile Agri",
          risk: details.risk,
          invested: `₦${formatNumberWithCommas(details.investedVal)}`,
          total: `₦${formatNumberWithCommas(details.totalVal)}`,
          investors: `${Math.round(details.progress * 1.8)} investors`,
          minInvest: `₦${formatNumberWithCommas(details.minInvestVal)}`,
          inspected: `Inspected ${details.inspectedDays} days ago`,
          funded: `${details.progress}% funded`,
          progress: details.progress,
          // attributes for filters
          roi: details.roi,
          duration: details.duration,
          rawLocation: farm.location,
          rawCategory: farm.Category?.id,
          pictures: (farm as any).pictures || [],
        };
      })
      .filter((farm) => {
        // Category filtering (handled by API but kept here for double safety/client-side fallback)
        if (selectedCategory && farm.rawCategory !== selectedCategory) {
          return false;
        }
        // Risk Level filter
        if (selectedRisk && farm.risk !== selectedRisk) {
          return false;
        }
        // Duration filter
        if (selectedDuration) {
          const d = farm.duration;
          if (selectedDuration === "under_6" && d >= 6) return false;
          if (selectedDuration === "6_12" && (d < 6 || d > 12)) return false;
          if (selectedDuration === "over_12" && d <= 12) return false;
        }
        // ROI filter
        if (selectedRoi) {
          const r = farm.roi;
          if (selectedRoi === "under_15" && r >= 15) return false;
          if (selectedRoi === "15_25" && (r < 15 || r > 25)) return false;
          if (selectedRoi === "over_25" && r <= 25) return false;
        }
        // Location filter
        if (selectedLocation && !farm.rawLocation?.toLowerCase().includes(selectedLocation.toLowerCase())) {
          return false;
        }
        // Funding status filter
        if (selectedFundingStatus) {
          const p = farm.progress;
          if (selectedFundingStatus === "active" && p >= 100) return false;
          if (selectedFundingStatus === "fully_funded" && p < 100) return false;
        }
        return true;
      });
  }, [farmsResponse, selectedCategory, selectedRisk, selectedDuration, selectedRoi, selectedLocation, selectedFundingStatus]);

  return (
    <div className="min-h-screen bg-[#F4F7F6]">
      <MainHeader activeTab="invest" />

      <main className="mx-auto w-full max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE7D1] bg-white px-3 py-1 text-[11px] font-medium text-[#657162] shadow-[0_2px_6px_rgba(17,24,39,0.04)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#1E2E16]" />
          <span>{stats[0].value} active opportunities</span>
          <span>•</span>
          <span>{stats[1].value} raised this quarter</span>
        </div>

        <section className="max-w-4xl pb-6 pt-5 sm:pt-7">
          <h1 className="max-w-3xl text-[42px] font-bold leading-[1] tracking-[-0.04em] text-[#1F251E] sm:text-[60px]">
            Invest in verified <br className="hidden sm:block" /> <span className="text-[#3D6A2A]">agricultural</span> opportunities.
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-7 text-[#6F776F] sm:text-[18px]">
            Discover vetted farms, track performance in real time, and earn returns while supporting food production
            across Nigeria.
          </p>

          <div className="mt-6 flex max-w-3xl items-stretch rounded-[22px] border border-[#D8E4CD] bg-white p-2 shadow-[0_8px_20px_rgba(17,24,39,0.04)]">
            <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
              <SearchIcon size={20} color="#98A19A" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setDebouncedSearch(searchInput);
                  }
                }}
                placeholder="Search by farm name, crop, farmer, or location..."
                className="w-full border-0 bg-transparent text-[14px] text-[#334043] outline-none placeholder:text-[#9CA3AF]"
              />
            </div>
            <button
              type="button"
              onClick={() => setDebouncedSearch(searchInput)}
              className="rounded-[16px] bg-[#23491D] cursor-pointer px-6 py-3 text-[14px] font-semibold text-white shadow-[0_6px_14px_rgba(35,73,29,0.22)] hover:bg-[#1A3716] transition-colors"
            >
              Search
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-[13px] text-[#7C8578]">
            <span className="mr-1 font-medium">Popular categories:</span>
            {popularCategoriesList.map((cat) => {
              const isCatActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(isCatActive ? "" : cat.id)}
                  className={clsx(
                    "rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all cursor-pointer",
                    isCatActive
                      ? "border-[#23491D] bg-[#23491D] text-white shadow-sm"
                      : "border-[#D7E3CC] bg-[#F7FAF4] text-[#52614E] hover:bg-[#E7F0DE]"
                  )}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-lg border border-[#D5E0CB] bg-[#DFE8D6] px-4 py-3 shadow-[0_2px_8px_rgba(17,24,39,0.03)] lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={clearAllFilters}
              className="inline-flex items-center gap-2 rounded-lg border border-[#9FAE93] bg-[#D9E3CD] px-3 py-2 text-[13px] font-semibold text-[#263126] hover:bg-[#CDD9C1] transition-colors cursor-pointer"
            >
              <FilterIcon size={16} color="currentColor" />
              {activeFiltersCount > 0 ? "Clear Filters" : "Filters"}
              {activeFiltersCount > 0 && (
                <span className="rounded-full bg-[#314C28] px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:flex-1 lg:justify-center">
            {/* Category Select */}
            <Select
              variant="v2"
              className="!py-1.5 !px-3 h-auto text-[12px] border-[#D6DECD] bg-white text-[#47524B] shadow-[0_2px_5px_rgba(17,24,39,0.03)] rounded-full outline-none min-w-[130px]"
              placeholder="Category: All"
              options={categoryOptions}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />

            {/* Risk Select */}
            <Select
              variant="v2"
              className="!py-1.5 !px-3 h-auto text-[12px] border-[#D6DECD] bg-white text-[#47524B] shadow-[0_2px_5px_rgba(17,24,39,0.03)] rounded-full outline-none min-w-[130px]"
              placeholder="Risk: All"
              options={riskOptions}
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
            />

            {/* Duration Select */}
            <Select
              variant="v2"
              className="!py-1.5 !px-3 h-auto text-[12px] border-[#D6DECD] bg-white text-[#47524B] shadow-[0_2px_5px_rgba(17,24,39,0.03)] rounded-full outline-none min-w-[130px]"
              placeholder="Duration: All"
              options={durationOptions}
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
            />

            {/* ROI Select */}
            <Select
              variant="v2"
              className="!py-1.5 !px-3 h-auto text-[12px] border-[#D6DECD] bg-white text-[#47524B] shadow-[0_2px_5px_rgba(17,24,39,0.03)] rounded-full outline-none min-w-[130px]"
              placeholder="ROI: All"
              options={roiOptions}
              value={selectedRoi}
              onChange={(e) => setSelectedRoi(e.target.value)}
            />

            {/* Location Select */}
            <Select
              variant="v2"
              className="!py-1.5 !px-3 h-auto text-[12px] border-[#D6DECD] bg-white text-[#47524B] shadow-[0_2px_5px_rgba(17,24,39,0.03)] rounded-full outline-none min-w-[130px]"
              placeholder="Location: All"
              options={locationOptions}
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            />

            {/* Funding Status Select */}
            <Select
              variant="v2"
              className="!py-1.5 !px-3 h-auto text-[12px] border-[#D6DECD] bg-white text-[#47524B] shadow-[0_2px_5px_rgba(17,24,39,0.03)] rounded-full outline-none min-w-[130px]"
              placeholder="Status: All"
              options={fundingStatusOptions}
              value={selectedFundingStatus}
              onChange={(e) => setSelectedFundingStatus(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={clsx(
                "flex h-8 w-8 items-center justify-center rounded-full transition-colors cursor-pointer",
                viewMode === "grid"
                  ? "bg-[#2F5530] text-white"
                  : "bg-white text-[#7B8578] shadow-[0_2px_5px_rgba(17,24,39,0.04)] hover:bg-[#E5EFDC]"
              )}
              aria-label="Grid view"
            >
              <span className="grid grid-cols-2 gap-0.5">
                <span className="h-1.5 w-1.5 rounded-[2px] bg-current" />
                <span className="h-1.5 w-1.5 rounded-[2px] bg-current" />
                <span className="h-1.5 w-1.5 rounded-[2px] bg-current" />
                <span className="h-1.5 w-1.5 rounded-[2px] bg-current" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={clsx(
                "flex h-8 w-8 items-center justify-center rounded-full transition-colors cursor-pointer",
                viewMode === "list"
                  ? "bg-[#2F5530] text-white"
                  : "bg-white text-[#7B8578] shadow-[0_2px_5px_rgba(17,24,39,0.04)] hover:bg-[#E5EFDC]"
              )}
              aria-label="List view"
            >
              <span className="flex flex-col gap-1">
                <span className="h-1 w-3 rounded-full bg-current" />
                <span className="h-1 w-3 rounded-full bg-current" />
                <span className="h-1 w-3 rounded-full bg-current" />
              </span>
            </button>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-[22px] font-bold text-[#1F261F]">Farms</h2>
              <p className="mt-1 text-[13px] text-[#7B8379]">
                {filteredFarms.length} verified {filteredFarms.length === 1 ? "farm" : "farms"} · updated just now
              </p>
            </div>
            <p className="text-[13px] text-[#9AA099]">
              Showing 1-{filteredFarms.length} of {farmsResponse?.data?.pagination?.total ?? filteredFarms.length}
            </p>
          </div>

          {isFarmsLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredFarms.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 py-12 text-center rounded-[18px] border border-[#DCE7D1] bg-white shadow-[0_2px_10px_rgba(17,24,39,0.02)]">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EFEDE4]">
                <SearchIcon size={24} color="#5B655C" />
              </div>
              <h3 className="text-[18px] font-bold text-[#1C2420]">No opportunities found</h3>
              <p className="mt-2 max-w-sm text-sm text-[#6C756B]">
                We couldn&apos;t find any active farm opportunities matching your current filters. Try resetting them or adjusting your search.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-5 rounded-full bg-[#1F2E16] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2A3D1D] cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredFarms.map((farm, index) => (
                <FieldCard key={`${farm.id}-${index}`} farm={farm} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredFarms.map((farm, index) => (
                <FieldRow key={`${farm.id}-${index}`} farm={farm} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default InvestPage;
