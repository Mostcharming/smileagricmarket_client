/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useApproveAdminFarm, useGetAdminFarmById, useRejectAdminFarm } from '@/mutation';
import { Typography } from '@/components/ui';
import { useQueryClient } from '@tanstack/react-query';
import AdminFarmActionModal from '@/components/modal/adminFarmActionModal';
import {
  CheckIcon,
  DocsIcon,
  FarmIcon,
  LocationIcon,
  LogoWhiteIcon,
  PercentIcon,
  TrendingUpIcon,
  WalletIcon,
} from '@/components/icons';
import dynamic from 'next/dynamic';
import { formatNumberWithCommas } from '@/utils';
import { getPreviewImageUrl } from '@/utils/image';
import { AdminFarmDetailsResponse, ProjectMilestoneItem } from '@/types';

const Viewer = dynamic(() => import('react-viewer'), { ssr: false });

type DocumentItem = {
  id: string;
  name: string;
  size: string;
  status: 'pending' | 'reviewed';
  url: string;
};

type GalleryItem = {
  src: string;
  alt?: string;
};

const IMAGE_EXTENSIONS = /\.(png|jpe?g|gif|webp|bmp|svg)$/i;

const isImageUrl = (url?: string, mimeType?: string, fileName?: string) => {
  if (mimeType?.startsWith('image/')) return true;
  if (fileName && IMAGE_EXTENSIONS.test(fileName)) return true;
  if (!url) return false;

  const strippedUrl = url.split('#')[0].split('?')[0];
  if (IMAGE_EXTENSIONS.test(strippedUrl)) return true;

  try {
    const parsedUrl = new URL(url, 'https://app.smileagrimarket.com');
    if (parsedUrl.pathname.startsWith('/image-proxy')) {
      const innerUrl = parsedUrl.searchParams.get('url');
      if (innerUrl) return isImageUrl(decodeURIComponent(innerUrl));
    }
    return IMAGE_EXTENSIONS.test(parsedUrl.pathname);
  } catch {
    return false;
  }
};

const parseAmount = (value?: string | number | null) => {
  if (value === null || value === undefined) return 0;
  const parsedValue = typeof value === 'string' ? Number(value.replace(/,/g, '')) : value;
  return typeof parsedValue === 'number' && !Number.isNaN(parsedValue) ? parsedValue : 0;
};

const formatCurrency = (value?: number | string | null) => {
  const amount = parseAmount(value);
  return `₦${formatNumberWithCommas(amount.toFixed(0))}`;
};

const formatCurrencyWithDecimals = (value?: number | string | null) => {
  const amount = parseAmount(value);
  return `₦${formatNumberWithCommas(amount.toFixed(2))}`;
};

