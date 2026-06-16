"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { MainHeader} from "@/components/ui";
import { AlertTriangleIcon, ClockIcon, FarmIcon, InfoIcon, LayersIcon, LocationIcon, LogoWhiteIcon, TrendingUpIcon, UsersIcon, VerifiedIcon, WalletIcon } from "@/components/icons";
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

const formatRisk = (risk: string) => {
  if (risk === "LOW RISK") return "Low Risk";
  if (risk === "MEDIUM RISK") return "Medium Risk";
  if (risk === "HIGH RISK") return "High Risk";
  return risk;
};

const FarmDetailPage = () => {
  const params = useParams();
  const farmId = params?.farmId as string | undefined;

  const { data: farmResponse, isLoading } = useGetFarmById(farmId);
  const farm = farmResponse?.data;

  // Viewer state for gallery lightbox
  const [viewerVisible, setViewerVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const details = useMemo(() => {
    if (!farm) return null;
    return getDeterministicFarmDetails(farm);
  }, [farm]);

  const pictures = useMemo(() => {
    const rawPictures = (farm as any)?.pictures || [];
    const farmPictures = rawPictures.map((pic: any) => ({
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
    const sourceMilestones = (farm as any).milestones || (farm as any).SelectedMilestones || [];
    if (sourceMilestones.length > 0) {
      return sourceMilestones.map((item: any, index: number) => {
        const name = item.Milestone?.name || item.name || `Milestone ${index + 1}`;
        const status = item.Milestone?.status || item.status || "Not started";
        
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
    const farmUser = (farm as any).user || (farm as any).User;
    return farmUser?.fullName || (farm as any).investorName || "James Ojan";
  }, [farm]);

  const remainingUnits = useMemo(() => {
    if (!details) return 48;
    return Math.max(0, Math.ceil(((100 - details.progress) / 100) * 250));
  }, [details]);

  const openPreview = (index: number) => {
    if (pictures.length === 0) return;
    setActiveIndex(index);
    setViewerVisible(true);
  };

  const handleInvest = () => {
    toast.success(`Investment initialization complete for ${farm?.name || "farm"}. Proceeding to checkout.`);
  };

  const handleSupportMessage = () => {
    toast.info("Thank you for reaching out! A support representative will contact you soon.");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EEF8E7]">
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
      <div className="min-h-screen bg-[#EEF8E7]">
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
    <div className="min-h-screen bg-[#EEF8E7]">
      <MainHeader activeTab="invest" />

      <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
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

            {farm.description && (
              <section className="mt-5 rounded-[18px] border border-[#DDE8D0] bg-white p-5 shadow-[0_10px_24px_rgba(17,24,39,0.05)]">
                <h2 className="text-[18px] font-semibold text-[#172017] mb-2">About the Farm</h2>
                <p className="text-sm text-[#5E675B] leading-relaxed">{farm.description}</p>
              </section>
            )}

            <section className="mt-5 overflow-hidden rounded-[18px] border border-[#DDE8D0] bg-white shadow-[0_10px_24px_rgba(17,24,39,0.05)]">
              <div className="border-b border-[#E8ECE1] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF6DF] text-[#5A8D31]">
                    <FarmIcon size={18} color="currentColor" />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-semibold text-[#172017]">Farm Milestone Timeline</h2>
                    <p className="text-[12px] text-[#8B9586]">Activities needed to be done on the farm to complete investment cycle</p>
                  </div>
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
                        <div className="absolute left-[2px] top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-4 border-[#EEF8E7] bg-[#6FB23D]" />
                        <div>
                          <div className="text-[15px] font-medium text-[#1C241D]">{milestone.name}</div>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                            milestone.status === "Completed"
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
                  <span className="rounded-full bg-[#FFF2DE] px-3 py-1 text-[11px] font-semibold text-[#D98B2B]">
                    {details.progress}% Funded
                  </span>
                </div>

                <div className="mt-4 h-2 rounded-full bg-[#E5EDD8]">
                  <div
                    className="h-2 rounded-full bg-[#6BAF3D]"
                    style={{ width: `${Math.min(details.progress, 100)}%` }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-[12px] text-[#5E675B]">
                  <span>₦{formatNumberWithCommas(details.investedVal)} Raised</span>
                  <span>₦{formatNumberWithCommas(details.totalVal - details.investedVal)} Remaining</span>
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

                <button
                  type="button"
                  onClick={handleInvest}
                  className="mt-5 w-full rounded-[6px] bg-[#67A73B] py-3 text-[14px] font-semibold text-white shadow-[0_10px_18px_rgba(103,167,59,0.22)] cursor-pointer hover:bg-[#589230] transition-colors"
                >
                  INVEST NOW
                </button>

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
      </main>

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
            className="rounded-[6px] bg-[#67A73B] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_10px_18px_rgba(103,167,59,0.22)] cursor-pointer hover:bg-[#589230] transition-colors"
          >
            INVEST NOW
          </button>
        </div>
      </div>

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
