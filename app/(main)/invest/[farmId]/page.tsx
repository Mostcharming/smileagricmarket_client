"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import clsx from "clsx";
import { toast } from "sonner";
import { MainHeader } from "@/components/ui";
import { AlertTriangleIcon, CalendarIcon, ClockIcon, FarmIcon, InfoIcon, LayersIcon, LocationIcon, LogoWhiteIcon, TrendingUpIcon, UsersIcon, VerifiedIcon, WalletIcon, InvestmentIcon, PercentIcon, FileTextIcon } from "@/components/icons";
import { useGetFarmById } from "@/mutation";
import { formatNumberWithCommas } from "@/utils";
import { getPreviewImageUrl } from "@/utils/image";

const Viewer = dynamic(() => import("react-viewer"), { ssr: false });

type FarmMilestone = {
  name: string;
  status: "Completed" | "In progress" | "Not started";
};

const DUMMY_FARM_PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
    alt: "Beautiful agricultural farmland with green crops",
  },
  {
    src: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80",
    alt: "Ripe tomatoes growing on vines in a farm greenhouse",
  },
  {
    src: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1200&q=80",
    alt: "Farmer hands holding rich organic soil with a small green sprout",
  },
  {
    src: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=1200&q=80",
    alt: "Fresh green lettuce fields under the sun",
  },
  {
    src: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=1200&q=80",
    alt: "Golden wheat field moving gently in the wind",
  },
  {
    src: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1200&q=80",
    alt: "Professional farmer checking the health of leafy green vegetables",
  },
  {
    src: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1200&q=80",
    alt: "Rows of organic plants growing inside a modern greenhouse structure",
  },
  {
    src: "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1200&q=80",
    alt: "Sunlight shining through a vibrant corn crop field",
  },
  {
    src: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=1200&q=80",
    alt: "Bright red chili peppers ripening on agricultural bushes",
  },
  {
    src: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80",
    alt: "Modern farm tractor working in a vast cultivated field",
  },
  {
    src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    alt: "Scenic sunrise view over peaceful rolling farmland hills",
  },
  {
    src: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80",
    alt: "Fresh green sprouts growing in small farming pots",
  },
];

const FarmFieldArt = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#f2d266_0%,#9cc85a_25%,#5b8f34_52%,#2e541f_100%)]" />
    <div className="absolute inset-0 bg-[repeating-linear-gradient(110deg,rgba(18,58,24,0.78)_0_10px,rgba(92,145,54,0.08)_10px_22px,rgba(18,58,24,0.78)_22px_34px)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,232,146,0.5)_0%,rgba(255,232,146,0)_28%)]" />
    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(10,30,13,0.18)_100%)]" />
  </div>
);