const formatFileSize = (bytes?: number | string) => {
  const sizeNum = typeof bytes === 'number' ? bytes : Number(bytes);
  if (!sizeNum || Number.isNaN(sizeNum)) return 'PDF Document';
  if (sizeNum >= 1024 * 1024) {
    return `PDF ${(sizeNum / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `PDF ${(sizeNum / 1024).toFixed(1)} KB`;
};

const formatDates = (startDate?: string, endDate?: string) => {
  if (!startDate && !endDate) return '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const formatOne = (dStr?: string) => {
    if (!dStr) return '';
    const d = new Date(dStr);
    if (Number.isNaN(d.getTime())) return dStr;
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const start = formatOne(startDate);
  const end = formatOne(endDate);
  if (start && end) return `${start} - ${end}`;
  return start || end;
};

const formatStatusText = (status?: string, isCompleted?: boolean) => {
  if (isCompleted) return 'Completed';
  if (!status) return 'Not Started';

  const normalized = status.toLowerCase().trim();
  if (normalized === 'request_for_funding' || normalized === 'request for funding') return 'Request for Funding';
  if (normalized === 'processing_funding' || normalized === 'processing funding' || normalized === 'processing') return 'Processing Funding';
  if (normalized === 'completed' || normalized === 'complete') return 'Completed';
  if (normalized === 'funding_started' || normalized === 'funding started' || normalized === 'funding') return 'Funding Started';
  if (normalized === 'not_started' || normalized === 'not started' || normalized === 'not_requested' || normalized === 'not requested') return 'Not Started';
  if (normalized === 'active') return 'Active';

  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatRelativeDate = (value?: string) => {
  if (!value) return 'Submitted recently';
  const createdAt = new Date(value).getTime();
  if (Number.isNaN(createdAt)) return 'Submitted recently';

  const diffInDays = Math.max(0, Math.round((Date.now() - createdAt) / (1000 * 60 * 60 * 24)));
  if (diffInDays === 0) return 'Submitted today';
  if (diffInDays === 1) return 'Submitted 1 day ago';
  return `Submitted ${diffInDays} days ago`;
};

const getInitials = (name?: string) => {
  if (!name) return 'FP';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.length === 1
    ? parts[0].slice(0, 2).toUpperCase()
    : `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-xs sm:text-sm py-0.5">
    <span className="text-[#667085] font-normal">{label}</span>
    <span className="font-semibold text-[#101828]">{value}</span>
  </div>
);

const FarmDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const farmId = params?.farmId as string | undefined;

  const { data: farmData, isLoading } = useGetAdminFarmById(farmId);
  const approveMutation = useApproveAdminFarm();
  const rejectMutation = useRejectAdminFarm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const [modalInitialStep, setModalInitialStep] = useState<'approve' | 'reject'>('approve');

  const farm = useMemo(
    () => (farmData ?? {}) as AdminFarmDetailsResponse,
    [farmData]
  );

  const farmUser = farm.user || farm.User;
  const ownerName = farmUser?.fullName || farm.investorName || '—';
  const ownerEmail = farmUser?.email || '—';
  const ownerAvatar = farmUser?.profileImage ? getPreviewImageUrl(farmUser.profileImage) : null;
  const farmName = farm.name || 'Farm Details';
  const farmSize = typeof farm.size === 'number'
    ? `${formatNumberWithCommas(farm.size)} Acres`
    : farm.size ? `${farm.size} Acres` : '—';
  const farmLocation = farm.location || 'No address provided';

  // Farm Projects from API
  const investmentProjects = useMemo(() => {
    const list = (farm.InvestmentProjects || farm.investmentProjects || []) as any[];
    if (list.length > 0) return list;
    if (farm.InvestmentProject || farm.investmentProject) return [farm.InvestmentProject || farm.investmentProject];
    if (farm.Investment) return [farm.Investment];
    return [];
  }, [farm]);

  // Primary/Active Project
  const activeProject = useMemo(() => {
    if (investmentProjects.length === 0) return null;
    return investmentProjects[0];
  }, [investmentProjects]);

  // Farm category
  const farmCategoryName = useMemo(() => {
    return (
      activeProject?.Category?.name ||
      activeProject?.category?.name ||
      farm.Category?.name ||
      farm.category?.name ||
      farm.farmCategory?.name ||
      '—'
    );
  }, [activeProject, farm]);

  const activeProjectTitle = useMemo(() => {
    if (!activeProject) return `Farm Project - ${farmCategoryName}`;
    return (
      activeProject.InvestmentTemplate?.name ||
      activeProject.name ||
      `Farm Project 1 - ${farmCategoryName}`
    );
  }, [activeProject, farmCategoryName]);

  const activeProjectDates = useMemo(() => {
    if (!activeProject) return '';
    return formatDates(activeProject.startDate, activeProject.endDate);
  }, [activeProject]);

  const activeProjectStatusRaw = activeProject?.investmentStatus || activeProject?.status || 'not_started';
  const activeProjectStatus = formatStatusText(activeProjectStatusRaw);

  const activeProjectExpected = parseAmount(
    activeProject?.expectedInvestment || activeProject?.InvestmentTemplate?.fundingMinGoal || activeProject?.amount
  );
  const activeProjectReceived = parseAmount(
    activeProject?.investmentReceived || activeProject?.amountRaised
  );
  const activeProjectProgressPct = activeProjectExpected > 0
    ? Math.min(100, Math.max(0, (activeProjectReceived / activeProjectExpected) * 100))
    : 0;

  // Milestones extracted from Active Project or farm.SelectedMilestones
  const activeProjectMilestones: ProjectMilestoneItem[] = useMemo(() => {
    const projectMs = activeProject?.ProjectMilestones || activeProject?.projectMilestones || activeProject?.milestones;
    const farmMs = farm.SelectedMilestones || farm.milestones;
    const rawList = (projectMs && projectMs.length > 0 ? projectMs : farmMs) || [];

    if (!Array.isArray(rawList)) return [];

    return [...rawList].sort((a: any, b: any) => {
      const orderA = a.order ?? a.InvestmentMilestone?.order ?? 0;
      const orderB = b.order ?? b.InvestmentMilestone?.order ?? 0;
      return orderA - orderB;
    });
  }, [activeProject, farm.SelectedMilestones, farm.milestones]);

  // Stats calculation
  const totalListedProjects = investmentProjects.length;
  const activeProjectsCount = investmentProjects.filter((p: any) => {
    const st = String(p.investmentStatus || p.status || '').toLowerCase();
    return st !== 'completed';
  }).length;

  const totalFundingRaised = useMemo(() => {
    if (farmUser?.totalFundsReceived !== undefined && farmUser?.totalFundsReceived !== null) {
      return parseAmount(farmUser.totalFundsReceived);
    }
    return investmentProjects.reduce((sum, p) => sum + parseAmount(p.investmentReceived), 0);
  }, [farmUser, investmentProjects]);

  const completionPercentage = useMemo(() => {
    if (farm.stats?.completionPercentage !== undefined) {
      return farm.stats.completionPercentage;
    }
    if (activeProjectMilestones.length === 0) return 0;
    const completed = activeProjectMilestones.filter((m) => m.isCompleted).length;
    return Math.round((completed / activeProjectMilestones.length) * 100);
  }, [farm.stats, activeProjectMilestones]);

  const verifiedFarmsCount = typeof farmUser?.verifiedFarmsCount === 'number'
    ? farmUser.verifiedFarmsCount
    : (farm.verificationStatus?.toLowerCase() === 'approved' ? 1 : 0);

  const verificationStatusRaw = (farm.verificationStatus || (farm as any).status || '').toLowerCase().trim();
  const isApproved =
    verificationStatusRaw === 'approved' ||
    verificationStatusRaw === 'verified' ||
    verificationStatusRaw === 'active';

  // Extract all Documents and Photos from API
  const { allPhotos, allDocuments } = useMemo(() => {
    const rawAll = [
      ...(farm.Documents || []),
      ...(farm.documents || []),
      ...(farm.farmDocuments || []),
      ...(farm.photos || []),
      ...(farm.pictures || []),
    ] as any[];

    // Also include milestone funding evidence photos and files
    activeProjectMilestones.forEach((m) => {
      if (Array.isArray(m.FundingEvidence)) {
        rawAll.push(...m.FundingEvidence);
      }
    });

    const seenUrls = new Set<string>();
    const photoList: GalleryItem[] = [];
    const docList: DocumentItem[] = [];

    rawAll.forEach((item, index) => {
      if (!item) return;
      const fileUrl = item.fileUrl || item.url || (typeof item === 'string' ? item : '');
      if (!fileUrl || seenUrls.has(fileUrl)) return;
      seenUrls.add(fileUrl);

      const fileName = item.fileName || item.name || `File ${index + 1}`;
      const mimeType = item.mimeType || '';
      const docType = item.documentType || item.evidenceType;

      const isPicture =
        docType === 'picture' ||
        docType === 'photo' ||
        isImageUrl(fileUrl, mimeType, fileName);

      if (isPicture) {
        photoList.push({
          src: getPreviewImageUrl(fileUrl),
          alt: fileName,
        });
      } else {
        docList.push({
          id: item.id || `doc-${index}`,
          name: fileName,
          size: formatFileSize(item.fileSize ?? item.size),
          status: 'reviewed',
          url: fileUrl,
        });
      }
    });

    return { allPhotos: photoList, allDocuments: docList };
  }, [farm, activeProjectMilestones]);

  // Viewer state
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerImages, setViewerImages] = useState<Array<{ src: string; alt?: string }>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const openPreview = (urlOrIndex?: string | number) => {
    if (typeof urlOrIndex === 'number') {
      if (allPhotos.length === 0) return;
      setViewerImages(allPhotos);
      setActiveIndex(urlOrIndex);
      setViewerVisible(true);
      return;
    }

    if (!urlOrIndex) {
      if (allPhotos.length > 0) {
        setViewerImages(allPhotos);
        setActiveIndex(0);
        setViewerVisible(true);
      }
      return;
    }

    if (isImageUrl(urlOrIndex)) {
      const idx = allPhotos.findIndex((image) => image.src.split('?')[0] === urlOrIndex.split('?')[0]);
      setViewerImages(allPhotos.length > 0 ? allPhotos : [{ src: urlOrIndex, alt: 'Preview' }]);
      setActiveIndex(idx >= 0 ? idx : 0);
      setViewerVisible(true);
    } else {
      window.open(urlOrIndex, '_blank', 'noopener,noreferrer');
    }
  };

  const handleApprove = async () => {
    if (!farmId) return;

    approveMutation.mutate(
      { payload: { farmId } },
      {
        onSuccess: () => {
          toast.success('Farm approved successfully');
          queryClient.invalidateQueries({ queryKey: ['adminFarms'] }).catch(() => {});
          queryClient.invalidateQueries({ queryKey: ['adminFarm', farmId] }).catch(() => {});
          queryClient.invalidateQueries({ queryKey: ['farms'] }).catch(() => {});
          setIsModalOpen(false);
        },
        onError: (err) => {
          const msg = err instanceof Error ? err.message : 'Failed to approve farm';
          toast.error(msg);
        },
      }
    );
  };

  const handleReject = async (note?: string) => {
    if (!farmId || !note) return;

    rejectMutation.mutate(
      { payload: { farmId, note } },
      {
        onSuccess: () => {
          toast.success('Farm rejected successfully');
          queryClient.invalidateQueries({ queryKey: ['adminFarms'] }).catch(() => {});
          queryClient.invalidateQueries({ queryKey: ['farms'] }).catch(() => {});
          router.push('/admin/farms');
        },
        onError: (err) => {
          const msg = err instanceof Error ? err.message : 'Failed to reject farm';
          toast.error(msg);
        },
      }
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#EDF8E9] flex flex-col justify-between text-[#1F2937]">
      <div className="w-full flex-1 px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto w-full max-w-[1360px]">
          {isLoading ? (
            <div className="space-y-6">
              <div className="animate-pulse space-y-2">
                <div className="h-8 w-64 rounded bg-[#DCE7D1]" />
                <div className="h-4 w-48 rounded bg-[#DCE7D1]" />
              </div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="grid grid-cols-2 gap-4 lg:col-span-2">
                  <div className="h-28 rounded-2xl bg-white p-5 shadow-xs" />
                  <div className="h-28 rounded-2xl bg-white p-5 shadow-xs" />
                  <div className="h-28 rounded-2xl bg-white p-5 shadow-xs" />
                  <div className="h-28 rounded-2xl bg-white p-5 shadow-xs" />
                </div>
                <div className="h-56 rounded-2xl bg-white p-6 shadow-xs" />
              </div>
              <div className="h-64 rounded-2xl bg-white p-6 shadow-xs" />
            </div>
          ) : isApproved ? (
            /* ================= APPROVED FARM VIEW ================= */
            <div className="space-y-6">
              {/* Page Title & Status */}
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-[26px] sm:text-[32px] font-bold text-[#101828] leading-tight tracking-tight">
                    {farmName}
                  </h1>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#E8F8E5] text-[#2F681E] border border-[#C5E9BD]">
                    {farm.verificationStatus || 'APPROVED'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#5E6771] mt-1.5 font-medium">
                  <LocationIcon size={15} className="text-[#5E6771] shrink-0" />
                  <span>{farmLocation}</span>
                </div>
              </div>

              {/* 2-Column Main Layout: Column 1 (Left lg:col-span-2) & Column 2 (Right lg:col-span-1) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* FIRST COLUMN (Left: 2x2 cards, Farm Overview, Active Project, History, Photos, Documents) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* 2x2 Metric Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Card 1: Public Listed Project */}
                    <div className="bg-white border border-[#E9EAEB] rounded-[20px] p-5.5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="h-9 w-9 rounded-full bg-[#E2F3DA] text-[#4E8931] flex items-center justify-center shrink-0">
                          <FarmIcon size={18} color="#4E8931" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="text-2xl font-bold text-[#1F2937] leading-none block">
                          {totalListedProjects}
                        </span>
                        <p className="text-xs font-medium text-[#5E6771] mt-1">Public Listed Project</p>
                      </div>
                    </div>

                    {/* Card 2: Active Farm Project */}
                    <div className="bg-white border border-[#E9EAEB] rounded-[20px] p-5.5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="h-9 w-9 rounded-full bg-[#E2F3DA] text-[#4E8931] flex items-center justify-center shrink-0">
                          <TrendingUpIcon size={18} color="#4E8931" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="text-2xl font-bold text-[#1F2937] leading-none block">
                          {activeProjectsCount}
                        </span>
                        <p className="text-xs font-medium text-[#5E6771] mt-1">Active Farm Project</p>
                      </div>
                    </div>

                    {/* Card 3: Total Funding Raised */}
                    <div className="bg-white border border-[#E9EAEB] rounded-[20px] p-5.5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="h-9 w-9 rounded-full bg-[#E2F3DA] text-[#4E8931] flex items-center justify-center shrink-0">
                          <WalletIcon size={18} color="#4E8931" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="text-2xl font-bold text-[#1F2937] leading-none block">
                          {formatCurrencyWithDecimals(totalFundingRaised)}
                        </span>
                        <p className="text-xs font-medium text-[#5E6771] mt-1">Total Funding raised</p>
                      </div>
                    </div>

                    {/* Card 4: Completion Rate */}
                    <div className="bg-white border border-[#E9EAEB] rounded-[20px] p-5.5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="h-9 w-9 rounded-full bg-[#E2F3DA] text-[#4E8931] flex items-center justify-center shrink-0">
                          <PercentIcon size={18} color="#4E8931" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="text-2xl font-bold text-[#1F2937] leading-none block">
                          {completionPercentage}%
                        </span>
                        <p className="text-xs font-medium text-[#5E6771] mt-1">Completion rate</p>
                      </div>
                    </div>
                  </div>

                  {/* Farm Overview Card */}
                  <section className="rounded-[20px] border border-[#E2EBDC] bg-white p-6 shadow-[0_8px_24px_rgba(78,137,49,0.04)]">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D1FADF] text-[#4E8931] border border-[#ECFDF3]">
                        <FarmIcon size={15} color="#4E8931" />
                      </div>
                      <Typography variant="base" className="font-bold text-base text-[#101828]">
                        Farm Overview
                      </Typography>
                    </div>

                    {/* Map Preview */}
                    <div className="mt-4 overflow-hidden rounded-[16px] border border-[#ECE5DC] bg-[#F5EFEA] relative h-48 sm:h-56 w-full flex items-center justify-center">
                      {farm.location ? (
                        <iframe
                          title="farm-location-map"
                          src={`https://www.google.com/maps?q=${encodeURIComponent(farmLocation)}&output=embed`}
                          className="h-full w-full border-0 opacity-40 pointer-events-none"
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-xs text-[#98A2B3]">No map location provided</div>
                      )}

                      {/* Centered Map Pin & Tooltip */}
                      {farm.location && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-3">
                          <div className="flex flex-col items-center">
                            <div className="bg-[#222120] text-white px-3.5 py-1.5 rounded-lg text-xs font-medium shadow-lg max-w-[90%] text-center truncate">
                              {farmLocation}
                            </div>
                            <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#222120]" />
                            <div className="mt-1">
                              <svg width="26" height="32" viewBox="0 0 28 36" fill="none" className="drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">
                                <path d="M14 0C6.26801 0 0 6.26801 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.26801 21.732 0 14 0Z" fill="#2584FF" />
                                <circle cx="14" cy="14" r="5" fill="white" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Location text below map */}
                    <p className="mt-3.5 text-xs font-semibold text-[#181918]">
                      {farmLocation}
                    </p>

                    {/* Info Rows */}
                    <div className="mt-3.5 space-y-2.5">
                      <hr className="border-[#F2F4F7]" />
                      <InfoRow label="Farm Name" value={farmName} />
                      <hr className="border-[#F2F4F7]" />
                      <InfoRow label="Farm Size" value={farmSize} />
                      <hr className="border-[#F2F4F7]" />
                      <InfoRow label="Farm Category" value={farmCategoryName} />
                    </div>
                  </section>

                  {/* Active Farm Project Card */}
                  {activeProject ? (
                    <section className="rounded-[20px] border border-[#E2EBDC] bg-white p-6 shadow-[0_8px_24px_rgba(78,137,49,0.04)]">
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E2F3DA] text-[#4E8931] shrink-0">
                            <FarmIcon size={16} color="#4E8931" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-[#1F2937]">
                              {activeProjectTitle}
                            </h3>
                            {activeProjectDates && (
                              <span className="text-xs font-medium text-[#5E6771] block mt-0.5">
                                {activeProjectDates}
                              </span>
                            )}
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            activeProjectStatus === 'Completed'
                              ? 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]'
                              : activeProjectStatus === 'Active'
                              ? 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]'
                              : 'bg-[#FFF4ED] text-[#DF2C0C] border border-[#FFDCD3]'
                          }`}
                        >
                          {activeProjectStatus}
                        </span>
                      </div>

                      {/* Progress bar and funding stats */}
                      <div className="mt-5">
                        <div className="flex justify-between items-center text-sm font-semibold text-[#1F2937] mb-2">
                          <span>
                            {formatCurrencyWithDecimals(activeProjectReceived)}{' '}
                            <span className="text-xs font-normal text-[#5E6771]">
                              of {formatCurrency(activeProjectExpected)}
                            </span>
                          </span>
                          <span className="text-xs font-normal text-[#5E6771]">
                            {activeProject.investorsCount ?? 0} Investors
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#EAECE8] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#4E8931] transition-all duration-500"
                            style={{ width: `${Math.max(activeProjectProgressPct, activeProjectReceived > 0 ? 4 : 0)}%` }}
                          />
                        </div>
                      </div>

                      {/* Farm Milestone Timeline */}
                      <div className="mt-7">
                        <h4 className="text-base font-bold text-[#1F2937]">Farm Milestone Timeline</h4>
                        <p className="text-xs text-[#5E6771] mt-0.5">
                          Milestones needed to be done in this farm to complete investment cycle
                        </p>

                        {activeProjectMilestones.length > 0 ? (
                          <div className="mt-6 relative pl-1">
                            <div className="absolute left-[10px] top-3 bottom-6 w-[2px] bg-[#4E8931]" />

                            <div className="space-y-6">
                              {activeProjectMilestones.map((m, idx) => {
                                const milestoneStatus = formatStatusText(m.fundingStatus, m.isCompleted);
                                const isCompleted = m.isCompleted || milestoneStatus === 'Completed';

                                return (
                                  <div key={m.id || `m-${idx}`} className="relative flex items-center justify-between pl-7 min-h-[36px]">
                                    <span
                                      className={`absolute left-[7px] -translate-x-1/2 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white z-10 shadow-xs ${
                                        isCompleted ? 'bg-[#4E8931]' : 'bg-[#4E8931]'
                                      }`}
                                    />

                                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                      <span className="text-sm font-semibold text-[#1F2937]">
                                        {m.name || m.InvestmentMilestone?.name || `Milestone ${idx + 1}`}
                                      </span>
                                      {m.amount && (
                                        <span className="text-xs text-[#5E6771]">
                                          {formatCurrencyWithDecimals(m.amount)} ({m.fundReleasePercentage || 0}%)
                                        </span>
                                      )}
                                    </div>

                                    <div className="shrink-0 ml-4">
                                      <span
                                        className={`inline-block rounded-md px-3.5 py-1 text-xs font-medium border ${
                                          isCompleted
                                            ? 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]'
                                            : milestoneStatus === 'Processing Funding'
                                            ? 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]'
                                            : milestoneStatus === 'Request for Funding'
                                            ? 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]'
                                            : 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]'
                                        }`}
                                      >
                                        {milestoneStatus}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4 rounded-xl border border-dashed border-[#E2EBDC] bg-[#FBFCF8] p-6 text-center text-xs text-[#667085]">
                            No milestones listed for this farm project.
                          </div>
                        )}
                      </div>
                    </section>
                  ) : (
                    <section className="rounded-[20px] border border-[#E2EBDC] bg-white p-6 shadow-[0_8px_24px_rgba(78,137,49,0.04)] text-center text-sm text-[#667085]">
                      No active farm projects found for this farm.
                    </section>
                  )}

                  {/* Investment History Card */}
                  <section className="rounded-[20px] border border-[#E2EBDC] bg-white p-6 shadow-[0_8px_24px_rgba(78,137,49,0.04)]">
                    <h3 className="text-base font-bold text-[#1F2937] mb-4">Investment History</h3>
                    {investmentProjects.length > 0 ? (
                      <div className="flex flex-col gap-4">
                        {investmentProjects.map((p: any, pIdx: number) => {
                          const projTitle =
                            p.InvestmentTemplate?.name ||
                            p.name ||
                            `Farm Project ${pIdx + 1} - ${p.Category?.name || farmCategoryName}`;
                          const projDates = formatDates(p.startDate, p.endDate);
                          const projStatus = formatStatusText(p.investmentStatus || p.status);
                          const isProjCompleted = projStatus === 'Completed';
                          const exp = parseAmount(p.expectedInvestment || p.InvestmentTemplate?.fundingMinGoal || p.amount);
                          const rec = parseAmount(p.investmentReceived || p.amountRaised);
                          const prog = exp > 0 ? Math.min(100, (rec / exp) * 100) : 0;

                          return (
                            <div key={p.id || `proj-hist-${pIdx}`} className="border border-[#E9EAEB] rounded-2xl p-5 bg-white">
                              <div className="flex justify-between items-start gap-2">
                                <div>
                                  <span className="text-sm font-bold text-[#1F2937] block leading-tight">
                                    {projTitle}
                                  </span>
                                  {projDates && (
                                    <span className="text-xs font-medium text-[#5E6771] block mt-1">
                                      {projDates}
                                    </span>
                                  )}
                                </div>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                                    isProjCompleted
                                      ? 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]'
                                      : 'bg-[#FFF5F3] text-[#DF2C0C] border-[#FFDCD3]'
                                  }`}
                                >
                                  {projStatus}
                                </span>
                              </div>

                              <div className="mt-4">
                                <div className="flex justify-between text-xs font-medium text-[#5E6771] mb-1.5">
                                  <span className="font-semibold text-[#1F2937]">
                                    {formatCurrencyWithDecimals(rec)}{' '}
                                    <span className="font-normal text-[#5E6771]">of {formatCurrency(exp)}</span>
                                  </span>
                                  <span>{p.investorsCount ?? 0} Investors</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-[#EAECE8] overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-[#4E8931]"
                                    style={{ width: `${Math.max(prog, rec > 0 ? 4 : 0)}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-[#E2EBDC] bg-[#FBFCF8] p-6 text-center text-xs text-[#667085]">
                        No investment history available.
                      </div>
                    )}
                  </section>

                  {/* Photos Section */}
                  <section className="rounded-[20px] border border-[#E2EBDC] bg-white p-6 shadow-[0_8px_24px_rgba(78,137,49,0.04)]">
                    <h3 className="text-base font-bold text-[#1F2937] mb-4">Photos</h3>
                    {allPhotos.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                        {/* Left Big Photo */}
                        <div
                          className="overflow-hidden rounded-[16px] border border-[#E9EAEB] bg-[#F4F7EE] h-[280px] md:h-[340px] w-full cursor-pointer relative group"
                          onClick={() => openPreview(0)}
                        >
                          <img
                            src={allPhotos[0].src}
                            alt={allPhotos[0].alt || 'Main farm view'}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        </div>

                        {/* Right 2 Stacked Photos */}
                        <div className="grid grid-rows-2 gap-4 h-[280px] md:h-[340px]">
                          {allPhotos.length > 1 ? (
                            <div
                              className="overflow-hidden rounded-[16px] border border-[#E9EAEB] bg-[#F4F7EE] cursor-pointer relative group"
                              onClick={() => openPreview(1)}
                            >
                              <img
                                src={allPhotos[1].src}
                                alt={allPhotos[1].alt || 'Farm photo 2'}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                              />
                            </div>
                          ) : (
                            <div className="overflow-hidden rounded-[16px] border border-[#E9EAEB] bg-[#F4F7EE] flex items-center justify-center text-xs text-[#8A9587]">
                              No photo
                            </div>
                          )}

                          {allPhotos.length > 2 ? (
                            <div
                              className="overflow-hidden rounded-[16px] border border-[#E9EAEB] bg-[#F4F7EE] relative cursor-pointer group"
                              onClick={() => openPreview(2)}
                            >
                              <img
                                src={allPhotos[2].src}
                                alt={allPhotos[2].alt || 'Farm photo 3'}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                              />
                              {allPhotos.length > 3 && (
                                <div className="absolute inset-0 bg-black/55 flex items-center justify-center text-white font-bold text-lg tracking-wide transition-opacity group-hover:bg-black/65">
                                  +{allPhotos.length - 2} Photos
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="overflow-hidden rounded-[16px] border border-[#E9EAEB] bg-[#F4F7EE] flex items-center justify-center text-xs text-[#8A9587]">
                              No photo
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-[#E2EBDC] bg-[#FBFCF8] p-8 text-center text-xs text-[#667085]">
                        No photos uploaded for this farm yet.
                      </div>
                    )}
                  </section>

                  {/* Documents Section */}
                  <section className="rounded-[20px] border border-[#E2EBDC] bg-white p-6 shadow-[0_8px_24px_rgba(78,137,49,0.04)]">
                    <h3 className="text-base font-bold text-[#1F2937] mb-4">Documents</h3>
                    {allDocuments.length > 0 ? (
                      <div className="space-y-3">
                        {allDocuments.map((doc, idx) => (
                          <React.Fragment key={doc.id || `doc-row-${idx}`}>
                            {idx > 0 && <hr className="border-[#F2F4F7]" />}
                            <div className="flex items-center justify-between py-1">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E2F3DA] text-[#4E8931] shrink-0">
                                  <DocsIcon size={16} color="#4E8931" />
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-[#101828]">{doc.name}</p>
                                  <p className="text-xs text-[#667085] mt-0.5">{doc.size}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => openPreview(doc.url)}
                                className="p-1.5 text-[#667085] hover:text-[#4E8931] transition-colors cursor-pointer rounded-md hover:bg-gray-50 focus:outline-none"
                                aria-label="Open document"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </button>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-[#E2EBDC] bg-[#FBFCF8] p-8 text-center text-xs text-[#667085]">
                        No documents uploaded for this farm yet.
                      </div>
                    )}
                  </section>
                </div>

                {/* SECOND COLUMN (Right: Farmer Profile Card) */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Farmer Profile Card */}
                  <div className="bg-white border border-[#E2EBDC] rounded-[20px] p-6 shadow-[0_8px_24px_rgba(78,137,49,0.04)] flex flex-col justify-between">
                    <div>
                      {/* Card Title */}
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D1FADF] text-[#4E8931] border border-[#ECFDF3]">
                          <FarmIcon size={15} color="#4E8931" />
                        </div>
                        <Typography variant="base" className="font-bold text-sm sm:text-base text-[#101828]">
                          Farmer Profile
                        </Typography>
                      </div>

                      {/* Farmer Details */}
                      <div className="mt-4 flex items-center gap-3">
                        {ownerAvatar ? (
                          <img
                            src={ownerAvatar}
                            alt={ownerName}
                            className="h-10 w-10 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E4E7EC] text-xs font-bold text-[#344054]">
                            {getInitials(ownerName)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center">
                            <p className="truncate text-sm font-bold text-[#1D2939]">{ownerName}</p>
                            <span className="ml-1.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#ECFDF3] text-[#12B76A] border border-[#D1FADF]">
                              <svg className="w-2 h-2" viewBox="0 0 12 12" fill="none">
                                <path d="M10 3L4.5 8.5L2 6" stroke="#12B76A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          </div>
                          <p className="truncate text-xs text-[#667085] mt-0.5">{ownerEmail}</p>
                        </div>
                      </div>

                      {/* Farmer Stats */}
                      <div className="mt-5 space-y-2.5">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-[#667085] font-normal">Verified Farms</span>
                          <span className="font-semibold text-[#101828]">{verifiedFarmsCount}</span>
                        </div>
                        <hr className="border-[#F2F4F7]" />
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-[#667085] font-normal">Total Funding received</span>
                          <span className="font-semibold text-[#101828]">
                            {formatCurrency(farmUser?.totalFundsReceived ?? totalFundingRaised)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Profile Action Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (farm.userId || farm.user?.id || farm.User?.id) {
                          router.push(`/admin/users`);
                        }
                      }}
                      className="mt-5 w-full py-2.5 px-4 rounded-[8px] bg-[#EFF1F5] hover:bg-[#E4E7EC] transition-colors text-center font-bold text-xs uppercase tracking-wider text-[#344054] cursor-pointer"
                    >
                      VIEW FULL PROFILE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ================= PENDING REVIEW / VERIFICATION VIEW ================= */
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
              {/* Left Column */}
              <aside className="space-y-6">
                {/* Review Status Card */}
                <section className="relative overflow-hidden rounded-[20px] bg-[#28421B] p-7 text-white shadow-[0_12px_32px_rgba(40,66,27,0.15)]">
                  <div className="relative z-10">
                    <Typography variant="small" className="text-white/85 text-xs sm:text-sm font-normal mb-1 block">
                      Review
                    </Typography>
                    <Typography variant="subheading" className="text-white font-bold text-xl sm:text-[24px] leading-tight mb-2 block">
                      {verificationStatusRaw === 'rejected'
                        ? 'Verification Rejected'
                        : 'Verification in Progress'}
                    </Typography>
                    <Typography variant="small" className="text-white/75 text-xs sm:text-sm font-normal block">
                      {formatRelativeDate(farm.createdAt)}
                    </Typography>
                  </div>

                  {/* Watermark leaf logo */}
                  <div className="absolute -bottom-6 -right-6 pointer-events-none opacity-20 scale-125">
                    <LogoWhiteIcon />
                  </div>
                </section>

                {/* Farmer Profile Card */}
                <section className="rounded-[20px] border border-[#E2EBDC] bg-white p-6 shadow-[0_8px_24px_rgba(78,137,49,0.04)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D1FADF] text-[#4E8931] border-2 border-[#ECFDF3]">
                      <FarmIcon size={16} color="#4E8931" />
                    </div>
                    <Typography variant="base" className="font-semibold text-base text-[#101828]">
                      Farmer Profile
                    </Typography>
                  </div>

                  <div className="mt-5 flex items-center gap-3.5">
                    {ownerAvatar ? (
                      <img
                        src={ownerAvatar}
                        alt={ownerName}
                        className="h-11 w-11 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E4E7EC] text-sm font-bold text-[#344054]">
                        {getInitials(ownerName)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center">
                        <p className="truncate text-sm font-bold text-[#1D2939]">{ownerName}</p>
                        <span className="ml-1.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#ECFDF3] text-[#12B76A] border border-[#D1FADF]">
                          <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none">
                            <path d="M10 3L4.5 8.5L2 6" stroke="#12B76A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </div>
                      <p className="truncate text-xs text-[#667085] mt-0.5">{ownerEmail}</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3.5">
                    <InfoRow label="Verified Farms" value={String(verifiedFarmsCount)} />
                    <hr className="border-[#F2F4F7]" />
                    <InfoRow
                      label="Total Funding received"
                      value={formatCurrency(farmUser?.totalFundsReceived ?? totalFundingRaised)}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (farm.userId || farm.user?.id || farm.User?.id) {
                        router.push(`/admin/users`);
                      }
                    }}
                    className="mt-6 w-full py-3 px-4 rounded-[8px] bg-[#EFF1F5] hover:bg-[#E4E7EC] transition-colors text-center font-bold text-xs uppercase text-[#344054] cursor-pointer"
                  >
                    VIEW FULL PROFILE
                  </button>
                </section>
              </aside>

              {/* Right Column */}
              <main className="space-y-6">
                {/* Farm Overview Card */}
                <section className="rounded-[20px] border border-[#E2EBDC] bg-white p-6 shadow-[0_8px_24px_rgba(78,137,49,0.04)]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D1FADF] text-[#4E8931] border-2 border-[#ECFDF3]">
                      <FarmIcon size={16} color="#4E8931" />
                    </div>
                    <Typography variant="base" className="font-semibold text-base text-[#101828]">
                      Farm Overview
                    </Typography>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-[16px] border border-[#ECE5DC] bg-[#F5EFEA] relative h-52 sm:h-56 w-full flex items-center justify-center">
                    {farm.location ? (
                      <iframe
                        title="farm-location-map"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(farmLocation)}&output=embed`}
                        className="h-full w-full border-0 opacity-40 pointer-events-none"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-xs text-[#98A2B3]">No map location provided</div>
                    )}

                    {farm.location && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-4">
                        <div className="flex flex-col items-center">
                          <div className="bg-[#222120] text-white px-3.5 py-1.5 rounded-lg text-xs font-medium shadow-lg max-w-[90%] text-center truncate">
                            {farmLocation}
                          </div>
                          <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#222120]" />
                          <div className="mt-1">
                            <svg width="28" height="36" viewBox="0 0 28 36" fill="none" className="drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">
                              <path d="M14 0C6.26801 0 0 6.26801 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.26801 21.732 0 14 0Z" fill="#2584FF" />
                              <circle cx="14" cy="14" r="5" fill="white" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="mt-3.5 text-xs font-semibold text-[#181918]">
                    {farmLocation}
                  </p>

                  <div className="mt-4 space-y-3.5">
                    <hr className="border-[#F2F4F7]" />
                    <InfoRow label="Farm Name" value={farmName} />
                    <hr className="border-[#F2F4F7]" />
                    <InfoRow label="Farm Size" value={farmSize} />
                    <hr className="border-[#F2F4F7]" />
                    <InfoRow label="Farm Category" value={farmCategoryName} />
                  </div>
                </section>

                {/* Submitted Evidence & Documentation Card */}
                <section className="rounded-[20px] border border-[#E2EBDC] bg-white p-6 shadow-[0_8px_24px_rgba(78,137,49,0.04)]">
                  <div className="flex items-center gap-2.5">
                    <DocsIcon size={20} color="#4E8931" />
                    <Typography variant="base" className="font-semibold text-base text-[#101828]">
                      Submitted Evidence & Documentation
                    </Typography>
                    <span className="rounded-full bg-[#ECEFEA] px-2.5 py-0.5 text-xs font-medium text-[#475467]">
                      {allDocuments.length + allPhotos.length}{' '}
                      {allDocuments.length + allPhotos.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {allDocuments.length > 0 || allPhotos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                      {allDocuments.map((doc) => (
                        <article
                          key={doc.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => openPreview(doc.url)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') openPreview(doc.url);
                          }}
                          className="cursor-pointer rounded-[14px] border border-[#E5EAE0] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:border-[#4E8931] hover:shadow-[0_4px_16px_rgba(78,137,49,0.08)] flex flex-col justify-between min-h-[104px]"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] bg-[#4E8931] text-white">
                              <CheckIcon size={12} color="#FFFFFF" strokeWidth={3} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-[#4E8931]">{doc.name}</p>
                              <p className="truncate text-xs text-[#98A2B3] mt-0.5">
                                {doc.size !== '—' ? `${doc.size} - ` : ''}Click to review
                              </p>
                            </div>
                          </div>

                          <div className="mt-2">
                            <span className="inline-block rounded-full bg-[#ECFDF3] px-2.5 py-0.5 text-[11px] font-semibold text-[#027A48]">
                              Reviewed
                            </span>
                          </div>
                        </article>
                      ))}

                      {allPhotos.map((photo, pIdx) => (
                        <article
                          key={`photo-card-${pIdx}`}
                          role="button"
                          tabIndex={0}
                          onClick={() => openPreview(photo.src)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') openPreview(photo.src);
                          }}
                          className="cursor-pointer rounded-[14px] border border-[#E5EAE0] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:border-[#4E8931] hover:shadow-[0_4px_16px_rgba(78,137,49,0.08)] flex flex-col justify-between min-h-[104px]"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] bg-[#4E8931] text-white">
                              <CheckIcon size={12} color="#FFFFFF" strokeWidth={3} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-[#4E8931]">{photo.alt || `Photo ${pIdx + 1}`}</p>
                              <p className="truncate text-xs text-[#98A2B3] mt-0.5">Click to preview image</p>
                            </div>
                          </div>

                          <div className="mt-2">
                            <span className="inline-block rounded-full bg-[#ECFDF3] px-2.5 py-0.5 text-[11px] font-semibold text-[#027A48]">
                              Reviewed
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-5 rounded-xl border border-dashed border-[#E2EBDC] bg-[#FBFCF8] p-8 text-center text-sm text-[#667085]">
                      No documents or evidence have been uploaded for this farm.
                    </div>
                  )}
                </section>
              </main>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Footer Bar (Only for pending farms) */}
      {!isLoading && !isApproved && verificationStatusRaw !== 'rejected' && (
        <footer className="w-full bg-white border-t border-[#EAECF0] px-6 py-4 flex items-center justify-end gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.02)]">
          <button
            type="button"
            onClick={() => {
              setModalInitialStep('reject');
              setIsModalOpen(true);
            }}
            disabled={rejectMutation.isPending}
            className="bg-[#CC3333] hover:bg-[#B42318] text-white font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-[8px] transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            REJECT
          </button>
          <button
            type="button"
            onClick={() => {
              setModalInitialStep('approve');
              setIsModalOpen(true);
            }}
            disabled={approveMutation.isPending}
            className="bg-[#4E8931] hover:bg-[#43782A] text-white font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-[8px] transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            APPROVE
          </button>
        </footer>
      )}

      {/* Action Confirmation Modal */}
      <AdminFarmActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        farmName={farmName}
        onApprove={handleApprove}
        onReject={(note) => handleReject(note)}
        isPending={approveMutation.isPending || rejectMutation.isPending}
        initialStep={modalInitialStep}
      />

      {/* Image Lightbox Viewer */}
      <Viewer
        visible={viewerVisible}
        onClose={() => setViewerVisible(false)}
        images={viewerImages}
        activeIndex={activeIndex}
        rotatable={true}
        zIndex={2000}
      />
    </div>
  );
};

export default FarmDetailPage;
