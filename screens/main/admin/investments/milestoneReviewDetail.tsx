'use client'

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  CheckIcon,
  CloseIcon,
  FarmIcon,
  VerifiedIcon,
  LocationIcon,
  CalendarIcon,
  ClockIcon,
  AlertTriangleIcon,
  DocsIcon,
  FileTextIcon,
  LockIcon,
  FlagIcon,
  MessageSquareIcon
} from '@/components/icons';
import {
  useGetUserInvestmentMilestoneById,
  useUpdateUserInvestmentMilestoneChecklist,
  useReviewUserInvestmentMilestone,
} from '@/mutation';
import { UserInvestmentMilestoneChecklistItem, UserInvestmentMilestoneEvidenceItem } from '@/types';
import { formatNumberWithCommas, truncateMiddle } from '@/utils';
import { getPreviewImageUrl } from '@/utils/image';

interface ChecklistState {
  photos: 'unreviewed' | 'verified' | 'needs_clarification' | 'rejected';
  receipt: 'unreviewed' | 'verified' | 'needs_clarification' | 'rejected';
  video: 'unreviewed' | 'verified' | 'needs_clarification' | 'rejected';
  gps: 'unreviewed' | 'verified' | 'needs_clarification' | 'rejected';
  notes: 'unreviewed' | 'verified' | 'needs_clarification' | 'rejected';
}

const DEFAULT_CHECKLIST: ChecklistState = {
  photos: 'unreviewed',
  receipt: 'unreviewed',
  video: 'unreviewed',
  gps: 'unreviewed',
  notes: 'unreviewed',
};

