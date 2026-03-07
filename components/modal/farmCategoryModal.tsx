"use client"

import { useState } from "react";
import { Button, Input, Typography } from "../ui";
import { CloseIcon } from "../icons";
import Modal from "./modal";

interface FarmCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

const FarmCategoryModal = ({ isOpen, onClose, onCreate }: FarmCategoryModalProps) => {
  const [categoryName, setCategoryName] = useState('');

  const handleCreate = () => {
    const value = categoryName.trim();
    if (!value) return;
    onCreate(value);
    setCategoryName('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setCategoryName('');
        onClose();
      }}
      ariaLabel="Create Farm Category"
    >
      <div className="w-full flex flex-col px-6 py-7">
        <div className="flex items-center justify-between gap-2 mb-3">
          <Typography variant="subheading" className="font-semibold text-foreground">Create Farm Category</Typography>

          <div onClick={onClose} className="w-fit cursor-pointer">
            <CloseIcon   />
          </div>
        </div>

        <Typography variant="normal" className="-mt-2">Please enter a name for this category.</Typography>

        <Input
          id="farm-category-name"
          type="text"
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value)}
          placeholder="Cereal, Tuber"
          className="mt-4"
        />

        <Button
          variant="primary"
          className="w-full uppercase mt-4"
          size="large"
          onClick={handleCreate}
          disabled={!categoryName.trim()}
        >
          Create Category
        </Button>
      </div>
    </Modal>
  );
};

export default FarmCategoryModal;