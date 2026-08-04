/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AddIcon, CheckIcon, CloseIcon, DocsIcon, EqualIcon, FarmIcon, FilterIcon, MoreIcon, PhotoIcon, SearchIcon, ShieldIcon, TickIcon, UploadIcon, ClockIcon, WalletIcon, LayersIcon, ChevronIcon, InfoIcon, CalendarIcon, LocationIcon, TrendingUpIcon, PercentIcon, DownloadIcon } from "@/components/icons";
import { Modal } from "@/components/modal";
import { Button, Input, MainHeader, Select, Table, Typography } from "@/components/ui";
import { Column } from "@/components/ui/table";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { useGetFarmCategories, useGetWebMilestonesByCategory, useGetWebInvestmentTemplate } from "@/mutation/dashboard.mutation";
import { useAddMilestonesToFarm, useCreateFarm, useGetFarms, useUploadDocToFarm, useUpdateFarm, useGetFarmById } from "@/mutation/farms.mutation";
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

type Step = 1 | 2;

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

const getInvestmentDetails = (farm: any) => {
  const isVerified = farm.verificationStatus === "Verified" || farm.status === "Approved" || farm.status === "Verified" || farm.verificationStatus === "Approved" || farm.isActive;
  
  const cycles = farm.stats?.completedMilestones || farm.SelectedMilestones?.filter((m: any) => m.isCompleted).length || 0;
  const verificationStatus = isVerified ? "Verified" : "Pending";
  
  const rawStatus = farm.Investment?.status || farm.status;
  let investmentStatus = "Not Started";
  if (rawStatus === "Active" || rawStatus === "active") {
    investmentStatus = "Active";
  } else if (rawStatus === "Funding Started" || rawStatus === "funding_started" || rawStatus === "Funding") {
    investmentStatus = "Funding Started";
  } else if (rawStatus === "Completed" || rawStatus === "completed") {
    investmentStatus = "Completed";
  } else if (farm.stats?.completionPercentage > 0 && farm.stats?.completionPercentage < 100) {
    investmentStatus = "Active";
  }
  
  return {
    cycles,
    verificationStatus,
    investmentStatus,
  };
};

const FarmActionCell = ({ onViewDetails }: { farm: any; onViewDetails: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current?.contains(event.target as Node)) {
        return;
      }
      const target = event.target as HTMLElement;
      if (target.closest("[data-dropdown-portal]")) {
        return;
      }
      setIsOpen(false);
    };

    const handleScrollOrResize = () => {
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right - 144 + window.scrollX
      });
    }
  }, [isOpen]);

  const portalContainer = typeof document !== "undefined" ? document.body : null;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="text-[#7A828E] hover:text-[#4B5563] transition-colors p-1.5 rounded-full hover:bg-gray-50 focus:outline-none cursor-pointer flex items-center justify-center"
        aria-label="Actions menu"
      >
        <MoreIcon size={18} />
      </button>

      {isOpen && portalContainer && createPortal(
        <div
          data-dropdown-portal="true"
          style={{
            position: "absolute",
            top: `${coords.top}px`,
            left: `${coords.left}px`,
          }}
          className="w-36 bg-white border border-[#E9EAEB] rounded-lg shadow-lg py-1 z-9999 animate-fadeIn text-left flex flex-col min-w-[140px]"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onViewDetails();
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors font-medium cursor-pointer block whitespace-nowrap"
          >
            View Details
          </button>
        </div>,
        portalContainer
      )}
    </div>
  );
};

