'use client'

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AddIcon, DeleteIcon, FarmIcon } from '@/components/icons';
import { Button, Input, Typography } from '@/components/ui';
import { FarmCategoryModal } from '@/components/modal';
import {
  useCreateCategory,
  useCreateMilestone,
  useDeleteMilestone,
  useGetCategories,
  useGetMilestonesByCategory,
  useUpdateMilestone,
} from '@/mutation';
import { MilestonePayload, MilestoneResponse } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

type MilestoneDraft = {
  id?: string;
  name: string;
}

const MilestonesDashboard = () => {
  const queryClient = useQueryClient();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [draftByCategory, setDraftByCategory] = useState<Record<string, MilestoneDraft[]>>({});
  const [removedIdsByCategory, setRemovedIdsByCategory] = useState<Record<string, string[]>>({});
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [draggingMilestoneIndex, setDraggingMilestoneIndex] = useState<number | null>(null);
  const [dragOverMilestoneIndex, setDragOverMilestoneIndex] = useState<number | null>(null);

  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetCategories();
  const categories = useMemo(() => categoriesResponse?.data ?? [], [categoriesResponse?.data]);

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

  const {
    data: milestonesResponse,
    isLoading: isMilestonesLoading,
    isFetching: isMilestonesFetching,
  } = useGetMilestonesByCategory(selectedCategoryId ?? undefined);

  const createCategoryMutation = useCreateCategory();
  const createMilestoneMutation = useCreateMilestone();
  const updateMilestoneMutation = useUpdateMilestone();
  const deleteMilestoneMutation = useDeleteMilestone();

  const serverMilestones = useMemo(
    () =>
      (milestonesResponse?.data ?? []).map((milestone: MilestoneResponse) => ({
        id: milestone.id,
        name: milestone.name,
      })),
    [milestonesResponse?.data]
  );

  const milestonesDraft = useMemo(() => {
    if (!selectedCategoryId) return [];
    return draftByCategory[selectedCategoryId] ?? serverMilestones;
  }, [draftByCategory, selectedCategoryId, serverMilestones]);

  const removedMilestoneIds = useMemo(() => {
    if (!selectedCategoryId) return [];
    return removedIdsByCategory[selectedCategoryId] ?? [];
  }, [removedIdsByCategory, selectedCategoryId]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId) || null,
    [categories, selectedCategoryId]
  );

  const updateCategoryDraft = (
    updater: (current: MilestoneDraft[]) => MilestoneDraft[]
  ) => {
    if (!selectedCategoryId) return;

    setDraftByCategory((previous) => {
      const currentDraft = previous[selectedCategoryId] ?? serverMilestones;
      return {
        ...previous,
        [selectedCategoryId]: updater(currentDraft),
      };
    });
  };

  const handleMilestoneChange = (index: number, value: string) => {
    updateCategoryDraft((previous) =>
      previous.map((milestone, currentIndex) =>
        currentIndex === index ? { ...milestone, name: value } : milestone
      )
    );
  };

  const handleAddMilestone = () => {
    if (!selectedCategoryId) return;
    updateCategoryDraft((previous) => [...previous, { name: '' }]);
  };

  const handleRemoveMilestone = (index: number) => {
    if (!selectedCategoryId || milestonesDraft.length <= 1) return;

    const removedMilestone = milestonesDraft[index];
    if (removedMilestone?.id) {
      setRemovedIdsByCategory((previous) => ({
        ...previous,
        [selectedCategoryId]: [
          ...(previous[selectedCategoryId] ?? []),
          removedMilestone.id!,
        ],
      }));
    }

    updateCategoryDraft((previous) =>
      previous.filter((_, currentIndex) => currentIndex !== index)
    );
  };

  const handleReorderMilestones = (fromIndex: number, toIndex: number) => {
    if (!selectedCategoryId || fromIndex === toIndex) return;

    updateCategoryDraft((previous) => {
      const milestones = [...previous];
      const [movedMilestone] = milestones.splice(fromIndex, 1);
      milestones.splice(toIndex, 0, movedMilestone);
      return milestones;
    });
  };

  const handleDragStart = (index: number) => {
    setDraggingMilestoneIndex(index);
    setDragOverMilestoneIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (draggingMilestoneIndex === null) return;
    setDragOverMilestoneIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggingMilestoneIndex === null) return;
    handleReorderMilestones(draggingMilestoneIndex, index);
    setDraggingMilestoneIndex(null);
    setDragOverMilestoneIndex(null);
  };

  const handleDragEnd = () => {
    setDraggingMilestoneIndex(null);
    setDragOverMilestoneIndex(null);
  };

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

  const handleSave = async () => {
    if (!selectedCategoryId) return;

    const trimmedMilestones = milestonesDraft
      .map((milestone) => ({ ...milestone, name: milestone.name.trim() }))
      .filter((milestone) => milestone.name.length > 0);

    if (!trimmedMilestones.length) {
      toast.error('Add at least one milestone before saving');
      return;
    }

    try {
      await Promise.all(
        removedMilestoneIds.map((milestoneId) =>
          deleteMilestoneMutation.mutateAsync(milestoneId)
        )
      );

      const existingMilestones = trimmedMilestones.filter((milestone) => milestone.id);
      const newMilestones = trimmedMilestones.filter((milestone) => !milestone.id);

      if (newMilestones.length) {
        await createMilestoneMutation.mutateAsync({
          categoryId: selectedCategoryId,
          payload: {
            milestones: newMilestones.map((milestone, index) => ({
              name: milestone.name,
              order: index,
            })),
          },
        });
      }

      await Promise.all(
        existingMilestones.map((milestone, index) =>
          updateMilestoneMutation.mutateAsync({
            milestoneId: milestone.id!,
            payload: {
              name: milestone.name,
              order: index,
            } as Partial<MilestonePayload>,
          })
        )
      );

      await queryClient.invalidateQueries({
        queryKey: ['milestones', selectedCategoryId],
      });

      setDraftByCategory((previous) => {
        const next = { ...previous };
        delete next[selectedCategoryId];
        return next;
      });

      setRemovedIdsByCategory((previous) => {
        const next = { ...previous };
        delete next[selectedCategoryId];
        return next;
      });

      toast.success('Milestones saved successfully');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to save milestones';
      toast.error(message);
    }
  };

  const isSaving =
    createMilestoneMutation.isPending ||
    updateMilestoneMutation.isPending ||
    deleteMilestoneMutation.isPending;

  const isBusy = isCategoriesLoading || isMilestonesLoading || isMilestonesFetching;

  return (
    <div className="flex flex-col lg:flex-row">
      <section className="w-full p-5 border-r border-gray-100 bg-appWhite max-w-[220px] h-[calc(100vh-4rem)] overflow-y-auto">
        <Typography variant='normal' className="text-appBlack font-medium">Farm Categories</Typography>

        <div className="space-y-1 mt-5">
          {categories.map((category) => {
        const isActive = category.id === selectedCategoryId;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategoryId(category.id)}
            className={`w-full flex items-center gap-3 rounded-md px-3 py-3 text-left transition-colors cursor-pointer ${
          isActive ? 'text-appBlack bg-foreground/5' : 'text-foreground hover:bg-white/70'
            }`}
          >
            <FarmIcon color='var(--border)' size={24} />
            <Typography variant='normal'>{category.name}</Typography>
          </button>
        );
          })}
        </div>

        <Button
          variant="light"
          icon={<AddIcon color="black" size={16} />}
          className="mt-8 w-full uppercase text-xs"
          onClick={() => setIsCategoryModalOpen(true)}
          isLoading={createCategoryMutation.isPending}
        >
          Add New Category
        </Button>

        {!categories.length && (
          <Typography variant='small' className="mt-3 text-sm text-foreground100">Create your first farm category</Typography>
        )}
      </section>

      <section className="w-full h-fit m-10 overflow-y-auto bg-white border border-border100/10 rounded-sm p-6 lg:p-9">
        <Typography variant='intro' className="uppercase">Milestones</Typography>

        <div className='mt-8'>
          {selectedCategory ? (
            <div className="space-y-4">
              {milestonesDraft.map((milestone, index) => (
                <div
                  key={milestone.id ?? `${selectedCategory.id}-${index}`}
                  className={`flex items-center gap-3 rounded-md transition-colors ${
                    dragOverMilestoneIndex === index && draggingMilestoneIndex !== index
                      ? 'bg-foreground/5'
                      : ''
                  }`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    handleDragOver(index);
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    handleDrop(index);
                  }}
                >
                  <button
                    type="button"
                    draggable
                    className="grid grid-cols-2 gap-0.5 cursor-grab active:cursor-grabbing p-1"
                    aria-label={`Drag milestone ${index + 1} to reorder`}
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = 'move';
                      handleDragStart(index);
                    }}
                    onDragEnd={handleDragEnd}
                  >
                    {Array.from({ length: 6 }).map((_, dotIndex) => (
                      <span key={dotIndex} className="w-[3px] h-[3px] rounded-full bg-border" />
                    ))}
                  </button>

                  <Input
                    id={`milestone-${index}`}
                    value={milestone.name}
                    onChange={(event) => handleMilestoneChange(index, event.target.value)}
                    placeholder={`Milestone/Stage ${index + 1}`}
                    label={milestone.name.trim() ? `Milestone/Stage ${index + 1}` : ''}
                    containerClassName="flex-1"
                    labelClassName="text-base"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveMilestone(index)}
                    className="cursor-pointer"
                    aria-label={`Remove milestone ${index + 1}`}
                  >
                    <DeleteIcon color='var(--red100)' />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border100 bg-background/30 px-6 py-10 md:py-14 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white border border-border100">
                <FarmIcon color="#599C38" size={18} />
              </div>
              <p className="text-lg md:text-xl font-semibold text-appBlack">Create your first farm category</p>
              <p className="mt-2 text-sm md:text-base text-foreground100">
                Create a farm category first to start adding milestones.
              </p>
            </div>
          )}
        </div>

        <Button
          variant="dark"
          icon={<AddIcon color="#FFFFFF" size={24} />}
          className="uppercase mt-4"
          onClick={handleAddMilestone}
          disabled={!selectedCategory || isBusy}
        >
          Add New Milestone
        </Button>

        <Button
          variant="primary"
          className="mt-8 w-full max-w-[159px] uppercase"
          onClick={handleSave}
          disabled={!selectedCategory || isBusy || isSaving}
          isLoading={isSaving}
        >
          Save
        </Button>
      </section>

      <FarmCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCreate={handleCreateCategory}
      />
    </div>
  );
};

export default MilestonesDashboard;