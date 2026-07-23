/* eslint-disable @next/next/no-img-element */
'use client'

import { useMemo, useRef, useState } from "react";
import { AddIcon, CheckIcon, CloseIcon, DocsIcon, EqualIcon, FarmIcon, FilterIcon, MoreIcon, PhotoIcon, SearchIcon, ShieldIcon, TickIcon, UploadIcon, ClockIcon, WalletIcon, LayersIcon, ChevronIcon, InfoIcon, CalendarIcon } from "@/components/icons";
import { Modal } from "@/components/modal";
import { Button, Input, MainHeader, Select, Table, Typography, FarmStatusBadge } from "@/components/ui";
import { Column } from "@/components/ui/table";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { useGetFarmCategories, useGetWebMilestonesByCategory } from "@/mutation/dashboard.mutation";
import { useAddMilestonesToFarm, useCreateFarm, useGetFarms, useUploadDocToFarm } from "@/mutation/farms.mutation";
import { useGetKycStatus } from "@/mutation";
import { MilestoneResponse, SelectOptions } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type FarmRecord = {
  id: string;
  name: string;
  category: string;
  status: string; // legacy label
  verificationStatus?: string; // raw verificationStatus from API
};

type Step = 1 | 2 | 3;

type PhotoItem = {
  id: string;
  name: string;
  preview: string;
  file: File;
};

type DocItem = {
  id: string;
  name: string;
  file: File;
};

type SelectedMilestone = {
  milestoneId: string;
  amount: string;
};

const makeId = () => Math.random().toString(36).slice(2, 10);

const StepItem = ({
  title,
  done,
  className = "",
}: {
  title: string;
  done: boolean;
  className?: string;
}) => (
  <div className={`flex flex-col md:flex-row items-center gap-3 text-xs font-medium text-[#111827] sm:text-sm text-center ${className}`.trim()}>
    <div className={`flex h-5 w-5 items-center justify-center rounded-full ${done ? "" : "opacity-50"}`}>
      <TickIcon />
    </div>
    <span className={done ? "text-[#111827]" : "text-[#8A8F96]"}><span className="hidden sm:inline-flex">Farm&nbsp;</span>{title}</span>
  </div>
);

const normalizeKycStatus = (status?: string) => status?.trim().toLowerCase().replace(/\s+/g, "_") ?? "";

const getMilestonePercentage = (name: string, index: number, total: number) => {
  const lower = name.toLowerCase();
  if (lower.includes("preparation")) return 20;
  if (lower.includes("planting") || lower.includes("seed") || lower.includes("input")) return 30;
  if (lower.includes("maintenance") || lower.includes("weeding") || lower.includes("crop")) return 20;
  if (lower.includes("harvest")) return 20;
  if (lower.includes("sales") || lower.includes("close-out") || lower.includes("market")) return 10;

  if (total === 5) {
    const standard = [20, 30, 20, 20, 10];
    return standard[index] ?? 20;
  }
  return Math.round(100 / total);
};

const getCategoryOverviewDetails = (categoryName: string, milestonesCount: number) => {
  const code = categoryName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const durationMonths = categoryName.toLowerCase() === "vegetable" ? 6 : 6 + (code % 7); // 6 to 12 months
  const minFunding = categoryName.toLowerCase() === "vegetable" ? 2 : 1 + (code % 5);
  const maxFunding = categoryName.toLowerCase() === "vegetable" ? 10 : minFunding + 3 + (code % 7);
  
  // Format dates deterministically or use Aug 6, 2026 / Sep 6, 2026 for vegetable
  let startDate = "Aug 6, 2026";
  let endDate = "Sep 6, 2026";
  
  if (categoryName.toLowerCase() !== "vegetable") {
    // Generate deterministic dates
    const dateSeed = code % 28;
    const startDay = 1 + (dateSeed % 28);
    const startMonth = 1 + (dateSeed % 12);
    const startYear = 2026;
    const endDay = 1 + ((dateSeed + 15) % 28);
    const endMonth = 1 + ((dateSeed + 1) % 12);
    const endYear = startMonth > endMonth ? 2027 : 2026;
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    startDate = `${months[startMonth - 1]} ${startDay}, ${startYear}`;
    endDate = `${months[endMonth - 1]} ${endDay}, ${endYear}`;
  }

  return {
    duration: `${durationMonths} months`,
    fundingRange: `₦${minFunding}M`,
    stagesCount: `${milestonesCount || 5} milestones`,
    cropCategory: categoryName.toLowerCase() === "vegetable" ? "Vegetable" : categoryName,
    startDate,
    endDate,
  };
};

const isKycVerifiedStatus = (status?: string) => {
  const normalizedStatus = normalizeKycStatus(status);
  return normalizedStatus === "approved" || normalizedStatus === "verified" || normalizedStatus === "active";
};