const FarmDetailsView = ({
  farm,
  onBack,
  customProjects,
  setCustomProjects,
  onCreateProject,
}: {
  farm: any;
  onBack: () => void;
  customProjects: Record<string, any[]>;
  setCustomProjects: React.Dispatch<React.SetStateAction<Record<string, any[]>>>;
  onCreateProject: () => void;
}) => {
  const stats = useMemo(() => {
    const cycles = farm.stats?.completedMilestones || farm.SelectedMilestones?.filter((m: any) => m.isCompleted).length || 0;
    const currentCycle = (farm.Investment && farm.Investment.status !== 'Completed') ? 1 : 0;
    const funding = farm.Investment?.amount || 0;
    const completion = farm.stats?.completionPercentage || 0;

    return {
      cycles,
      cyclesTag: null,
      currentCycle,
      funding: formatCurrency(funding),
      fundingTag: null,
      completion: `${parseFloat(String(completion)).toFixed(1)}%`,
      completionTag: null
    };
  }, [farm]);

  const pictures = useMemo(() => {
    const directPictures = farm.pictures || [];
    if (Array.isArray(directPictures) && directPictures.length > 0) {
      return directPictures.map((p: any) => {
        if (!p) return "";
        if (typeof p === 'string') return p;
        return p.url || p.src || p.preview || p.path || p.fileUrl || "";
      }).filter(Boolean);
    }
    return [];
  }, [farm.pictures]);

  const docs = useMemo(() => {
    const directDocs = farm.documents || [];
    if (Array.isArray(directDocs) && directDocs.length > 0) {
      return directDocs.map((d: any) => {
        if (!d) return { name: 'document.pdf', size: '', url: '' };
        if (typeof d === 'string') {
          const name = d.split('/').pop() || 'document.pdf';
          return { name, size: '', url: d };
        }
        const name = d.name || d.fileName || (d.url && d.url.split('/').pop()) || 'document.pdf';
        const size = d.size || d.fileSize || '';
        const url = d.url || d.fileUrl || d.path || d.preview || '';
        return { name, size, url };
      }).filter(Boolean);
    }
    return [];
  }, [farm.documents]);

  const farmProjects = useMemo(() => {
    const addedProjects = customProjects[farm.id] || [];
    const apiProjects: any[] = [];

    // Prefer explicit Investment object from API
    if (farm.Investment) {
      const inv = farm.Investment;
      const invMilestones = Array.isArray(inv.milestones)
        ? inv.milestones.map((m: any) => ({
            id: m.id,
            name: m.name || m.title || "",
            pct: m.releasePercentage ?? m.allocation ?? m.pct ?? 0,
            amount: m.amount ?? 0,
            status: m.status ?? (m.isCompleted ? "Completed" : "Request for Funding")
          }))
        : [];

      const totalAllocation = invMilestones.reduce((acc: number, mm: any) => acc + (Number(mm.pct) || 0), 0);

      apiProjects.push({
        id: inv.id,
        name: inv.name || inv.title || `Investment Project`,
        categoryName: farm.Category?.name || inv.categoryName || "",
        status: inv.status || "Funding Started",
        dates: (inv.startDate || inv.endDate) ? `${formatDate(inv.startDate) || ""} - ${formatDate(inv.endDate) || ""}` : "",
        raised: inv.amountRaised ?? inv.raised ?? 0,
        goal: inv.amount ?? inv.goal ?? 0,
        investors: inv.investorsCount ?? inv.investors ?? 0,
        roi: inv.roi ? `${inv.roi}${String(inv.roi).includes('%') ? '' : '% return'}` : (inv.roiText || ''),
        milestones: invMilestones,
        totalAllocation: totalAllocation
      });
    }

    // If API exposes SelectedMilestones but no Investment object, map them directly
    else if (Array.isArray(farm.SelectedMilestones) && farm.SelectedMilestones.length > 0) {
      const milestones = farm.SelectedMilestones.map((m: any) => ({
        id: m.id,
        name: m.name || m.title || "",
        pct: m.releasePercentage ?? m.allocation ?? m.pct ?? 0,
        amount: m.amount ?? 0,
        status: m.isCompleted ? "Completed" : (m.status || "Request for Funding")
      }));
      const totalAllocation = milestones.reduce((acc: number, mm: any) => acc + (Number(mm.pct) || 0), 0);

      apiProjects.push({
        id: farm.id + "-p1",
        name: farm.Investment?.name || `Investment Project 1 - ${farm.Category?.name || ''}`,
        categoryName: farm.Category?.name || "",
        status: farm.Investment?.status || "Funding Started",
        dates: "",
        raised: farm.Investment?.amountRaised ?? 0,
        goal: farm.Investment?.amount ?? 0,
        investors: farm.Investment?.investorsCount ?? 0,
        roi: farm.Investment?.roi ? `${farm.Investment.roi}% return` : '',
        milestones,
        totalAllocation: totalAllocation
      });
    }

    return [...addedProjects, ...apiProjects];
  }, [farm, customProjects]);

  // If there are no projects at all, show a simplified view: only photos and documents
  if (!farmProjects || farmProjects.length === 0) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#8A9587] uppercase mb-4">
          <button
            type="button"
            onClick={onBack}
            className="hover:text-[#4E8A35] transition-colors cursor-pointer"
          >
            My Farms
          </button>
          <span>/</span>
          <span className="text-[#1F2937] normal-case">{farm.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mt-12 pt-8">
          <div className="bg-white border border-[#E9EAEB] rounded-2xl py-6 px-4 shadow-xs h-fit">
            <h2 className="text-lg font-bold text-[#1F2937] mb-4">Photos</h2>
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
              <div className="overflow-hidden rounded-2xl border border-[#E9EAEB] bg-[#F4F7EE] h-[280px] md:h-80 w-full">
                {pictures.length > 0 ? (
                  <img
                    src={pictures[0]}
                    alt="Main farm landscape"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-[#7A8077]">No photos available</div>
                )}
              </div>

              <div className="grid grid-rows-2 gap-4 h-[280px] md:h-80">
                <div className="overflow-hidden rounded-2xl border border-[#E9EAEB] bg-[#F4F7EE]">
                  {pictures[1] ? (
                    <img src={pictures[1]} alt="Farm" className="h-44 w-full object-cover md:h-full" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#7A8077]">No photo</div>
                  )}
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#E9EAEB] bg-[#F4F7EE] relative group">
                  {pictures[2] ? (
                    <img src={pictures[2]} alt="Farm" className="h-44 w-full object-cover md:h-full" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#7A8077]">No photo</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E9EAEB] rounded-2xl py-6 px-4 shadow-xs h-fit">
            <h2 className="text-lg font-bold text-[#1F2937] mb-4">Documents</h2>
            <div className="flex flex-col gap-4">
              {docs.length > 0 ? docs.map((doc: { name: string; size: string }, idx: number) => (
                <div key={idx} className="flex items-center justify-between border-b border-[#F3F4F6] last:border-b-0 pb-4 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex p-2 aspect-square items-center justify-center rounded-full bg-[#F1F9ED]">
                      <DocsIcon />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-[#1F2937] truncate max-w-[220px]">{doc.name}</div>
                      <div className="text-xs text-[#7A8077]">{doc.size}</div>
                    </div>
                  </div>
                  <a href="#" className="text-sm text-[#4E8A35]">Download</a>
                </div>
              )) : (
                <div className="text-sm text-[#7A8077]">No documents available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const activeProject = useMemo(() => {
    if (farmProjects.length === 0) return null;
    return farmProjects.find((p) => p.id === activeProjectId) || farmProjects[0];
  }, [farmProjects, activeProjectId]);

  const handleRequestFunding = (projectId: string, milestoneId: string) => {
    const isCustom = projectId.startsWith("custom-p-");
    
    toast.success("Funding request submitted successfully!");

    if (isCustom) {
      setCustomProjects((prev) => {
        const farmList = prev[farm.id] || [];
        const updated = farmList.map((proj) => {
          if (proj.id === projectId) {
            return {
              ...proj,
              milestones: proj.milestones.map((m: any) =>
                m.id === milestoneId ? { ...m, status: "Requested" } : m
              ),
            };
          }
          return proj;
        });
        return { ...prev, [farm.id]: updated };
      });
    } else {
      const projectToOverride = farmProjects.find(p => p.id === projectId);
      if (projectToOverride) {
        const updatedProject = {
          ...projectToOverride,
          milestones: projectToOverride.milestones.map((m: any) =>
            m.id === milestoneId ? { ...m, status: "Requested" } : m
          ),
        };
        setCustomProjects((prev) => {
          const farmList = prev[farm.id] || [];
          const filtered = farmList.filter(p => p.id !== projectId);
          return {
            ...prev,
            [farm.id]: [updatedProject, ...filtered],
          };
        });
      }
    }
  };

  const activeAllocationPct = useMemo(() => {
    if (!activeProject) return 0;
    // Prefer pre-computed totalAllocation on project
    if (typeof activeProject.totalAllocation === 'number') {
      return activeProject.totalAllocation;
    }
    // If no completed milestones, show sum of milestone pct as allocation
    const total = activeProject.milestones.reduce((acc: number, m: any) => acc + (Number(m.pct) || 0), 0);
    return total;
  }, [activeProject]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#8A9587] uppercase mb-4">
        <button
          type="button"
          onClick={onBack}
          className="hover:text-[#4E8A35] transition-colors cursor-pointer"
        >
          My Farms
        </button>
        <span>/</span>
        <span className="text-[#1F2937] normal-case">{farm.name}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[32px] font-bold text-[#1F2937] leading-tight">{farm.name}</h1>
            <span className="inline-flex items-center rounded-full bg-[#ECFDF5] px-2.5 py-1 text-xs font-semibold text-[#047857] gap-1 shrink-0">
              <svg className="w-3.5 h-3.5 text-[#047857]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verified
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#5E6771] mt-2 text-sm">
            <LocationIcon size={16} />
            <span>{farm.location || "Location not provided"}</span>
          </div>
        </div>
        <div>
          <button
            type="button"
            onClick={onCreateProject}
            className="inline-flex items-center gap-2 rounded-lg bg-[#4E8A35] hover:bg-[#3D6E29] px-5 py-3 text-sm font-semibold text-white transition-colors shadow-sm cursor-pointer"
          >
            <AddIcon color="#FFFFFF" size={16} />
            <span>Create Investment Project</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-[#E9EAEB] rounded-2xl p-5 shadow-xs flex flex-col justify-between relative min-h-[120px]">
          <div className="flex items-center justify-between">
            <div className="text-[#80916E] bg-[#F7FAF5] p-2 rounded-lg">
              <FarmIcon size={18} />
            </div>
            {stats.cyclesTag && (
              <span className="text-xs font-semibold text-[#4E8A35] flex items-center gap-0.5">
                ↗ {stats.cyclesTag}
              </span>
            )}
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-[#1F2937]">{stats.cycles}</span>
            <p className="text-xs font-medium text-[#5E6771] mt-1">Cycles completed</p>
          </div>
        </div>

        <div className="bg-white border border-[#E9EAEB] rounded-2xl p-5 shadow-xs flex flex-col justify-between relative min-h-[120px]">
          <div className="flex items-center justify-between">
            <div className="text-[#80916E] bg-[#F7FAF5] p-2 rounded-lg">
              <TrendingUpIcon size={18} />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-[#1F2937]">{stats.currentCycle}</span>
            <p className="text-xs font-medium text-[#5E6771] mt-1">Active Investment Project</p>
          </div>
        </div>

        <div className="bg-white border border-[#E9EAEB] rounded-2xl p-5 shadow-xs flex flex-col justify-between relative min-h-[120px]">
          <div className="flex items-center justify-between">
            <div className="text-[#80916E] bg-[#F7FAF5] p-2 rounded-lg">
              <WalletIcon size={18} />
            </div>
            {stats.fundingTag && (
              <span className="text-xs font-semibold text-[#4E8A35] flex items-center gap-0.5">
                ↗ {stats.fundingTag}
              </span>
            )}
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-[#1F2937]">{stats.funding}</span>
            <p className="text-xs font-medium text-[#5E6771] mt-1">Total funding raised</p>
          </div>
        </div>

        <div className="bg-white border border-[#E9EAEB] rounded-2xl p-5 shadow-xs flex flex-col justify-between relative min-h-[120px]">
          <div className="flex items-center justify-between">
            <div className="text-[#80916E] bg-[#F7FAF5] p-2 rounded-lg">
              <PercentIcon size={18} />
            </div>
            {stats.completionTag && (
              <span className="text-xs font-semibold text-[#4E8A35] flex items-center gap-0.5">
                ↗ {stats.completionTag}
              </span>
            )}
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-[#1F2937]">{stats.completion}</span>
            <p className="text-xs font-medium text-[#5E6771] mt-1">Completion rate</p>
          </div>
        </div>
      </div>

      {farmProjects.length > 0 && activeProject && (
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-8">
          <div className="bg-white border border-[#E9EAEB] rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E2F3DA] text-[#4E8A35]">
                    <FarmIcon size={14} />
                  </div>
                  <h3 className="text-base font-bold text-[#1F2937]">{activeProject.name}</h3>
                </div>
                <span className="text-xs font-medium text-[#5E6771] block mt-1 ml-8">{activeProject.dates}</span>
              </div>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                activeProject.status === "Active" ? "bg-[#ECFDF5] text-[#047857]" :
                activeProject.status === "Funding Started" ? "bg-[#FFFBEB] text-[#D97706]" :
                "bg-[#EFF6FF] text-[#1D4ED8]"
              }`}>
                {activeProject.status}
              </span>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center text-sm font-semibold text-[#1F2937] mb-2">
                <span>{formatCurrency(activeProject.raised)} <span className="text-xs font-medium text-[#5E6771]">of {formatCurrency(activeProject.goal)}</span></span>
                <span className="text-xs font-medium text-[#5E6771]">{activeProject.investors} investors</span>
              </div>
              <div className="h-2 rounded-full bg-[#EAECE8] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#4E8A35] transition-all duration-500"
                  style={{ width: `${Math.min(100, (activeProject.raised / activeProject.goal) * 100)}%` }}
                />
              </div>
            </div>

            {activeProject.status === "Funding Started" && (
              <div className="mt-6 bg-[#FEF3C7] border border-[#FDE68A] rounded-2xl p-4 text-xs font-semibold text-[#B45309] leading-relaxed">
                Funding has started for this investment, but the funding goal has not been reached. You can only request for funding only after funding goal has been reached
              </div>
            )}
            {activeProject.status === "Active" && (
              <div className="mt-6 bg-[#E6F4EA] border border-[#CEEAD6] rounded-2xl p-4 text-xs font-semibold text-[#137333] leading-relaxed">
                Funding has been completed for this cycle. You can proceed to request payment for your next milestone.
              </div>
            )}
            {activeProject.status === "Completed" && (
              <div className="mt-6 bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-4 text-xs font-semibold text-[#1E40AF] leading-relaxed">
                This investment cycle has been completed successfully and all payouts have been distributed.
              </div>
            )}

            <div className="mt-8">
              <h4 className="text-base font-bold text-[#1F2937]">Farm Milestone Timeline</h4>
              <p className="text-xs text-[#5E6771] mt-0.5">Activities needed to be done on the farm to complete investment cycle</p>

              <div className="mt-6 flex flex-col sm:flex-row items-center gap-6 border border-[#E9EAEB] rounded-2xl p-5 bg-[#FAFAFA]">
                <div className="relative flex items-center justify-center shrink-0">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="38" stroke="#EAECE8" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="48"
                      cy="48"
                      r="38"
                      stroke="#4E8A35"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={238}
                      strokeDashoffset={238 - (238 * activeAllocationPct) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-[#8A8F96] uppercase tracking-wider">Active</span>
                    <span className="text-base font-bold text-[#1F2937] leading-none mt-0.5">{activeAllocationPct}%</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-[#1F2937]">
                    <svg className="w-5 h-5 text-[#4E8A35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Total Allocation</span>
                  </div>
                  <p className="text-xs text-[#5E6771] mt-1 leading-normal">Milestone allocation is balanced.</p>
                </div>
              </div>

              <div className="mt-8 relative pl-6 border-l-2 border-[#EAECE8] space-y-6 ml-3">
                {activeProject.milestones.map((m: any) => {
                  const isCompleted = m.status === "Completed";
                  const isRequested = m.status === "Requested";
                  const isActionable = m.status === "Request for Funding";
                  return (
                    <div key={m.id} className="relative">
                      <span className={`absolute -left-[33px] top-7.5 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-white ${
                        isCompleted ? "border-[#4E8A35] bg-[#E2F3DA]" : "border-[#B8C3CF]"
                      }`}>
                        {isCompleted && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#4E8A35]" />
                        )}
                      </span>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#E9EAEB] rounded-2xl p-4 bg-white hover:shadow-xs transition-shadow">
                        <div>
                          <span className="text-sm font-semibold text-[#1F2937]">{m.name}</span>
                          <span className="text-xs text-[#5E6771] block mt-1">{m.pct}% – {formatCurrency(m.amount)}</span>
                        </div>
                        <div>
                          {isCompleted && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#047857] bg-[#ECFDF5] px-2.5 py-1.5 rounded-lg border border-[#A7F3D0]">
                              Completed ✓
                            </span>
                          )}
                          {isRequested && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#D97706] bg-[#FFFBEB] px-2.5 py-1.5 rounded-lg border border-[#FDE68A]">
                              Requested
                            </span>
                          )}
                          {isActionable && (
                            <button
                              type="button"
                              onClick={() => handleRequestFunding(activeProject.id, m.id)}
                              className="border border-[#D5D7DA] bg-white hover:bg-[#F4FAF0] text-[#4E8A35] hover:text-[#3D6E29] text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                            >
                              Request for Funding
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E9EAEB] rounded-2xl py-6 px-4 shadow-xs h-fit">
            <h3 className="text-lg font-bold text-[#1F2937] mb-4">Investment History</h3>
            <div className="flex flex-col gap-4">
              {farmProjects.map((p) => {
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActiveProjectId(p.id)}
                    className={`w-full text-left bg-white border rounded-2xl p-5 transition-all hover:shadow-md cursor-pointer block border-[#E9EAEB]`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-xs font-medium text-[#5E6771] block">{p.dates}</span>
                        <span className="text-sm font-bold text-[#1F2937] block mt-1">{p.name}</span>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        p.status === "Active" ? "bg-[#ECFDF5] text-[#047857]" :
                        p.status === "Funding Started" ? "bg-[#FFFBEB] text-[#D97706]" :
                        "bg-[#EFF6FF] text-[#1D4ED8]"
                      }`}>
                        {p.status}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-[11px] font-medium text-[#5E6771] mb-1">
                        <span>{formatCurrency(p.raised)} <span className="opacity-70">of {formatCurrency(p.goal)}</span></span>
                        <span>{p.investors} investors</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#EAECE8] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#4E8A35]"
                          style={{ width: `${Math.min(100, (p.raised / p.goal) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#4E8A35]">
                      <TrendingUpIcon size={14} />
                      <span>{p.roi}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mt-12 pt-8">
        <div className="bg-white border border-[#E9EAEB] rounded-2xl py-6 px-4 shadow-xs h-fit">
          <h2 className="text-lg font-bold text-[#1F2937] mb-4">Photos</h2>
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
            <div className="overflow-hidden rounded-2xl border border-[#E9EAEB] bg-[#F4F7EE] h-[280px] md:h-80 w-full">
              {pictures.length > 0 ? (
                <img
                  src={pictures[0]}
                  alt="Main farm landscape"
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-[#8A9587]">No photos uploaded</div>
              )}
            </div>

            <div className="grid grid-rows-2 gap-4 h-[280px] md:h-80">
              <div className="overflow-hidden rounded-2xl border border-[#E9EAEB] bg-[#F4F7EE]">
                {pictures.length > 1 ? (
                  <img
                    src={pictures[1]}
                    alt="Farm detail 1"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-[#8A9587]">No photo</div>
                )}
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#E9EAEB] bg-[#F4F7EE] relative group">
                {pictures.length > 2 ? (
                  <>
                    <img
                      src={pictures[2]}
                      alt="Farm detail 2"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#1E3517]/75 flex flex-col items-center justify-center text-white transition-colors duration-300 group-hover:bg-[#1E3517]/80 cursor-pointer">
                      <span className="text-[20px] font-bold">
                        +12 Photos
                      </span>
                      <span className="text-[10px] opacity-90 font-medium mt-0.5">
                        Click to View Gallery
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-[#8A9587]">No photo</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E9EAEB] rounded-2xl py-6 px-4 shadow-xs h-fit">
          <h2 className="text-lg font-bold text-[#1F2937] mb-4">Documents</h2>
          <div className="flex flex-col gap-4">
            {docs.length > 0 ? docs.map((doc: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between border-b border-[#F3F4F6] last:border-b-0 pb-4 last:pb-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex p-2 items-center justify-center rounded-full bg-[#E2F3DA] text-[#4E8A35]">
                    <DocsIcon size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-[#1F2937] block truncate max-w-[220px]">{doc.name}</span>
                    <span className="text-[11px] font-medium text-[#7A828E] uppercase tracking-wider block mt-0.5">{doc.size ? `PDF ${doc.size}` : 'PDF'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  {doc.url ? (
                    <a href={doc.url} target="_blank" rel="noreferrer" className="text-sm text-[#4E8A35]">Download</a>
                  ) : (
                    <span className="text-sm text-[#7A8077]">No file link</span>
                  )}
                </div>
              </div>
            )) : (
              <div className="flex items-center justify-center py-8 text-sm text-[#7A8077]">
                No documents uploaded for this farm
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface CreateProjectFlowProps {
  farm: any;
  onBackToFarm: () => void;
  projectStep: 1 | 2 | 3 | 'success';
  setProjectStep: (step: 1 | 2 | 3 | 'success') => void;
  projectCategory: string;
  setProjectCategory: (category: string) => void;
  projectMilestones: SelectedMilestone[];
  setProjectMilestones: React.Dispatch<React.SetStateAction<SelectedMilestone[]>>;
  projectGoal: string;
  setProjectGoal: (goal: string) => void;
  projectAgreed: boolean;
  setProjectAgreed: (agreed: boolean) => void;
  farmCategories: SelectOptions[];
  isFarmCategoriesLoading: boolean;
  milestonesList: any[];
  milestoneOptions: any[];
  activeTemplate: any;
  selectedCategoryName: string;
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
}

const CreateProjectFlow = ({
  farm,
  onBackToFarm,
  projectStep,
  setProjectStep,
  projectCategory,
  setProjectCategory,
  projectMilestones,
  setProjectMilestones,
  projectGoal,
  setProjectGoal,
  projectAgreed,
  setProjectAgreed,
  farmCategories,
  isFarmCategoriesLoading,
  milestonesList,
  milestoneOptions,
  activeTemplate,
  selectedCategoryName,
  isSubmitting,
  onSubmit,
}: CreateProjectFlowProps) => {
  const [isCardExpanded, setIsCardExpanded] = useState(true);

  const toggleProjectMilestone = (milestoneId: string) => {
    setProjectMilestones((prev) => {
      const exists = prev.some((item) => item.milestoneId === milestoneId);
      if (exists) {
        return prev.filter((item) => item.milestoneId !== milestoneId);
      }
      return [...prev, { milestoneId, amount: "" }];
    });
  };

  const numericStep = typeof projectStep === 'number' ? projectStep : 4;
  const projectProgressWidth = numericStep === 1 ? "33%" : numericStep === 2 ? "66%" : "100%";

  const overviewDetails = getCategoryOverviewDetails(selectedCategoryName, milestonesList.length, activeTemplate);

  const roi = activeTemplate?.fundingRules?.roi ?? activeTemplate?.roi ?? 42.0;
  const durationLabel = overviewDetails.duration !== "-" ? overviewDetails.duration : "14 Months";
  const startDateLabel = overviewDetails.startDate !== "-" ? overviewDetails.startDate : "2 Aug, 2026";
  const endDateLabel = overviewDetails.endDate !== "-" ? overviewDetails.endDate : "22 Mar, 2027";

  if (projectStep === 'success') {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="w-full max-w-[620px] rounded-3xl bg-white border border-[#E9EAEB] shadow-[0_12px_36px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="flex flex-col items-center justify-center pt-10 pb-6 text-center px-6">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#ECFDF3]">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D1FADF]">
                <div className="text-[#039855]">
                  <CheckIcon size={28} color="currentColor" />
                </div>
              </div>
            </div>
            <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-semibold text-[#047857] flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-[#047857]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Project Confirmed
            </span>
            <h2 className="text-[22px] font-bold text-[#1F2937] mt-4">Investment Project Creation Successful</h2>
            <p className="mt-2 text-sm text-[#5E6771] max-w-[480px]">
              Your investment project for <strong className="font-semibold text-gray-900">{farm.name}</strong> has been created successfully and is now open to investors.
            </p>
          </div>

          <div className="px-8 pb-8 pt-4 border-t border-[#F3F4F6] bg-[#FAFAFA]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-[#E9EAEB] rounded-2xl p-4 shadow-xs flex items-center gap-3">
                <div className="text-[#80916E] bg-[#F7FAF5] p-2 rounded-lg shrink-0">
                  <FarmIcon size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#8A8F96] uppercase tracking-wider block">Farm Name</span>
                  <span className="text-sm font-semibold text-[#1F2937] block mt-0.5">{farm.name}</span>
                </div>
              </div>

              <div className="bg-white border border-[#E9EAEB] rounded-2xl p-4 shadow-xs flex items-center gap-3">
                <div className="text-[#80916E] bg-[#F7FAF5] p-2 rounded-lg shrink-0">
                  <TrendingUpIcon size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#8A8F96] uppercase tracking-wider block">Funding Goal</span>
                  <span className="text-sm font-semibold text-[#1F2937] block mt-0.5">{formatCurrency(projectGoal)}</span>
                </div>
              </div>

              <div className="bg-white border border-[#E9EAEB] rounded-2xl p-4 shadow-xs flex items-center gap-3">
                <div className="text-[#80916E] bg-[#F7FAF5] p-2 rounded-lg shrink-0">
                  <PercentIcon size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#8A8F96] uppercase tracking-wider block">ROI</span>
                  <span className="text-sm font-semibold text-[#1F2937] block mt-0.5">{parseFloat(String(roi)).toFixed(1)}%</span>
                </div>
              </div>

              <div className="bg-white border border-[#E9EAEB] rounded-2xl p-4 shadow-xs flex items-center gap-3">
                <div className="text-[#80916E] bg-[#F7FAF5] p-2 rounded-lg shrink-0">
                  <ClockIcon size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#8A8F96] uppercase tracking-wider block">Duration</span>
                  <span className="text-sm font-semibold text-[#1F2937] block mt-0.5">{durationLabel}</span>
                </div>
              </div>

              <div className="bg-white border border-[#E9EAEB] rounded-2xl p-4 shadow-xs flex items-center gap-3">
                <div className="text-[#80916E] bg-[#F7FAF5] p-2 rounded-lg shrink-0">
                  <CalendarIcon size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#8A8F96] uppercase tracking-wider block">Investment Start Date</span>
                  <span className="text-sm font-semibold text-[#1F2937] block mt-0.5">{startDateLabel}</span>
                </div>
              </div>

              <div className="bg-white border border-[#E9EAEB] rounded-2xl p-4 shadow-xs flex items-center gap-3">
                <div className="text-[#80916E] bg-[#F7FAF5] p-2 rounded-lg shrink-0">
                  <CalendarIcon size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#8A8F96] uppercase tracking-wider block">Investment End Date</span>
                  <span className="text-sm font-semibold text-[#1F2937] block mt-0.5">{endDateLabel}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
              <button
                type="button"
                onClick={onBackToFarm}
                className="w-full sm:flex-1 inline-flex items-center justify-center rounded-lg bg-[#4E8A35] hover:bg-[#3D6E29] px-6 py-3.5 text-sm font-semibold text-white transition-colors cursor-pointer shadow-sm"
              >
                GO BACK TO FARM
              </button>
              <button
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-[#D5D7DA] bg-white hover:bg-gray-50 px-6 py-3.5 text-sm font-semibold text-[#374151] transition-colors cursor-pointer"
              >
                <DownloadIcon size={18} />
                <span>DOWNLOAD AGREEMENT</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#8A9587] uppercase mb-4">
        <button
          type="button"
          onClick={onBackToFarm}
          className="hover:text-[#4E8A35] transition-colors cursor-pointer"
        >
          My Farms
        </button>
        <span>/</span>
        <span className="text-[#8A9587]">{farm.name}</span>
        <span>/</span>
        <span className="text-[#1F2937] normal-case">Create Investment Cycle</span>
      </div>

      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-[#1F2937] leading-tight">Create Investment Project</h1>
        <p className="text-sm text-[#5E6771] mt-1.5">Create an investment cycle to get an investment on your farm project</p>
      </div>

      <section className="overflow-hidden rounded-xl border border-[#EAECE8] bg-white">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
          <aside className="border-b border-[#EAECE8] p-5 sm:p-6 md:border-b-0 md:border-r">
            <div className="flex items-center justify-between gap-3 md:flex-col md:items-start md:gap-0 md:space-y-0.5">
              <StepItem title="Category" done={numericStep >= 2 || projectCategory !== ""} className="flex-1 md:flex-none" />
              <p className="ml-2 hidden text-[#9CC98A] md:block">:</p>
              <StepItem title="Milestones" done={numericStep >= 3} className="flex-1 md:flex-none" />
              <p className="ml-2 hidden text-[#9CC98A] md:block">:</p>
              <StepItem title="Goal" done={false} className="flex-1 md:flex-none" />
            </div>
          </aside>

          <div>
            <div className="border-b border-[#EAECE8] px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-[#1F2937]">
                  {projectStep === 1 && "Farm Category"}
                  {projectStep === 2 && "Farm Milestones"}
                  {projectStep === 3 && "Funding Goal"}
                </h2>
              </div>
              <div className="mt-3 h-1 rounded-full bg-[#BEDCB0]">
                <div className="h-1 rounded-full bg-[#64B03F] transition-all" style={{ width: projectProgressWidth }} />
              </div>
            </div>

            <div className="px-5 py-6 sm:px-6 md:max-h-[500px] md:overflow-y-auto">
              {projectStep === 1 && (
                <div className="max-w-3xl space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#8A8F96] uppercase tracking-wider mb-2">Select Farm Category</label>
                    <Select
                      value={projectCategory}
                      onChange={(event) => setProjectCategory(event.target.value)}
                      placeholder="Select Farm Category"
                      options={farmCategories}
                    />
                  </div>

                  {isFarmCategoriesLoading && (
                    <p className="text-sm text-[#6B7280]">Loading farm categories...</p>
                  )}

                  {projectCategory && (
                    <>
                      <div className="border border-[#EAECE8] rounded-2xl bg-white shadow-xs p-6">
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
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <ChevronIcon
                              className={`transform transition-transform ${isCardExpanded ? "" : "rotate-180"}`}
                              size={16}
                            />
                          </button>
                        </div>
                        {isCardExpanded && (
                          <div className="mt-6 border-t border-[#EAECE8] pt-6 space-y-6">
                            <div>
                              <div className="text-[10px] font-bold text-[#8A8F96] tracking-wider mb-3">
                                PROGRAMME OVERVIEW
                              </div>

                              <div className="md:rounded-[12px] md:border md:border-[#E5E9E0] md:bg-[#FFFFFF] md:p-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="flex flex-col gap-1.5 rounded-[12px] bg-[#F7FAF5] px-4 py-3">
                                    <div className="flex items-center gap-1.5">
                                      <ClockIcon size={14} color="#80916E" />
                                      <span className="text-[10px] font-bold text-[#8A9587] uppercase tracking-[0.08em]">Duration</span>
                                    </div>
                                    <span className="text-sm font-semibold text-[#1F2937] mt-0.5">{overviewDetails.duration}</span>
                                  </div>

                                  <div className="flex flex-col gap-1.5 rounded-[12px] bg-[#F7FAF5] px-4 py-3">
                                    <div className="flex items-center gap-1.5">
                                      <WalletIcon size={14} color="#80916E" />
                                      <span className="text-[10px] font-bold text-[#8A9587] uppercase tracking-[0.08em]">Minimum Funding Range</span>
                                    </div>
                                    <span className="text-sm font-semibold text-[#1F2937] mt-0.5">{overviewDetails.fundingRange}</span>
                                  </div>

                                  <div className="flex flex-col gap-1.5 rounded-[12px] bg-[#F7FAF5] px-4 py-3">
                                    <div className="flex items-center gap-1.5">
                                      <LayersIcon size={14} color="#80916E" />
                                      <span className="text-[10px] font-bold text-[#8A9587] uppercase tracking-[0.08em]">Funding Stages</span>
                                    </div>
                                    <span className="text-sm font-semibold text-[#1F2937] mt-0.5">{overviewDetails.stagesCount}</span>
                                  </div>

                                  <div className="flex flex-col gap-1.5 rounded-[12px] bg-[#F7FAF5] px-4 py-3">
                                    <div className="flex items-center gap-1.5">
                                      <FarmIcon size={14} color="#80916E" />
                                      <span className="text-[10px] font-bold text-[#8A9587] uppercase tracking-[0.08em]">Crop Category</span>
                                    </div>
                                    <span className="text-sm font-semibold text-[#1F2937] mt-0.5">{overviewDetails.cropCategory}</span>
                                  </div>

                                  <div className="flex flex-col gap-1.5 rounded-[12px] bg-[#F7FAF5] px-4 py-3">
                                    <div className="flex items-center gap-1.5">
                                      <CalendarIcon size={14} color="#80916E" />
                                      <span className="text-[10px] font-bold text-[#8A9587] uppercase tracking-[0.08em]">Investment Start Date</span>
                                    </div>
                                    <span className="text-sm font-semibold text-[#1F2937] mt-0.5">{overviewDetails.startDate}</span>
                                  </div>

                                  <div className="flex flex-col gap-1.5 rounded-[12px] bg-[#F7FAF5] px-4 py-3">
                                    <div className="flex items-center gap-1.5">
                                      <CalendarIcon size={14} color="#80916E" />
                                      <span className="text-[10px] font-bold text-[#8A9587] uppercase tracking-[0.08em]">Investment End Date</span>
                                    </div>
                                    <span className="text-sm font-semibold text-[#1F2937] mt-0.5">{overviewDetails.endDate}</span>
                                  </div>
                                </div>

                                <div className="mt-4 rounded-[12px] bg-[#D9F8DC] p-4 text-xs font-semibold leading-relaxed text-[#013611]">
                                  Note: <strong className="font-bold">Funding goal</strong> for this farm category must be reached on or before the <strong className="font-bold">Investment End Date.</strong> If the funding goal is not reached by this date, <strong className="font-bold">investments will be reimbursed back to the investors and the farm funding will be closed.</strong>
                                </div>
                              </div>
                            </div>

                            <div>
                              <div className="text-[10px] font-bold text-[#8A8F96] tracking-wider mb-4">
                                FUNDING MILESTONES
                              </div>
                              <div className="space-y-3">
                                {milestonesList.map((m: any, idx: number, arr: any[]) => {
                                  const pct = getResolvedMilestonePercentage(m, idx, arr.length, activeTemplate?.milestones);
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

                      <Button
                        variant="primary"
                        disabled={!projectCategory}
                        className="rounded-lg text-sm px-6 py-2.5"
                        onClick={() => setProjectStep(2)}
                      >
                        CONTINUE
                      </Button>
                    </>
                  )}
                </div>
              )}

              {projectStep === 2 && (
                <div className="max-w-3xl space-y-5">
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
                        const selectedMilestone = projectMilestones.find((item) => item.milestoneId === option.id);
                        const checked = Boolean(selectedMilestone);
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => toggleProjectMilestone(option.id)}
                            className={`flex w-full min-h-11 items-center gap-3 rounded-md border bg-transparent px-4 py-3 text-left transition-colors cursor-pointer ${checked
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

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="light"
                      className="rounded-md bg-[#E0E0E0] text-sm"
                      onClick={() => setProjectStep(1)}
                    >
                      BACK
                    </Button>
                    <Button
                      variant="primary"
                      disabled={projectMilestones.length === 0}
                      className="rounded-md text-sm"
                      onClick={() => setProjectStep(3)}
                    >
                      CONTINUE
                    </Button>
                  </div>
                </div>
              )}

              {projectStep === 3 && (
                <div className="max-w-3xl space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-[#1F2937]">
                      Funding Goal
                    </label>
                    <Input
                      id="project-goal"
                      placeholder="Enter Amount Needed For this Farm"
                      value={projectGoal}
                      onChange={(event) => setProjectGoal(event.target.value)}
                      type="text"
                      inputMode="numeric"
                      className="rounded-md border-[#D5D7DA] py-3.5 text-sm text-[#374151] placeholder:text-[#9AA0A6] focus:ring-0 focus:border-[#8FB57F]"
                    />
                  </div>

                  <div className="flex items-start gap-3 rounded-lg border-2 border-[#187E36] bg-[#D9F8DC] px-4 py-3.5 text-left transition-colors">
                    <button
                      type="button"
                      onClick={() => setProjectAgreed(!projectAgreed)}
                      className={`flex h-5 w-5 mt-0.5 shrink-0 items-center justify-center rounded-sm border cursor-pointer ${projectAgreed ? "border-[#187E36] bg-[#187E36] text-white" : "border-[#8A93A4] text-transparent"
                        }`}
                    >
                      ✓
                    </button>
                    <span className="text-xs font-semibold text-[#1F2937] select-none leading-relaxed">
                      I understand how this investment programme works and agree to the milestone-based funding process
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="light"
                      className="rounded-md bg-[#E0E0E0] text-sm"
                      onClick={() => setProjectStep(2)}
                    >
                      BACK
                    </Button>
                    <Button
                      variant="primary"
                      disabled={!projectAgreed || !projectGoal || Number(projectGoal.replace(/\D/g, "")) <= 0}
                      className="rounded-md text-sm"
                      onClick={onSubmit}
                      isLoading={isSubmitting}
                    >
                      CREATE INVESTMENT PROJECT
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const normalizeKycStatus = (status?: string) => status?.trim().toLowerCase().replace(/\s+/g, "_") ?? "";

const formatCurrency = (val: string | number) => {
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num)) return '₦0';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num).replace('NGN', '₦');
};

const formatDuration = (monthsStr: string | number) => {
  const months = typeof monthsStr === 'number' ? monthsStr : parseInt(monthsStr);
  if (isNaN(months)) return '';
  if (months % 12 === 0) {
    const years = months / 12;
    return `${years} ${years === 1 ? 'Year' : 'Years'}`;
  }
  return `${months} ${months === 1 ? 'Month' : 'Months'}`;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
};

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

const getResolvedMilestonePercentage = (
  milestone: any,
  index: number,
  total: number,
  templateMilestones?: any[]
) => {
  if (milestone && typeof milestone.fundReleasePercentage === "number") {
    return milestone.fundReleasePercentage;
  }
  if (milestone && typeof milestone.allocation === "number") {
    return milestone.allocation;
  }

  if (templateMilestones) {
    const matched = templateMilestones.find(
      (m: any) => m.id === milestone?.id || m.name === milestone?.name
    );
    if (matched) {
      if (typeof matched.fundReleasePercentage === "number") {
        return matched.fundReleasePercentage;
      }
      if (typeof matched.allocation === "number") {
        return matched.allocation;
      }
    }
  }

  return getMilestonePercentage(milestone?.name || "", index, total);
};

const getCategoryOverviewDetails = (
  categoryName: string,
  milestonesCount: number,
  template?: any
) => {
  if (!template) {
    return {
      duration: "-",
      fundingRange: "-",
      stagesCount: `${milestonesCount} milestones`,
      cropCategory: categoryName,
      startDate: "-",
      endDate: "-",
    };
  }

  let formattedDuration = "-";
  if (template.duration && typeof template.duration === "object") {
    formattedDuration = template.duration.label ?? `${template.duration.value} ${template.duration.unit}`;
  } else {
    const durationVal = template.durationValue ?? template.duration ?? 0;
    formattedDuration = durationVal ? formatDuration(durationVal) : "-";
  }

  const minFundingVal = template.fundingRules?.minGoal ?? template.minFunding ?? 0;
  const maxFundingVal = template.fundingRules?.maxGoal ?? template.maxFunding ?? 0;
  
  let fundingRange = "-";
  if (minFundingVal || maxFundingVal) {
    fundingRange = `${formatCurrency(minFundingVal)} – ${formatCurrency(maxFundingVal)}`;
  }

  const startDate = template.startDate ? formatDate(template.startDate) : (template.createdAt ? formatDate(template.createdAt) : "-");
  const endDate = template.endDate ? formatDate(template.endDate) : "-";

  return {
    duration: formattedDuration,
    fundingRange,
    stagesCount: `${milestonesCount || template.milestones?.length || 0} milestones`,
    cropCategory: categoryName,
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
  const [selectedFarmForDetails, setSelectedFarmForDetails] = useState<any | null>(null);

  // Create Investment Project sub-flow states
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectStep, setProjectStep] = useState<1 | 2 | 3 | 'success'>(1);
  const [projectCategory, setProjectCategory] = useState("");
  const [projectMilestones, setProjectMilestones] = useState<SelectedMilestone[]>([]);
  const [projectGoal, setProjectGoal] = useState("");
  const [projectAgreed, setProjectAgreed] = useState(false);
  const [customProjects, setCustomProjects] = useState<Record<string, any[]>>({});

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

  const photoInputRef = useRef<HTMLInputElement>(null);
  const photoCaptureRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const { data: farmsResponse, isLoading: isFarmsLoading } = useGetFarms({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    search,
  });
  const { data: kycStatusResponse, isLoading: isKycStatusLoading } = useGetKycStatus();
  const activeCategoryId = isCreatingProject ? projectCategory : farmCategory;

  const { data: farmCategoriesResponse, isLoading: isFarmCategoriesLoading } = useGetFarmCategories();
  const { data: milestonesResponse } = useGetWebMilestonesByCategory(activeCategoryId || undefined);
  const { data: investmentTemplateResponse } = useGetWebInvestmentTemplate(activeCategoryId || undefined);

  const createFarmMutation = useCreateFarm();
  const updateFarmMutation = useUpdateFarm();
  const addMilestonesMutation = useAddMilestonesToFarm();
  const uploadDocumentsMutation = useUploadDocToFarm();
  const { data: farmDetailsResponse } = useGetFarmById(selectedFarmForDetails?.id);
  const selectedFarmDetails = farmDetailsResponse?.data || selectedFarmForDetails;

  const isSubmittingFarm =
    createFarmMutation.isPending || updateFarmMutation.isPending || addMilestonesMutation.isPending || uploadDocumentsMutation.isPending;

  const farmCategories = useMemo<SelectOptions[]>(() => {
    const categories = farmCategoriesResponse?.data?.categories ?? [];

    return categories.map((category) => ({
      label: category.name,
      value: category.id,
    }));
  }, [farmCategoriesResponse?.data?.categories]);

  useEffect(() => {
    if (!farmCategory && farmCategories.length > 0) {
      setFarmCategory(String(farmCategories[0].value ?? ""));
    }
  }, [farmCategories, farmCategory]);

  const investmentTemplate = useMemo(() => {
    const rawData = investmentTemplateResponse?.data;
    if (!rawData) return null;
    if (Array.isArray(rawData)) {
      return rawData[0] || null;
    }
    if (typeof rawData === "object") {
      if ("template" in rawData) return rawData.template;
      if ("investmentTemplate" in rawData) return rawData.investmentTemplate;
      if ("templates" in rawData && Array.isArray(rawData.templates)) {
        return rawData.templates[0] || null;
      }
      if ("investmentTemplates" in rawData && Array.isArray(rawData.investmentTemplates)) {
        return rawData.investmentTemplates[0] || null;
      }
      return rawData;
    }
    return null;
  }, [investmentTemplateResponse]);

  const selectedCategoryTemplate = useMemo(() => {
    const categories = farmCategoriesResponse?.data?.categories ?? [];
    const cat = categories.find((c) => c.id === activeCategoryId);
    return cat?.investmentTemplate || cat?.investmentTemplates?.[0] || null;
  }, [farmCategoriesResponse, activeCategoryId]);

  const activeTemplate = useMemo(() => {
    return investmentTemplate || selectedCategoryTemplate;
  }, [investmentTemplate, selectedCategoryTemplate]);

  const milestonesList = useMemo(() => {
    return milestonesResponse?.data?.milestones ?? activeTemplate?.milestones ?? [];
  }, [milestonesResponse, activeTemplate]);

  const milestoneOptions = useMemo(() => {
    const milestones = milestonesList;

    return Array.isArray(milestones)
      ? milestones.map((milestone: MilestoneResponse) => ({
        id: milestone.id,
        name: milestone.name || "Unnamed milestone",
      }))
      : [];
  }, [milestonesList]);

  const selectedCategoryName = useMemo(() => {
    const categories = farmCategoriesResponse?.data?.categories ?? [];
    const cat = categories.find((c) => c.id === activeCategoryId);
    return cat?.name || "Vegetable";
  }, [farmCategoriesResponse, activeCategoryId]);

  const filteredFarms = useMemo(() => {
    const farms = farmsResponse?.data?.farms ?? [];

    return farms.map((farm) => ({
      ...farm,
      id: farm.id,
      name: farm.name,
      category: farm.Category?.name || "Uncategorized",
      // keep legacy status for compatibility, but prefer verificationStatus when available
      status: farm.verificationStatus
        ? String(farm.verificationStatus)
        : (farm.stats?.completionPercentage === 100 ? "Approved" : "Pending"),
      verificationStatus: farm.verificationStatus ?? undefined,
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

  const resetProjectForm = () => {
    setIsCreatingProject(false);
    setProjectStep(1);
    setProjectCategory("");
    setProjectMilestones([]);
    setProjectGoal("");
    setProjectAgreed(false);
  };

  const handleCreateProjectSubmit = async () => {
    if (!selectedFarmForDetails) return;
    const farmId = selectedFarmForDetails.id;
    try {
      if (projectCategory && projectCategory !== selectedFarmForDetails.farmCategoryId) {
        await updateFarmMutation.mutateAsync({
          farmId,
          payload: {
            farmCategoryId: projectCategory,
          },
        });
      }

      const numericGoal = Number(projectGoal.replace(/\D/g, ""));
      const totalWeight = projectMilestones.reduce((acc, item) => {
        const milestoneObj = milestonesList.find((m: any) => m.id === item.milestoneId);
        const weight = milestoneObj?.releasePercentage ?? 0;
        return acc + weight;
      }, 0);

      const milestonesPayload = projectMilestones.map((item) => {
        const milestoneObj = milestonesList.find((m: any) => m.id === item.milestoneId);
        const pct = milestoneObj?.releasePercentage ?? 0;
        const calculatedAmount = totalWeight > 0 ? Math.round((numericGoal * pct) / totalWeight) : 0;
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

      toast.success("Investment project created successfully!");
      queryClient.invalidateQueries({ queryKey: ["farms"] });

      const existingProjectsCount = (selectedFarmForDetails.Investment || (selectedFarmForDetails.SelectedMilestones && selectedFarmForDetails.SelectedMilestones.length > 0)) ? 1 : 0;
      const addedProjects = customProjects[farmId] || [];
      const totalCount = existingProjectsCount + addedProjects.length;
      const roi = activeTemplate?.fundingRules?.roi ?? activeTemplate?.roi ?? 42.0;

      const newProject = {
        id: `custom-p-${Date.now()}`,
        name: `Investment Project ${totalCount + 1} - ${selectedCategoryName}`,
        categoryName: selectedCategoryName,
        status: "Funding Started" as const,
        dates: `${new Date().toLocaleString('en-US', {month: 'short'})} ${new Date().getFullYear()} - ${new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toLocaleString('en-US', {month: 'short'})} ${new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).getFullYear()}`,
        raised: 0,
        goal: numericGoal,
        investors: 0,
        roi: `${parseFloat(String(roi)).toFixed(1)}% return`,
        milestones: projectMilestones.map((item, idx) => {
          const milestoneObj = milestonesList.find((m: any) => m.id === item.milestoneId);
          const pct = milestoneObj?.releasePercentage ?? 0;
          const calculatedAmount = totalWeight > 0 ? Math.round((numericGoal * pct) / totalWeight) : 0;
          return {
            id: item.milestoneId,
            name: milestoneObj?.name || `Milestone ${idx + 1}`,
            pct,
            amount: calculatedAmount,
            status: "Request for Funding" as const
          };
        })
      };

      setCustomProjects(prev => ({
        ...prev,
        [farmId]: [newProject, ...(prev[farmId] || [])]
      }));

      setProjectStep('success');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create investment project.");
    }
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
  const canSubmit = photos.length > 0 && documents.length > 0;

  const handleSubmitFarm = async () => {
    if (!canSubmit) return;

    try {
      const createdFarm = await createFarmMutation.mutateAsync({
        name: farmName.trim(),
        size: Number(farmSize.replace(/\D/g, "")) || undefined,
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
          const milestone = milestonesList.find((m: any) => m.id === item.milestoneId);
          const index = milestonesList.findIndex((m: any) => m.id === item.milestoneId);
          const pct = getResolvedMilestonePercentage(milestone, index >= 0 ? index : 0, milestonesList.length || 5, activeTemplate?.milestones);
          return sum + pct;
        }, 0) || 100;

        const milestonesPayload = selectedMilestones.map((item) => {
          const milestone = milestonesList.find((m: any) => m.id === item.milestoneId);
          const index = milestonesList.findIndex((m: any) => m.id === item.milestoneId);
          const pct = getResolvedMilestonePercentage(milestone, index >= 0 ? index : 0, milestonesList.length || 5, activeTemplate?.milestones);
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

  const progressWidth = step === 1 ? "50%" : "100%";

  const columns: Column<FarmRecord>[] = [
    {
      header: "Farm Name",
      key: "name",
      render: (farm) => {
        const { cycles } = getInvestmentDetails(farm);
        return (
          <div className="flex flex-col py-1">
            <span className="text-sm font-semibold text-[#1F2937]">{farm.name}</span>
            <span className="text-xs text-[#7A828E] mt-0.5">{cycles} Investment Cycles</span>
          </div>
        );
      },
    },
    {
      header: "Verification Status",
      key: "status",
      render: (farm) => {
        const { verificationStatus } = getInvestmentDetails(farm);
        if (verificationStatus === "Pending") {
          return (
            <span className="inline-flex items-center rounded-full bg-[#F3F4F6] px-2.5 py-1 text-xs font-semibold text-[#4B5563]">
              Pending
            </span>
          );
        }
        return (
          <span className="inline-flex items-center rounded-full bg-[#ECFDF5] px-2.5 py-1 text-xs font-semibold text-[#047857]">
            Verified
          </span>
        );
      },
    },
    {
      header: "Investment Status",
      key: "investmentStatus",
      render: (farm) => {
        const { investmentStatus, cycles } = getInvestmentDetails(farm);
        const completedCount = Number(cycles) || 0;

        const badgeStyles: Record<string, string> = {
          "Not Started": "bg-[#F3F4F6] text-[#374151]",
          "Funding Started": "bg-[#FFFBEB] text-[#D97706]",
          "Active": "bg-[#ECFDF5] text-[#047857]",
          "Completed": "bg-[#EFF6FF] text-[#1D4ED8]",
        };

        const mainStyle = badgeStyles[investmentStatus] || "bg-[#F3F4F6] text-[#374151]";

        return (
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${mainStyle}`}>
              {investmentStatus}
            </span>
            {completedCount > 0 && investmentStatus !== "Completed" && (
              <span className="inline-flex items-center rounded-full bg-[#EFF6FF] px-2.5 py-1 text-xs font-semibold text-[#1D4ED8]">
                {completedCount} Completed
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "Action",
      key: "actions",
      render: (farm) => (
        <FarmActionCell
          farm={farm}
          onViewDetails={() => setSelectedFarmForDetails(farm)}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F9FB] w-full">
      <MainHeader activeTab="my-farms" />

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        {isCreatingProject ? (
          <CreateProjectFlow
            farm={selectedFarmForDetails}
            onBackToFarm={resetProjectForm}
            projectStep={projectStep}
            setProjectStep={setProjectStep}
            projectCategory={projectCategory}
            setProjectCategory={setProjectCategory}
            projectMilestones={projectMilestones}
            setProjectMilestones={setProjectMilestones}
            projectGoal={projectGoal}
            setProjectGoal={setProjectGoal}
            projectAgreed={projectAgreed}
            setProjectAgreed={setProjectAgreed}
            farmCategories={farmCategories}
            isFarmCategoriesLoading={isFarmCategoriesLoading}
            milestonesList={milestonesList}
            milestoneOptions={milestoneOptions}
            activeTemplate={activeTemplate}
            selectedCategoryName={selectedCategoryName}
            isSubmitting={isSubmittingFarm}
            onSubmit={handleCreateProjectSubmit}
          />
        ) : selectedFarmForDetails ? (
          <FarmDetailsView
            farm={selectedFarmDetails}
            onBack={() => setSelectedFarmForDetails(null)}
            customProjects={customProjects}
            setCustomProjects={setCustomProjects}
            onCreateProject={() => {
              setProjectCategory(selectedFarmForDetails.farmCategoryId || "");
              setIsCreatingProject(true);
              setProjectStep(1);
            }}
          />
        ) : !showAddFarm ? (
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
        ) : (
          <section className="overflow-hidden rounded-xl border border-[#EAECE8] bg-white">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
              <aside className="border-b border-[#EAECE8] p-5 sm:p-6 md:border-b-0 md:border-r">
                <div className="flex items-center justify-between gap-3 md:flex-col md:items-start md:gap-0 md:space-y-0.5">
                  <StepItem title="Details" done={step >= 1} className="flex-1 md:flex-none" />
                  <p className="ml-2 hidden text-[#9CC98A] md:block">:</p>
                  <StepItem title="Documentation" done={step >= 2} className="flex-1 md:flex-none" />
                </div>
              </aside>

              <div>
                <div className="border-b border-[#EAECE8] px-5 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-[#1F2937]">Add Farm</h2>
                    <span className="rounded-full bg-[#E2F3DA] px-3 py-1 text-xs font-semibold text-[#4E8A35]">
                      {step === 1 ? "Farm Details" : "Farm Documentation"}
                    </span>
                  </div>
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
                        label="Enter Farm Size in plot"
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
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="flex p-2 aspect-square items-center justify-center rounded-full bg-[#D4EDC8]">
                                  <DocsIcon />
                                </div>
                                <span className="text-sm text-[#1F2937] truncate max-w-[220px]">{doc.name}</span>
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
                        <Button variant="light" className="rounded-md bg-[#E0E0E0] text-sm" onClick={() => setStep(1)}>
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

        {showAddFarm && !selectedFarmForDetails && (
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
