"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import clsx from "clsx";
import { toast } from "sonner";
import { MainHeader } from "@/components/ui";
import { AlertTriangleIcon, CalendarIcon, ClockIcon, FarmIcon, InfoIcon, LayersIcon, LocationIcon, LogoWhiteIcon, TrendingUpIcon, UsersIcon, VerifiedIcon, WalletIcon, InvestmentIcon, PercentIcon, FileTextIcon } from "@/components/icons";
import { useGetWebInvestmentById, useInvest } from "@/mutation/investments.mutation";
import { useGetPortfolioFarmById } from "@/mutation/portfolio.mutation";
import { formatNumberWithCommas } from "@/utils";
import { getPreviewImageUrl } from "@/utils/image";

const Viewer = dynamic(() => import("react-viewer"), { ssr: false });

type FarmMilestone = {
  name: string;
  status: "Completed" | "In progress" | "Not started";
};

const FarmFieldArt = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#f2d266_0%,#9cc85a_25%,#5b8f34_52%,#2e541f_100%)]" />
    <div className="absolute inset-0 bg-[repeating-linear-gradient(110deg,rgba(18,58,24,0.78)_0_10px,rgba(92,145,54,0.08)_10px_22px,rgba(18,58,24,0.78)_22px_34px)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,232,146,0.5)_0%,rgba(255,232,146,0)_28%)]" />
    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(10,30,13,0.18)_100%)]" />
  </div>
);

const formatRisk = (risk: string) => {
  const r = (risk || "").toLowerCase();
  if (r === "low risk" || r === "low") return "Low Risk";
  if (r === "medium risk" || r === "medium") return "Medium Risk";
  if (r === "high risk" || r === "high") return "High Risk";
  return risk;
};

