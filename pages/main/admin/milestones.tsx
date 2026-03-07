'use client'

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AddIcon, DeleteIcon, FarmIcon } from '@/components/icons';
import { Button, Input, Typography } from '@/components/ui';
import { FarmCategoryModal } from '@/components/modal';

type FarmCategory = {
  id: string;
  name: string;
  milestones: string[];
}

const initialCategories: FarmCategory[] = [];

const MilestonesDashboard = () => {
  const [categories, setCategories] = useState<FarmCategory[]>(initialCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialCategories[0]?.id ?? null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [draggingMilestoneIndex, setDraggingMilestoneIndex] = useState<number | null>(null);
  const [dragOverMilestoneIndex, setDragOverMilestoneIndex] = useState<number | null>(null);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId) || null,
    [categories, selectedCategoryId]
  );

  const handleMilestoneChange = (index: number, value: string) => {
    if (!selectedCategoryId) return;

    setCategories((prev) =>
      prev.map((category) => {
        if (category.id !== selectedCategoryId) return category;

        const updatedMilestones = [...category.milestones];
        updatedMilestones[index] = value;

        return {
          ...category,
          milestones: updatedMilestones,
        };
      })
    );
  };

  const handleAddMilestone = () => {
    if (!selectedCategoryId) return;

    setCategories((prev) =>
      prev.map((category) =>
        category.id === selectedCategoryId
          ? { ...category, milestones: [...category.milestones, ''] }
          : category
      )
    );
  };

  const handleRemoveMilestone = (index: number) => {
    if (!selectedCategoryId) return;

    setCategories((prev) =>
      prev.map((category) => {
        if (category.id !== selectedCategoryId) return category;
        if (category.milestones.length <= 1) return category;

        return {
          ...category,
          milestones: category.milestones.filter((_, currentIndex) => currentIndex !== index),
        };
      })
    );
  };

  const handleReorderMilestones = (fromIndex: number, toIndex: number) => {
    if (!selectedCategoryId || fromIndex === toIndex) return;

    setCategories((prev) =>
      prev.map((category) => {
        if (category.id !== selectedCategoryId) return category;

        const milestones = [...category.milestones];
        const [movedMilestone] = milestones.splice(fromIndex, 1);
        milestones.splice(toIndex, 0, movedMilestone);

        return {
          ...category,
          milestones,
        };
      })
    );
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

  const handleCreateCategory = (name: string) => {
    const normalizedName = name.trim();
    const nextCategory: FarmCategory = {
      id: `${normalizedName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name: normalizedName,
      milestones: ['', '', ''],
    };

    setCategories((prev) => [...prev, nextCategory]);
    setSelectedCategoryId(nextCategory.id);
    setIsCategoryModalOpen(false);
    toast.success('Farm category created successfully');
  };

  const handleSave = () => {
    toast.success('Milestones saved successfully');
  };

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
            onClick={() => setSelectedCategoryId(category.id)}
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
              {selectedCategory.milestones.map((milestone, index) => (
                <div
                  key={`${selectedCategory.id}-${index}`}
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
                    value={milestone}
                    onChange={(event) => handleMilestoneChange(index, event.target.value)}
                    placeholder={`Milestone/Stage ${index + 1}`}
                    label={milestone.trim() ? `Milestone/Stage ${index + 1}` : ''}
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
          disabled={!selectedCategory}
        >
          Add New Milestone
        </Button>

        <Button
          variant="primary"
          className="mt-8 w-full max-w-[159px] uppercase"
          onClick={handleSave}
          disabled={!selectedCategory}
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