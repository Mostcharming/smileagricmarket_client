/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useApproveAdminFarm, useGetAdminFarmById, useRejectAdminFarm } from '@/mutation';
import { Button, Typography } from '@/components/ui';
import { useQueryClient } from '@tanstack/react-query';
import AdminFarmActionModal from '@/components/modal/adminFarmActionModal';
import { CheckIcon, DocsIcon, FarmIcon, LogoWhiteIcon, UsersIcon } from '@/components/icons';
import dynamic from 'next/dynamic';
const Viewer = dynamic(() => import('react-viewer'), { ssr: false });
import { formatNumberWithCommas } from '@/utils';
import { getPreviewImageUrl } from '@/utils/image';

type DocumentItem = {
  id: string;
  name: string;
  size: string;
  status: 'pending' | 'reviewed';
  preview: string;
};

type GalleryItem = {
  src: string;
  alt?: string;
};

const IMAGE_EXTENSIONS = /\.(png|jpe?g|gif|webp|bmp)$/i;

const isImageUrl = (url?: string) => {
  if (!url) return false;

  const strippedUrl = url.split('#')[0];

  if (IMAGE_EXTENSIONS.test(strippedUrl.split('?')[0])) {
    return true;
  }

  try {
    const parsedUrl = new URL(url, 'https://app.smileagrimarket.com');

    if (parsedUrl.pathname.startsWith('/api/image-proxy')) {
      const innerUrl = parsedUrl.searchParams.get('url');
      if (innerUrl) {
        return isImageUrl(decodeURIComponent(innerUrl));
      }
    }

    return IMAGE_EXTENSIONS.test(parsedUrl.pathname);
  } catch {
    return false;
  }
};

type FarmDetailView = {
  user?: {
    verifiedFarmsCount?: number;
    totalFundsReceived?: string | number;
    fullName?: string;
    email?: string;
    profileImage?: string;
  };
  User?: {
    verifiedFarmsCount?: number;
    totalFundsReceived?: string | number;
    fullName?: string;
    email?: string;
    profileImage?: string;
  };
  documents?: Array<{
    id?: string;
    name?: string;
    size?: string | number;
    status?: string;
    url?: string;
  }>;
  pictures?: Array<{ id?: string; url?: string; name?: string }>;
  milestones?: Array<{ id?: string; name?: string; amount?: number | string }>;
  investorName?: string;
  submittedAt?: string;
};

const parseAmount = (value?: string | number | null) => {
  if (value === null || value === undefined) return undefined;

  const parsedValue = typeof value === 'string' ? Number(value.replace(/,/g, '')) : value;

  return typeof parsedValue === 'number' && !Number.isNaN(parsedValue) ? parsedValue : undefined;
};

const formatCurrency = (value?: number | string) => {
  const amount = parseAmount(value);

  if (typeof amount !== 'number') {
    return '—';
  }

  return `₦${formatNumberWithCommas(amount.toFixed(2))}`;
};

const formatRelativeDate = (value?: string) => {
  if (!value) return 'Submitted 2 days ago';

  const createdAt = new Date(value).getTime();

  if (Number.isNaN(createdAt)) return 'Submitted 2 days ago';

  const diffInDays = Math.max(0, Math.round((Date.now() - createdAt) / (1000 * 60 * 60 * 24)));

  if (diffInDays === 0) return 'Submitted today';
  if (diffInDays === 1) return 'Submitted 1 day ago';

  return `Submitted ${diffInDays} days ago`;
};

const getDocumentStatus = (status?: string) => {
  const normalizedStatus = status?.toLowerCase() ?? '';

  return normalizedStatus === 'reviewed' || normalizedStatus === 'approved' ? 'reviewed' : 'pending';
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-xs">
    <span className="text-[#61665F]">{label}</span>
    <span className="font-semibold text-sm text-[#181918]">{value}</span>
  </div>
);

const FarmDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const farmId = params?.farmId as string | undefined;

  const { data: farmData, isLoading } = useGetAdminFarmById(farmId);
  const approveMutation = useApproveAdminFarm();
  const rejectMutation = useRejectAdminFarm();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const [modalInitialStep, setModalInitialStep] = React.useState<'approve' | 'reject'>('approve');

  const farm = React.useMemo(
    () =>
      (farmData ?? {}) as FarmDetailView & {
        id?: string;
        name?: string;
        location?: string;
        size?: number;
        Category?: { name?: string };
        Investment?: { amount?: number; status?: string };
        stats?: { completionPercentage?: number };
        createdAt?: string;
      },
    [farmData]
  );

  const documents: DocumentItem[] = React.useMemo(() => {
    const sourceDocuments = (farm.documents ?? (farm as unknown as { Documents?: unknown[] }).Documents) ?? [];

    if (sourceDocuments.length > 0) {
      return sourceDocuments.map((document, index) => {
        const doc = document as { id?: string; fileName?: string; fileUrl?: string; fileSize?: number; url?: string };
        const previewUrl = getPreviewImageUrl(doc.fileUrl || doc.url || '');

        return {
          id: doc.id || `${index}-${doc.fileName || 'document'}`,
          name: doc.fileName || `Doc ${index + 1}.pdf`,
          size: typeof doc.fileSize === 'number' ? `${(doc.fileSize / 1024 / 1024).toFixed(1)}MB` : '2.3MB',
          status: getDocumentStatus(undefined),
          preview: previewUrl,
        } as DocumentItem;
      });
    }
    // Rely on endpoint data; no default placeholder documents
    return [];
  }, [farm]);

  const imageDocuments = React.useMemo(() => {
    return documents
      .filter((document) => isImageUrl(document.preview))
      .map((document, index) => ({
        id: `image-document-${index}-${document.id}`,
        name: document.name,
        src: document.preview,
      }));
  }, [documents]);

  const pdfDocuments = React.useMemo(() => {
    return documents.filter((document) => !isImageUrl(document.preview));
  }, [documents]);

  const galleryImages = React.useMemo<GalleryItem[]>(() => {
    const documentImages = imageDocuments.map((document) => ({ src: document.src, alt: document.name }));

    const pictureImages = (farm.pictures ?? [])
      .map((picture) => ({ src: getPreviewImageUrl(picture.url ?? ''), alt: picture.name }))
      .filter((picture) => isImageUrl(picture.src));

    return [...documentImages, ...pictureImages];
  }, [farm, imageDocuments]);

  const farmPictures = React.useMemo(() => {
    const directPictures = (farm.pictures ?? [])
      .map((picture, index) => ({
        id: picture.id || `picture-${index}`,
        name: picture.name || `Picture ${index + 1}`,
        src: getPreviewImageUrl(picture.url ?? ''),
      }))
      .filter((picture) => isImageUrl(picture.src));

    return [...directPictures, ...imageDocuments];
  }, [farm.pictures, imageDocuments]);

  const milestones = React.useMemo(() => {
    const sourceSelected = (farm.milestones ?? (farm as unknown as { SelectedMilestones?: unknown[] }).SelectedMilestones) ?? [];

    if (sourceSelected.length > 0) {
      return sourceSelected
        .map((item, index) => {
        const it = item as { id?: string; amount?: number | string; Milestone?: { id?: string; name?: string; amount?: number | string; order?: number } };
        const ms = it.Milestone ?? (it as unknown as { name?: string; amount?: number | string; order?: number });
        const name = ms?.name || `Milestone ${index + 1}`;

        const inv = farm.Investment as unknown as { investmentReceived?: string; expectedInvestment?: string; amount?: number };
        const amountCandidate = parseAmount(it.amount ?? ms?.amount ?? inv?.investmentReceived ?? inv?.expectedInvestment ?? 0) ?? 0;

        return {
          id: it.id || `${index}-${name}`,
          name,
          order: typeof ms?.order === 'number' ? ms.order : index,
          amount: amountCandidate,
        };
        })
        .sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
    }
  
    // Rely on endpoint data; no default placeholder milestones
    return [];
  }, [farm]);

  const farmUser = farm.user || farm.User;
  const ownerName = farmUser?.fullName || farm.investorName || 'Benjamin Taylor';
  const ownerEmail = farmUser?.email || 'jamestaylor@gmail.com';
  const farmName = farm.name || 'Farm details';
  const farmCategory = farm.Category?.name || 'Vegetable';
  const farmSize = typeof farm.size === 'number' ? `${formatNumberWithCommas(farm.size)} Acres` : '45.5 Acres';
  const inv = farm.Investment as unknown as { investmentReceived?: string; expectedInvestment?: string; amount?: number };
  const investmentVal = parseAmount(inv?.investmentReceived ?? inv?.expectedInvestment ?? (farm as unknown as { investmentAmount?: number }).investmentAmount ?? 0);
  const estInvestment = formatCurrency(investmentVal);
  const totalFundingReceived = formatCurrency(farmUser?.totalFundsReceived ?? inv?.investmentReceived ?? 0);
  const verifiedFarmsCount = typeof farmUser?.verifiedFarmsCount === 'number' ? farmUser.verifiedFarmsCount : 0;
  const verificationStatusNormalized = ((farm as unknown as { verificationStatus?: string }).verificationStatus ?? '').toLowerCase();
  // Viewer (gallery) state for image previews
  const [viewerVisible, setViewerVisible] = React.useState(false);
  const [viewerImages, setViewerImages] = React.useState<Array<{ src: string; alt?: string }>>([]);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const openPreview = (url?: string) => {
    if (!url) return;
    // If it's an image, open react-viewer as a gallery with all images for this farm
    if (isImageUrl(url)) {
      const idx = galleryImages.findIndex((image) => image.src.split('?')[0] === url.split('?')[0]);
      setViewerImages(galleryImages);
      setActiveIndex(idx >= 0 ? idx : 0);
      setViewerVisible(true);
    } else {
      // Non-image files (PDFs etc.) open in a new tab
      window.open(url, '_blank', 'noopener');
    }
  };

  const handleApprove = async () => {
    if (!farmId) return;

    approveMutation.mutate(
      { payload: { farmId } },
      {
        onSuccess: () => {
          toast.success('Farm approved successfully');
          // refetch admin farms and user farms lists
          queryClient.invalidateQueries({ queryKey: ['adminFarms'] }).catch(() => {});
          queryClient.invalidateQueries({ queryKey: ['farms'] }).catch(() => {});
          router.push('/admin/farms');
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
          // refetch admin farms and user farms lists
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
    <div className="-mx-8 -my-8 min-h-[calc(100vh-4rem)] bg-[#EFF7E9] px-8 py-8 text-[#1F2937]">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)]">
            <aside className="space-y-4">
              <div className="rounded-[20px] bg-white p-6 shadow-[0_18px_40px_rgba(85,112,54,0.06)]">
                <div className="animate-pulse">
                  <div className="h-4 w-24 rounded bg-gray-200 mb-3" />
                  <div className="h-6 w-48 rounded bg-gray-200 mb-2" />
                  <div className="h-3 w-36 rounded bg-gray-200 mt-4" />
                </div>
              </div>

              <div className="rounded-[20px] bg-white p-6 shadow-[0_18px_40px_rgba(85,112,54,0.06)]">
                <div className="flex items-center gap-4 animate-pulse">
                  <div className="h-12 w-12 rounded-full bg-gray-200" />
                  <div className="flex-1">
                    <div className="h-4 w-40 rounded bg-gray-200 mb-2" />
                    <div className="h-3 w-32 rounded bg-gray-200" />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="h-3 w-full rounded bg-gray-200" />
                  <div className="h-3 w-3/4 rounded bg-gray-200" />
                </div>
              </div>
            </aside>

            <main className="space-y-4">
              <div className="rounded-[20px] bg-white p-5 shadow-[0_18px_40px_rgba(85,112,54,0.06)]">
                <div className="animate-pulse">
                  <div className="h-44 w-full rounded bg-gray-200 mb-4" />
                  <div className="space-y-3">
                    <div className="h-4 w-1/2 rounded bg-gray-200" />
                    <div className="h-4 w-1/3 rounded bg-gray-200" />
                    <div className="h-4 w-2/3 rounded bg-gray-200" />
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] bg-white p-5 shadow-[0_18px_40px_rgba(85,112,54,0.06)]">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 w-1/3 rounded bg-gray-200" />
                  <div className="h-4 w-full rounded bg-gray-200" />
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                </div>
              </div>

              <div className="rounded-[20px] bg-white p-5 shadow-[0_18px_40px_rgba(85,112,54,0.06)]">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="h-36 rounded-2xl bg-gray-200 animate-pulse" />
                  <div className="h-36 rounded-2xl bg-gray-200 animate-pulse" />
                  <div className="h-36 rounded-2xl bg-gray-200 animate-pulse" />
                </div>
              </div>
            </main>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)]">
            <aside className="space-y-4">
              <section className="relative overflow-hidden rounded-[20px] bg-[#28421B] py-9 px-5 text-white shadow-[0_20px_55px_rgba(47,76,32,0.22)]">
                <div className="relative z-10">
                  <Typography variant="small" className="mb-2 block text-white">
                    Review
                  </Typography>
                  <Typography variant="subheading" className="capitalize block leading-tight text-white">
                    {(farm as unknown as { verificationStatus?: string }).verificationStatus ?? 'pending'}
                  </Typography>
                  <Typography variant="small" className="mt-2 block text-white">
                    {formatRelativeDate(farm.createdAt)}
                  </Typography>
                </div>
                <div className="absolute bottom-0 right-0 rounded-full">
                  <LogoWhiteIcon />
                </div>
              </section>

              <section className="rounded-[20px] border border-[#DBE6D5] bg-white px-4 py-7 shadow-[0_18px_40px_rgba(85,112,54,0.06)]">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D1FADF] text-[#4E8931] border-8 border-[#ECFDF3]">
                    <UsersIcon size={16} color="currentColor" />
                  </div>
                  <Typography variant="base" className="font-semibold text-[#07090C]">
                    Farmer Profile
                  </Typography>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-[radial-gradient(circle_at_30%_30%,#f0d8c9_0,#cb9f80_38%,#6f523d_100%)]" />
                  <div className="min-w-0">
                    <div className='flex'>
                      <p className="truncate text-sm font-semibold text-[#414651]">{ownerName}</p>
                    <span className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#ECF7E6] text-[#6AAB45]">
                      <CheckIcon size={8} color="currentColor" />
                    </span>
                    </div>
                    <p className="truncate text-xs text-[#535862]">{ownerEmail}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-4 text-xs">
                  <div className="flex items-center justify-between text-[#61665F]">
                    <span>Verified Farms</span>
                    <span className="font-semibold text-sm text-[#181918]">{verifiedFarmsCount}</span>
                  </div>
                  <hr className='text-[#DBE6D5]' />
                  <div className="flex items-center justify-between text-[#74806D]">
                    <span>Total Funding received</span>
                    <span className="font-semibold text-sm text-[#181918]">{totalFundingReceived}</span>
                  </div>
                </div>

                <Button variant="light" className="mt-10 w-full border-[#D5DBCF] bg-[#F6F7F3] uppercase text-[#2D372F] shadow-none">
                  VIEW FULL PROFILE
                </Button>
              </section>
            </aside>

            <main className="space-y-4">
              <section className="overflow-hidden rounded-[20px] border border-[#DBE6D5] bg-white p-5 shadow-[0_18px_40px_rgba(85,112,54,0.06)]">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D1FADF] text-[#4E8931] border-8 border-[#ECFDF3]">
                    <FarmIcon size={16} color="currentColor" />
                  </div>
                  <Typography variant="base" className="font-semibold text-[#07090C]">
                    Farm Overview
                  </Typography>
                </div>

                <div className="overflow-hidden rounded-[20px] border border-[#F0EAE3] bg-[#F5EFEA]">
                  {farm.location ? (
                    <div className="relative h-44 w-full">
                      <iframe
                        title="farm-location-map"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(farm.location)}&output=embed`}
                        className="h-full w-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />

                      <div className="absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-md bg-[#25211F] px-2.5 py-1 text-[11px] text-white shadow-sm">
                        {farm.location}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[#59615A]">
                  <span>{farm.location}</span>
                </div>

                <div className="mt-8 mb-4 space-y-5">
                  <InfoRow label="Farm Name" value={farmName} />
                  <hr className='text-[#DBE6D5]' />
                  <InfoRow label="Farm Size" value={farmSize} />
                  <hr className='text-[#DBE6D5]' />
                  <InfoRow label="Farm Category" value={farmCategory} />
                  <hr className='text-[#DBE6D5]' />
                  <InfoRow label="Est. Investment" value={estInvestment} />
                </div>
              </section>

              <section className="overflow-hidden rounded-[20px] border border-[#DBE6D5] bg-white p-5 shadow-[0_18px_40px_rgba(85,112,54,0.06)]">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D1FADF] text-[#4E8931] border-8 border-[#ECFDF3]">
                    <FarmIcon size={16} color="currentColor" />
                  </div>
                  <Typography variant="base" className="font-semibold text-[#07090C]">
                    Investment & Farm Milestones
                  </Typography>
                </div>

                <div className="mt-8 mb-4 space-y-5">
                  {milestones.length > 0 ? (
                    milestones.map((milestone, idx) => (
                      <div key={milestone.id} className="space-y-5">
                        <InfoRow label={milestone.name} value={formatCurrency(milestone.amount)} />
                        {idx !== milestones.length - 1 && <hr className="text-[#DBE6D5]" />}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg border border-dashed border-[#E6ECDD] bg-[#FBFCF8] p-6 text-center text-sm text-[#6B7280]">
                      No milestones selected for this farm.
                    </div>
                  )}
                </div>
              </section>

              <section className="overflow-hidden rounded-[20px] border border-[#DBE6D5] bg-white p-5 shadow-[0_18px_40px_rgba(85,112,54,0.06)]">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D1FADF] text-[#4E8931] border-8 border-[#ECFDF3]">
                    <DocsIcon size={16} color="currentColor" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Typography variant="base" className="font-semibold text-[#151917]">
                      Submitted Evidence & Documentation
                    </Typography>
                    <span className="rounded-full border border-[#DDE6D1] bg-[#F7FBF4] px-2 py-0.5 text-[11px] font-medium text-[#66745D]">
                      {pdfDocuments.length} {pdfDocuments.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {pdfDocuments.length > 0 ? (
                    pdfDocuments.map((document) => (
                      <article
                        key={document.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => openPreview(document.preview)}
                        onKeyDown={(e) => { if (e.key === 'Enter') openPreview(document.preview); }}
                        className="cursor-pointer rounded-2xl border border-[#E6ECDD] bg-white p-4 shadow-[0_8px_20px_rgba(85,112,54,0.05)] transition-transform hover:-translate-y-0.5"
                      >
                        <div className="flex items-start gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-[#2B342D]">{document.name}</p>
                            <p className="text-xs text-[#8B9486]">{document.size} - Click to review</p>
                          </div>
                        </div>

                        <div className="mt-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.04em]">
                          <span
                            className={
                              document.status === 'reviewed'
                                ? 'rounded-full bg-[#EEF9EA] px-2.5 pb-0.5 py-1 text-[#6DA94C]'
                                : 'rounded-full bg-[#FFF4E6] px-2.5 pb-0.5 py-1 text-[#EB8B2E]'
                            }
                          >
                            {document.status === 'reviewed' ? 'Reviewed' : 'Pending Review'}
                          </span>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="col-span-3 rounded-lg border border-dashed border-[#E6ECDD] bg-[#FBFCF8] p-6 text-center text-sm text-[#6B7280]">
                      No PDF documents have been uploaded for this farm.
                    </div>
                  )}
                </div>
              </section>

              <section className="overflow-hidden rounded-[20px] border border-[#DBE6D5] bg-white p-5 shadow-[0_18px_40px_rgba(85,112,54,0.06)]">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D1FADF] text-[#4E8931] border-8 border-[#ECFDF3]">
                    <FarmIcon size={16} color="currentColor" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Typography variant="base" className="font-semibold text-[#151917]">
                      Farm Pictures
                    </Typography>
                    <span className="rounded-full border border-[#DDE6D1] bg-[#F7FBF4] px-2 py-0.5 text-[11px] font-medium text-[#66745D]">
                      {farmPictures.length} items
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {farmPictures.length > 0 ? (
                    farmPictures.map((picture) => (
                      <article
                        key={picture.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => openPreview(picture.src)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') openPreview(picture.src);
                        }}
                        className="group cursor-pointer overflow-hidden rounded-2xl border border-[#E6ECDD] bg-white shadow-[0_8px_20px_rgba(85,112,54,0.05)] transition-transform hover:-translate-y-0.5"
                      >
                        <div className="relative aspect-square bg-[#F7FBF4]">
                          <img
                            src={picture.src}
                            alt={picture.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                        </div>
                        <div className="border-t border-[#E6ECDD] px-3 py-2">
                          <p className="truncate text-xs font-medium text-[#2B342D]">{picture.name}</p>
                          <p className="text-[11px] text-[#8B9486]">Click to review</p>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="col-span-full rounded-lg border border-dashed border-[#E6ECDD] bg-[#FBFCF8] p-6 text-center text-sm text-[#6B7280]">
                      No farm pictures have been uploaded.
                    </div>
                  )}
                </div>
              </section>
            </main>
          </div>
        )}

        {verificationStatusNormalized === 'pending' && (
          <div className="flex justify-end pt-4">
            <div className="flex w-[360px] gap-3">
              <Button
                variant="primary"
                className="flex-1 bg-red-500 hover:bg-red-600 border-none uppercase"
                onClick={() => { setModalInitialStep('reject'); setIsModalOpen(true); }}
                isLoading={rejectMutation.isPending}
              >
                REJECT
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-green-600 hover:bg-green-700 border-none uppercase"
                onClick={() => { setModalInitialStep('approve'); setIsModalOpen(true); }}
                isLoading={approveMutation.isPending}
              >
                APPROVE
              </Button>
            </div>
          </div>
        )}

        <AdminFarmActionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          farmName={farmName}
          onApprove={handleApprove}
          onReject={(note) => handleReject(note)}
          isPending={approveMutation.isPending || rejectMutation.isPending}
          initialStep={modalInitialStep}
        />
        <Viewer
          visible={viewerVisible}
          onClose={() => setViewerVisible(false)}
          images={viewerImages}
          activeIndex={activeIndex}
          rotatable={true}
          zIndex={2000}
        />
      </div>
    </div>
  );
};

export default FarmDetailPage;
