"use client"

import Image from "next/image";
import { useState, useRef, ChangeEvent } from "react";
import { ArrowLeftIcon, CloseIcon, PhotoIcon, UploadIcon } from "../icons";
import { Button, Input, Select, Typography } from "../ui";
import Modal from "./modal";
import { KycModalProps } from "@/types";

const KycModal = ({
  isOpen,
  onClose,
  number,
  setNumber,
  identification,
  setIdentification,
  identificationOptions,
  photo,
  setPhoto,
  isPending,
  onDone,
}: KycModalProps) => {
  const [step, setStep] = useState<1 | 2>(1)
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleContinue = () => {
    setStep(2);
  }

  const handleBack = () => {
    setStep(1);
  }

  const handleUploadClick = () => {
    uploadInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && setPhoto) {
      setPhoto(file);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="kyc modal"
      maxHeight="h-fit max-h-[85vh]"
    >
      <div className="w-full flex flex-col px-6 py-7">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {step === 2 && (
              <div onClick={handleBack} className="w-fit cursor-pointer">
                <ArrowLeftIcon size={24} />
              </div>
            )}
            <Typography variant="intro">KYC Verification</Typography>
          </div>

          <div onClick={onClose} className="w-fit cursor-pointer">
            <CloseIcon   />
          </div>
        </div>
        <div className="w-full mb-5">
          <div className="h-1 bg-primary/30 rounded-full overflow-hidden">
            <div
              className={`h-full bg-primary rounded-full transition-all`}
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>
        </div>
        {step === 1 ? (
          <>
            <Select
              options={identificationOptions}
              value={
                identificationOptions.find((opt) => opt.value === identification)
                  ? identification
                  : ""
              }
              onChange={(e) => setIdentification(e.target.value as string)}
              placeholder="Means of Identification"
              label="Means of Identification"
              className="w-full mb-4"
            />

            <Input
              label="Enter your National Identification Number"
              id="number"
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />

            <Button
              variant="primary"
              className="w-full uppercase mt-4"
              size="large"
              onClick={handleContinue}
              disabled={!identification || !number}
            >
              Continue
            </Button>
          </>
        ) : (
          <>
            <Typography className="font-semibold mb-2">ID & Selfie</Typography>
            <Typography variant="normal">Please add a photo of yourself showing your face and holding your NIN slip or card like shown below. Slip details must be clearly visible.</Typography>

            <div className="w-full h-fit mt-5 flex justify-center">
              <div className="relative w-[200px] h-[191px]">
                <Image 
                  src={photo ? URL.createObjectURL(photo) : "/picture-preview.jpg"} 
                  alt="kyc example" 
                  fill
                  className="mx-auto border border-border100 object-cover rounded-md" 
                />
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={uploadInputRef}
              onChange={handleFileChange}
            />
            <input
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              ref={cameraInputRef}
              onChange={handleFileChange}
            />

            <div className="w-full flex flex-col md:flex-row items-center gap-3 md:gap-5 mt-5">
              <Button
                variant="light"
                className="w-full flex-1 uppercase"
                size="small"
                icon={<UploadIcon />}
                onClick={handleUploadClick}
              >
                upload
              </Button>
              <Button
                variant="light"
                className="w-full flex-1 uppercase"
                size="small"
                icon={<PhotoIcon />}
                onClick={handleCameraClick}
              >
                take a photo
              </Button>
            </div>

            <Button
              variant="primary"
              className="w-full uppercase mt-4"
              size="large"
              onClick={onDone}
              isLoading={isPending}
              disabled={!photo}
            >
              submit kyc
            </Button>
          </>
        )}   
      </div>
    </Modal>
  );
};

export default KycModal;