const FarmDetailPage = () => {
  const params = useParams();
  const farmId = params?.farmId as string | undefined;

  const { data: farmResponse, isLoading: isFarmDetailsLoading } = useGetWebInvestmentById(farmId);
  const { data: portfolioFarmResponse, isLoading: isPortfolioLoading } = useGetPortfolioFarmById(farmId);

  const isLoading = isFarmDetailsLoading || isPortfolioLoading;

  const farm = useMemo(() => {
    const baseFarm = farmResponse?.data as any;
    const portfolioFarm = portfolioFarmResponse?.data;

    if (!baseFarm && !portfolioFarm) return null;

    const project = baseFarm?.investmentProjects?.[0] || portfolioFarm?.investments?.[0] || {};

    const roi = baseFarm?.roi ?? project?.roi ?? project?.roiPercentage ?? 0;
    const duration = baseFarm?.duration ?? project?.duration;
    const riskLevel = baseFarm?.riskLevel || project?.riskLevel || "medium";
    const minimumInvest = baseFarm?.minimumInvest ?? project?.minimumInvest ?? project?.investmentMinGoal ?? 0;
    const totalExpectedFunding = baseFarm?.totalExpectedFunding ?? baseFarm?.totalFundingAmount ?? project?.totalExpectedFunding ?? project?.fundingGoalAmount ?? 0;
    const fundingReceived = baseFarm?.fundingReceived ?? baseFarm?.amountRaised ?? project?.fundingReceived ?? project?.amountRaised ?? 0;
    const percentFunded = baseFarm?.percentFunded ?? project?.percentFunded ?? 0;
    const startDate = baseFarm?.startDate ?? project?.startDate;
    const endDate = baseFarm?.endDate ?? project?.endDate;
    const farmCategory = baseFarm?.farmCategory ?? project?.farmCategory;
    const milestones = portfolioFarm?.milestones || baseFarm?.milestones || project?.milestones || [];

    const mergedBase = {
      ...(baseFarm || {}),
      name: baseFarm?.farmName || baseFarm?.name || portfolioFarm?.name || project?.name || "Farm",
      roi,
      duration,
      riskLevel,
      minimumInvest,
      totalExpectedFunding,
      fundingReceived,
      percentFunded,
      startDate,
      endDate,
      farmCategory,
      milestones,
    };

    if (portfolioFarm) {
      const template = portfolioFarm.investments?.[0];
      const transaction = template?.transactions?.[0];
      const allTransactions = portfolioFarm.investments?.flatMap((inv: any) => inv.transactions || []) || [];

      return {
        ...mergedBase,
        Investment: {
          amount: portfolioFarm.userInvestment?.amountInvested ?? baseFarm?.Investment?.amount,
          id: transaction?.reference ?? transaction?.id ?? baseFarm?.Investment?.id,
          status: portfolioFarm.portfolioStatus ?? baseFarm?.Investment?.status,
        },
        userInvestment: portfolioFarm.userInvestment,
        portfolioInvestments: portfolioFarm.investments,
        transactions: allTransactions.length > 0 ? allTransactions : (transaction ? [transaction] : []),
        milestones: portfolioFarm.milestones || mergedBase.milestones,
        milestoneStats: portfolioFarm.milestoneStats ? {
          totalMilestones: portfolioFarm.milestoneStats.total,
          completedMilestones: portfolioFarm.milestoneStats.completed,
          inProgressMilestones: portfolioFarm.milestoneStats.pending,
          notStartedMilestones: 0,
          completionPercentage: portfolioFarm.milestoneStats.completionPercentage,
        } : (mergedBase.milestoneStats || project?.milestoneStats),
      };
    }

    return mergedBase;
  }, [farmResponse, portfolioFarmResponse]);

  // Viewer state for gallery lightbox
  const [viewerVisible, setViewerVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Investment state management
  const [step, setStep] = useState<'details' | 'calculator' | 'review' | 'success'>('details');
  const [investAmount, setInvestAmount] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [hasSessionInvested, setHasSessionInvested] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  const hasInvested = useMemo(() => {
    return !!farm?.Investment?.amount || !!farm?.userInvestment?.amountInvested || hasSessionInvested;
  }, [farm, hasSessionInvested]);

  // Review step states
  const [expandedSection, setExpandedSection] = useState<string | null>('keyTerms');
  const [ackRisks, setAckRisks] = useState(false);
  const [ackTerms, setAckTerms] = useState(false);
  const [ackLock, setAckLock] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const details = useMemo(() => {
    if (!farm) return null;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formatDate = (dateStr?: string) => {
      if (!dateStr) return "N/A";
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "N/A";
      return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };

    const rawDuration = farm.duration;
    let durationVal = 6;
    if (typeof rawDuration === "number") {
      durationVal = rawDuration;
    } else if (rawDuration && typeof rawDuration === "object") {
      durationVal = typeof rawDuration.value === "number" ? rawDuration.value : (parseInt(String(rawDuration.value), 10) || 6);
    } else if (typeof rawDuration === "string") {
      durationVal = parseInt(rawDuration, 10) || 6;
    } else if ((farm as any).durationValue) {
      durationVal = (farm as any).durationValue;
    }

    return {
      roi: Number(farm.roi) || 0,
      duration: durationVal,
      risk: farm.riskLevel || "medium",
      totalVal: Number(farm.totalExpectedFunding) || 0,
      progress: Number(farm.percentFunded) || 0,
      investedVal: Number(farm.fundingReceived) || 0,
      minInvestVal: Number(farm.minimumInvest) || 0,
      startDate: formatDate(farm.startDate),
      endDate: formatDate(farm.endDate),
    };
  }, [farm]);

  // Derived current values using default values from farm details if user has not interacted
  const currentAmount = useMemo(() => {
    return investAmount || (details ? details.minInvestVal : 0);
  }, [investAmount, details]);

  const currentDuration = useMemo(() => {
    return selectedDuration || (details?.duration ?? 0);
  }, [selectedDuration, details]);

  // Dynamic calculations for the calculator
  const currentRoi = useMemo(() => {
    if (!details || currentDuration === 0) return 0;
    return details.roi * (currentDuration / (details.duration || currentDuration || 1));
  }, [details, currentDuration]);

  const expectedProfit = useMemo(() => {
    if (currentAmount === 0 || currentRoi === 0) return 0;
    return Math.round(currentAmount * (currentRoi / 100));
  }, [currentAmount, currentRoi]);

  const totalReturn = useMemo(() => {
    return currentAmount + expectedProfit;
  }, [currentAmount, expectedProfit]);

  const payoutDateString = useMemo(() => {
    if (details?.endDate && details.endDate !== "N/A") {
      return details.endDate;
    }
    if (currentDuration === 0) return "";
    const date = new Date();
    date.setMonth(date.getMonth() + currentDuration);
    const day = date.getDate();
    const monthsArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const month = monthsArr[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }, [currentDuration, details]);

  const durations = useMemo(() => {
    return [details?.duration ?? 6];
  }, [details]);

  const formatCompactNaira = (val: number) => {
    if (val >= 1000000) {
      const m = val / 1000000;
      return `₦${m % 1 === 0 ? m : m.toFixed(1)}M`;
    }
    if (val >= 1000) {
      const k = val / 1000;
      return `₦${k % 1 === 0 ? k : k.toFixed(0)}K`;
    }
    return `₦${formatNumberWithCommas(val)}`;
  };

  const minSlider = useMemo(() => {
    return details?.minInvestVal || 10000;
  }, [details]);

  const maxSlider = useMemo(() => {
    if (!details) return 5000000;
    const remainingFunding = details.totalVal > details.investedVal ? details.totalVal - details.investedVal : details.totalVal;
    return remainingFunding > minSlider ? remainingFunding : Math.max(minSlider * 10, 1000000);
  }, [details, minSlider]);

  const stepSlider = useMemo(() => {
    if (minSlider >= 500000) return 50000;
    if (minSlider >= 100000) return 10000;
    if (minSlider >= 10000) return 5000;
    return 1000;
  }, [minSlider]);

  const sliderPercent = useMemo(() => {
    if (maxSlider <= minSlider) return 0;
    return Math.min(Math.max(((currentAmount - minSlider) / (maxSlider - minSlider)) * 100, 0), 100);
  }, [currentAmount, minSlider, maxSlider]);

  const presets = useMemo(() => {
    const min = details?.minInvestVal || 10000;
    const max = maxSlider;

    if (max <= min) return [min];

    const candidateTiers = [
      min,
      min * 2,
      min * 5,
      min * 10,
      min * 20,
      min * 50,
      max
    ];

    const valid = candidateTiers.filter((v) => v < max);
    let selected: number[] = [];
    if (valid.length <= 4) {
      selected = [...valid, max];
    } else {
      selected = [valid[0], valid[1], valid[Math.floor(valid.length / 2)], valid[valid.length - 1], max];
    }

    const rounded = selected.map((val) => Math.round(val / 1000) * 1000);
    const unique = Array.from(new Set(rounded)).sort((a, b) => a - b);
    return unique;
  }, [details, maxSlider]);

  const pictures = useMemo(() => {
    if (!farm) return [];
    const rawImages = (farm as any)?.images || (farm as any)?.photos || [];
    if (Array.isArray(rawImages) && rawImages.length > 0) {
      return rawImages.map((pic: any) => ({
        src: getPreviewImageUrl(pic.fileUrl || pic.url || pic.src || pic),
        alt: pic.fileName || pic.name || "Farm photo",
      }));
    }
    if ((farm as any)?.imageUrl) {
      return [{ src: getPreviewImageUrl((farm as any).imageUrl), alt: farm?.name || "Farm photo" }];
    }
    if ((farm as any)?.image?.fileUrl) {
      return [{ src: getPreviewImageUrl((farm as any).image.fileUrl), alt: farm?.name || "Farm photo" }];
    }
    return [];
  }, [farm]);

  const farmDocuments = useMemo(() => {
    if (!farm) return [];
    const rawDocs = (farm as any)?.documents || [];
    return rawDocs.filter((doc: any) => doc.documentType === "document" || doc.mimeType?.includes("pdf") || doc.fileName?.toLowerCase().endsWith(".pdf"));
  }, [farm]);

  const milestones = useMemo((): FarmMilestone[] => {
    if (!farm) return [];
    const sourceMilestones = farm.milestones || [];
    if (sourceMilestones.length > 0) {
      return sourceMilestones.map((item: any) => {
        const name = item.name || `Milestone`;
        const status = (item.status || "not_started") as string;

        let normalizedStatus: "Completed" | "In progress" | "Not started" = "Not started";
        const st = status.toLowerCase();
        if (st === "completed" || st === "complete" || item.isCompleted) {
          normalizedStatus = "Completed";
        } else if (st === "in progress" || st === "inprogress" || st === "in_progress" || st === "processing" || st === "request_for_funding") {
          normalizedStatus = "In progress";
        }

        return {
          name,
          status: normalizedStatus,
        };
      });
    }

    return [];
  }, [farm]);

  const ownerName = useMemo(() => {
    const f = farm as any;
    return f?.farmOwnerName || f?.farmOwner?.fullName || f?.farmOwner?.name || f?.owner?.fullName || f?.owner?.name || farm?.name || "Farm Partner";
  }, [farm]);

  const totalUnits = useMemo(() => {
    const f = farm as any;
    if (f?.totalUnits) return Number(f.totalUnits);
    if (f?.units) return Number(f.units);
    if (details?.totalVal && details?.minInvestVal && details.minInvestVal > 0) {
      return Math.floor(details.totalVal / details.minInvestVal);
    }
    return 0;
  }, [farm, details]);

  const remainingUnits = useMemo(() => {
    if (!details) return 0;
    if (totalUnits > 0) {
      return Math.max(0, Math.ceil(((100 - details.progress) / 100) * totalUnits));
    }
    return Math.max(0, 100 - details.progress);
  }, [details, totalUnits]);

  const formatHistoryDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const investmentHistory = useMemo(() => {
    const portfolioTransactions: any[] = farm?.transactions || [];
    if (portfolioTransactions.length > 0) {
      return portfolioTransactions.map((tx, idx) => ({
        id: tx.id || tx.reference || `tx-${idx}`,
        title: idx === 0 ? "Initial investment" : `Top-up #${idx}`,
        date: tx.investedAt || tx.paidAt || tx.createdAt,
        roi: Number(farm?.roi || details?.roi || 0),
        maturesDate: tx.effectiveEndDate || farm?.endDate || details?.endDate,
        amount: Number(tx.amount || 0),
      }));
    }

    if (hasInvested) {
      const amount = farm?.Investment?.amount || farm?.userInvestment?.amountInvested || investAmount || currentAmount;
      if (amount > 0) {
        return [
          {
            id: farm?.Investment?.id || transactionId || "tx-initial",
            title: "Initial investment",
            date: farm?.startDate || farm?.createdAt,
            roi: Number(farm?.roi || details?.roi || 0),
            maturesDate: farm?.endDate || details?.endDate,
            amount: Number(amount),
          }
        ];
      }
    }

    return [];
  }, [farm, details, hasInvested, investAmount, currentAmount, transactionId]);

  const totalInvestedInHistory = useMemo(() => {
    if (investmentHistory.length === 0) return 0;
    return investmentHistory.reduce((sum, item) => sum + item.amount, 0);
  }, [investmentHistory]);

  const timelineStatus = useMemo(() => {
    if (milestones.length === 0) return "Not Started";
    const completedCount = milestones.filter(m => m.status === "Completed").length;
    const inProgressCount = milestones.filter(m => m.status === "In progress").length;

    if (completedCount === milestones.length) return "Completed";
    if (completedCount > 0 || inProgressCount > 0) return "In Progress";
    return "Not Started";
  }, [milestones]);

  const farmUpdates = useMemo(() => {
    const completed = milestones.filter(m => m.status === "Completed");
    return completed.map((m, index) => {
      const imageSrc = pictures[index % pictures.length]?.src || null;
      return {
        id: `update-${index}`,
        author: ownerName,
        title: "Milestone Completed",
        description: `Completed ${m.name.toLowerCase()}`,
        date: new Date(farm?.updatedAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        image: imageSrc,
      };
    });
  }, [milestones, ownerName, pictures, farm]);

  const openPreview = (index: number) => {
    if (pictures.length === 0) return;
    setActiveIndex(index);
    setViewerVisible(true);
  };

  const handleInvest = () => {
    setStep('calculator');
  };

  const handleProceedInvest = () => {
    if (!agreedToTerms) {
      toast.error("Please read and agree to the terms & conditions.");
      return;
    }
    setStep('review');
  };

  const { mutate: investMutate, isPending: isInvesting } = useInvest();

  const handleProceedPayment = () => {
    if (!ackRisks || !ackTerms || !ackLock) {
      toast.error("Please confirm all acknowledgments to proceed to payment.");
      return;
    }
    if (!farmId) {
      toast.error("Farm ID is missing.");
      return;
    }

    const idempotencyKey = 'idemp-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    investMutate({
      farmId,
      payload: {
        amount: currentAmount,
        currency: farm?.currency || "NGN",
        idempotencyKey,
      }
    }, {
      onSuccess: (response) => {
        if (response.success && response.data) {
          const payment = response.data.payment;
          setTransactionId(payment.id || payment.reference);
          setHasSessionInvested(true);
          setStep('success');
          toast.success("Investment recorded successfully!");
        } else {
          toast.error(response.message || "Failed to record investment");
        }
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to complete investment");
      }
    });
  };

  const handleDownloadAgreement = () => {
    toast.success("Downloading Investment Agreement PDF...");
  };

  const handleSupportMessage = () => {
    toast.info("Thank you for reaching out! A support representative will contact you soon.");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F7F6]">
        <MainHeader activeTab="invest" />
        <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="mb-6 h-4 w-32 rounded bg-[#DCE7D1]" />
            <div className="h-10 w-2/3 rounded bg-[#DCE7D1] sm:h-12" />
            <div className="mt-3 flex gap-2">
              <div className="h-6 w-36 rounded-full bg-[#DCE7D1]" />
              <div className="h-6 w-28 rounded-full bg-[#DCE7D1]" />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-[2fr_1fr]">
              <div className="h-[300px] rounded-[18px] bg-[#DCE7D1]" />
              <div className="grid gap-4">
                <div className="h-[140px] rounded-[18px] bg-[#DCE7D1]" />
                <div className="h-[140px] rounded-[18px] bg-[#DCE7D1]" />
              </div>
            </div>

            <div className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-5">
                <div className="h-48 rounded-[18px] bg-[#DCE7D1]" />
              </div>
              <div className="h-96 rounded-[18px] bg-[#DCE7D1]" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!farm || !details) {
    return (
      <div className="min-h-screen bg-[#F4F7F6]">
        <MainHeader activeTab="invest" />
        <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
            <InfoIcon className="h-8 w-8 text-[#5A8D31]" />
          </div>
          <h2 className="text-2xl font-bold text-[#172017]">Opportunity not found</h2>
          <p className="mt-2 text-sm text-[#667164]">We couldn&apos;t find the farm you are looking for.</p>
          <Link href="/invest" className="mt-6 inline-flex rounded-full bg-[#67A73B] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#55912F]">
            Back to Opportunities
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#F4F7F6]'>
      <MainHeader activeTab="invest" />

      <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        {step === 'calculator' && (
          // Investment Calculator Step UI
          <div>
            <div className="mb-6 text-[12px] text-[#8B988A] flex items-center gap-1.5 font-medium">
              <Link href="/invest" className="hover:text-[#4B5548] transition-colors">
                Invest
              </Link>
              <span className="text-[#C4CFC3]">/</span>
              <button
                type="button"
                onClick={() => setStep('details')}
                className="hover:text-[#4B5548] cursor-pointer"
              >
                {farm.name}
              </button>
              <span className="text-[#C4CFC3]">/</span>
              <span className="text-[#556358] font-semibold">Set Investment</span>
            </div>

            <div className="mb-8">
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#008751] mb-2 flex items-center gap-1.5">
                <span>INVESTMENT</span>
                <span>·</span>
                <span>CALCULATOR</span>
              </div>
              <h1 className="text-[30px] sm:text-[40px] font-bold leading-[1.15] text-[#111827] tracking-tight">
                See your money <span className="text-[#008751]">grow</span> before you invest.
              </h1>
              <p className="mt-2 text-xs sm:text-[14px] text-[#556358] max-w-2xl">
                Move the slider or enter an amount, pick a duration, and watch your projected returns update in real time.
              </p>
            </div>

            <div className="mx-auto rounded-[28px] border border-[#E2E8E0] bg-white text-[#111827] shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="grid md:grid-cols-2">
                {/* Header */}
                <div className="px-6 py-5 sm:px-8 sm:py-6 md:col-span-2 border-b border-[#EEF2EC] flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#008751] text-white shadow-sm shrink-0">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" />
                        <circle cx="19" cy="4" r="1.5" />
                        <circle cx="5" cy="18" r="1.5" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-[17px] font-bold text-[#111827] leading-tight">Investment Calculator</h3>
                      <p className="text-[12px] text-[#718073] mt-0.5">Project your returns in real time</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF7EE] border border-[#C8E6CB] px-3.5 py-1 text-xs font-semibold text-[#008751]">
                    <span className="h-2 w-2 rounded-full bg-[#008751]"></span>
                    Live preview
                  </span>
                </div>

                {/* Left Column - Inputs */}
                <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-[#EEF2EC] flex flex-col justify-between">
                  <div className="space-y-6">
                    {/* Investment Amount */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#718073] mb-2.5">
                        INVESTMENT AMOUNT
                      </label>
                      <div className="bg-[#F5F7F5] border border-transparent focus-within:border-[#008751] focus-within:bg-white rounded-xl px-4 py-3 flex items-center gap-2 transition-all">
                        <span className="text-lg sm:text-xl font-medium text-[#718073] select-none">₦</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={investAmount === 0 ? "" : investAmount}
                          placeholder={String(details?.minInvestVal || 0)}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "");
                            setInvestAmount(val ? parseInt(val, 10) : 0);
                          }}
                          className="w-full bg-transparent text-xl sm:text-2xl font-bold text-[#111827] outline-none placeholder:text-[#9AA59C]"
                        />
                      </div>
                    </div>

                    {/* Slider */}
                    <div className="relative pt-1">
                      <input
                        type="range"
                        min={minSlider}
                        max={maxSlider}
                        step={stepSlider}
                        value={currentAmount}
                        onChange={(e) => setInvestAmount(Number(e.target.value))}
                        className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-[#DDE7DD] focus:outline-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[2.5px] [&::-webkit-slider-thumb]:border-[#008751] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[2.5px] [&::-moz-range-thumb]:border-[#008751] [&::-moz-range-thumb]:shadow-md"
                        style={{
                          background: `linear-gradient(to right, #008751 0%, #008751 ${sliderPercent}%, #DDE7DD ${sliderPercent}%, #DDE7DD 100%)`
                        }}
                      />
                      <div className="flex justify-between text-[11px] text-[#8B988A] mt-2 font-semibold select-none">
                        <span>{formatCompactNaira(minSlider)}</span>
                        <span className="translate-x-[-20%]">{formatCompactNaira(Math.round((minSlider + maxSlider) / 2))}</span>
                        <span>{formatCompactNaira(maxSlider)}</span>
                      </div>
                    </div>

                    {/* Preset buttons */}
                    <div className="flex flex-wrap gap-2 sm:gap-2.5">
                      {presets.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setInvestAmount(preset)}
                          className={clsx(
                            "flex-1 min-w-[70px] sm:min-w-[80px] rounded-full py-2 px-1.5 sm:px-2 text-xs font-semibold text-center transition-all cursor-pointer border",
                            currentAmount === preset
                              ? "bg-[#008751] border-[#008751] text-white shadow-sm"
                              : "bg-[#EDF2ED] border-transparent text-[#3A483D] hover:bg-[#E2EAE2]"
                          )}
                        >
                          {preset === maxSlider && presets.length > 2
                            ? `Max (${formatCompactNaira(preset)})`
                            : formatCompactNaira(preset)}
                        </button>
                      ))}
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#718073] mb-2.5">
                        DURATION
                      </label>
                      <div className="bg-[#EDF2ED] rounded-full p-1.5 inline-flex items-center gap-1.5 w-full sm:w-auto">
                        {durations.map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setSelectedDuration(d)}
                            className={clsx(
                              "rounded-full px-6 py-2 text-xs font-bold transition-all cursor-pointer",
                              currentDuration === d
                                ? "bg-[#008751] text-white shadow-sm"
                                : "bg-transparent text-[#556358] hover:text-[#111827]"
                            )}
                          >
                            {d} mo
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    {/* Terms Checkbox */}
                    <div
                      onClick={() => setAgreedToTerms(!agreedToTerms)}
                      className="bg-[#EEF7EE] border border-[#BCE4C4] rounded-2xl p-4 sm:p-4.5 flex items-start gap-3 cursor-pointer transition-all hover:border-[#96D8A2]"
                    >
                      <div
                        className={clsx(
                          "mt-0.5 h-4.5 w-4.5 shrink-0 rounded-[5px] flex items-center justify-center transition-colors border",
                          agreedToTerms
                            ? "bg-[#008751] border-[#008751] text-white"
                            : "bg-white border-[#A6CDB0]"
                        )}
                      >
                        {agreedToTerms && (
                          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs sm:text-[13px] text-[#2C382F] leading-snug select-none">
                        I have read the{" "}
                        <Link
                          href="/legal/terms-and-conditions"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="font-bold text-[#008751] underline hover:text-[#00663d]"
                        >
                          terms & conditions
                        </Link>{" "}
                        applied to this investment & agree to it
                      </span>
                    </div>

                    {/* Proceed Button */}
                    <button
                      type="button"
                      onClick={handleProceedInvest}
                      className="w-full rounded-2xl bg-[#008751] hover:bg-[#007446] py-3.5 sm:py-4 px-6 text-sm font-bold text-white shadow-[0_8px_24px_rgba(0,135,81,0.25)] transition-all cursor-pointer flex items-center justify-center gap-2 group"
                    >
                      Proceed to Invest
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="transform transition-transform group-hover:translate-x-1"
                      >
                        <path
                          d="M8.00008 12.6666L12.6667 7.99998L8.00008 3.33331"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.33342 8H12.6667"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Right Column - Returns Details */}
                <div className="p-6 sm:p-8 flex flex-col justify-between gap-6">
                  {/* Total Return Box */}
                  <div className="bg-white border border-[#9CE3B0] rounded-[22px] p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#008751] block mb-1.5">
                      TOTAL RETURN
                    </span>
                    <div className="text-[34px] sm:text-[44px] font-extrabold text-[#008751] tracking-tight leading-none mb-1.5">
                      ₦{formatNumberWithCommas(totalReturn)}
                    </div>
                    <p className="text-xs sm:text-[13px] text-[#556358] font-medium">
                      +₦{formatNumberWithCommas(expectedProfit)} profit in {currentDuration} months
                    </p>
                  </div>

                  {/* 2x2 Info Grid */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {/* Expected Profit */}
                    <div className="bg-[#EDF4F7] rounded-[18px] p-4 sm:p-5 flex flex-col justify-between min-h-[92px]">
                      <div className="flex items-center gap-1.5 text-[#008751]">
                        <TrendingUpIcon className="h-4 w-4 shrink-0" color="currentColor" />
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.08em] text-[#008751]">
                          Expected Profit
                        </span>
                      </div>
                      <div className="text-[16px] sm:text-[19px] font-bold text-[#111827] mt-1.5">
                        ₦{formatNumberWithCommas(expectedProfit)}
                      </div>
                    </div>

                    {/* ROI */}
                    <div className="bg-[#EDF4F7] rounded-[18px] p-4 sm:p-5 flex flex-col justify-between min-h-[92px]">
                      <div className="flex items-center gap-1.5 text-[#556358]">
                        <PercentIcon className="h-4 w-4 shrink-0" color="currentColor" />
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.08em] text-[#556358]">
                          ROI
                        </span>
                      </div>
                      <div className="text-[16px] sm:text-[19px] font-bold text-[#111827] mt-1.5">
                        {currentRoi.toFixed(1)}%
                      </div>
                    </div>

                    {/* Principal */}
                    <div className="bg-[#EDF4F7] rounded-[18px] p-4 sm:p-5 flex flex-col justify-between min-h-[92px]">
                      <div className="flex items-center gap-1.5 text-[#556358]">
                        <WalletIcon className="h-4 w-4 shrink-0" color="currentColor" />
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.08em] text-[#556358]">
                          Principal
                        </span>
                      </div>
                      <div className="text-[16px] sm:text-[19px] font-bold text-[#111827] mt-1.5">
                        ₦{formatNumberWithCommas(currentAmount)}
                      </div>
                    </div>

                    {/* Payout Date */}
                    <div className="bg-[#EDF4F7] rounded-[18px] p-4 sm:p-5 flex flex-col justify-between min-h-[92px]">
                      <div className="flex items-center gap-1.5 text-[#556358]">
                        <CalendarIcon className="h-4 w-4 shrink-0" color="currentColor" />
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.08em] text-[#556358]">
                          Payout Date
                        </span>
                      </div>
                      <div className="text-[15px] sm:text-[18px] font-bold text-[#111827] mt-1.5 truncate">
                        {payoutDateString}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'review' && (
          // Review Agreement Step UI
          <div>
            <div className="mb-6 text-[12px] text-[#9DA59A] flex items-center gap-1.5 font-medium">
              <Link href="/invest" className="hover:text-[#697468] transition-colors">
                Invest
              </Link>
              <span className="text-[#B9C0B5] font-light">/</span>
              <button
                type="button"
                onClick={() => setStep('details')}
                className="hover:text-[#697468] cursor-pointer font-medium transition-colors"
              >
                {farm.name}
              </button>
              <span className="text-[#B9C0B5] font-light">/</span>
              <button
                type="button"
                onClick={() => setStep('calculator')}
                className="hover:text-[#697468] cursor-pointer font-medium transition-colors"
              >
                Set Investment
              </button>
              <span className="text-[#B9C0B5] font-light">/</span>
              <span className="font-semibold text-[#1C241D]">Review Investment</span>
            </div>

            <div className="py-6 sm:py-8 max-w-3xl">
              <h1 className="text-[32px] sm:text-[40px] font-semibold leading-none text-[#1C2420] tracking-tight">
                Review your investment agreement
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[#7A846F] font-medium leading-relaxed max-w-2xl">
                Please read each section carefully. Confirm the acknowledgments below to proceed to secure payment.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_420px] items-start mt-4">
              {/* Main Content (Left) */}
              <div className="overflow-hidden rounded-[24px] border border-[#D0D9E15C] bg-[#FFFFFF] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
                {/* Custom Investment Agreement Header Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8ECE1]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0989261A] border border-[#09892633] text-[#487E1F]">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-semibold text-[#1C241D] leading-snug">Investment Agreement</h2>
                      <p className="text-[11px] text-[#8B9586] font-medium">Ref • {farm?.id ? `AGR-${farm.id.slice(-6).toUpperCase()}` : 'AGR-ESCROW'}</p>
                    </div>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0989261A] border border-[#09892633] px-3.5 py-1.5 text-[11px] font-bold text-[#098926]">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Trustee-backed
                    </span>
                  </div>
                </div>

                {/* 1. Key Terms */}
                <div className="overflow-hidden rounded-2xl border border-[#0989264D] bg-[#09892608] shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                  <button
                    type="button"
                    onClick={() => setExpandedSection(expandedSection === 'keyTerms' ? null : 'keyTerms')}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F9FAF8] transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFFFFF] border border-[#D0D9E15C] text-[#098926]">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m-2 2a2 2 0 012-2m-2 4a2 2 0 012-2m-2-4h.01M17 7h.01M17 11h.01M17 15h.01M12 7H5a1 1 0 00-1 1v12a1 1 0 001 1h14a1 1 0 001-1V8a1 1 0 00-1-1h-7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#1C241D] leading-tight">Key Terms</h3>
                        <p className="text-[11px] text-[#8B9586]">The core commercial terms of your investment.</p>
                      </div>
                    </div>
                    <span className="text-[#8B9586]">
                      <svg
                        className={`h-5 w-5 transform transition-transform duration-205 ${expandedSection === 'keyTerms' ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  {expandedSection === 'keyTerms' && (
                    <div className="border-t border-[#E8ECE1] px-5 py-4 bg-transparent">
                      <div className="grid gap-3.5 text-xs text-[#5E675B]">
                        <div className="flex justify-between py-2.5 border-b border-[#E8ECE1]">
                          <span>Principal</span>
                          <span className="font-semibold text-[#1C241D]">₦{formatNumberWithCommas(currentAmount)}</span>
                        </div>
                        <div className="flex justify-between py-2.5 border-b border-[#E8ECE1]">
                          <span>Tenure</span>
                          <span className="font-semibold text-[#1C241D]">{currentDuration} months, non-callable</span>
                        </div>
                        <div className="flex justify-between py-2.5 border-b border-[#E8ECE1]">
                          <span>Projected Profit</span>
                          <span className="font-semibold text-[#1C241D]">₦{formatNumberWithCommas(expectedProfit)}</span>
                        </div>
                        <div className="flex justify-between py-2.5 border-b border-[#E8ECE1]">
                          <span>Total Payout at Maturity</span>
                          <span className="font-semibold text-[#1C241D]">₦{formatNumberWithCommas(totalReturn)}</span>
                        </div>
                        <div className="flex justify-between py-2.5 border-b border-[#E8ECE1]">
                          <span>Payout Frequency</span>
                          <span className="font-semibold text-[#1C241D]">single payout at maturity</span>
                        </div>
                        <div className="flex justify-between py-2.5">
                          <span>Early Exit</span>
                          <span className="font-semibold text-[#1C241D]">Not permitted before maturity</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Escrow Structure */}
                <div className="overflow-hidden rounded-2xl border border-[#0989264D] bg-[#09892608] shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                  <button
                    type="button"
                    onClick={() => setExpandedSection(expandedSection === 'escrow' ? null : 'escrow')}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F9FAF8] transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFFFFF] border border-[#D0D9E15C] text-[#098926]">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#1C241D] leading-tight">Escrow Structure</h3>
                        <p className="text-[11px] text-[#8B9586]">Where your funds sit and who controls release.</p>
                      </div>
                    </div>
                    <span className="text-[#8B9586]">
                      <svg
                        className={`h-5 w-5 transform transition-transform duration-205 ${expandedSection === 'escrow' ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  {expandedSection === 'escrow' && (
                    <div className="border-t border-[#E8ECE1] px-5 py-4 bg-transparent text-xs text-[#5E675B] leading-relaxed">
                      <ul className="space-y-3.5 pl-1">
                        <li className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B9A2C]" />
                          <span>Funds are held in a segregated escrow account administered by a licensed trustee, ring-fenced from operating capital.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B9A2C]" />
                          <span>Release from escrow is governed by a tripartite mandate: Investor, Issuer, and Trustee.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B9A2C]" />
                          <span>Capital is deployed only after the funding round is fully subscribed and legal conditions precedent are satisfied.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B9A2C]" />
                          <span>On maturity, the trustee releases principal and profit directly to your verified payout account.</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* 3. Profit Sharing Model */}
                <div className="overflow-hidden rounded-2xl border border-[#0989264D] bg-[#09892608] shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                  <button
                    type="button"
                    onClick={() => setExpandedSection(expandedSection === 'profitSharing' ? null : 'profitSharing')}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F9FAF8] transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFFFFF] border border-[#D0D9E15C] text-[#098926]">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#1C241D] leading-tight">Profit Sharing Model</h3>
                        <p className="text-[11px] text-[#8B9586]">How returns are calculated and distributed.</p>
                      </div>
                    </div>
                    <span className="text-[#8B9586]">
                      <svg
                        className={`h-5 w-5 transform transition-transform duration-205 ${expandedSection === 'profitSharing' ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  {expandedSection === 'profitSharing' && (
                    <div className="border-t border-[#E8ECE1] px-5 py-4 bg-transparent text-xs text-[#5E675B] leading-relaxed">
                      <p className="mb-4">Profit is contractually fixed at <span className="font-bold text-[#1C241D]">{details.roi.toFixed(1)}%</span> of principal over the {currentDuration} month tenure, paid as a single bullet distribution at maturity.</p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-white border border-[#E8ECE1] rounded-xl p-3.5">
                          <span className="block text-[9px] uppercase font-bold text-[#8B9586] mb-1 tracking-wider">INVESTOR</span>
                          <span className="block text-base font-bold text-[#098926]">100%</span>
                          <span className="text-[9px] text-[#8B9586] font-medium leading-none">of estimated return</span>
                        </div>
                        <div className="bg-white border border-[#E8ECE1] rounded-xl p-3.5">
                          <span className="block text-[9px] uppercase font-bold text-[#8B9586] mb-1 tracking-wider">PLATFORM FEE</span>
                          <span className="block text-base font-bold text-[#098926]">0%</span>
                          <span className="text-[9px] text-[#8B9586] font-medium leading-none">deducted from profit</span>
                        </div>
                        <div className="bg-white border border-[#E8ECE1] rounded-xl p-3.5 flex flex-col justify-between min-h-[75px]">
                          <span className="block text-[9px] uppercase font-bold text-[#8B9586] mb-0.5 tracking-wider">WITHHOLDING</span>
                          <span className="block text-[13px] font-bold text-[#098926] leading-tight">As applicable</span>
                          <span className="text-[9px] text-[#8B9586] font-medium leading-none mt-1">per local rules</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Investor Rights */}
                <div className="overflow-hidden rounded-2xl border border-[#0989264D] bg-[#09892608] shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                  <button
                    type="button"
                    onClick={() => setExpandedSection(expandedSection === 'rights' ? null : 'rights')}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F9FAF8] transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFFFFF] border border-[#D0D9E15C] text-[#098926]">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 14a14.82 14.82 0 00-6.906-3.268m12 .002a15 15 0 013.73 3.626m-.002-3.626a14.966 14.966 0 011.618 7.623M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#1C241D] leading-tight">Investor Rights</h3>
                        <p className="text-[11px] text-[#8B9586]">Your protections and entitlements.</p>
                      </div>
                    </div>
                    <span className="text-[#8B9586]">
                      <svg
                        className={`h-5 w-5 transform transition-transform duration-205 ${expandedSection === 'rights' ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  {expandedSection === 'rights' && (
                    <div className="border-t border-[#E8ECE1] px-5 py-4 bg-transparent text-xs text-[#5E675B] leading-relaxed">
                      <ul className="space-y-3.5 pl-1">
                        <li className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B9A2C]" />
                          <span>Right to receive quarterly performance and escrow reconciliation statements.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B9A2C]" />
                          <span>Right to inspect the trustee's certified custody records on reasonable notice.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B9A2C]" />
                          <span>Right to dispute resolution via independent arbitration under Nigerian law.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B9A2C]" />
                          <span>Right to priority claim on escrowed principal in the event of issuer default.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B9A2C]" />
                          <span>Right to withdraw consent prior to fund deployment (cooling-off window: 48 hours).</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* 5. Risk Disclaimer */}
                <div className="overflow-hidden rounded-2xl border border-[#0989264D] bg-[#09892608] shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
                  <button
                    type="button"
                    onClick={() => setExpandedSection(expandedSection === 'disclaimer' ? null : 'disclaimer')}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F9FAF8] transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFFFFF] border border-[#D0D9E15C] text-[#098926]">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#1C241D] leading-tight">Risk Disclaimer</h3>
                        <p className="text-[11px] text-[#8B9586]">Read carefully — investment carries risk.</p>
                      </div>
                    </div>
                    <span className="text-[#8B9586]">
                      <svg
                        className={`h-5 w-5 transform transition-transform duration-205 ${expandedSection === 'disclaimer' ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  {expandedSection === 'disclaimer' && (
                    <div className="border-t border-[#E8ECE1] px-5 py-4 bg-transparent text-xs text-[#5E675B] leading-relaxed space-y-4">
                      <div className="bg-[#FFF5F5] border border-[#FFD8D8] rounded-xl p-4 text-[#C53030] flex gap-2.5 items-start">
                        <svg className="h-5 w-5 shrink-0 text-[#E53E3E] mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <div className="font-semibold mb-1 text-[#C53030] text-sm">Capital at Risk</div>
                          Past performance is not indicative of future results. Projected returns are targets, not guarantees. You may lose part or all of your invested capital in adverse scenarios including counterparty default, market disruption, or force majeure events.
                        </div>
                      </div>

                      <ul className="space-y-3.5 pl-1">
                        <li className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B9A2C]" />
                          <span>Funds are locked for the full tenure — no early liquidity is available.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B9A2C]" />
                          <span>Returns are net of any applicable statutory taxes and levies.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5B9A2C]" />
                          <span>This offering is not insured by the NDIC and is not a bank deposit.</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-[#8B9586] leading-relaxed pt-2">
                  This agreement is governed by the laws of the Federal Republic of Nigeria. Full contractual documentation, including the trust deed and subscription agreement, will be emailed to your registered address upon completion of payment.
                </p>
              </div>

              {/* Sidebar (Right) */}
              <div className="space-y-5">
                {/* Order Summary */}
                <div className="bg-white border border-[#DDE8D0] rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B9586] block mb-2">
                    ORDER SUMMARY
                  </div>
                  <div className="text-3xl font-bold text-[#098926] tracking-tight leading-none mb-1">
                    ₦{formatNumberWithCommas(totalReturn)}
                  </div>
                  <span className="text-[11px] text-[#8B9586] font-medium block mb-4 border-b border-[#E8ECE1] pb-3">
                    Payout at maturity
                  </span>

                  <div className="space-y-3.5 text-xs text-[#5E675B]">
                    <div className="flex justify-between">
                      <span className="text-[#7D8678]">Principal</span>
                      <span className="font-bold text-[#1C241D]">₦{formatNumberWithCommas(currentAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7D8678]">Expected Profit</span>
                      <span className="font-bold text-[#098926]">+₦{formatNumberWithCommas(expectedProfit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7D8678]">Tenure</span>
                      <span className="font-bold text-[#1C241D]">{currentDuration} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#7D8678]">Fixed Rate</span>
                      <span className="font-bold text-[#1C241D]">{details.roi.toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[12px] bg-[#D9F8DC] py-3 px-4 text-xs font-medium leading-relaxed text-[#013611]">
                    Note: <strong className="font-bold">Funding goal</strong> for this farm must be reached on or before the <strong className="font-bold">Funding End Date.</strong> If the funding goal is not reached by this date, <strong className="font-bold">your payment will be reimbursed back to your account and the farm funding will be closed.</strong>
                  </div>
                </div>

                {/* Acknowledgments */}
                <div className="bg-[#ECF3F899] border border-[#D0D9E15C] rounded-[24px] p-5 space-y-4">
                  <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#475A32] block mb-4">
                    ACKNOWLEDGMENTS
                  </div>

                  {/* Ack 1 */}
                  <div
                    onClick={() => setAckRisks(!ackRisks)}
                    className="flex items-start gap-3 bg-[#0989260F] border border-[#09892666] rounded-2xl p-4 cursor-pointer transition-colors group text-left"
                  >
                    <div className={clsx(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors cursor-pointer",
                      ackRisks ? "border-[#098926] bg-[#098926] text-white" : "border-[#C3D6AA] bg-white"
                    )}>
                      {ackRisks && (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5 select-none">
                      <span className="text-sm font-semibold text-[#1C241D] group-hover:text-[#098926] transition-colors">
                        I understand the risks
                      </span>
                      <span className="text-[10px] text-[#7A846F] leading-snug">
                        Capital is not guaranteed and losses are possible.
                      </span>
                    </div>
                  </div>

                  {/* Ack 2 */}
                  <div
                    onClick={() => setAckTerms(!ackTerms)}
                    className="flex items-start gap-3 bg-[#0989260F] border border-[#09892666] rounded-2xl p-4 cursor-pointer transition-colors group text-left"
                  >
                    <div className={clsx(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors cursor-pointer",
                      ackTerms ? "border-[#098926] bg-[#098926] text-white" : "border-[#C3D6AA] bg-white"
                    )}>
                      {ackTerms && (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5 select-none">
                      <span className="text-sm font-semibold text-[#1C241D] group-hover:text-[#098926] transition-colors">
                        I agree to the investment terms
                      </span>
                      <span className="text-[10px] text-[#7A846F] leading-snug">
                        I have read and accept all sections of the agreement above and the{" "}
                        <Link
                          href="/legal/terms-and-conditions"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="font-medium text-[#098926] underline hover:text-[#076d1e]"
                        >
                          Terms & Conditions
                        </Link>.
                      </span>
                    </div>
                  </div>

                  {/* Ack 3 */}
                  <div
                    onClick={() => setAckLock(!ackLock)}
                    className="flex items-start gap-3 bg-[#0989260F] border border-[#09892666] rounded-2xl p-4 cursor-pointer transition-colors group text-left"
                  >
                    <div className={clsx(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors cursor-pointer",
                      ackLock ? "border-[#098926] bg-[#098926] text-white" : "border-[#C3D6AA] bg-white"
                    )}>
                      {ackLock && (
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5 select-none">
                      <span className="text-sm font-semibold text-[#1C241D] group-hover:text-[#098926] transition-colors">
                        I understand funds may be locked until maturity
                      </span>
                      <span className="text-[10px] text-[#7A846F] leading-snug">
                        No early withdrawal is possible during the {currentDuration}-month tenure.
                      </span>
                    </div>
                  </div>

                  {/* Secure Button */}
                  <div>
                    <button
                      type="button"
                      onClick={handleProceedPayment}
                      disabled={isInvesting}
                      className="w-full rounded-2xl bg-[#009B4E] hover:bg-[#007C3E] py-4 px-6 text-sm font-bold text-white shadow-[0_6px_20px_rgba(0,155,78,0.15)] transition-all cursor-pointer flex items-center justify-center gap-2 group font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isInvesting ? "Processing..." : "Proceed to Payment"}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="transform transition-transform group-hover:translate-x-1 text-white"
                      >
                        <path
                          d="M8.00008 12.6666L12.6667 7.99998L8.00008 3.33331"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.33342 8H12.6667"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <p className="mt-3 text-center text-[10px] text-[#8B9586] flex items-center justify-center gap-1 font-medium">
                      <svg className="h-3.5 w-3.5 text-[#5B9A2C] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Secured with 256-bit TLS • PCI-DSS compliant
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'success' && (
          // Success / Confirmation Step UI matching reference design exactly
          <div className="max-w-[784px] mx-auto py-8 sm:py-12 md:px-4">
            <div className="bg-white border border-[#E9EFE7] rounded-[32px] py-12 px-6 sm:p-12 shadow-[0_15px_40px_rgba(0,0,0,0.03)] text-center relative overflow-hidden">
              {/* Dark Green Checkmark Badge */}
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#386223] text-white mb-5 shadow-sm">
                <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              {/* Status Badge */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0989261A] border border-[#09892633] px-3.5 py-1 text-[11px] font-semibold text-[#098926]">
                  <svg className="h-3.5 w-3.5 text-[#098926]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                  Payment Confirmed
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-[#192218] leading-tight mb-2.5 tracking-tight">
                Investment Successful
              </h1>
              <p className="text-xs sm:text-sm text-[#737E71] font-mono max-w-md mx-auto mb-7 tracking-tight">
                Your investment in <span className="font-semibold text-[#192218]">{farm.name}</span> has been confirmed and is in escrow. Investment Duration will start once funding has been completed for this farm.
              </p>

              {/* Info Outer Box */}
              <div className="bg-[#F9F9F9] border border-[#DBE6D5] rounded-[22px] p-3 text-left mb-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Farm Name Card */}
                  <div className="bg-white border border-[#E2E8DF] rounded-xl p-3.5 sm:p-4 shadow-[0_2px_4px_rgba(0,0,0,0.01)] flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8C9788] uppercase tracking-wider mb-1.5">
                      <svg className="h-3.5 w-3.5 text-[#8C9788]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                      </svg>
                      <span>FARM NAME</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-[#192218] truncate">
                      {farm.name}
                    </span>
                  </div>

                  {/* Amount Invested Card */}
                  <div className="bg-white border border-[#E2E8DF] rounded-xl p-3.5 sm:p-4 shadow-[0_2px_4px_rgba(0,0,0,0.01)] flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8C9788] uppercase tracking-wider mb-1.5">
                      <svg className="h-3.5 w-3.5 text-[#8C9788]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 005.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                      </svg>
                      <span>AMOUNT INVESTED</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-[#192218]">
                      ₦{formatNumberWithCommas(currentAmount)}
                    </span>
                  </div>

                  {/* ROI Card */}
                  <div className="bg-white border border-[#E2E8DF] rounded-xl p-3.5 sm:p-4 shadow-[0_2px_4px_rgba(0,0,0,0.01)] flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8C9788] uppercase tracking-wider mb-1.5">
                      <svg className="h-3.5 w-3.5 text-[#8C9788]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m-5.5.5a1 1 0 11-2 0 1 1 0 012 0zm6 5a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                      <span>ROI</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-[#192218]">
                      {Number(details?.roi || 0).toFixed(1)}%
                    </span>
                  </div>

                  {/* Duration Card */}
                  <div className="bg-white border border-[#E2E8DF] rounded-xl p-3.5 sm:p-4 shadow-[0_2px_4px_rgba(0,0,0,0.01)] flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8C9788] uppercase tracking-wider mb-1.5">
                      <svg className="h-3.5 w-3.5 text-[#8C9788]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                      </svg>
                      <span>DURATION</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-[#192218]">
                      {currentDuration || details?.duration || 0} Months
                    </span>
                  </div>

                  {/* Transaction ID Card */}
                  <div className="bg-white border border-[#E2E8DF] rounded-xl p-3.5 sm:p-4 shadow-[0_2px_4px_rgba(0,0,0,0.01)] flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8C9788] uppercase tracking-wider mb-1.5">
                      <svg className="h-3.5 w-3.5 text-[#8C9788]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                      </svg>
                      <span>TRANSACTION ID</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-[#192218]">
                      {transactionId || farm?.Investment?.id || '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <Link
                  href="/my-portfolio"
                  className="rounded-lg bg-[#50962E] hover:bg-[#438225] text-white py-3 px-4 text-xs font-bold shadow-sm transition-all cursor-pointer text-center tracking-wider uppercase flex items-center justify-center"
                >
                  VIEW MY PORTFOLIO
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setStep('details');
                    // Reset variables
                    setInvestAmount(0);
                    setSelectedDuration(0);
                    setAgreedToTerms(false);
                    setAckRisks(false);
                    setAckTerms(false);
                    setAckLock(false);
                  }}
                  className="rounded-lg bg-[#F2F2F7] border border-[#D1D1D6] text-[#333E31] py-3 px-4 text-xs font-bold transition-all cursor-pointer text-center tracking-wider uppercase flex items-center justify-center"
                >
                  SEE OTHER INVESTMENTS
                </button>
              </div>

              {/* Download Agreement */}
              <button
                type="button"
                onClick={handleDownloadAgreement}
                className="inline-flex items-center justify-center gap-2 text-xs font-bold text-[#494C47] hover:text-[#50962E] transition-colors tracking-wider uppercase cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5m-4.5 4.5V3" />
                </svg>
                DOWNLOAD AGREEMENT
              </button>
            </div>
          </div>
        )}

        {step === 'details' && (
          // Main Detail Page UI
          <div>
            <div className="mb-6 text-[12px] text-[#9DA59A]">
              <Link href="/invest" className="hover:text-[#697468]">
                Invest
              </Link>
              <span className="px-1.5">/</span>
              <span className="font-medium text-[#7A846F]">{farm.name}</span>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
              <section>
                <h1 className="text-[34px] font-bold leading-[1.1] text-[#172017] sm:text-[40px]">{farm.name}</h1>

                <div className="mt-3 flex flex-wrap items-center gap-8 text-sm text-[#667164]">
                  <span className="inline-flex items-center gap-1">
                    <LocationIcon size={24} color="#80916E" />
                    {farm.location || "Nigeria"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D9E7CE]">
                      <UsersIcon size={16} color="#648A43" />
                    </span>
                    {ownerName}
                    <span className="flex">
                      <VerifiedIcon size={20} color="currentColor" />
                    </span>
                  </span>
                </div>

                <div className="mt-10 grid gap-4 md:grid-cols-[2fr_1fr]">
                  {/* Main Photo (Left) */}
                  <div className="overflow-hidden rounded-[18px] border border-[#DDE8D0] bg-[#F4F7EE] shadow-[0_10px_24px_rgba(17,24,39,0.06)] md:h-full">
                    {pictures.length > 0 ? (
                      <div
                        className="relative aspect-[4/3] md:aspect-auto md:h-full w-full overflow-hidden cursor-pointer"
                        onClick={() => openPreview(0)}
                      >
                        <img
                          src={pictures[0].src}
                          alt={pictures[0].alt}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                        />
                      </div>
                    ) : (
                      <div className="relative aspect-[4/3] md:aspect-auto md:h-full w-full overflow-hidden">
                        <FarmFieldArt />
                      </div>
                    )}
                  </div>

                  {/* Side Photos (Right) */}
                  <div className="grid md:grid-rows-2 gap-4">
                    {/* Photo 2 (Top Right) - Half height of main photo */}
                    <div className="overflow-hidden hidden md:block rounded-[18px] border border-[#DDE8D0] bg-[#F4F7EE] shadow-[0_10px_24px_rgba(17,24,39,0.06)] md:h-full">
                      {pictures.length > 1 ? (
                        <div
                          className="relative h-full aspect-[4/3] md:aspect-auto overflow-hidden cursor-pointer"
                          onClick={() => openPreview(1)}
                        >
                          <img
                            src={pictures[1].src}
                            alt={pictures[1].alt}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                          />
                        </div>
                      ) : (
                        <div className="relative h-full aspect-[4/3] md:aspect-auto overflow-hidden">
                          <FarmFieldArt />
                        </div>
                      )}
                    </div>

                    {/* Photo 3 (Bottom Right) - Half height of main photo + Overlay indicating more photos */}
                    <div className="overflow-hidden rounded-[18px] border border-[#DDE8D0] bg-[#F4F7EE] shadow-[0_10px_24px_rgba(17,24,39,0.06)] md:h-full">
                      {pictures.length > 2 ? (
                        <div
                          className="relative h-full aspect-[4/3] md:aspect-auto overflow-hidden cursor-pointer group"
                          onClick={() => openPreview(2)}
                        >
                          <img
                            src={pictures[2].src}
                            alt={pictures[2].alt}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                          <div className="absolute inset-0 bg-[#1E3517]/75 flex flex-col items-center justify-center text-white transition-colors duration-300 group-hover:bg-[#1E3517]/80">
                            <span className="text-[24px] font-bold">
                              +{pictures.length - 2} Photo{pictures.length - 2 !== 1 ? 's' : ''}
                            </span>
                            <span className="text-[12px] opacity-90 font-medium mt-0.5">
                              Click to View Gallery
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="flex h-full items-center justify-center bg-[#1E3517] px-4 py-10 text-center text-[22px] font-semibold text-white cursor-pointer hover:bg-[#2A471F] transition-colors"
                          onClick={() => {
                            if (pictures.length > 0) openPreview(0);
                          }}
                        >
                          + View Gallery
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Investment Start & End Dates Section */}
                {hasInvested ? (
                  <div className="grid gap-4 grid-cols-2 mt-5">
                    {/* Card 1: Amount Invested */}
                    <div className="flex flex-col gap-1.5 rounded-[18px] border border-[#E8ECE1] bg-white p-5 shadow-[0_10px_24px_rgba(17,24,39,0.02)]">
                      <div className="flex items-center gap-1.5">
                        <TrendingUpIcon size={16} color="#80916E" />
                        <div className="text-[11px] uppercase tracking-[0.08em] text-[#93A08D]">Amount Invested</div>
                      </div>
                      <div className="mt-1 text-[18px] font-semibold text-[#172017]">
                        ₦{formatNumberWithCommas(farm?.Investment?.amount || investAmount || currentAmount)}
                      </div>
                    </div>

                    {/* Card 2: ROI */}
                    <div className="flex flex-col gap-1.5 rounded-[18px] border border-[#E8ECE1] bg-white p-5 shadow-[0_10px_24px_rgba(17,24,39,0.02)]">
                      <div className="flex items-center gap-1.5">
                        <PercentIcon className="h-4 w-4" color="#80916E" />
                        <div className="text-[11px] uppercase tracking-[0.08em] text-[#93A08D]">ROI</div>
                      </div>
                      <div className="mt-1 text-[18px] font-semibold text-[#172017]">
                        {details.roi.toFixed(1)}%
                      </div>
                    </div>

                    {/* Card 3: Duration */}
                    <div className="flex flex-col gap-1.5 rounded-[18px] border border-[#E8ECE1] bg-white p-5 shadow-[0_10px_24px_rgba(17,24,39,0.02)]">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="h-4 w-4" color="#80916E" strokeWidth={2} />
                        <div className="text-[11px] uppercase tracking-[0.08em] text-[#93A08D]">Duration</div>
                      </div>
                      <div className="mt-1 text-[18px] font-semibold text-[#172017]">
                        {details.duration} Months
                      </div>
                    </div>

                    {/* Card 4: Transaction ID */}
                    <div className="flex flex-col gap-1.5 rounded-[18px] border border-[#E8ECE1] bg-white p-5 shadow-[0_10px_24px_rgba(17,24,39,0.02)]">
                      <div className="flex items-center gap-1.5">
                        <FileTextIcon className="h-4 w-4" color="#80916E" />
                        <div className="text-[11px] uppercase tracking-[0.08em] text-[#93A08D]">Transaction ID</div>
                      </div>
                      <div className="mt-1 text-[18px] font-semibold text-[#172017] truncate">
                        {farm?.Investment?.id || transactionId || "—"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 bg-[#FFFFFF] border border-[#DBE6D5] p-4 rounded-[18px]">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5 rounded-[18px] border border-[#E8ECE1] bg-white p-4">
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon className="h-5 w-5" color="#80916E" strokeWidth={2} />
                          <div className="text-[11px] uppercase tracking-[0.08em] text-[#93A08D]">Funding Start Date</div>
                        </div>
                        <div className="mt-1 text-[16px] font-bold text-[#172017]">{details.startDate}</div>
                      </div>

                      <div className="flex flex-col gap-1.5 rounded-[18px] border border-[#E8ECE1] bg-white p-4">
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon className="h-5 w-5" color="#80916E" strokeWidth={2} />
                          <div className="text-[11px] uppercase tracking-[0.08em] text-[#93A08D]">Funding End Date</div>
                        </div>
                        <div className="mt-1 text-[16px] font-bold text-[#172017]">{details.endDate}</div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-[12px] bg-[#D9F8DC] p-4 text-xs md:text-sm font-medium leading-relaxed text-[#013611]">
                      Note: <strong className="font-bold">Funding goal</strong> for this farm must be reached on or before the <strong className="font-bold">Funding End Date.</strong> If the funding goal is not reached by this date, <strong className="font-bold">your payment will be reimbursed back to your account and the farm funding will be closed.</strong>
                    </div>
                  </div>
                )}

                <section className="my-5 overflow-hidden rounded-[18px] border border-[#DDE8D0] bg-white shadow-[0_10px_24px_rgba(17,24,39,0.05)]">
                  <div className="border-b border-[#E8ECE1] px-5 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF6DF] text-[#5A8D31]">
                          <FarmIcon size={18} color="currentColor" />
                        </div>
                        <div>
                          <h2 className="text-[18px] font-semibold text-[#172017]">Farm Milestone Timeline</h2>
                          <p className="text-[12px] text-[#8B9586]">Activities needed to be done on the farm to complete investment cycle</p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold shrink-0 ${timelineStatus === "Completed"
                            ? "bg-[#ECF9E4] text-[#5B9A2C]"
                            : timelineStatus === "In Progress"
                              ? "bg-[#FFF3E3] text-[#E08A2E]"
                              : "bg-[#F3F4F6] text-[#7E8590]"
                          }`}
                      >
                        {timelineStatus}
                      </span>
                    </div>
                  </div>

                  <div className="px-5 py-5">
                    <div className="relative">
                      {milestones.length > 0 && (
                        <div className="absolute left-[10px] top-1 bottom-1 w-px bg-[#D8E8C8]" />
                      )}
                      <div className="space-y-0">
                        {milestones.map((milestone, index) => (
                          <div key={`${milestone.name}-${index}`} className="relative flex items-center justify-between gap-4 py-4 pl-8">
                            <div className="absolute left-[2px] top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-4 border-[#F4F7F6] bg-[#6FB23D]" />
                            <div>
                              <div className="text-[15px] font-medium text-[#1C241D]">{milestone.name}</div>
                            </div>
                            <span
                              className={`rounded-full px-3 py-1 text-[11px] font-semibold ${milestone.status === "Completed"
                                ? "bg-[#ECF9E4] text-[#5B9A2C]"
                                : milestone.status === "In progress"
                                  ? "bg-[#FFF3E3] text-[#E08A2E]"
                                  : "bg-[#F3F4F6] text-[#7E8590]"
                                }`}
                            >
                              {milestone.status}
                            </span>
                            {index !== milestones.length - 1 && (
                              <div className="absolute left-[10px] top-full h-6 w-px bg-[#D8E8C8]" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Investment History Section */}
                {hasInvested && investmentHistory.length > 0 && (
                  <section className="my-5 overflow-hidden rounded-[18px] border border-[#DDE8D0] bg-white p-5 sm:p-6 shadow-[0_10px_24px_rgba(17,24,39,0.03)]">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <div className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#93A08D] mb-1">
                          PAYMENTS
                        </div>
                        <h3 className="text-[18px] sm:text-[20px] font-bold text-[#172017] leading-tight">
                          Investment History
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                        className="text-[#64748B] hover:text-[#111827] transition-colors p-1 cursor-pointer"
                        aria-label="Toggle investment history"
                      >
                        <svg
                          className={clsx("h-5 w-5 transform transition-transform duration-200", isHistoryOpen ? "rotate-180" : "")}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {isHistoryOpen && (
                      <div className="space-y-4">
                        <div className="divide-y divide-[#F1F5F0]">
                          {investmentHistory.map((item) => (
                            <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                              <div>
                                <div className="text-[14px] sm:text-[15px] font-bold text-[#172017]">
                                  {item.title}
                                </div>
                                <div className="text-[11.5px] text-[#8B9586] mt-0.5">
                                  {formatHistoryDate(item.date)}
                                  {item.roi > 0 && ` • ${item.roi.toFixed(1)}% ROI estimated`}
                                  {item.maturesDate && ` • Matures ${formatHistoryDate(item.maturesDate)}`}
                                </div>
                              </div>
                              <div className="text-[15px] sm:text-[16px] font-bold text-[#172017] shrink-0">
                                ₦{formatNumberWithCommas(item.amount)}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 rounded-[14px] bg-[#EEF5FB] px-5 py-3.5 flex items-center justify-between">
                          <span className="text-[13px] sm:text-[14px] font-semibold text-[#334155]">
                            Total invested
                          </span>
                          <span className="text-[15px] sm:text-[16px] font-bold text-[#111827]">
                            ₦{formatNumberWithCommas(totalInvestedInHistory)}
                          </span>
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {/* Farm Updates Section */}
                {hasInvested && farmUpdates.length > 0 && (
                  <section className="mt-8">
                    <h3 className="text-[22px] font-bold text-[#172017] mb-5">Farm Updates</h3>
                    <div className="space-y-6">
                      {farmUpdates.map((update) => (
                        <div key={update.id} className="rounded-[18px] border border-[#DDE8D0] bg-white p-5 shadow-[0_10px_24px_rgba(17,24,39,0.03)]">
                          {/* User Header */}
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF6DF] text-[#648A43]">
                              <UsersIcon size={20} color="#648A43" />
                            </span>
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-semibold text-[#172017]">{update.author}</span>
                                <span className="flex">
                                  <VerifiedIcon size={16} color="currentColor" />
                                </span>
                              </div>
                              <div className="text-[11px] text-[#8B9586] font-medium">{update.date}</div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="mt-4">
                            <h4 className="text-[15px] font-bold text-[#172017]">{update.title}</h4>
                            <p className="mt-1 text-xs sm:text-sm text-[#5E675B] leading-relaxed">{update.description}</p>
                          </div>

                          {/* Image */}
                          {update.image && (
                            <div className="mt-4 overflow-hidden rounded-[14px] border border-[#E8ECE1] bg-[#F4F7EE] max-h-[360px]">
                              <img
                                src={update.image}
                                alt={update.title}
                                className="w-full h-auto object-cover max-h-[300px]"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </section>

              <aside className="space-y-5">
                <section className="overflow-hidden rounded-[18px] border border-[#DDE8D0] bg-white shadow-[0_10px_24px_rgba(17,24,39,0.05)]">
                  <div className="px-5 py-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[12px] text-[#7D8678]">Funding Goal</div>
                        <div className="mt-1 text-[30px] font-semibold tracking-[-0.03em] text-[#172017]">
                          ₦{formatNumberWithCommas(details.totalVal.toFixed(2))}
                        </div>
                      </div>
                      {details.progress >= 100 ? (
                        <span className="rounded-full bg-[#ECF9E4] px-3 py-1 text-[11px] font-semibold text-[#5B9A2C]">
                          Completed
                        </span>
                      ) : (
                        <span className="rounded-full bg-[#FFF2DE] px-3 py-1 text-[11px] font-semibold text-[#D98B2B]">
                          {details.progress}% Funded
                        </span>
                      )}
                    </div>

                    <div className="mt-4 h-2 rounded-full bg-[#E5EDD8]">
                      <div
                        className="h-2 rounded-full bg-[#6BAF3D]"
                        style={{ width: `${Math.min(details.progress, 100)}%` }}
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[12px] text-[#5E675B]">
                      <span>₦{formatNumberWithCommas(details.investedVal)} Raised</span>
                      {details.progress < 100 && (
                        <span>₦{formatNumberWithCommas(details.totalVal - details.investedVal)} Remaining</span>
                      )}
                    </div>

                    <div className="mt-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-[#E8ECE1] pb-4">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF7E5] text-[#6DA94C]">
                            <TrendingUpIcon className="h-4 w-4" />
                          </span>

                          <div>
                            <div className="text-[11px] uppercase tracking-[0.08em] text-[#93A08D]">Expected ROI</div>
                            <div className="text-[14px] font-semibold text-[#172017]">{details.roi}%</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-b border-[#E8ECE1] pb-4">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF7E5] text-[#6DA94C]">
                            <ClockIcon className="h-4 w-4" />
                          </span>

                          <div>
                            <div className="text-[11px] uppercase tracking-[0.08em] text-[#93A08D]">Duration</div>
                            <div className="text-[14px] font-semibold text-[#172017]">{details.duration} Months</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-b border-[#E8ECE1] pb-4">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF7E5] text-[#6DA94C]">
                            <CalendarIcon className="h-4 w-4" />
                          </span>

                          <div>
                            <div className="text-[11px] uppercase tracking-[0.08em] text-[#93A08D]">Funding Start Date</div>
                            <div className="text-[14px] font-semibold text-[#172017]">{details.startDate}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-b border-[#E8ECE1] pb-4">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF7E5] text-[#6DA94C]">
                            <AlertTriangleIcon className="h-4 w-4" />
                          </span>

                          <div>
                            <div className="text-[11px] uppercase tracking-[0.08em] text-[#93A08D]">Risk Rating</div>
                            <div className="text-[14px] font-semibold text-[#172017]">{formatRisk(details.risk)}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-b border-[#E8ECE1] pb-4">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF7E5] text-[#6DA94C]">
                            <WalletIcon className="h-4 w-4" />
                          </span>

                          <div>
                            <div className="text-[11px] uppercase tracking-[0.08em] text-[#93A08D]">Minimum Investment</div>
                            <div className="text-[14px] font-semibold text-[#172017]">₦{formatNumberWithCommas(details.minInvestVal)}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF7E5] text-[#6DA94C]">
                            <LayersIcon className="h-4 w-4" />
                          </span>

                          <div>
                            <div className="text-[11px] uppercase tracking-[0.08em] text-[#93A08D]">Remaining Units</div>
                            <div className="text-[14px] font-semibold text-[#172017]">
                              {remainingUnits} {totalUnits > 0 ? `/ ${totalUnits}` : 'units'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {details.progress < 100 && (
                      <button
                        type="button"
                        onClick={handleInvest}
                        className="mt-5 w-full rounded-[6px] bg-[#67A73B] py-3 text-[14px] font-semibold text-white shadow-[0_10px_18px_rgba(103,167,59,0.22)] cursor-pointer hover:bg-[#589230] transition-colors uppercase"
                      >
                        {hasInvested ? "ADD ANOTHER INVESTMENT" : "INVEST NOW"}
                      </button>
                    )}

                    <p className="mt-3 text-center text-[10px] text-[#7D8678]">
                      Regulated by Financial Conduct Authority.<br /> Your capital is protected by the NDIC
                    </p>
                  </div>
                </section>

                <section className="relative overflow-hidden rounded-[20px] bg-[#28421B] py-6 px-5 text-white shadow-[0_20px_55px_rgba(47,76,32,0.22)]">
                  <div className="relative z-10">
                    <h3 className="text-[22px] font-semibold">Need Assistance?</h3>
                    <p className="mt-2 text-[14px] text-[#D9E6D2]">
                      Reach out to our dedicated agricultural investment advisors today.
                    </p>
                    <button
                      type="button"
                      onClick={handleSupportMessage}
                      className="mt-5 w-full rounded-[6px] bg-white py-3 text-[13px] font-semibold text-[#1F2E16] cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      SEND US A MESSAGE
                    </button>
                  </div>
                  <div className="absolute bottom-0 right-0 rounded-full">
                    <LogoWhiteIcon />
                  </div>
                </section>
              </aside>
            </div>
          </div>
        )}
      </main>

      {step === 'details' && !hasInvested && details.progress < 100 && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#E2EAD8] bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.04)]">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-8 px-6 py-5 sm:px-8 lg:px-12">
            {/* Funding Goal */}
            <div className="flex items-center gap-4">
              <div>
                <div className="text-[11px] text-[#7E8779]">Funding Goal</div>
                <div className="text-[22px] font-semibold text-[#172017]">
                  ₦{formatNumberWithCommas(details.totalVal.toFixed(2))}
                </div>
              </div>

              <div className="hidden md:flex flex-col gap-2.5 flex-1 w-full min-w-[331px]">
                <div className="h-[10px] w-full rounded-full bg-[#E5EDD8]">
                  <div
                    className="h-[10px] rounded-full bg-[#61A838]"
                    style={{ width: `${Math.min(details.progress, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[13px] font-medium text-[#4B5548]">
                  <span>₦{formatNumberWithCommas(details.investedVal)} Raised</span>
                  <span>₦{formatNumberWithCommas(details.totalVal - details.investedVal)} Remaining</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleInvest}
              className="rounded-[6px] bg-[#67A73B] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_10px_18px_rgba(103,167,59,0.22)] cursor-pointer hover:bg-[#589230] transition-colors uppercase"
            >
              {hasInvested ? "ADD ANOTHER INVESTMENT" : "INVEST NOW"}
            </button>
          </div>
        </div>
      )}

      <Viewer
        visible={viewerVisible}
        onClose={() => setViewerVisible(false)}
        images={pictures}
        activeIndex={activeIndex}
        rotatable={true}
        zIndex={2000}
      />
    </div>
  );
};

export default FarmDetailPage;
