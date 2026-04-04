'use client'

import { useMemo, useRef, useState } from "react";
import { AddIcon, CloseIcon, DocsIcon, FarmIcon, FilterIcon, MoreIcon, PhotoIcon, SearchIcon, TickIcon, UploadIcon } from "@/components/icons";
import { Button, Input, MainHeader, Select, Table, Typography } from "@/components/ui";
import { Column } from "@/components/ui/table";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { useGetFarmCategories, useGetMilestonesByCategory } from "@/mutation/dashboard.mutation";
import { useAddMilestonesToFarm, useCreateFarm, useGetFarms, useUploadDocToFarm } from "@/mutation/farms.mutation";
import { MilestoneResponse, SelectOptions } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type FarmRecord = {
  id: string;
  name: string;
  category: string;
  status: "Pending" | "Approved";
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

const makeId = () => Math.random().toString(36).slice(2, 10);

const StepItem = ({ title, done }: { title: string; done: boolean }) => (
  <div className="flex items-center gap-3 text-base font-medium text-[#111827]">
    <div className={`flex h-5 w-5 items-center justify-center rounded-full ${done ? "" : "opacity-50"}`}>
      <TickIcon />
    </div>
    <span className={done ? "text-[#111827]" : "text-[#8A8F96]"}>{title}</span>
  </div>
);

const MyFarms = () => {
  const queryClient = useQueryClient();
  const [showAddFarm, setShowAddFarm] = useState(false);
  const [step, setStep] = useState<Step>(1);
  const [search, setSearch] = useState("");

  const [farmName, setFarmName] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [farmAddress, setFarmAddress] = useState("");
  const [farmCategory, setFarmCategory] = useState("");
  const [totalInvestment, setTotalInvestment] = useState("");
  const [selectedMilestones, setSelectedMilestones] = useState<string[]>([]);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [documents, setDocuments] = useState<DocItem[]>([]);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const photoCaptureRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const { data: farmsResponse, isLoading: isFarmsLoading } = useGetFarms({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    search,
  });
  const { data: farmCategoriesResponse, isLoading: isFarmCategoriesLoading } = useGetFarmCategories();
  const { data: milestonesResponse, isLoading: isMilestonesLoading } = useGetMilestonesByCategory(farmCategory || undefined);

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
    const milestones = (milestonesResponse?.data ?? []) as MilestoneResponse[];
    return milestones.map((milestone: MilestoneResponse) => ({ id: milestone.id, name: milestone.name || "Unnamed milestone" }));
  }, [milestonesResponse?.data]);

  const filteredFarms = useMemo(() => {
    const farms = farmsResponse?.data?.farms ?? [];

    return farms.map((farm) => ({
      id: farm.id,
      name: farm.name,
      category: farm.Category?.name || "Uncategorized",
      status: (farm.stats?.completionPercentage === 100 ? "Approved" : "Pending") as FarmRecord["status"],
    }));
  }, [farmsResponse?.data?.farms]);

  const farmsCount = farmsResponse?.data?.pagination?.total ?? filteredFarms.length;

  const resetForm = () => {
    photos.forEach((item) => URL.revokeObjectURL(item.preview));
    setStep(1);
    setFarmName("");
    setFarmSize("");
    setFarmAddress("");
    setFarmCategory("");
    setTotalInvestment("");
    setSelectedMilestones([]);
    setPhotos([]);
    setDocuments([]);
  };

  const handleOpenAddFarm = () => {
    setShowAddFarm(true);
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

  const toggleMilestone = (value: string) => {
    setSelectedMilestones((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      }
      return [...prev, value];
    });
  };

  const canContinueStepOne = farmName.trim().length > 0 && farmSize.trim().length > 0 && farmAddress.trim().length > 0;
  const canContinueStepTwo = farmCategory.length > 0 && selectedMilestones.length > 0 && totalInvestment.trim().length > 0;
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
        await addMilestonesMutation.mutateAsync({
          farmId,
          payload: { milestones: selectedMilestones },
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
        <span className="rounded-full bg-[#E5E5E5] px-3 py-1 text-xs font-medium text-[#555D66]">{farm.status}</span>
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
              <aside className="border-r border-[#EAECE8] p-5 sm:p-6">
                <div className="space-y-0.5">
                  <StepItem title="Farm Details" done={step >= 1} />
                  <p className="ml-2 text-[#9CC98A]">:</p>
                  <StepItem title="Farm Milestones" done={step >= 2} />
                  <p className="ml-2 text-[#9CC98A]">:</p>
                  <StepItem title="Farm Documentation" done={step >= 3} />
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
                    <div className="max-w-3xl space-y-4">
                      <Select
                        value={farmCategory}
                        onChange={(event) => setFarmCategory(event.target.value)}
                        placeholder="Select Farm Category"
                        options={farmCategories}
                      />

                      {isFarmCategoriesLoading && (
                        <p className="text-sm text-[#6B7280]">Loading farm categories...</p>
                      )}

                      {farmCategory && (
                        <>
                          <Typography variant="small" className="font-semibold text-[#1F2937]">What do you need funds for? (Select farm milestones that apply)</Typography>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mt-3">
                            {milestoneOptions.map((option) => {
                              if (!option.id) return null;
                              const checked = selectedMilestones.includes(option.id);
                              return (
                                <button
                                  key={option.id}
                                  type="button"
                                  onClick={() => toggleMilestone(option.id)}
                                  className="flex items-center gap-3 rounded-md shadow-xs border border-[#B8C3CF] bg-transparent px-4 py-3 text-left text-[#1F2937]"
                                >
                                  <span className={`flex h-5 w-5 items-center justify-center rounded-sm border ${checked ? "border-[#3B82F6] bg-[#DBEAFE] text-[#2563EB]" : "border-[#8A93A4] text-transparent"}`}>
                                    ✓
                                  </span>
                                  <span>{option.name}</span>
                                </button>
                              );
                            })}
                          </div>

                          {isMilestonesLoading && (
                            <p className="text-sm text-[#6B7280]">Loading milestones...</p>
                          )}

                          {!isMilestonesLoading && milestoneOptions.length === 0 && (
                            <p className="text-sm text-[#6B7280]">No milestones configured for this category yet.</p>
                          )}

                          <Input
                            id="total-investment"
                            value={totalInvestment}
                            onChange={(event) => setTotalInvestment(event.target.value)}
                            label="Enter Total Investment Amount Needed (NGN)"
                          />
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
                            <div key={photo.id} className="relative aspect-square overflow-hidden rounded-md bg-[#D9D9D9]">
                              <div
                                role="img"
                                aria-label={photo.name}
                                className="h-full w-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${photo.preview})` }}
                              />
                              <button
                                type="button"
                                onClick={() => removePhoto(photo.id)}
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
    </div>
  );
};

export default MyFarms;