export default function MilestoneReviewDetailScreen() {
  const router = useRouter();
  const params = useParams();
  const milestoneId = (params?.id || params?.milestoneId || '') as string;

  const [activeTab, setActiveTab] = useState<'photos' | 'documents' | 'video'>('photos');
  const [internalNote, setInternalNote] = useState('');

  const [checklist, setChecklist] = useState<ChecklistState>(DEFAULT_CHECKLIST);

  // Fetch workspace details from GET /web/admin/user-investment-milestones/{milestoneId}
  const { data: response, isLoading, refetch } = useGetUserInvestmentMilestoneById(milestoneId);
  const detail = response?.data;

  const updateChecklistMutation = useUpdateUserInvestmentMilestoneChecklist();
  const reviewMutation = useReviewUserInvestmentMilestone();

  // Restrict opening review detail if fundingStatus is not_requested
  useEffect(() => {
    if (detail) {
      const fs = (detail.fundingStatus || '').toLowerCase();
      if (fs === 'not_requested') {
        toast.error('This milestone has not been requested for funding yet and cannot be reviewed.');
        router.push('/admin/investments/milestone-review');
      }
    }
  }, [detail, router]);

  // Populate internal notes and checklist when detail data arrives
  useEffect(() => {
    if (detail?.internalNotes) {
      setInternalNote(detail.internalNotes);
    }
    const rawChecklist = detail?.VerificationChecklist || detail?.checklist;
    if (rawChecklist && Array.isArray(rawChecklist)) {
      const nextChecklist: ChecklistState = { ...DEFAULT_CHECKLIST };
      rawChecklist.forEach((item) => {
        const key = item.name.toLowerCase();
        const status = item.status as ChecklistState[keyof ChecklistState];
        if (key.includes('photo') && status) nextChecklist.photos = status;
        else if (key.includes('receipt') && status) nextChecklist.receipt = status;
        else if (key.includes('video') && status) nextChecklist.video = status;
        else if (key.includes('gps') && status) nextChecklist.gps = status;
        else if (key.includes('note') && status) nextChecklist.notes = status;
      });
      setChecklist(nextChecklist);
    }
  }, [detail]);

  const updateChecklistItem = (key: keyof ChecklistState, value: ChecklistState[keyof ChecklistState]) => {
    setChecklist(prev => ({ ...prev, [key]: value }));
  };

  const verifiedCount = Object.values(checklist).filter((val) => val === 'verified').length;

  const handleReviewAction = async (action: 'approve' | 'reject' | 'request_more_evidence') => {
    if (!milestoneId) return;

    const formattedChecklist: UserInvestmentMilestoneChecklistItem[] = [
      { name: 'Farm Photos', status: checklist.photos },
      { name: 'Purchase Receipt', status: checklist.receipt },
      { name: 'Progress Video', status: checklist.video },
      { name: 'GPS Verification', status: checklist.gps },
      { name: 'Farmer Notes', status: checklist.notes },
    ];

    try {
      // Save checklist and internal notes on decision click
      await updateChecklistMutation.mutateAsync({
        milestoneId,
        payload: {
          checklist: formattedChecklist,
          internalNotes: internalNote,
        },
      });

      // Submit milestone review decision action
      await reviewMutation.mutateAsync({
        milestoneId,
        payload: {
          action,
          internalNotes: internalNote,
          checklist: formattedChecklist,
        },
      });

      if (action === 'approve') {
        toast.success('Milestone approved successfully! Disbursal initiated.');
      } else if (action === 'request_more_evidence') {
        toast.info('Request for additional evidence sent to farmer.');
      } else {
        toast.error('Milestone request rejected.');
      }

      router.push('/admin/investments/milestone-review');
    } catch (err: unknown) {
      const anyErr = err as {
        response?: { data?: { message?: string } };
        data?: { message?: string };
        message?: string;
      };
      const msg =
        anyErr?.response?.data?.message ||
        anyErr?.data?.message ||
        anyErr?.message ||
        (err instanceof Error ? err.message : 'Action failed');
      toast.error(msg);
    }
  };

  const renderChecklistButtons = (key: keyof ChecklistState) => {
    const current = checklist[key];
    return (
      <div className="flex items-center gap-1.5 pt-1">
        <button
          type="button"
          onClick={() => updateChecklistItem(key, 'verified')}
          className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors cursor-pointer flex items-center gap-1 ${current === 'verified' ? 'bg-[#12B76A] text-white border-[#12B76A]' : 'bg-white text-[#344054] border-gray-200 hover:bg-gray-100'
            }`}
        >
          <CheckIcon size={12} color={current === 'verified' ? '#FFFFFF' : '#12B76A'} />
          <span>Verified</span>
        </button>
        <button
          type="button"
          onClick={() => updateChecklistItem(key, 'needs_clarification')}
          className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors cursor-pointer flex items-center gap-1 ${current === 'needs_clarification' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-[#344054] border-gray-200 hover:bg-gray-100'
            }`}
        >
          <FlagIcon size={12} color={current === 'needs_clarification' ? '#FFFFFF' : '#D97706'} />
          <span>Needs clarification</span>
        </button>
        <button
          type="button"
          onClick={() => updateChecklistItem(key, 'rejected')}
          className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors cursor-pointer flex items-center gap-1 ${current === 'rejected' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-[#344054] border-gray-200 hover:bg-gray-100'
            }`}
        >
          <CloseIcon size={12} color={current === 'rejected' ? '#FFFFFF' : '#D92D20'} />
          <span>Rejected</span>
        </button>
      </div>
    );
  };

  const renderStatusBadge = (key: keyof ChecklistState) => {
    const status = checklist[key];
    if (status === 'verified') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#027A48]">
          <CheckIcon size={10} color="#027A48" /> Verified
        </span>
      );
    }
    if (status === 'rejected') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
          <CloseIcon size={10} color="#B42318" /> Rejected
        </span>
      );
    }
    if (status === 'needs_clarification') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
          <FlagIcon size={10} color="#B45309" /> Needs Info
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
        <ClockIcon size={10} color="#667085" /> Unreviewed
      </span>
    );
  };

  // Mapped Data fields from backend API response payload
  const milestoneTitle = detail?.name || detail?.InvestmentMilestone?.name || detail?.milestoneTitle || '';
  const farmName = detail?.InvestmentProject?.Farm?.name || detail?.farmName || '';
  const farmerName = detail?.InvestmentProject?.Farm?.User?.fullName || detail?.farmerName || '';
  const farmLocation = detail?.InvestmentProject?.Farm?.location || detail?.farmDetails?.location || '';
  const cropCategory = detail?.InvestmentProject?.Category?.name || detail?.cropCategory || '';
  const farmSize = detail?.InvestmentProject?.Farm?.size || detail?.farmDetails?.sizeInHectares;

  const currentOrder = detail?.order || detail?.InvestmentMilestone?.order || 1;
  const projectMilestones = detail?.InvestmentProject?.ProjectMilestones || [];
  const templateMilestones = detail?.InvestmentProject?.InvestmentTemplate?.Milestones || [];
  const totalMilestonesCount = projectMilestones.length || templateMilestones.length || 0;

  const rawAmountRequested = detail?.amountRequested !== undefined ? detail.amountRequested : detail?.amount || 0;
  const formattedAmountRequested = typeof rawAmountRequested === 'number'
    ? `₦${formatNumberWithCommas(rawAmountRequested)}`
    : `₦${formatNumberWithCommas(parseFloat(String(rawAmountRequested)) || 0)}`;

  const rawExpectedInvestment = detail?.InvestmentProject?.expectedInvestment || detail?.totalFarmFunding || 0;
  const formattedExpectedInvestment = typeof rawExpectedInvestment === 'number'
    ? `₦${formatNumberWithCommas(rawExpectedInvestment)}`
    : `₦${formatNumberWithCommas(parseFloat(String(rawExpectedInvestment)) || 0)}`;

  const releasePercentage = detail?.fundReleasePercentage || detail?.InvestmentMilestone?.fundReleasePercentage || detail?.releasePercentage || '0.00';

  const rawReceived = detail?.InvestmentProject?.investmentReceived || detail?.releasedAmount || 0;
  const releasedAmountNum = typeof rawReceived === 'number' ? rawReceived : parseFloat(String(rawReceived)) || 0;

  const reviewStatusText = (detail?.reviewStatus || detail?.status || 'pending').replace(/_/g, ' ');

  const formattedSubmittedDate = useMemo(() => {
    const rawDate = detail?.fundingRequestedAt || detail?.createdAt;
    if (!rawDate) return '';
    try {
      const d = new Date(rawDate);
      return d.toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return String(rawDate);
    }
  }, [detail]);

  // Map evidence photos, docs, videos directly from FundingEvidence
  const fundingEvidence = detail?.FundingEvidence || (detail as any)?.fundingEvidence || (Array.isArray(detail?.evidence) ? detail.evidence : []);

  const evidencePhotos = useMemo<UserInvestmentMilestoneEvidenceItem[]>(() => {
    const items: UserInvestmentMilestoneEvidenceItem[] = [];

    if (Array.isArray(fundingEvidence) && fundingEvidence.length > 0) {
      fundingEvidence.forEach(e => {
        const evType = (e.evidenceType || e.type || '').toLowerCase();
        const isPhoto = evType === 'photo' || evType === 'picture' || e.mimeType?.startsWith('image/');
        if (isPhoto) {
          const rawUrl = e.fileUrl || e.url || '';
          items.push({
            ...e,
            id: e.id,
            type: 'photo',
            evidenceType: 'photo',
            url: getPreviewImageUrl(rawUrl),
            fileUrl: getPreviewImageUrl(rawUrl),
            title: e.fileName || e.title || 'Photo Evidence',
            fileName: e.fileName || e.title || 'Photo Evidence',
            capturedAt: e.createdAt
              ? new Date(e.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
              : e.capturedAt,
            location: farmLocation,
          });
        }
      });
    }

    return items;
  }, [fundingEvidence, farmLocation]);

  const evidenceDocs = useMemo<UserInvestmentMilestoneEvidenceItem[]>(() => {
    const items: UserInvestmentMilestoneEvidenceItem[] = [];

    if (Array.isArray(fundingEvidence) && fundingEvidence.length > 0) {
      fundingEvidence.forEach(e => {
        const evType = (e.evidenceType || e.type || '').toLowerCase();
        const isDoc = evType === 'file' || evType === 'document' || evType === 'pdf' || e.mimeType === 'application/pdf' || (e.fileName && e.fileName.endsWith('.pdf'));
        if (isDoc) {
          const rawUrl = e.fileUrl || e.url || '';
          items.push({
            ...e,
            id: e.id,
            type: 'document',
            evidenceType: 'document',
            url: rawUrl,
            fileUrl: rawUrl,
            title: e.fileName || e.title || 'Document Evidence',
            fileName: e.fileName || e.title || 'Document Evidence',
            capturedAt: e.createdAt
              ? new Date(e.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              : e.capturedAt,
          });
        }
      });
    }

    return items;
  }, [fundingEvidence]);

  const evidenceVideos = useMemo<UserInvestmentMilestoneEvidenceItem[]>(() => {
    const items: UserInvestmentMilestoneEvidenceItem[] = [];

    if (Array.isArray(fundingEvidence) && fundingEvidence.length > 0) {
      fundingEvidence.forEach(e => {
        const evType = (e.evidenceType || e.type || '').toLowerCase();
        const isVideo = evType === 'video' || e.mimeType?.startsWith('video/');
        if (isVideo) {
          const rawUrl = e.fileUrl || e.url || '';
          items.push({
            ...e,
            id: e.id,
            type: 'video',
            evidenceType: 'video',
            url: rawUrl,
            fileUrl: rawUrl,
            title: e.fileName || e.title || 'Video Evidence',
            fileName: e.fileName || e.title || 'Video Evidence',
          });
        }
      });
    }

    return items;
  }, [fundingEvidence]);

  // Milestone schedule list
  const milestoneSchedule = useMemo(() => {
    if (projectMilestones.length > 0) {
      return projectMilestones.map(m => {
        const fs = (m.fundingStatus || '').toLowerCase();
        const isCurrentMilestone = (m.id && detail?.id && m.id === detail.id) || m.order === currentOrder;
        let status = 'Locked';

        if (fs === 'completed' || fs === 'approved' || m.reviewStatus === 'approved' || m.completedAt !== null) {
          status = 'Approved';
        } else if (fs === 'processing' || fs === 'request_for_funding' || fs === 'processing_funding' || fs === 'under_review' || fs === 'in_review') {
          status = 'Under Review';
        } else if (fs === 'not_requested' || fs === 'requested' || fs === 'not_started') {
          status = isCurrentMilestone ? 'Under Review' : 'Locked';
        } else {
          const isDone = m.order < currentOrder;
          status = isDone ? 'Approved' : isCurrentMilestone ? 'Under Review' : 'Locked';
        }

        return {
          id: m.id,
          order: m.order,
          title: m.name,
          percentage: parseFloat(String(m.fundReleasePercentage)) || 0,
          amount: typeof m.amount === 'number' ? m.amount : parseFloat(String(m.amount)) || 0,
          status,
          isCurrent: isCurrentMilestone,
        };
      }).sort((a, b) => a.order - b.order);
    }

    if (templateMilestones.length > 0) {
      return templateMilestones.map(m => {
        const isCurrent = m.order === currentOrder;
        const isDone = m.order < currentOrder;
        const milestoneAmount = (parseFloat(String(m.fundReleasePercentage)) / 100) * parseFloat(String(rawExpectedInvestment));
        return {
          id: m.id,
          order: m.order,
          title: m.name,
          percentage: parseFloat(String(m.fundReleasePercentage)) || 0,
          amount: milestoneAmount,
          status: isDone ? 'Approved' : isCurrent ? 'Under Review' : 'Locked',
          isCurrent,
        };
      }).sort((a, b) => a.order - b.order);
    }

    return detail?.milestoneSchedule || [];
  }, [projectMilestones, templateMilestones, detail, currentOrder, rawExpectedInvestment]);

  // Previous milestone history items
  const previousMilestones = useMemo(() => {
    if (projectMilestones.length > 0) {
      return projectMilestones
        .filter(m => (m.fundingStatus === 'completed' || m.completedAt !== null || m.reviewStatus === 'approved') && m.id !== detail?.id)
        .map(m => ({
          id: m.id,
          title: `${m.order}. ${m.name}`,
          amount: typeof m.amount === 'number' ? m.amount : parseFloat(String(m.amount)) || 0,
          status: m.fundingStatus === 'completed' || m.reviewStatus === 'approved' ? 'Approved' : (m.reviewStatus ? m.reviewStatus.replace(/_/g, ' ') : 'Pending'),
          approvedBy: m.reviewedBy || '',
          approvedAt: m.reviewedAt ? new Date(m.reviewedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : (m.fundingRequestedAt ? new Date(m.fundingRequestedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''),
        }));
    }
    return detail?.previousMilestones || [];
  }, [projectMilestones, currentOrder, detail]);

  // Mapped audit trail strictly from ReviewAuditTrail
  const auditTrail = useMemo(() => {
    const rawLogs = detail?.ReviewAuditTrail || (detail as any)?.reviewAuditTrail || detail?.auditTrail;

    if (rawLogs && Array.isArray(rawLogs) && rawLogs.length > 0) {
      return rawLogs.map((item: Record<string, any>) => {
        const rawDate = item.createdAt || item.timestamp || item.created_at;
        let formattedTime = '';
        if (rawDate) {
          const d = new Date(rawDate);
          if (!isNaN(d.getTime())) {
            const dayMonth = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
            const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            formattedTime = `${dayMonth} · ${timeStr}`;
          } else {
            formattedTime = String(rawDate);
          }
        }

        const rawAction = item.action || item.title || item.event || 'Milestone Updated';
        const actionText = String(rawAction)
          .replace(/_/g, ' ')
          .toLowerCase()
          .replace(/\b\w/g, (c: string) => c.toUpperCase());

        let descriptionText = item.description || item.internalNotes || item.note || item.notes || item.comment || '';
        if (!descriptionText && item.fromReviewStatus && item.toReviewStatus && item.fromReviewStatus !== item.toReviewStatus) {
          descriptionText = `Review status changed from ${item.fromReviewStatus} to ${item.toReviewStatus}`;
        }

        const actorText = item.Admin?.fullName ||
          (typeof item.actor === 'string' ? item.actor : item.actor?.fullName) ||
          item.Admin?.email ||
          item.reviewedBy ||
          item.User?.fullName ||
          item.user?.fullName ||
          item.reviewer ||
          'Admin User';

        const isGreen = /approved|passed|verified|completed/i.test(rawAction) || /approved|passed|verified|completed/i.test(descriptionText);

        return {
          id: item.id,
          timestamp: formattedTime,
          action: actionText,
          description: descriptionText,
          actor: actorText,
          isGreen,
        };
      });
    }

    return [];
  }, [detail]);

  const farmerNotesText = detail?.InvestmentProject?.notes || detail?.farmerNotes || (detail as unknown as { notes?: string })?.notes || 'No farmer notes provided for this milestone.';

  const maturityDate = detail?.InvestmentProject?.endDate ||
    detail?.InvestmentProject?.InvestmentTemplate?.endDate ||
    (detail as unknown as { maturityDate?: string })?.maturityDate ||
    detail?.InvestmentProject?.startDate ||
    detail?.createdAt;

  const fundingCycleCode = useMemo(() => {
    if (!maturityDate) return '';
    try {
      const d = new Date(maturityDate);
      if (isNaN(d.getTime())) return '';
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `CYC-${year}-${month}${day}`;
    } catch {
      return '';
    }
  }, [maturityDate]);

  if (isLoading) {
    return (
      <div className="-m-4 md:-m-8 p-8 min-h-[calc(100vh-4rem)] bg-[#EBF5EB] flex items-center justify-center">
        <div className="text-center text-[#667085] text-sm font-medium">
          Loading milestone review workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="-m-4 md:-m-8 p-4 md:p-8 min-h-[calc(100vh-4rem)] bg-[#EBF5EB] space-y-6">
      {/* Top Navigation Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <Link
              href="/admin/investments/milestone-review"
              className="w-fit inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#D0D5DD] text-[#344054] rounded-md text-xs font-semibold hover:bg-gray-50 transition-colors shadow-xs"
            >
              <ArrowLeftIcon size={14} color="#344054" />
              <span>Queue</span>
            </Link>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#101828]">
                {[milestoneTitle, farmName].filter(Boolean).join(' · ')}
              </h1>
              <p className="text-xs font-medium text-[#667085] pl-0.5">
                {[
                  detail?.id || milestoneId ? `MS-${(detail?.id || milestoneId).slice(0, 4).toUpperCase()}` : '',
                  currentOrder && totalMilestonesCount ? `Milestone ${currentOrder} of ${totalMilestonesCount}` : '',
                  formattedSubmittedDate ? `Submitted ${formattedSubmittedDate}` : ''
                ].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="inline-flex items-center gap-1.5 bg-[#FFFAEB] text-[#B54708] border border-[#FEDF89] px-3.5 py-1 rounded-full text-xs font-semibold capitalize shadow-2xs">
            <ClockIcon size={14} color="#B54708" />
            {reviewStatusText}
          </span>
        </div>
      </div>

      {/* Main 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT COLUMN: Details & Evidence */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Farmer & Milestone Release Overview */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100/80 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#EAF6EA] text-[#2E7D32] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FarmIcon size={22} color="#2E7D32" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-base font-semibold text-[#101828]">{farmerName || 'Farmer'}</h2>
                    <VerifiedIcon size={16} className="text-[#12B76A]" />
                  </div>
                  <p className="text-xs text-[#667085] flex items-center gap-1.5 mt-0.5">
                    {farmLocation && <LocationIcon size={14} color="#667085" />}
                    {[farmLocation, cropCategory, farmSize ? `${farmSize} hectares` : ''].filter(Boolean).join(' · ')}
                  </p>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-xs text-[#667085] font-medium block">This milestone releases</span>
                <span className="text-2xl font-bold text-[#101828] block">{formattedAmountRequested}</span>
                <span className="text-xs text-[#667085] font-medium">{releasePercentage}% of {formattedExpectedInvestment}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs">
              {fundingCycleCode && (
                <div>
                  <span className="text-[#667085] font-medium block">Funding cycle</span>
                  <span className="font-semibold text-[#101828] text-sm">{fundingCycleCode}</span>
                </div>
              )}
              <div>
                <span className="text-[#667085] font-medium block">Released to date</span>
                <span className="font-semibold text-[#101828] text-sm">₦{formatNumberWithCommas(releasedAmountNum)}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Evidence Viewer */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100/80 shadow-xs space-y-5">
            <div>
              <h2 className="text-base font-semibold text-[#101828]">Evidence viewer</h2>
              <p className="text-xs text-[#667085]">Inspect and verify each item before making a milestone decision.</p>
            </div>

            {/* Segmented Control / Tabs */}
            <div className="flex items-center gap-2 bg-[#F2F4F7] p-1 rounded-xl w-full text-xs font-semibold text-[#667085]">
              <button
                type="button"
                onClick={() => setActiveTab('photos')}
                className={`px-4 py-2 w-full rounded-lg transition-all cursor-pointer ${activeTab === 'photos' ? 'bg-white text-[#101828] shadow-xs' : 'hover:text-[#101828]'
                  }`}
              >
                Photos ({evidencePhotos.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('documents')}
                className={`px-4 py-2 w-full rounded-lg transition-all cursor-pointer ${activeTab === 'documents' ? 'bg-white text-[#101828] shadow-xs' : 'hover:text-[#101828]'
                  }`}
              >
                Documents ({evidenceDocs.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('video')}
                className={`px-4 py-2 w-full rounded-lg transition-all cursor-pointer ${activeTab === 'video' ? 'bg-white text-[#101828] shadow-xs' : 'hover:text-[#101828]'
                  }`}
              >
                Video ({evidenceVideos.length})
              </button>
            </div>

            {/* Content Tabs */}
            {activeTab === 'photos' && (
              evidencePhotos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {evidencePhotos.map((photo, idx) => (
                    <div key={photo.id || idx} className="border border-[#EAECF0] rounded-xl overflow-hidden bg-white space-y-2 pb-3 shadow-xs">
                      <div className="relative h-44 w-full bg-gray-100">
                        {photo.url || photo.fileUrl ? (
                          <Image
                            src={getPreviewImageUrl(photo.url || photo.fileUrl || '')}
                            alt={photo.title || `Photo ${idx + 1}`}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-xs">No image preview</div>
                        )}
                      </div>
                      <div className="px-3 space-y-1">
                        <h3 className="text-xs font-bold text-[#101828] truncate">{photo.title || `Photo ${idx + 1}`}</h3>
                        {photo.capturedAt && (
                          <p className="text-[11px] text-[#667085] flex items-center gap-1">
                            <CalendarIcon size={12} color="#667085" />
                            {photo.capturedAt}
                          </p>
                        )}
                        {photo.location && (
                          <p className="text-[11px] text-[#667085] flex items-center gap-1 truncate">
                            <LocationIcon size={12} color="#667085" />
                            {photo.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 border border-dashed border-gray-200 rounded-xl text-center space-y-1 text-xs text-[#667085]">
                  <p className="font-semibold text-[#101828]">No photo evidence submitted yet.</p>
                </div>
              )
            )}

            {activeTab === 'documents' && (
              evidenceDocs.length > 0 ? (
                <div className="p-4 border border-[#EAECF0] rounded-xl space-y-2.5 text-xs text-[#667085]">
                  <p className="font-semibold text-[#101828] pb-1 border-b border-gray-100">{evidenceDocs.length} Attached Documents</p>
                  {evidenceDocs.map((doc, idx) => (
                    <a
                      key={doc.id || idx}
                      href={doc.url || doc.fileUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100"
                    >
                      <span className="flex items-center gap-2 font-medium text-[#101828] truncate">
                        <FileTextIcon size={16} color="#667085" />
                        {doc.title || `Document ${idx + 1}`}
                      </span>
                      <span className="text-xs text-[#6941C6] font-semibold flex-shrink-0">View Document</span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="p-8 border border-dashed border-gray-200 rounded-xl text-center space-y-1 text-xs text-[#667085]">
                  <p className="font-semibold text-[#101828]">No document evidence submitted.</p>
                </div>
              )
            )}

            {activeTab === 'video' && (
              evidenceVideos.length > 0 ? (
                <div className="p-4 border border-[#EAECF0] rounded-xl space-y-2.5 text-xs text-[#667085]">
                  <p className="font-semibold text-[#101828] pb-1 border-b border-gray-100">{evidenceVideos.length} Video Attached</p>
                  {evidenceVideos.map((vid, idx) => (
                    <a
                      key={vid.id || idx}
                      href={vid.url || vid.fileUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100"
                    >
                      <span className="flex items-center gap-2 font-medium text-[#101828] truncate">
                        <DocsIcon size={16} />
                        {vid.title || `Video ${idx + 1}`}
                      </span>
                      <span className="text-xs text-[#6941C6] font-semibold flex-shrink-0">Watch Video</span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="p-8 border border-dashed border-gray-200 rounded-xl text-center space-y-1 text-xs text-[#667085]">
                  <p className="font-semibold text-[#101828]">No video evidence submitted.</p>
                </div>
              )
            )}

            {/* Evidence Quick Action Buttons */}
            {(() => {
              const currentChecklistKey: keyof ChecklistState = activeTab === 'photos'
                ? 'photos'
                : activeTab === 'documents'
                  ? 'receipt'
                  : 'video';
              const isVerified = checklist[currentChecklistKey] === 'verified';
              const isFlagged = checklist[currentChecklistKey] === 'needs_clarification';

              return (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => updateChecklistItem(currentChecklistKey, 'verified')}
                    className={`px-4 py-2 border rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      isVerified
                        ? 'bg-[#12B76A] text-white border-[#12B76A]'
                        : 'bg-white border-[#D0D5DD] text-[#344054] hover:bg-gray-50'
                    }`}
                  >
                    <CheckIcon size={14} color={isVerified ? '#FFFFFF' : '#344054'} />
                    <span>{isVerified ? 'Verified' : 'Mark as Verified'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateChecklistItem(currentChecklistKey, 'needs_clarification')}
                    className={`px-4 py-2 border rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      isFlagged
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white border-[#D0D5DD] text-[#344054] hover:bg-gray-50'
                    }`}
                  >
                    <FlagIcon size={14} color={isFlagged ? '#FFFFFF' : '#344054'} />
                    <span>{isFlagged ? 'Flagged' : 'Flag Evidence'}</span>
                  </button>
                </div>
              );
            })()}
          </div>

          {/* Card 3: Farmer Notes */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100/80 shadow-xs space-y-3">
            <h2 className="text-base font-semibold text-[#101828]">Farmer notes</h2>
            <div className="p-4 bg-[#F8FAF8] border border-[#EAECF0] rounded-xl text-xs text-[#344054] leading-relaxed">
              {farmerNotesText}
            </div>
          </div>

          {/* Card 4: Previous Milestone History */}
          {previousMilestones.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100/80 shadow-xs space-y-3">
              <h2 className="text-base font-semibold text-[#101828]">Previous milestone history</h2>
              <div className="space-y-2">
                {previousMilestones.map((prev, idx) => (
                  <div key={prev.id || idx} className="flex items-center justify-between p-3.5 border border-[#EAECF0] rounded-xl bg-white text-xs">
                    <div>
                      <span className="font-semibold text-[#101828] block text-sm">{prev.title}</span>
                      <span className="text-[#667085]">{prev.approvedBy ? `${prev.approvedBy} · ` : ''}{prev.approvedAt || ''}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-[#101828]">
                        {typeof prev.amount === 'number' ? `₦${formatNumberWithCommas(prev.amount)}` : prev.amount}
                      </span>
                      <span className="bg-[#ECFDF5] text-[#027A48] px-2.5 py-0.5 rounded-full font-semibold text-[11px] flex items-center gap-1 capitalize">
                        <CheckIcon size={10} color="#027A48" /> {prev.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Card 5: Audit Trail */}
          {auditTrail.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100/80 shadow-xs space-y-4">
              <div>
                <h2 className="text-base font-bold text-[#101828]">Audit trail</h2>
                <p className="text-xs text-[#667085]">Who · what · when · result</p>
              </div>

              <div className="relative pl-6 space-y-5 before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {auditTrail.map((item, idx) => (
                  <div key={item.id || idx} className="relative text-xs space-y-0.5">
                    <div
                      className={`absolute -left-5 top-1.5 w-3 h-3 rounded-full border-2 border-white ${
                        item.isGreen ? 'bg-[#12B76A]' : 'bg-[#A0AEC0]'
                      }`}
                    />
                    {item.timestamp && <span className="text-[#667085] text-[11px] block font-normal">{item.timestamp}</span>}
                    <p className="font-semibold text-[#101828] text-sm leading-snug">{item.action}</p>
                    {item.description && <p className="text-[#667085] text-xs leading-relaxed">{item.description}</p>}
                    {item.actor && <p className="text-[#667085] text-xs font-normal">by {item.actor}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Sidebar Action & Checklist Panels */}
        <div className="space-y-6">
          {/* Panel 1: Milestone Schedule */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100/80 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-[#101828]">Milestone schedule</h2>
              <p className="text-xs text-[#667085]">
                ₦{formatNumberWithCommas(releasedAmountNum)} of {formattedExpectedInvestment} released
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              {milestoneSchedule.map((step) => {
                const isCurrent = step.status.toLowerCase() === 'under review' || step.status.toLowerCase() === 'pending';
                const isDone = step.status.toLowerCase() === 'approved' || step.status.toLowerCase() === 'complete';
                return (
                  <div
                    key={step.id || step.order}
                    className={`flex items-center justify-between p-3 rounded-xl border ${isDone
                      ? 'bg-gray-50/70 border-gray-100'
                      : isCurrent
                        ? 'bg-[#FFFAEB] border-[#FEDF89]'
                        : 'bg-white border-gray-100 opacity-60'
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${isDone
                          ? 'bg-[#12B76A] text-white'
                          : isCurrent
                            ? 'bg-[#B54708] text-white'
                            : 'bg-gray-100 text-gray-500'
                          }`}
                      >
                        {isDone ? <CheckIcon size={12} color="#FFFFFF" /> : isCurrent ? step.order : <LockIcon size={12} color="#667085" />}
                      </div>
                      <div>
                        <span className="font-bold text-[#101828] block">{step.title}</span>
                        <span className="text-[11px] font-semibold capitalize text-[#667085]">{step.status}</span>
                      </div>
                    </div>
                    <span className="text-[#667085] font-medium text-right">
                      {step.percentage}% · ₦{formatNumberWithCommas(step.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panel 2: Verification Checklist */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-[#101828]">Verification checklist</h2>
                <p className="text-xs text-[#667085]">Verify each item before deciding</p>
              </div>
              <span className="bg-gray-100 text-[#344054] text-[11px] font-bold px-2 py-0.5 rounded-md">
                {verifiedCount}/5 verified
              </span>
            </div>

            {/* Checklist items */}
            <div className="space-y-3.5 text-xs">
              {/* Item 1: Farm Photos */}
              <div className="space-y-1.5 p-2.5 bg-gray-50/60 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#101828]">Farm Photos</span>
                  {renderStatusBadge('photos')}
                </div>
                <p className="text-[11px] text-[#667085] flex items-center gap-1">
                  <CheckIcon size={10} color="#667085" /> Evidence provided
                </p>
                {renderChecklistButtons('photos')}
              </div>

              {/* Item 2: Purchase Receipt */}
              <div className="space-y-1.5 p-2.5 bg-gray-50/60 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#101828]">Purchase Receipt</span>
                  {renderStatusBadge('receipt')}
                </div>
                <p className="text-[11px] text-[#667085] flex items-center gap-1">
                  <CheckIcon size={10} color="#667085" /> Evidence provided
                </p>
                {renderChecklistButtons('receipt')}
              </div>

              {/* Item 3: Progress Video */}
              <div className="space-y-1.5 p-2.5 bg-gray-50/60 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#101828]">Progress Video</span>
                  {renderStatusBadge('video')}
                </div>
                <p className="text-[11px] text-[#667085] flex items-center gap-1">
                  <CheckIcon size={10} color="#667085" /> Evidence provided
                </p>
                {renderChecklistButtons('video')}
              </div>

              {/* Item 4: GPS Verification */}
              <div className="space-y-1.5 p-2.5 bg-gray-50/60 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#101828]">GPS Verification</span>
                  {renderStatusBadge('gps')}
                </div>
                <p className="text-[11px] text-[#667085] flex items-center gap-1">
                  <CheckIcon size={10} color="#667085" /> Evidence provided
                </p>
                {renderChecklistButtons('gps')}
              </div>

              {/* Item 5: Farmer Notes */}
              <div className="space-y-1.5 p-2.5 bg-gray-50/60 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#101828]">Farmer Notes</span>
                  {renderStatusBadge('notes')}
                </div>
                <p className="text-[11px] text-[#667085] flex items-center gap-1">
                  <CheckIcon size={10} color="#667085" /> Evidence provided
                </p>
                {renderChecklistButtons('notes')}
              </div>
            </div>
          </div>

          {/* Panel 3: Internal Notes */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100/80 shadow-xs space-y-3">
            <div>
              <h2 className="text-sm font-semibold text-[#101828]">Internal notes</h2>
              <p className="text-xs text-[#667085]">Visible to reviewers only</p>
            </div>
            <textarea
              rows={3}
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Add context for other reviewers..."
              className="w-full p-3 border border-[#EAECF0] rounded-xl text-xs outline-none focus:border-[#137333] transition-colors resize-none placeholder:text-[#98A2B3]"
            />
          </div>

          {/* Panel 4: Decision Buttons */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100/80 shadow-xs space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#667085] font-medium">Verification progress</span>
                <span className="font-bold text-[#101828]">{verifiedCount}/5 verified</span>
              </div>
              <div className="w-full bg-[#E4E7EC] h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-[#137333] h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(verifiedCount / 5) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                disabled={reviewMutation.isPending}
                onClick={() => handleReviewAction('approve')}
                className="w-full py-3 bg-[#137333] text-white rounded-xl text-xs font-bold hover:bg-[#0f5c29] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <CheckIcon size={16} color="#FFFFFF" />
                <span>{reviewMutation.isPending ? 'Submitting...' : `Approve & release ${formattedAmountRequested}`}</span>
              </button>

              <button
                type="button"
                disabled={reviewMutation.isPending}
                onClick={() => handleReviewAction('request_more_evidence')}
                className="w-full py-3 bg-[#F8FAF8] border border-[#EAECF0] text-[#344054] rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <MessageSquareIcon size={14} color="#344054" />
                <span>Request more evidence</span>
              </button>

              <button
                type="button"
                disabled={reviewMutation.isPending}
                onClick={() => handleReviewAction('reject')}
                className="w-full py-3 text-[#D92D20] text-xs font-bold hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <CloseIcon size={14} color="#D92D20" />
                <span>Reject milestone</span>
              </button>
            </div>

            {verifiedCount < 5 && (
              <p className="text-[11px] text-[#667085] flex items-center justify-center gap-1.5 pt-1 italic">
                <AlertTriangleIcon size={12} color="#667085" />
                Not all evidence items are verified yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

