"use client"

import { useState } from "react";
import Modal from "./modal";
import { ArrowLeftIcon, CloseIcon, PhotoIcon, UploadIcon } from "../icons";
import { Button, Input, Select, Typography } from "../ui";
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
  // setPhoto,
  isPending,
  onDone,
}: KycModalProps) => {
  const [step, setStep] = useState<1 | 2>(1)

  const handleSubmit = () => {
    setTimeout(() => {
      onDone();
    }, 900);
  };

  const handleContinue = () => {
    setStep(2);
  }

  const handleBack = () => {
    setStep(1);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="kyc modal"
      maxHeight="h-fit max-h-[85vh]"
    >
      <div className="w-full flex flex-col px-6 py-7">
        <div className="flex items-center justify-between gap-2  mb-3">
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

            <div className="w-full flex items-center gap-5 mt-4">
              <Button
                variant="light"
                className="flex-1 uppercase"
                size="small"
                icon={<UploadIcon />}
                // onClick={handleUpload}
              >
                upload
              </Button>
              <Button
                variant="light"
                className="flex-1 uppercase"
                size="small"
                icon={<PhotoIcon />}
                // onClick={handleUpload}
              >
                take a photo
              </Button>
            </div>

            <Button
              variant="primary"
              className="w-full uppercase mt-4"
              size="large"
              onClick={handleSubmit}
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