const MyFarms = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showAddFarm, setShowAddFarm] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [search, setSearch] = useState("");

  const [farmName, setFarmName] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [farmAddress, setFarmAddress] = useState("");
  const [farmCategory, setFarmCategory] = useState("");
  const [selectedMilestones, setSelectedMilestones] = useState<SelectedMilestone[]>([]);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [previewPhoto, setPreviewPhoto] = useState<PhotoItem | null>(null);
  const [totalInvestmentAmount, setTotalInvestmentAmount] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState(true);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const photoCaptureRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const { data: farmsResponse, isLoading: isFarmsLoading } = useGetFarms({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    search,
  });
  const { data: kycStatusResponse, isLoading: isKycStatusLoading } = useGetKycStatus();
  const { data: farmCategoriesResponse, isLoading: isFarmCategoriesLoading } = useGetFarmCategories();
  const { data: milestonesResponse, isLoading: isMilestonesLoading } = useGetWebMilestonesByCategory(farmCategory || undefined);

  const createFarmMutation = useCreateFarm();
  const addMilestonesMutation = useAddMilestonesToFarm();
  const uploadDocumentsMutation = useUploadDocToFarm();

  const isSubmittingFarm =
    createFarmMutation.isPending || addMilestonesMutation.isPending || uploadDocumentsMutation.isPending;

  const farmCategories = useMemo<SelectOptions[]>(() => {
    const categories = farmCategoriesResponse?.data?.categories ?? [];

    return categories.map((category) => ({
      label: category.name,
      value: category.id,
    }));
  }, [farmCategoriesResponse?.data?.categories]);

  const milestoneOptions = useMemo(() => {
    const milestones = milestonesResponse?.data?.milestones ?? [];

    return Array.isArray(milestones)
      ? milestones.map((milestone: MilestoneResponse) => ({
        id: milestone.id,
        name: milestone.name || "Unnamed milestone",
      }))
      : [];
  }, [milestonesResponse?.data]);

  const selectedCategoryName = useMemo(() => {
    const categories = farmCategoriesResponse?.data?.categories ?? [];
    const cat = categories.find((c) => c.id === farmCategory);
    return cat?.name || "Vegetable";
  }, [farmCategoriesResponse, farmCategory]);

  const milestonesList = useMemo(() => {
    return milestonesResponse?.data?.milestones ?? [];
  }, [milestonesResponse]);

  const filteredFarms = useMemo(() => {
    const farms = farmsResponse?.data?.farms ?? [];

    return farms.map((farm) => ({
      id: farm.id,
      name: farm.name,
      category: farm.Category?.name || "Uncategorized",
      // keep legacy status for compatibility, but prefer verificationStatus when available
      status: (farm as unknown as { verificationStatus?: string }).verificationStatus
        ? String((farm as unknown as { verificationStatus?: string }).verificationStatus)
        : (farm.stats?.completionPercentage === 100 ? "Approved" : "Pending"),
      verificationStatus: (farm as unknown as { verificationStatus?: string }).verificationStatus ?? undefined,
    }));
  }, [farmsResponse?.data?.farms]);

  const farmsCount = farmsResponse?.data?.pagination?.total ?? filteredFarms.length;
  const isKycVerified = isKycVerifiedStatus(kycStatusResponse?.data?.status);
  const isVerificationRequired = !isKycStatusLoading && !isKycVerified;

  const resetForm = () => {
    photos.forEach((item) => URL.revokeObjectURL(item.preview));
    setStep(1);
    setFarmName("");
    setFarmSize("");
    setFarmAddress("");
    setFarmCategory("");
    setSelectedMilestones([]);
    setPhotos([]);
    setDocuments([]);
    setPreviewPhoto(null);
    setTotalInvestmentAmount("");
    setIsAgreed(false);
  };

  const handleOpenAddFarm = () => {
    if (!isKycVerified) {
      setShowVerificationModal(true);
      return;
    }

    setShowAddFarm(true);
  };

  const handleVerifyAccount = () => {
    router.push("/dashboard");
  };

  const handleBackToList = () => {
    resetForm();
    setShowAddFarm(false);
  };

  const toggleMilestone = (milestoneId: string) => {
    setSelectedMilestones((prev) => {
      const exists = prev.some((item) => item.milestoneId === milestoneId);

      if (exists) {
        return prev.filter((item) => item.milestoneId !== milestoneId);
      }

      return [...prev, { milestoneId, amount: "" }];
    });
  };

  const updateMilestoneAmount = (milestoneId: string, amount: string) => {
    setSelectedMilestones((prev) => {
      const exists = prev.some((item) => item.milestoneId === milestoneId);

      if (!exists) {
        return [...prev, { milestoneId, amount }];
      }

      return prev.map((item) =>
        item.milestoneId === milestoneId ? { ...item, amount } : item
      );
    });
  };

  const handlePhotoFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const items: PhotoItem[] = Array.from(fileList).map((file) => ({
      id: makeId(),
      name: file.name,
      preview: URL.createObjectURL(file),
      file,
    }));

    setPhotos((prev) => [...prev, ...items]);
  };

  const handleDocFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const items: DocItem[] = Array.from(fileList).map((file) => ({
      id: makeId(),
      name: file.name,
      file,
    }));

    setDocuments((prev) => [...prev, ...items]);
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const item = prev.find((photo) => photo.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((photo) => photo.id !== id);
    });
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const canContinueStepOne = farmName.trim().length > 0 && farmSize.trim().length > 0 && farmAddress.trim().length > 0;
  const canContinueStepTwo =
    farmCategory.length > 0 &&
    selectedMilestones.length > 0 &&
    Number(totalInvestmentAmount) > 0 &&
    isAgreed;
  const canSubmit = photos.length > 0 && documents.length > 0;

  const handleSubmitFarm = async () => {
    if (!canSubmit) return;

    try {
      const createdFarm = await createFarmMutation.mutateAsync({
        name: farmName.trim(),
        size: Number(farmSize) || undefined,
        farmCategoryId: farmCategory,
        location: farmAddress.trim(),
      });

      const farmId = createdFarm?.data?.id;

      if (!farmId) {
        toast.error("Unable to create farm");
        return;
      }

      if (selectedMilestones.length) {
        const totalWeight = selectedMilestones.reduce((sum, item) => {
          const milestone = milestonesList.find((m) => m.id === item.milestoneId);
          const index = milestonesList.findIndex((m) => m.id === item.milestoneId);
          const pct = getMilestonePercentage(milestone?.name || "", index >= 0 ? index : 0, milestonesList.length || 5);
          return sum + pct;
        }, 0) || 100;

        const milestonesPayload = selectedMilestones.map((item) => {
          const milestone = milestonesList.find((m) => m.id === item.milestoneId);
          const index = milestonesList.findIndex((m) => m.id === item.milestoneId);
          const pct = getMilestonePercentage(milestone?.name || "", index >= 0 ? index : 0, milestonesList.length || 5);
          const calculatedAmount = Math.round((Number(totalInvestmentAmount) * pct) / totalWeight);
          return {
            milestoneId: item.milestoneId,
            amount: calculatedAmount,
          };
        });

        await addMilestonesMutation.mutateAsync({
          farmId,
          payload: {
            milestones: milestonesPayload,
          },
        });
      }

      if (photos.length || documents.length) {
        await uploadDocumentsMutation.mutateAsync({
          farmId,
          payload: {
            pictures: photos.map((item) => item.file),
            documents: documents.map((item) => item.file),
          },
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["farms"] });
      toast.success("Farm added successfully");
      resetForm();
      setShowAddFarm(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to add farm";
      toast.error(message);
    }
  };

  const progressWidth = step === 1 ? "25%" : step === 2 ? "50%" : "75%";

  const columns: Column<FarmRecord>[] = [
    {
      header: "Farm Name",
      key: "name",
      render: (farm) => <span className="text-sm font-medium text-[#1F2937]">{farm.name}</span>,
    },
    {
      header: "Verification Status",
      key: "status",
      render: (farm) => (
        // Prefer the verificationStatus field when available
        <FarmStatusBadge status={(farm as FarmRecord).verificationStatus ?? farm.status} />
      ),
    },
    {
      header: "Farm Category",
      key: "category",
      render: (farm) => <span className="text-sm text-[#1F2937]">{farm.category}</span>,
    },
    {
      header: "Action",
      key: "actions",
      render: () => (
        <button type="button" className="text-[#7A828E] hover:text-[#4B5563] transition-colors">
          <MoreIcon size={18} />
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen w-full">
      <MainHeader activeTab="my-farms" />

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        {!showAddFarm && (
          <section className="overflow-hidden rounded-xl shadow-xs border border-[#EAECE8] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EAECE8] p-5 sm:px-6">
              <div className="flex items-center gap-2">
                <h1 className="text-[18px] font-medium text-[#1F2937]">My Farms</h1>
                <span className="rounded-full bg-[#DDEDD6] px-3 py-1 text-xs font-medium text-[#4E8A35]">{farmsCount} Farms</span>
              </div>
              <Button
                variant="primary"
                className="rounded-lg text-sm"
                onClick={handleOpenAddFarm}
                icon={<AddIcon color="#FFFFFF" size={20} />}
              >
                Add your Farm
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 border-b border-[#EAECE8] px-5 py-3 sm:px-6">
              <div className="relative w-full max-w-[400px]">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8F96]">
                  <SearchIcon size={20} color="currentColor" />
                </span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search Farm"
                  className="h-11 w-full rounded-lg border border-[#D5D7DA] bg-transparent pl-10 pr-3 text-sm text-[#374151] outline-none focus:border-[#8FB57F]"
                />
              </div>
              <button type="button" className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#D5D7DA] shadow-xs px-5 text-sm font-semibold text-[#3F464D] cursor-pointer">
                <FilterIcon size={20} />
                <span>Filters</span>
              </button>
            </div>

            {!isFarmsLoading && filteredFarms.length === 0 ? (
              <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-14 text-center">
                <div className="mb-4 flex h-18 w-18 items-center justify-center rounded-full bg-[#F1F9ED]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E2F3DA]">
                    <FarmIcon size={24} color="#4E8931" strokeWidth={0.2} />
                  </div>
                </div>
                <h2 className="text-base font-semibold text-[#1F2937]">No Farms found</h2>
                <p className="mt-2 max-w-[352px] text-sm text-[#5E6771]">
                  You have not added any farm yet. Add a farm to see your farms here.
                </p>
                <Button
                  variant="primary"
                  className="mt-6 w-full max-w-[352px] rounded-lg text-sm"
                  onClick={handleOpenAddFarm}
                  icon={<AddIcon color="#FFFFFF" size={20} />}
                >
                  Add your Farm
                </Button>
              </div>
            ) : isFarmsLoading ? (
              <div className="p-20 text-center text-gray-500">Loading farms...</div>
            ) : (
              <div className="p-4 sm:p-6">
                <div className="overflow-hidden rounded-xl border border-[#E9EAEB] bg-white">
                  <div className="border-b border-[#E9EAEB] px-5 py-4">
                    <span className="rounded-full bg-[#EEEAFB] px-3 py-1 text-sm font-medium text-[#6A53C8]">{filteredFarms.length} Farm</span>
                  </div>
                  <Table columns={columns} data={filteredFarms} />
                </div>
              </div>
            )}
          </section>
        )}

        {showAddFarm && (
          <section className="overflow-hidden rounded-xl border border-[#EAECE8] bg-white">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
              <aside className="border-b border-[#EAECE8] p-5 sm:p-6 md:border-b-0 md:border-r">
                <div className="flex items-center justify-between gap-3 md:flex-col md:items-start md:gap-0 md:space-y-0.5">
                  <StepItem title="Details" done={step >= 1} className="flex-1 md:flex-none" />
                  <p className="ml-2 hidden text-[#9CC98A] md:block">:</p>
                  <StepItem title="Milestones" done={step >= 2} className="flex-1 md:flex-none" />
                  <p className="ml-2 hidden text-[#9CC98A] md:block">:</p>
                  <StepItem title="Documentation" done={step >= 3} className="flex-1 md:flex-none" />
                </div>
              </aside>

              <div>
                <div className="border-b border-[#EAECE8] px-5 py-4 sm:px-6">
                  <h2 className="text-lg font-medium text-[#1F2937]">Add Farm</h2>
                  <div className="mt-3 h-1 rounded-full bg-[#BEDCB0]">
                    <div className="h-1 rounded-full bg-[#64B03F] transition-all" style={{ width: progressWidth }} />
                  </div>
                </div>

                <div className="px-5 py-6 sm:px-6 md:max-h-[480px] md:overflow-y-auto">
                  {step === 1 && (
                    <div className="max-w-3xl space-y-4">
                      <Input
                        id="farm-name"
                        value={farmName}
                        onChange={(event) => setFarmName(event.target.value)}
                        label="Enter Name of your Farm"
                      />
                      <Input
                        id="farm-size"
                        value={farmSize}
                        onChange={(event) => setFarmSize(event.target.value)}
                        label="Enter Farm Size - Per plot"
                      />
                      <Input
                        id="farm-address"
                        value={farmAddress}
                        onChange={(event) => setFarmAddress(event.target.value)}
                        label="Enter Farm Location or Address"
                      />

                      <Button
                        variant="primary"
                        disabled={!canContinueStepOne}
                        className="mt-1 rounded-md text-sm"
                        onClick={() => setStep(2)}
                      >
                        CONTINUE
                      </Button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="max-w-3xl space-y-5">
                      <div>
                        <label className="block text-xs font-semibold text-[#8A8F96] uppercase tracking-wider mb-2">Select Farm Category</label>
                        <Select
                          value={farmCategory}
                          onChange={(event) => setFarmCategory(event.target.value)}
                          placeholder="Select Farm Category"
                          options={farmCategories}
                        />
                      </div>

                      {isFarmCategoriesLoading && (
                        <p className="text-sm text-[#6B7280]">Loading farm categories...</p>
                      )}

                      {farmCategory && (
                        <>
                          {/* Investment Programme Card */}
                          <div className="border border-[#EAECE8] rounded-2xl bg-white shadow-xs p-6">
                            {/* Card Header */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="hidden md:flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#128A3E] text-white">
                                  <FarmIcon color="#FFFFFF" size={24} />
                                </div>
                                <div className="flex flex-col">
                                  <Typography variant="subheading" className="text-[#1F2937] font-bold text-lg leading-tight">
                                    {selectedCategoryName} Investment Programme
                                  </Typography>
                                  <p className="text-xs text-[#5E6771] mt-1 leading-normal">
                                    Review how funding for this crop works before continuing with your farm listing.
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setIsCardExpanded(!isCardExpanded)}
                                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                              >
                                <ChevronIcon
                                  className={`transform transition-transform ${isCardExpanded ? "" : "rotate-180"}`}
                                  size={16}
                                />
                              </button>
                            </div>
                            {/* Card Content (Collapsible) */}
                            {isCardExpanded && (
                              <div className="mt-6 border-t border-[#EAECE8] pt-6 space-y-6">
                                {/* PROGRAMME OVERVIEW */}
                                {(() => {
                                  const overviewDetails = getCategoryOverviewDetails(selectedCategoryName, milestonesList.length);
                                  return (
                                    <div>
                                      <div className="text-[10px] font-bold text-[#8A8F96] tracking-wider mb-3">
                                        PROGRAMME OVERVIEW
                                      </div>

                                      <div className="md:rounded-[12px] md:border md:border-[#E5E9E0] md:bg-[#FFFFFF] md:p-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          {/* DURATION */}
                                          <div className="flex flex-col gap-1.5 rounded-[12px] bg-[#F7FAF5] px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                              <ClockIcon size={14} color="#80916E" />
                                              <span className="text-[10px] font-bold text-[#8A9587] uppercase tracking-[0.08em]">Duration</span>
                                            </div>
                                            <span className="text-sm font-semibold text-[#1F2937] mt-0.5">{overviewDetails.duration}</span>
                                          </div>

                                          {/* MINIMUM FUNDING RANGE */}
                                          <div className="flex flex-col gap-1.5 rounded-[12px] bg-[#F7FAF5] px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                              <WalletIcon size={14} color="#80916E" />
                                              <span className="text-[10px] font-bold text-[#8A9587] uppercase tracking-[0.08em]">Minimum Funding Range</span>
                                            </div>
                                            <span className="text-sm font-semibold text-[#1F2937] mt-0.5">{overviewDetails.fundingRange}</span>
                                          </div>

                                          {/* FUNDING STAGES */}
                                          <div className="flex flex-col gap-1.5 rounded-[12px] bg-[#F7FAF5] px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                              <LayersIcon size={14} color="#80916E" />
                                              <span className="text-[10px] font-bold text-[#8A9587] uppercase tracking-[0.08em]">Funding Stages</span>
                                            </div>
                                            <span className="text-sm font-semibold text-[#1F2937] mt-0.5">{overviewDetails.stagesCount}</span>
                                          </div>

                                          {/* CROP CATEGORY */}
                                          <div className="flex flex-col gap-1.5 rounded-[12px] bg-[#F7FAF5] px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                              <FarmIcon size={14} color="#80916E" />
                                              <span className="text-[10px] font-bold text-[#8A9587] uppercase tracking-[0.08em]">Crop Category</span>
                                            </div>
                                            <span className="text-sm font-semibold text-[#1F2937] mt-0.5">{overviewDetails.cropCategory}</span>
                                          </div>

                                          {/* INVESTMENT START DATE */}
                                          <div className="flex flex-col gap-1.5 rounded-[12px] bg-[#F7FAF5] px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                              <CalendarIcon size={14} color="#80916E" />
                                              <span className="text-[10px] font-bold text-[#8A9587] uppercase tracking-[0.08em]">Investment Start Date</span>
                                            </div>
                                            <span className="text-sm font-semibold text-[#1F2937] mt-0.5">{overviewDetails.startDate}</span>
                                          </div>

                                          {/* INVESTMENT END DATE */}
                                          <div className="flex flex-col gap-1.5 rounded-[12px] bg-[#F7FAF5] px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                              <CalendarIcon size={14} color="#80916E" />
                                              <span className="text-[10px] font-bold text-[#8A9587] uppercase tracking-[0.08em]">Investment End Date</span>
                                            </div>
                                            <span className="text-sm font-semibold text-[#1F2937] mt-0.5">{overviewDetails.endDate}</span>
                                          </div>
                                        </div>

                                        {/* Note Alert Card */}
                                        <div className="mt-4 rounded-[12px] bg-[#D9F8DC] p-4 text-xs font-semibold leading-relaxed text-[#013611]">
                                          Note: <strong className="font-bold">Funding goal</strong> for this farm category must be reached on or before the <strong className="font-bold">Investment End Date.</strong> If the funding goal is not reached by this date, <strong className="font-bold">investments will be reimbursed back to the investors and the farm funding will be closed.</strong>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}

                                {/* FUNDING MILESTONES */}
                                <div>
                                  <div className="text-[10px] font-bold text-[#8A8F96] tracking-wider mb-4">
                                    FUNDING MILESTONES
                                  </div>
                                  <div className="space-y-3">
                                    {(milestonesList.length > 0
                                      ? milestonesList
                                      : [
                                        { id: "1", name: "Land preparation" },
                                        { id: "2", name: "Planting & Inputs" },
                                        { id: "3", name: "Crop maintenance" },
                                        { id: "4", name: "Harvest" },
                                        { id: "5", name: "Sales & project close-out" },
                                      ]
                                    ).map((m, idx, arr) => {
                                      const pct = getMilestonePercentage(m.name || "", idx, arr.length);
                                      const isLast = idx === arr.length - 1;
                                      const circleBg = isLast ? "bg-[#F59E0B]" : "bg-[#10B981]";
                                      return (
                                        <div key={m.id || idx} className="flex items-center gap-4 border border-[#E9EAEB] rounded-2xl p-4 bg-white">
                                          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${circleBg}`}>
                                            {pct}%
                                          </div>
                                          <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-[#8A8F96] uppercase tracking-wider">STAGE {idx + 1}</span>
                                            <span className="text-sm font-semibold text-[#1F2937] mt-0.5">{m.name}</span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* HOW FUNDS ARE RELEASED */}
                                <div>
                                  <div className="text-[10px] font-bold text-[#8A8F96] tracking-wider mb-3">
                                    HOW FUNDS ARE RELEASED
                                  </div>
                                  <div className="bg-[#E6F4EA] border border-[#CEEAD6] rounded-2xl p-4 flex gap-3 items-start">
                                    <div className="mt-0.5 shrink-0 text-[#137333]">
                                      <ShieldIcon size={20} color="currentColor" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      <p className="text-xs font-semibold text-[#137333] leading-relaxed">
                                        Funds are not released all at once. Each milestone is funded only after the previous milestone is completed and verified by Agrimarket.
                                      </p>
                                      <p className="text-[10px] text-[#5E6771] mt-1">
                                        *Evidence is submitted when requesting for funds, not during farm listing.
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* IMPORTANT TO KNOW */}
                                <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-2xl p-5">
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="text-[#D97706]">
                                      <InfoIcon size={20} color="currentColor" />
                                    </div>
                                    <span className="text-sm font-bold text-[#92400E]">Important to know</span>
                                  </div>
                                  <ul className="space-y-2.5 text-xs text-[#92400E] font-medium pl-1">
                                    <li className="flex items-start gap-2">
                                      <span className="text-[#D97706] mt-0.5 shrink-0">•</span>
                                      <span>Funding is released in stages, never all at once.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-[#D97706] mt-0.5 shrink-0">•</span>
                                      <span>Each milestone must be verified before the next payment.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-[#D97706] mt-0.5 shrink-0">•</span>
                                      <span>Funds follow Agrimarket&apos;s approved investment programme.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-[#D97706] mt-0.5 shrink-0">•</span>
                                      <span>Investment rules cannot be modified by farmers.</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* CHECKLIST */}
                          <div className="space-y-3">
                            <Typography variant="small" className="font-semibold text-[#1F2937]">
                              What do you need funds for? (Select farm milestones that apply)
                            </Typography>
                            <p className="text-xs text-[#5E6771] -mt-1">
                              You will be required to provide evidence for each milestone when requesting for payment
                            </p>

                            <div className="space-y-2.5">
                              {milestoneOptions.map((option) => {
                                if (!option.id) return null;
                                const selectedMilestone = selectedMilestones.find((item) => item.milestoneId === option.id);
                                const checked = Boolean(selectedMilestone);
                                return (
                                  <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => toggleMilestone(option.id)}
                                    className={`flex w-full min-h-11 items-center gap-3 rounded-md border bg-transparent px-4 py-3 text-left transition-colors ${checked
                                        ? "border-[#5DA63D] bg-[#F7FBF4]"
                                        : "border-[#B8C3CF]"
                                      }`}
                                  >
                                    <span className={`flex h-5 w-5 items-center justify-center rounded-sm border ${checked ? "border-[#5DA63D] bg-[#5DA63D] text-white" : "border-[#8A93A4] text-transparent"}`}>
                                      ✓
                                    </span>
                                    <span className="text-sm font-medium text-[#1F2937]">{option.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* INVESTMENT AMOUNT */}
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[#1F2937]">
                              Funding Goal
                            </label>
                            <Input
                              id="total-investment-amount"
                              placeholder="Enter Amount Needed For this Farm"
                              value={totalInvestmentAmount}
                              onChange={(event) => setTotalInvestmentAmount(event.target.value)}
                              type="text"
                              inputMode="numeric"
                              className="rounded-md border-[#D5D7DA] py-3.5 text-sm text-[#374151] placeholder:text-[#9AA0A6] focus:ring-0 focus:border-[#8FB57F]"
                            />
                          </div>

                          {/* AGREEMENT CHECKBOX */}
                          <div className="flex items-start gap-3 rounded-lg border-2 border-[#187E36] bg-[#D9F8DC] px-4 py-3.5 text-left transition-colors">
                            <button
                              type="button"
                              onClick={() => setIsAgreed(!isAgreed)}
                              className={`flex h-5 w-5 mt-0.5 shrink-0 items-center justify-center rounded-sm border ${isAgreed ? "border-[#187E36] bg-[#187E36] text-white" : "border-[#8A93A4] text-transparent"
                                }`}
                            >
                              ✓
                            </button>
                            <span className="text-xs font-semibold text-[#1F2937] select-none leading-relaxed">
                              I understand how this investment programme works and agree to the milestone-based funding process
                            </span>
                          </div>
                        </>
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          variant="light"
                          className="rounded-md bg-[#E0E0E0] text-sm"
                          onClick={() => setStep(1)}
                        >
                          BACK
                        </Button>
                        <Button
                          variant="primary"
                          disabled={!canContinueStepTwo}
                          className="rounded-md text-sm"
                          onClick={() => setStep(3)}
                        >
                          CONTINUE
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="max-w-4xl space-y-5">
                      <div>
                        <p className="text-sm font-semibold text-[#1F2937]">Please upload some photos of your farm</p>
                        <p className="mt-1 text-sm italic text-[#7A8077]">Allowed Formats: JPG, PNG, WebP</p>
                      </div>

                      {photos.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                          {photos.map((photo) => (
                            <div
                              key={photo.id}
                              role="button"
                              tabIndex={0}
                              onClick={() => setPreviewPhoto(photo)}
                              onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                  event.preventDefault();
                                  setPreviewPhoto(photo);
                                }
                              }}
                              className="relative aspect-square cursor-pointer overflow-hidden rounded-md bg-[#D9D9D9]"
                            >
                              <div
                                role="img"
                                aria-label={photo.name}
                                className="h-full w-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${photo.preview})` }}
                              />
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  removePhoto(photo.id);
                                }}
                                className="absolute right-1 top-1 rounded-full bg-black/60 text-white"
                                aria-label="Remove photo"
                              >
                                <CloseIcon size={16} color="#FFFFFF" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Button
                          variant="light"
                          onClick={() => photoInputRef.current?.click()}
                          className="rounded-md"
                          icon={<UploadIcon size={17} />}
                        >
                          UPLOAD
                        </Button>
                        <Button
                          variant="light"
                          onClick={() => photoCaptureRef.current?.click()}
                          className="rounded-md"
                          icon={<PhotoIcon size={18} />}
                        >
                          TAKE A PHOTO
                        </Button>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-[#1F2937]">Please upload your farm documentations</p>
                        <p className="mt-1 text-sm italic text-[#7A8077]">Allowed Formats: PDF</p>
                      </div>

                      {documents.length > 0 && (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between rounded-md bg-[#F3FFF7] p-4">
                              <div className="flex items-center gap-3">
                                <div className="flex p-2 aspect-square items-center justify-center rounded-full bg-[#D4EDC8]">
                                  <DocsIcon />
                                </div>
                                <span className="text-sm text-[#1F2937]">{doc.name}</span>
                              </div>
                              <button type="button" onClick={() => removeDocument(doc.id)} aria-label="Remove document">
                                <CloseIcon size={18} color="#7A8077" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Button
                          variant="light"
                          onClick={() => docInputRef.current?.click()}
                          className="rounded-md"
                          icon={<UploadIcon size={17} />}
                        >
                          UPLOAD
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <Button variant="light" className="rounded-md bg-[#E0E0E0] text-sm" onClick={() => setStep(2)}>
                          BACK
                        </Button>
                        <Button variant="primary" disabled={!canSubmit} className="rounded-md text-sm" onClick={handleSubmitFarm} isLoading={isSubmittingFarm}>
                          ADD FARM
                        </Button>
                      </div>

                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        multiple
                        className="hidden"
                        onChange={(event) => {
                          handlePhotoFiles(event.target.files);
                          event.target.value = "";
                        }}
                      />
                      <input
                        ref={photoCaptureRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        capture="environment"
                        multiple
                        className="hidden"
                        onChange={(event) => {
                          handlePhotoFiles(event.target.files);
                          event.target.value = "";
                        }}
                      />
                      <input
                        ref={docInputRef}
                        type="file"
                        accept="application/pdf"
                        multiple
                        className="hidden"
                        onChange={(event) => {
                          handleDocFiles(event.target.files);
                          event.target.value = "";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {showAddFarm && (
          <div className="mt-5">
            <button type="button" onClick={handleBackToList} className="text-sm text-[#4B5563] hover:underline cursor-pointer">
              Cancel and return to list
            </button>
          </div>
        )}
      </main>

      <Modal
        isOpen={!!previewPhoto}
        onClose={() => setPreviewPhoto(null)}
        ariaLabel="Photo preview"
        maxWidth="max-w-4xl"
        maxHeight="max-h-[90vh]"
      >
        {previewPhoto && (
          <div className="bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <Typography variant="subheading" className="text-[#0B1307] text-lg!">
                  Full Preview
                </Typography>
                <Typography variant="small" className="text-[#7A8077]">
                  {previewPhoto.name}
                </Typography>
              </div>
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="rounded-full bg-[#F3F4F6] p-2 text-[#111827] hover:bg-[#E5E7EB]"
                aria-label="Close preview"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <div className="flex max-h-[75vh] items-center justify-center overflow-hidden rounded-lg bg-black/5">
              <img
                src={previewPhoto.preview}
                alt={previewPhoto.name}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showVerificationModal && isVerificationRequired}
        onClose={() => setShowVerificationModal(false)}
        ariaLabel="Verification Required"
        maxWidth="max-w-[446px]"
        maxHeight="max-h-[90vh]"
        closeOnOverlayClick={false}
      >
        <div className="relative w-full rounded-lg bg-white p-6 border-[#6FC346] border-t-4">
          <button
            type="button"
            onClick={() => setShowVerificationModal(false)}
            className="absolute right-3 top-3 cursor-pointer text-[#7A8077] transition-opacity hover:opacity-80"
            aria-label="Close verification prompt"
          >
            <CloseIcon size={24} color="currentColor" />
          </button>

          <div className="mx-auto mb-6 mt-2 flex h-[86px] w-[86px] items-center justify-center rounded-full bg-[#ECFDF3] sm:mb-7">
            <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#D1FADF]">
              <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full text-[#039855]">
                <CheckIcon size={28} color="currentColor" />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center">
            <Typography variant="subheading" className="text-[#0B1307] text-xl! text-center">
              Verification Required to List Your Farm
            </Typography>
            <Typography variant="base" className="mt-2 text-center text-[#31332F]">
              To protect buyers &amp; investors, all farm listings must be verified to ensure authenticity &amp; quality.
            </Typography>
          </div>

          <div className="mx-auto mt-8 flex w-full max-w-[312px] items-center justify-between">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#64B03F] text-white">
                <CheckIcon size={16} color="currentColor" />
              </div>
              <Typography variant="small" className="font-semibold whitespace-nowrap tracking-[0.03em] text-[#599C38]!">UPLOAD ID</Typography>
            </div>

            <div className="h-0.5 w-[69px] rounded-full bg-[#C2E6CE]" />

            <div className="flex flex-col items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full border border-[#D3D5D8] bg-[#F6F7F7] text-sm font-semibold text-[#B5B9BE]">
                2
              </div>
              <Typography variant="small" className="font-semibold whitespace-nowrap tracking-[0.03em] text-[#61665F]!">VERIFY PROFILE</Typography>
            </div>
          </div>

          <div className="mx-auto mt-10 w-full max-w-[640px] space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#F1F9ED] text-[#4E8931]">
                <ShieldIcon size={18} color="currentColor" />
              </div>
              <div className="flex flex-col">
                <Typography variant="normal" className="font-semibold leading-[1.2] text-[#151917]!">Build trust with buyers &amp; investors</Typography>
                <Typography variant="normal" className="leading-[1.4] text-[#61665F]!">Verified badges increase buyer confidence by 85%</Typography>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#F1F9ED] text-[#4E8931]">
                <EqualIcon size={18} color="currentColor" />
              </div>
              <div className="flex flex-col">
                <Typography variant="normal" className="font-semibold leading-[1.2] text-[#151917]!">Get higher visibility on listings</Typography>
                <Typography variant="normal" className="leading-[1.4] text-[#61665F]!">Priority placement in search results &amp; category pages</Typography>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#F1F9ED] text-[#4E8931]">
                <FarmIcon size={18} color="currentColor" />
              </div>
              <div className="flex flex-col">
                <Typography variant="normal" className="font-semibold leading-[1.2] text-[#151917]!">Access funding opportunities</Typography>
                <Typography variant="normal" className="leading-[1.4] text-[#61665F]!">Eligible for institutional investments &amp; agricultural grants</Typography>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-10 flex w-full max-w-[640px] flex-col gap-4">
            <Button
              variant="primary"
              onClick={handleVerifyAccount}
              className="py-4"
            >
              <span className="flex items-center gap-4">
                <span>VERIFY YOUR ACCOUNT</span>
                <div className="text-2xl -mt-1 leading-none">›</div>
              </span>
            </Button>

            <Button
              type="button"
              variant="light"
              onClick={() => setShowVerificationModal(false)}
              className="py-4 border border-[#D6D6D6] bg-[#DEDEDE] text-[#252525]"
            >
              MAYBE LATER
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyFarms;