const getDeterministicFarmDetails = (farm: { id: string; name: string; stats?: { completionPercentage?: number } }) => {
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

  // Deterministic dates
  const baseYear = 2026;
  const startMonth = (code % 4) + 6; // July, August, September, October (indices 6, 7, 8, 9)
  const startDay = 1 + (code % 28);
  const startDateObj = new Date(baseYear, startMonth, startDay);
  
  const endDateObj = new Date(startDateObj);
  endDateObj.setDate(startDateObj.getDate() + 30 + (code % 25));

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formatDate = (date: Date) => `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

  const startDate = (farm as any).startDate ? formatDate(new Date((farm as any).startDate)) : formatDate(startDateObj);
  const endDate = (farm as any).endDate ? formatDate(new Date((farm as any).endDate)) : formatDate(endDateObj);

  return {
    roi,
    duration,
    risk,
    inspectedDays,
    totalVal,
    progress,
    investedVal,
    minInvestVal,
    startDate,
    endDate,
  };
};
const formatRisk = (risk: string) => {
  if (risk === "LOW RISK") return "Low Risk";
  if (risk === "MEDIUM RISK") return "Medium Risk";
  if (risk === "HIGH RISK") return "High Risk";
  return risk;
};

const mockFarmsMap: Record<string, any> = {
  "inv-1": {
    name: "Oakhaven Almond Grove",
    location: "Sacramento Valley, CA",
    investedAmount: 125000,
    roi: 12.5,
    progress: 62,
    status: "not_started",
  },
  "inv-2": {
    name: "RubyBerry Vertical Farm",
    location: "Austin, TX",
    investedAmount: 125000,
    roi: 12.5,
    progress: 34,
    status: "harvest",
  },
  "inv-3": {
    name: "Golden Valley Vineyard",
    location: "Napa, CA",
    investedAmount: 125000,
    roi: 12.5,
    progress: 84,
    status: "land_preparation",
  },
  "inv-4": {
    name: "Sierra Highlands Coffee",
    location: "Boquete, Panama",
    investedAmount: 125000,
    roi: 12.5,
    progress: 12,
    status: "land_preparation",
  },
  "inv-5": {
    name: "Pine Creek Orchard",
    location: "Yakima Valley, WA",
    investedAmount: 95000,
    roi: 14.0,
    progress: 100,
    status: "completed",
  },
};

const FarmDetailPage = () => {
  const params = useParams();
  const farmId = params?.farmId as string | undefined;

  const isMockId = useMemo(() => farmId?.startsWith('inv-'), [farmId]);
  const mockFarmData = useMemo(() => {
    if (!isMockId) return null;
    const mockInfo = mockFarmsMap[farmId!] || {
      name: "Greenfield Cassava Cluster",
      location: "Orile-Iganmu, Lagos",
      investedAmount: 1640000,
      roi: 42.0,
      progress: 100,
      status: "completed",
    };

    return {
      id: farmId || 'inv-5',
      name: mockInfo.name,
      description: "A premium cassava farming cluster optimized for high yields and modern processing.",
      location: mockInfo.location,
      createdAt: "2026-07-22T00:00:00Z",
      Investment: {
        amount: mockInfo.investedAmount,
        status: "active",
        id: "TXN-8F29X1A2",
      },
      stats: {
        completionPercentage: mockInfo.progress,
      },
      mockRoi: mockInfo.roi,
      mockTotalVal: 2010000,
      mockMilestones: [
        { name: "Land preparation", status: "Completed" },
        { name: "Seed Purchase", status: "Completed" },
        { name: "Planting of seeds", status: "Not started" },
        { name: "Land maintenance", status: "Not started" },
        { name: "Harvest", status: "Not started" },
        { name: "Go to Market", status: "Not started" },
      ],
    };
  }, [farmId, isMockId]);

  const { data: farmResponse, isLoading: apiIsLoading } = useGetFarmById(isMockId ? undefined : farmId);
  const farm = isMockId ? mockFarmData : farmResponse?.data;
  const isLoading = isMockId ? false : apiIsLoading;

  // Viewer state for gallery lightbox
  const [viewerVisible, setViewerVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Investment state management
  const [step, setStep] = useState<'details' | 'calculator' | 'review' | 'success'>('details');
  const [investAmount, setInvestAmount] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [hasSessionInvested, setHasSessionInvested] = useState(false);

  const hasInvested = useMemo(() => {
    return !!farm?.Investment?.amount || hasSessionInvested;
  }, [farm, hasSessionInvested]);

  // Review step states
  const [expandedSection, setExpandedSection] = useState<string | null>('keyTerms');
  const [ackRisks, setAckRisks] = useState(false);
  const [ackTerms, setAckTerms] = useState(false);
  const [ackLock, setAckLock] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const details = useMemo(() => {
    if (!farm) return null;
    const baseDetails = getDeterministicFarmDetails(farm);
    if ((farm as any).mockRoi !== undefined) {
      baseDetails.roi = (farm as any).mockRoi;
    }
    if ((farm as any).mockTotalVal !== undefined) {
      baseDetails.totalVal = (farm as any).mockTotalVal;
      // Re-calculate investedVal based on progress and totalVal override
      baseDetails.investedVal = Math.round((baseDetails.progress / 100) * baseDetails.totalVal);
    }
    return baseDetails;
  }, [farm]);

  // Derived current values using default values from farm details if user has not interacted
  const currentAmount = useMemo(() => {
    return investAmount || (details ? details.minInvestVal : 0);
  }, [investAmount, details]);

  const currentDuration = useMemo(() => {
    return 14;
  }, []);

  // Dynamic calculations for the calculator
  const currentRoi = useMemo(() => {
    if (!details || currentDuration === 0) return 0;
    return details.roi * (currentDuration / details.duration);
  }, [details, currentDuration]);

  const expectedProfit = useMemo(() => {
    if (currentAmount === 0 || currentRoi === 0) return 0;
    return Math.round(currentAmount * (currentRoi / 100));
  }, [currentAmount, currentRoi]);

  const totalReturn = useMemo(() => {
    return currentAmount + expectedProfit;
  }, [currentAmount, expectedProfit]);

  const payoutDateString = useMemo(() => {
    if (currentDuration === 0) return "";
    const date = new Date();
    date.setMonth(date.getMonth() + currentDuration);
    const day = String(date.getDate()).padStart(2, "0");
    const monthsArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthsArr[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }, [currentDuration]);

  const durations = useMemo(() => {
    return [14];
  }, []);

  const presets = useMemo(() => {
    if (!details) return [50000, 100000, 500000, 1000000];
    const min = details.minInvestVal;
    const list = [50000, 100000, 500000, 1000000, 2000000, 5000000];
    return list.filter((val) => val >= min).slice(0, 4);
  }, [details]);

  const pictures = useMemo(() => {
    const rawPictures = (farm as unknown as Record<string, unknown>)?.pictures as { url: string; name?: string }[] | undefined || [];
    const farmPictures = rawPictures.map((pic) => ({
      src: getPreviewImageUrl(pic.url ?? ""),
      alt: pic.name || "Farm photo",
    }));

    // Pad to 12 photos with dummy ones if we have fewer
    if (farmPictures.length < 12) {
      const needed = 12 - farmPictures.length;
      return [...farmPictures, ...DUMMY_FARM_PHOTOS.slice(0, needed)];
    }
    return farmPictures.slice(0, 12);
  }, [farm]);

  const milestones = useMemo((): FarmMilestone[] => {
    if (!farm) return [];
    if ((farm as any).mockMilestones) {
      return (farm as any).mockMilestones;
    }
    const farmRec = farm as unknown as Record<string, unknown>;
    const sourceMilestones = (farmRec.milestones || farmRec.SelectedMilestones || []) as Record<string, unknown>[];
    if (sourceMilestones.length > 0) {
      return sourceMilestones.map((item, index) => {
        const milestoneObj = item.Milestone as Record<string, unknown> | undefined;
        const name = (milestoneObj?.name || item.name || `Milestone ${index + 1}`) as string;
        const status = (milestoneObj?.status || item.status || "Not started") as string;

        let normalizedStatus: "Completed" | "In progress" | "Not started" = "Not started";
        const st = status.toLowerCase();
        if (st === "completed" || st === "complete") {
          normalizedStatus = "Completed";
        } else if (st === "in progress" || st === "inprogress" || st === "in_progress") {
          normalizedStatus = "In progress";
        }

        return {
          name,
          status: normalizedStatus,
        };
      });
    }

    // Fallback default timeline
    return [
      { name: "Land preparation", status: "Completed" },
      { name: "Seed Purchase", status: "In progress" },
      { name: "Planting of seeds", status: "Not started" },
      { name: "Land maintenance", status: "Not started" },
      { name: "Harvest", status: "Not started" },
      { name: "Go to Market", status: "Not started" },
    ];
  }, [farm]);

  const ownerName = useMemo(() => {
    if (!farm) return "James Ojan";
    const farmRec = farm as unknown as Record<string, unknown>;
    const farmUser = (farmRec.user || farmRec.User) as Record<string, unknown> | undefined;
    return (farmUser?.fullName || farmRec.investorName || "James Ojan") as string;
  }, [farm]);

  const remainingUnits = useMemo(() => {
    if (!details) return 48;
    return Math.max(0, Math.ceil(((100 - details.progress) / 100) * 250));
  }, [details]);

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
    const list = completed.map((m, index) => {
      const imageSrc = pictures[index % pictures.length]?.src || DUMMY_FARM_PHOTOS[index % DUMMY_FARM_PHOTOS.length].src;
      return {
        id: `update-${index}`,
        author: ownerName,
        title: "Milestone Completed",
        description: `Completed ${m.name.toLowerCase()}`,
        date: "Nov 17",
        image: imageSrc,
      };
    });

    // Fallback if none are completed, to ensure updates are not empty when hasInvested is true
    if (list.length === 0 && milestones.length >= 2) {
      list.push(
        {
          id: "update-0",
          author: ownerName,
          title: "Milestone Completed",
          description: `Completed ${milestones[0].name.toLowerCase()}`,
          date: "Nov 17",
          image: pictures[0]?.src || DUMMY_FARM_PHOTOS[0].src,
        },
        {
          id: "update-1",
          author: ownerName,
          title: "Milestone Completed",
          description: `Completed ${milestones[1].name.toLowerCase()}`,
          date: "Nov 17",
          image: pictures[1]?.src || DUMMY_FARM_PHOTOS[1].src,
        }
      );
    }
    return list;
  }, [milestones, ownerName, pictures]);

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

  const handleProceedPayment = () => {
    if (!ackRisks || !ackTerms || !ackLock) {
      toast.error("Please confirm all acknowledgments to proceed to payment.");
      return;
    }
    const txn = 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    setTransactionId(txn);
    setHasSessionInvested(true);
    setStep('success');
    toast.success("Payment confirmed successfully!");
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
            <div className="mb-6 text-[12px] text-[#9DA59A]">
              <Link href="/invest" className="hover:text-[#697468]">
                Invest
              </Link>
              <span className="px-1.5">/</span>
              <button
                type="button"
                onClick={() => setStep('details')}
                className="hover:text-[#697468] cursor-pointer font-medium"
              >
                {farm.name}
              </button>
              <span className="px-1.5">/</span>
              <span className="font-medium text-[#7A846F]">Set Investment</span>
            </div>

            <div className="text-center py-6 sm:py-8 max-w-3xl mx-auto">
              <div className="text-[11.5px] font-bold uppercase tracking-[0.22em] text-[#599C38] mb-2.5">
                INVESTMENT • CALCULATOR
              </div>
              <h1 className="text-[28px] sm:text-[40px] font-bold leading-tight text-[#1C2420] tracking-[-0.03em]">
                See your money <span className="text-[#599C38]">grow</span> before you invest.
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-[#6C756B] max-w-xl mx-auto">
                Move the slider, pick a duration, and watch your projected returns update in real time.
              </p>
            </div>

            <div className="mx-auto rounded-[28px] border border-[#2A343D]/30 bg-[#14210E] text-white shadow-[0_24px_60px_rgba(7,19,5,0.3)] overflow-hidden mt-6">
              <div className="grid md:grid-cols-2">
                {/* Header */}
                <div className="p-6 sm:p-8 md:col-span-2 border-b border-b-[#152A11] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1C3A16] text-[#4ADE80]">
                      <InvestmentIcon size={22} color="currentColor" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">Investment Calculator</h3>
                      <p className="text-[11px] text-[#8B9A86]">Project your returns in real time</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0D2411] border border-[#1D4E26] px-3 py-1 text-[11px] font-medium text-[#4ADE80]">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#22C55E]"></span>
                    </span>
                    Live preview
                  </span>
                </div>

                {/* Left Column - Inputs */}
                <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-[#152A11] flex flex-col justify-between">
                  <div>
                    {/* Investment Amount Display */}
                    <div className="mb-6">
                      <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[#8B9A86] mb-3">
                        INVESTMENT AMOUNT
                      </label>
                      <div className="text-[32px] sm:text-[38px] font-bold text-white tracking-tight flex items-baseline">
                        <span className="text-2xl font-medium text-[#8B9A86] mr-2">₦</span>
                        {formatNumberWithCommas(currentAmount)}
                      </div>
                    </div>

                    {/* Slider */}
                    <div className="mb-6 relative">
                      <input
                        type="range"
                        min={details.minInvestVal}
                        max={5000000}
                        step={10000}
                        value={currentAmount}
                        onChange={(e) => setInvestAmount(Number(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[#142C10] focus:outline-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4ADE80] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#4ADE80] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg"
                        style={{
                          background: `linear-gradient(to right, #4ADE80 0%, #4ADE80 ${((currentAmount - details.minInvestVal) / (5000000 - details.minInvestVal)) * 100
                            }%, #142C10 ${((currentAmount - details.minInvestVal) / (5000000 - details.minInvestVal)) * 100
                            }%, #142C10 100%)`
                        }}
                      />
                      <div className="flex justify-between text-[11px] text-[#607559] mt-2 font-medium">
                        <span>₦{formatNumberWithCommas(details.minInvestVal >= 1000000 ? `${details.minInvestVal / 1000000}M` : `${details.minInvestVal / 1000}K`)}</span>
                        <span>₦5M</span>
                      </div>
                    </div>

                    {/* Preset buttons */}
                    {presets.length > 0 && (
                      <div className="w-full flex flex-wrap gap-2.5 mb-8">
                        {presets.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setInvestAmount(preset)}
                            className={clsx(
                              "flex-1 rounded-xl px-4 py-2.5 text-xs font-semibold border transition-all cursor-pointer",
                              currentAmount === preset
                                ? "bg-[#1C3A16] border-[#4ADE80] text-white"
                                : "bg-[#14210E] border-[#2A343D99] text-[#95A0AA] hover:border-[#306129]"
                            )}
                          >
                            ₦{preset >= 1000000 ? `${preset / 1000000}M` : `${preset / 1000}K`}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Duration */}
                    <div className="mb-8">
                      <label className="block text-[11px] font-bold uppercase tracking-[0.15em] text-[#8B9A86] mb-3">
                        DURATION
                      </label>
                      <div className="bg-[#101A0B] rounded-2xl p-2 flex flex-wrap gap-1.5">
                        {durations.map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setSelectedDuration(d)}
                            className={clsx(
                              "rounded-xl px-5 py-1 text-xs font-semibold transition-all cursor-pointer min-w-[130px] text-center",
                              currentDuration === d
                                ? "bg-[#4ADE80] text-[#071305] shadow-md"
                                : "bg-transparent text-[#8B9A86] hover:bg-[#122410] hover:text-white"
                            )}
                          >
                            {d} mo
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Terms Checkbox */}
                    <div className="mb-6">
                      <label className="bg-[#14210E] border border-[#213A15] rounded-2xl p-6 flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="mt-0.5 h-4.5 w-4.5 rounded border-[#1D3E17] bg-[#091507] text-[#4ADE80] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-xs text-[#8B9A86] leading-relaxed group-hover:text-[#A1B29C] transition-colors">
                          I have read the <span className="text-[#4ADE80] hover:underline">terms & conditions</span> applied to this investment and agree to it
                        </span>
                      </label>
                    </div>

                    {/* Proceed Button */}
                    <button
                      type="button"
                      onClick={handleProceedInvest}
                      className="w-full rounded-2xl bg-gradient-to-r from-[#22C55E] to-[#4ADE80] hover:from-[#16A34A] hover:to-[#22C55E] py-4 px-6 text-sm font-bold text-[#071305] shadow-[0_10px_30px_rgba(74,222,128,0.25)] transition-all cursor-pointer flex items-center justify-center gap-2 group"
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
                <div className="p-6 sm:p-8 flex flex-col gap-8">
                  {/* Total Return Box */}
                  <div className="bg-[#0C1408] border border-[#213A15] rounded-[22px] p-4 sm:p-6 relative overflow-hidden">
                    {/* Subtle glow background */}
                    <div className="absolute -right-20 -top-20 w-44 h-44 rounded-full bg-[#22C55E]/10 blur-3xl pointer-events-none" />

                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4ADE80] block mb-2">
                      TOTAL RETURN
                    </span>
                    <div className="text-[34px] sm:text-[42px] font-bold text-[#4ADE80] tracking-tight leading-none mb-2">
                      ₦{formatNumberWithCommas(totalReturn)}
                    </div>
                    <p className="text-xs text-[#8B9A86] font-medium">
                      +₦{formatNumberWithCommas(expectedProfit)} profit in {currentDuration} months
                    </p>
                  </div>

                  {/* 2x2 Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Expected Profit */}
                    <div className="bg-[#182810] border border-[#213A15] rounded-[20px] p-4.5">
                      <div className="flex items-center gap-2 mb-2 text-[#4ADE80]">
                        <TrendingUpIcon className="h-4 w-4 shrink-0" />
                        <span className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#8B9A86]">
                          Expected Profit
                        </span>
                      </div>
                      <div className="text-[15px] sm:text-base font-bold text-white">
                        ₦{formatNumberWithCommas(expectedProfit)}
                      </div>
                    </div>

                    {/* ROI */}
                    <div className="bg-[#182810] border border-[#213A15] rounded-[20px] p-4.5">
                      <div className="flex items-center gap-2 mb-2 text-[#4ADE80]">
                        {/* Custom percent badge icon */}
                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h.01M15 17h.01M9 17h.01M15 7h.01M9 21h6a2 2 0 002-2V5a2 2 0 00-2-2H9a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#8B9A86]">
                          ROI
                        </span>
                      </div>
                      <div className="text-[15px] sm:text-base font-bold text-white">
                        {currentRoi.toFixed(1)}%
                      </div>
                    </div>

                    {/* Principal */}
                    <div className="bg-[#182810] border border-[#213A15] rounded-[20px] p-4.5">
                      <div className="flex items-center gap-2 mb-2 text-[#4ADE80]">
                        <WalletIcon className="h-4 w-4 shrink-0" />
                        <span className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#8B9A86]">
                          Principal
                        </span>
                      </div>
                      <div className="text-[15px] sm:text-base font-bold text-white">
                        ₦{formatNumberWithCommas(currentAmount)}
                      </div>
                    </div>

                    {/* Payout Date */}
                    <div className="bg-[#182810] border border-[#213A15] rounded-[20px] p-4.5">
                      <div className="flex items-center gap-2 mb-2 text-[#4ADE80]">
                        {/* Custom calendar icon */}
                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[9.5px] font-bold uppercase tracking-[0.1em] text-[#8B9A86]">
                          Payout Date
                        </span>
                      </div>
                      <div className="text-[14px] sm:text-[15px] font-bold text-white">
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
                      <p className="text-[11px] text-[#8B9586] font-medium">Ref • AGR-876-0043</p>
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
                    Note: <strong className="font-bold">Funding goal</strong> for this farm must be reached on or before the <strong className="font-bold">Investment End Date.</strong> If the funding goal is not reached by this date, <strong className="font-bold">your payment will be reimbursed back to your account and the farm funding will be closed.</strong>
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
                        I have read and accept all sections of the agreement above.
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
                      className="w-full rounded-2xl bg-[#009B4E] hover:bg-[#007C3E] py-4 px-6 text-sm font-bold text-white shadow-[0_6px_20px_rgba(0,155,78,0.15)] transition-all cursor-pointer flex items-center justify-center gap-2 group font-semibold"
                    >
                      Proceed to Payment
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
                      {details?.roi ? `${Number(details.roi).toFixed(1)}%` : '42.0%'}
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
                      {currentDuration || details?.duration || 14} Months
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
                      {transactionId || 'TXN-8F29X1A2'}
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
                              +{pictures.length - 2} Photos
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
                        ₦{formatNumberWithCommas(farm?.Investment?.amount || investAmount || 1640000)}
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
                        {farm?.Investment?.id || transactionId || "TXN-8F29X1A2"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 bg-[#FFFFFF] border border-[#DBE6D5] p-4 rounded-[18px]">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5 rounded-[18px] border border-[#E8ECE1] bg-white p-4">
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon className="h-5 w-5" color="#80916E" strokeWidth={2} />
                          <div className="text-[11px] uppercase tracking-[0.08em] text-[#93A08D]">Investment Start Date</div>
                        </div>
                        <div className="mt-1 text-[16px] font-bold text-[#172017]">{details.startDate}</div>
                      </div>

                      <div className="flex flex-col gap-1.5 rounded-[18px] border border-[#E8ECE1] bg-white p-4">
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon className="h-5 w-5" color="#80916E" strokeWidth={2} />
                          <div className="text-[11px] uppercase tracking-[0.08em] text-[#93A08D]">Investment End Date</div>
                        </div>
                        <div className="mt-1 text-[16px] font-bold text-[#172017]">{details.endDate}</div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-[12px] bg-[#D9F8DC] p-4 text-xs md:text-sm font-medium leading-relaxed text-[#013611]">
                      Note: <strong className="font-bold">Funding goal</strong> for this farm must be reached on or before the <strong className="font-bold">Investment End Date.</strong> If the funding goal is not reached by this date, <strong className="font-bold">your payment will be reimbursed back to your account and the farm funding will be closed.</strong>
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
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold shrink-0 ${
                          timelineStatus === "Completed"
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
                            <div className="text-[11px] uppercase tracking-[0.08em] text-[#93A08D]">Investment Start Date</div>
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
                            <div className="text-[14px] font-semibold text-[#172017]">{remainingUnits} / 250</div>
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
