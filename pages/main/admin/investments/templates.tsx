'use client'

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AddIcon, FarmIcon, TickIcon, CloseIcon } from '@/components/icons';
import { Button, Typography, Input } from '@/components/ui';
import { FarmCategoryModal, Modal } from '@/components/modal';
import { 
  useCreateCategory, 
  useGetCategories,
  useGetInvestments,
  useCreateInvestment,
  useUpdateInvestment
} from '@/mutation';
import { FarmCategoryResponse } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

interface Milestone {
  id: string;
  name: string;
  allocation: number;
}

interface InvestmentTemplate {
  id?: string;
  roi: string;
  duration: string;
  minFunding: string;
  maxFunding: string;
  minInvestment: string;
  maxInvestment: string;
  startDate: string;
  endDate: string;
  milestones: Milestone[];
}

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

const formatDuration = (monthsStr: string) => {
  const months = parseInt(monthsStr);
  if (isNaN(months)) return '';
  if (months % 12 === 0) {
    const years = months / 12;
    return `${years} ${years === 1 ? 'Year' : 'Years'}`;
  }
  return `${months} ${months === 1 ? 'Month' : 'Months'}`;
};

const TemplatesDashboard = () => {
  const queryClient = useQueryClient();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Investment Template Wizard state
  const [mode, setMode] = useState<'view' | 'step1' | 'step2' | 'step3'>('view');

  // Form states for Step 1
  const [roi, setRoi] = useState('');
  const [duration, setDuration] = useState('');
  const [minFunding, setMinFunding] = useState('');
  const [maxFunding, setMaxFunding] = useState('');
  const [minInvestment, setMinInvestment] = useState('');
  const [maxInvestment, setMaxInvestment] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Milestone list for Step 2
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [milestoneForm, setMilestoneForm] = useState({
    id: '',
    name: '',
    allocation: 0
  });

  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetCategories();
  const categories = useMemo<FarmCategoryResponse[]>(() => {
    const categoryData = categoriesResponse?.data;

    if (Array.isArray(categoryData)) {
      return categoryData;
    }

    if (
      categoryData &&
      typeof categoryData === 'object' &&
      Array.isArray((categoryData as { categories?: FarmCategoryResponse[] }).categories)
    ) {
      return (categoryData as { categories: FarmCategoryResponse[] }).categories;
    }

    return [];
  }, [categoriesResponse?.data]);

  const selectedCategoryId = useMemo(() => {
    if (!categories.length) return null;

    if (
      activeCategoryId &&
      categories.some((category) => category.id === activeCategoryId)
    ) {
      return activeCategoryId;
    }

    return categories[0].id;
  }, [activeCategoryId, categories]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId) || null,
    [categories, selectedCategoryId]
  );

  // Fetch investments for the selected category
  const { data: investmentsResponse, isLoading: isInvestmentsLoading } = useGetInvestments({
    farmCategoryId: selectedCategoryId || undefined
  });

  const currentInvestment = useMemo(() => {
    return investmentsResponse?.data?.investments?.[0] || null;
  }, [investmentsResponse]);

  const currentTemplate = useMemo<InvestmentTemplate | null>(() => {
    if (!currentInvestment) return null;
    return {
      id: currentInvestment.id,
      roi: String(currentInvestment.roiPercentage),
      duration: String(currentInvestment.durationValue),
      minFunding: String(currentInvestment.fundingRules?.minGoal || 0),
      maxFunding: String(currentInvestment.fundingRules?.maxGoal || 0),
      minInvestment: String(currentInvestment.investmentLimit?.minGoal || 0),
      maxInvestment: String(currentInvestment.investmentLimit?.maxGoal || 0),
      startDate: currentInvestment.createdAt ? currentInvestment.createdAt.split('T')[0] : '',
      endDate: currentInvestment.createdAt ? currentInvestment.createdAt.split('T')[0] : '',
      milestones: (currentInvestment.milestones || []).map((m) => ({
        id: m.id,
        name: m.name,
        allocation: m.fundReleasePercentage,
      })),
    };
  }, [currentInvestment]);

  const createCategoryMutation = useCreateCategory();
  const createInvestmentMutation = useCreateInvestment();
  const updateInvestmentMutation = useUpdateInvestment();

  const handleCreateCategory = async (name: string) => {
    const normalizedName = name.trim();
    if (!normalizedName) return;

    try {
      const response = await createCategoryMutation.mutateAsync({
        name: normalizedName,
      });

      const createdCategoryId = response.data.id;
      setIsCategoryModalOpen(false);

      await queryClient.invalidateQueries({ queryKey: ['farmCategories'] });

      if (createdCategoryId) {
        setActiveCategoryId(createdCategoryId);
      }

      toast.success('Farm category created successfully');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create category';
      toast.error(message);
    }
  };

  const handleAddTemplate = () => {
    // Populate form if template already exists, otherwise clear
    if (currentTemplate) {
      setRoi(currentTemplate.roi);
      setDuration(currentTemplate.duration);
      setMinFunding(currentTemplate.minFunding);
      setMaxFunding(currentTemplate.maxFunding);
      setMinInvestment(currentTemplate.minInvestment);
      setMaxInvestment(currentTemplate.maxInvestment);
      setStartDate(currentTemplate.startDate);
      setEndDate(currentTemplate.endDate);
      setMilestones(currentTemplate.milestones);
    } else {
      setRoi('');
      setDuration('');
      setMinFunding('');
      setMaxFunding('');
      setMinInvestment('');
      setMaxInvestment('');
      setStartDate('');
      setEndDate('');
      setMilestones([]);
    }
    setMode('step1');
  };

  // Milestone Actions
  const handleStartAddMilestone = () => {
    setMilestoneForm({ id: '', name: '', allocation: 0 });
    setEditingMilestone({ id: '', name: '', allocation: 0 });
  };

  const handleEditMilestone = (m: Milestone) => {
    setMilestoneForm({ ...m });
    setEditingMilestone(m);
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id));
    toast.success('Milestone deleted');
  };

  const handleSaveMilestone = () => {
    if (!milestoneForm.name.trim() || milestoneForm.allocation <= 0) {
      toast.error('Please complete all milestone fields');
      return;
    }

    if (milestoneForm.id) {
      // Edit
      setMilestones(milestones.map((m) => m.id === milestoneForm.id ? { ...milestoneForm } : m));
    } else {
      // Add
      const newMilestone: Milestone = {
        ...milestoneForm,
        id: Math.random().toString(36).substr(2, 9)
      };
      setMilestones([...milestones, newMilestone]);
    }
    setEditingMilestone(null);
  };

  const totalAllocation = useMemo(() => {
    return milestones.reduce((sum, m) => sum + m.allocation, 0);
  }, [milestones]);

  const handlePublishTemplate = async () => {
    if (!selectedCategoryId) return;

    const payload = {
      name: `${selectedCategory?.name || 'Category'} Investment Plan`,
      description: `Investment template for ${selectedCategory?.name || 'Category'} farms.`,
      farmCategoryId: selectedCategoryId,
      roiPercentage: parseFloat(roi) || 0,
      durationValue: parseInt(duration) || 0,
      durationUnit: 'months',
      riskLevel: 'medium',
      fundingMinGoal: parseFloat(minFunding) || 0,
      fundingMaxGoal: parseFloat(maxFunding) || 0,
      investmentMinGoal: parseFloat(minInvestment) || 0,
      investmentMaxGoal: parseFloat(maxInvestment) || 0,
      currency: 'NGN',
      milestones: milestones.map((m, idx) => ({
        name: m.name,
        fundReleasePercentage: m.allocation,
        order: idx + 1,
        isActive: true,
      })),
    };

    try {
      if (currentTemplate?.id) {
        // Update existing template
        await updateInvestmentMutation.mutateAsync({
          investmentId: currentTemplate.id,
          payload,
        });
        toast.success('Investment template updated successfully');
      } else {
        // Create new template
        await createInvestmentMutation.mutateAsync(payload);
        toast.success('Investment template published successfully');
      }

      await queryClient.invalidateQueries({ queryKey: ["adminInvestments"] });
      setMode('view');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to publish template';
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-4rem)] lg:overflow-hidden bg-background w-full">
      {/* Left Sidebar - Farm Categories */}
      <section className="w-full lg:w-[220px] p-5 border-b lg:border-b-0 lg:border-r border-gray-100 bg-appWhite flex flex-col lg:flex-shrink-0 lg:overflow-y-auto">
        <div className="flex items-center justify-between lg:block">
          <Typography variant='normal' className="text-appBlack font-medium">Farm Categories</Typography>
          <Button
            variant="light"
            icon={<AddIcon color="black" size={16} />}
            className="lg:hidden uppercase text-xs px-3 py-2"
            onClick={() => setIsCategoryModalOpen(true)}
            isLoading={createCategoryMutation.isPending}
          >
            Add
          </Button>
        </div>

        <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible whitespace-nowrap gap-2 mt-4 lg:mt-5 scrollbar-hide">
          {isCategoriesLoading ? (
            <div className="text-gray-400 text-sm py-2">Loading...</div>
          ) : (
            categories.map((category) => {
              const isActive = category.id === selectedCategoryId;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setActiveCategoryId(category.id);
                    setMode('view');
                  }}
                  className={`flex-shrink-0 flex items-center gap-2 lg:gap-3 rounded-md px-3 py-2 lg:py-3 text-left transition-colors cursor-pointer ${
                    isActive ? 'text-appBlack bg-foreground/5 font-semibold' : 'text-foreground hover:bg-white/70'
                  }`}
                >
                  <FarmIcon color='var(--border)' size={20} className="w-5 h-5" />
                  <Typography variant='normal' className="text-sm">{category.name}</Typography>
                </button>
              );
            })
          )}
        </div>

        <Button
          variant="light"
          icon={<AddIcon color="black" size={16} />}
          className="hidden lg:flex mt-8 w-full uppercase text-xs"
          onClick={() => setIsCategoryModalOpen(true)}
          isLoading={createCategoryMutation.isPending}
        >
          Add New Category
        </Button>

        {!categories.length && !isCategoriesLoading && (
          <Typography variant='small' className="mt-3 text-sm text-foreground100">Create your first farm category</Typography>
        )}
      </section>

      {/* Right Content Area - Card layout based on active mode */}
      <section className="flex-1 h-auto lg:h-full overflow-y-auto p-4 md:p-10 bg-background">
        <div className="bg-white border border-border100/10 rounded-xl p-4 md:p-6 lg:p-9 shadow-sm w-auto">
        {mode === 'view' && (
          <>
            <div className="flex justify-between items-center">
              <Typography className='font-semibold text-lg text-gray-900'>Investment Template</Typography>
              {currentTemplate && (
                <button onClick={handleAddTemplate} className="p-1 hover:bg-gray-50 rounded-md transition-colors cursor-pointer" title="Edit Template">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 hover:text-gray-900">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              )}
            </div>
            
            <div className="h-px bg-gray-100 w-full mt-4" />

            <div className="mt-8">
              {isInvestmentsLoading || isCategoriesLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 text-sm">
                  <svg className="w-8 h-8 animate-spin text-primary mb-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <span>Loading template details...</span>
                </div>
              ) : currentTemplate ? (
                /* Card Template Detail View (Screen 4) */
                <div className="space-y-8">
                  {/* Overview Block */}
                  <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-gray-50/75 px-5 py-3 border-b border-gray-100">
                      <p className="font-semibold text-sm text-gray-900">Template Overview</p>
                    </div>
                    <div className="p-5 flex justify-between items-center text-sm border-b border-gray-100">
                      <span className="text-gray-400">Farm Category</span>
                      <span className="font-semibold text-gray-900">{selectedCategory?.name}</span>
                    </div>
                  </div>

                  {/* Rules Block */}
                  <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-gray-50/75 px-5 py-3 border-b border-gray-100">
                      <p className="font-semibold text-sm text-gray-900">Investment Rules</p>
                    </div>
                    <div className="divide-y divide-gray-100 text-sm">
                      <div className="p-5 flex justify-between items-center">
                        <span className="text-gray-400">ROI</span>
                        <span className="font-semibold text-gray-900 text-right">{currentTemplate.roi}%</span>
                      </div>
                      <div className="p-5 flex justify-between items-center">
                        <span className="text-gray-400">Duration</span>
                        <span className="font-semibold text-gray-900 text-right">{formatDuration(currentTemplate.duration)}</span>
                      </div>
                      <div className="p-5 flex justify-between items-center">
                        <span className="text-gray-400">Funding Goal</span>
                        <span className="font-semibold text-gray-900 text-right">
                          {formatCurrency(currentTemplate.minFunding)} – {formatCurrency(currentTemplate.maxFunding)}
                        </span>
                      </div>
                      <div className="p-5 flex justify-between items-center">
                        <span className="text-gray-400">Investor Limits</span>
                        <span className="font-semibold text-gray-900 text-right">
                          {formatCurrency(currentTemplate.minInvestment)} – {formatCurrency(currentTemplate.maxInvestment)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Milestones Block */}
                  <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-gray-50/75 px-5 py-3 border-b border-gray-100">
                      <p className="font-semibold text-sm text-gray-900">Milestones</p>
                    </div>
                    <div className="divide-y divide-gray-100 text-sm">
                      {currentTemplate.milestones.map((m) => (
                        <div key={m.id} className="p-5 flex justify-between items-center">
                          <span className="text-gray-400">{m.name}</span>
                          <span className="font-semibold text-gray-900 text-right">{m.allocation}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Card Empty State (Screen 1 start point) */
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className='w-16 h-16 rounded-full bg-[#F1F9ED] flex items-center justify-center mb-6'>
                    <div className="w-12 h-12 rounded-full bg-[#E2F3DA] flex items-center justify-center">
                      <FarmIcon color="var(--primary)" size={20} />
                    </div>
                  </div>
                  <h4 className="text-gray-900 font-semibold text-base">No Template found for this category</h4>
                  <p className="text-gray-400 text-sm mt-1">
                    You have not added a template for this category
                  </p>
                  <Button
                    variant="primary"
                    icon={<AddIcon color="white" size={16} />}
                    className="mt-6 mx-auto w-full max-w-[352px] py-3 uppercase text-xs"
                    onClick={handleAddTemplate}
                  >
                    Add Template
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        {mode === 'step1' && (
          /* Step 1 of 3 wizard (Screen 1) */
          <>
            <div className="flex justify-between items-center">
              <Typography className='font-semibold text-lg text-gray-900'>Investment Parameters</Typography>
              <span className="text-xs text-gray-400">Step 1 of 3</span>
            </div>
            <div className="h-px bg-gray-100 w-full mt-4" />

            <div className="mt-8 space-y-6 max-w-[680px]">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">ROI Configuration</p>
                <Input
                  id="roi-input"
                  value={roi}
                  onChange={(e) => setRoi(e.target.value)}
                  label="Expected Return(%)"
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">Duration</p>
                <Input
                  id="duration-input"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  label="Enter Number of Months for Investment to Mature"
                />
              </div>
            </div>

            <div className="mt-6 space-y-6 max-w-[980px]">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">Funding Rules</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      id="min-funding-input"
                      value={minFunding}
                      onChange={(e) => setMinFunding(e.target.value)}
                      label="Minimum Funding Goal per farm (₦)"
                    />
                    <span className="text-gray-300 whitespace-nowrap">--</span>
                    <Input
                      id="max-funding-input"
                      value={maxFunding}
                      onChange={(e) => setMaxFunding(e.target.value)}
                      label="Maximum Funding Goal per farm (₦)"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      id="min-investment-input"
                      value={minInvestment}
                      onChange={(e) => setMinInvestment(e.target.value)}
                      label="Minimum Investment per investor (₦)"
                    />
                    <span className="text-gray-300 whitespace-nowrap">--</span>
                    <Input
                      id="max-investment-input"
                      value={maxInvestment}
                      onChange={(e) => setMaxInvestment(e.target.value)}
                      label="Maximum Investment per investor (₦)"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative w-full">
                      <Input
                        id="start-date-input"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        label="Investment Start Date"
                        className="[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center pr-1">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#92998E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                    </div>
                    <span className="text-gray-300 whitespace-nowrap">--</span>
                    <div className="relative w-full">
                      <Input
                        id="end-date-input"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        label="Investment End Date"
                        className="[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none flex items-center pr-1">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#92998E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  className="w-full max-w-[170px] py-3.5 uppercase text-xs font-bold"
                  onClick={() => setMode('step2')}
                  disabled={!roi || !duration || !minFunding || !maxFunding || !minInvestment || !maxInvestment || !startDate || !endDate}
                >
                  Save & Continue
                </Button>
              </div>
            </div>
          </>
        )}

        {mode === 'step2' && (
          /* Step 2 of 3 wizard (Screen 2) */
          <>
            <div className="flex justify-between items-center">
              <Typography className='font-semibold text-lg text-gray-900'>Milestones</Typography>
              <span className="text-xs text-gray-400">Step 2 of 3</span>
            </div>
            
            <div className="h-px bg-gray-100 w-full mt-4" />

            <div className="mt-8 max-w-[1200px]">
              {/* Total Allocation Banner */}
              {totalAllocation === 100 ? (
                <div className="flex items-center justify-between bg-[#0EA0530D] border border-[#0EA0534D] rounded-xl p-4 mb-8">
                  <div className="flex items-center gap-3">
                    <TickIcon size={20} />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">Total Allocation</p>
                      <p className="text-xs text-gray-500">Milestone allocation is balanced.</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-[#0EA053]">100%</span>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">!</div>
                    <div>
                      <p className="font-semibold text-sm text-red-900">Total Allocation</p>
                      <p className="text-xs text-red-500">Milestone allocation must sum to 100%. Current: {totalAllocation}%</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-red-600">{totalAllocation}%</span>
                </div>
              )}

              {/* Milestones list with vertical timeline line */}
              <div className="relative pl-12 space-y-6">
                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-200" />

                {milestones.map((m, idx) => (
                  <div key={m.id || idx} className="relative flex items-center gap-4">
                    {/* Circle Indicator */}
                    <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-primary bg-white text-primary flex items-center justify-center font-bold text-sm z-10">
                      {idx + 1}
                    </div>

                    {/* Milestone Card */}
                    <div className="flex-1 bg-white border border-gray-100 rounded-xl px-4 py-6 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="grid grid-cols-2 gap-0.5 cursor-grab p-1">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <span key={i} className="w-[3px] h-[3px] rounded-full bg-gray-300" />
                          ))}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{m.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <span className="font-bold text-gray-900 text-sm">{m.allocation}%</span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleEditMilestone(m)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                          <button onClick={() => handleDeleteMilestone(m.id)} className="text-gray-400 hover:text-red-500 cursor-pointer">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Milestone Button Box */}
              <div
                onClick={handleStartAddMilestone}
                className="mt-6 border border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer text-gray-500 hover:bg-gray-50 flex items-center justify-center gap-2 text-sm transition-colors"
              >
                <span className="text-base font-semibold">+</span> Add Milestone
              </div>

              {/* Wizard Nav buttons */}
              <div className="flex gap-3 mt-8 pt-4">
                <Button
                  variant="light"
                  className="px-6 py-3 uppercase text-xs font-semibold"
                  onClick={() => setMode('step1')}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  className="px-6 py-3 uppercase text-xs font-semibold"
                  onClick={() => setMode('step3')}
                  disabled={totalAllocation !== 100}
                >
                  Continue
                </Button>
              </div>
            </div>
          </>
        )}

        {mode === 'step3' && (
          /* Step 3 of 3 wizard (Screen 3) */
          <>
            <div className="flex justify-between items-center">
              <Typography className='font-semibold text-lg text-gray-900'>Review Investment Template</Typography>
              <span className="text-xs text-gray-400">Step 3 of 3</span>
            </div>
            
            <div className="h-px bg-gray-100 w-full mt-4" />

            <div className="mt-8 space-y-8">
              {/* Overview Review */}
              <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-gray-50/75 px-5 py-3 border-b border-gray-100">
                  <p className="font-semibold text-sm text-gray-900">Template Overview</p>
                </div>
                <div className="p-5 flex justify-between items-center text-sm">
                  <span className="text-gray-400">Farm Category</span>
                  <span className="font-semibold text-gray-900">{selectedCategory?.name}</span>
                </div>
              </div>

              {/* Rules Review */}
              <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-gray-50/75 px-5 py-3 border-b border-gray-100">
                  <p className="font-semibold text-sm text-gray-900">Investment Rules</p>
                </div>
                <div className="divide-y divide-gray-100 text-sm">
                  <div className="p-5 flex justify-between items-center">
                    <span className="text-gray-400">ROI</span>
                    <span className="font-semibold text-gray-900">{roi}%</span>
                  </div>
                  <div className="p-5 flex justify-between items-center">
                    <span className="text-gray-400">Duration</span>
                    <span className="font-semibold text-gray-900">{formatDuration(duration)}</span>
                  </div>
                  <div className="p-5 flex justify-between items-center">
                    <span className="text-gray-400">Funding Goal</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(minFunding)} – {formatCurrency(maxFunding)}
                    </span>
                  </div>
                  <div className="p-5 flex justify-between items-center">
                    <span className="text-gray-400">Investor Limits</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(minInvestment)} – {formatCurrency(maxInvestment)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Milestones Review */}
              <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-gray-50/75 px-5 py-3 border-b border-gray-100">
                  <p className="font-semibold text-sm text-gray-900">Milestones</p>
                </div>
                <div className="divide-y divide-gray-100 text-sm">
                  {milestones.map((m) => (
                    <div key={m.id} className="p-5 flex justify-between items-center">
                      <span className="text-gray-400">{m.name}</span>
                      <span className="font-semibold text-gray-900">{m.allocation}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wizard Nav buttons */}
              <div className="flex gap-3 mt-8 pt-4">
                <Button
                  variant="light"
                  className="px-6 py-3 uppercase text-xs font-semibold"
                  onClick={() => setMode('step2')}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  className="px-6 py-3 uppercase text-xs font-semibold bg-primary hover:bg-primary/95 text-white"
                  onClick={handlePublishTemplate}
                  isLoading={createInvestmentMutation.isPending || updateInvestmentMutation.isPending}
                >
                  {currentTemplate?.id ? 'Save Template' : 'Publish Template'}
                </Button>
              </div>
            </div>
          </>
        )}
        </div>
      </section>

      {/* Category Creation Modal */}
      <FarmCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCreate={handleCreateCategory}
      />

      {/* Milestone Edit/Add Modal */}
      <Modal
        isOpen={editingMilestone !== null}
        onClose={() => setEditingMilestone(null)}
        ariaLabel={milestoneForm.id ? 'Edit Milestone' : 'Add Milestone'}
        maxWidth="max-w-[500px]"
      >
        <div className="w-full flex flex-col p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div className='flex flex-col'>
              <Typography variant='subheading' className="font-bold text-gray-900 leading-none">
                {milestoneForm.id ? 'Edit Milestone' : 'Add Milestone'}
              </Typography>
              <Typography variant='normal' className="text-gray-500 mt-1">
                {milestoneForm.id 
                  ? 'Changes made here will apply to every record of this milestone' 
                  : 'Define the details for this milestone'}
              </Typography>
            </div>
            <button 
              onClick={() => setEditingMilestone(null)} 
              className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            >
              <CloseIcon size={24} />
            </button>
          </div>

          <div className="space-y-6">
            <Input
              id="m-name"
              label="Milestone"
              value={milestoneForm.name}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, name: e.target.value })}
            />
            <Input
              id="m-alloc"
              type="number"
              label="Fund Release Percentage"
              value={milestoneForm.allocation === 0 ? '' : milestoneForm.allocation.toString()}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, allocation: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <Button 
              variant="light" 
              className="w-full uppercase text-xs font-bold py-3.5"
              onClick={() => setEditingMilestone(null)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              className="w-full uppercase text-xs font-bold py-3.5 bg-primary text-white"
              onClick={handleSaveMilestone} 
              disabled={!milestoneForm.name || milestoneForm.allocation <= 0}
            >
              {milestoneForm.id ? 'Save Milestone' : 'Add Milestone'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TemplatesDashboard;
