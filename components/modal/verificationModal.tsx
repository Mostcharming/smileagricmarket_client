"use client"

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { CloseIcon, CopyIcon, CheckIcon } from "../icons";
import { Button, Input, Typography } from "../ui";
import Modal from "./modal";
import { VerificationModalProps } from "@/types";

// Import react-viewer dynamically to avoid SSR issues
const Viewer = dynamic(() => import("react-viewer"), { ssr: false });

const VerificationModal = ({
  isOpen,
  onClose,
  user,
  onApprove,
  onReject,
  isPending,
}: VerificationModalProps) => {
  const [step, setStep] = useState<"main" | "approve" | "reject">("main");
  const [rejectReason, setRejectReason] = useState("");
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const kyc = user?.kyc;
  const profile = user?.user;
  const fullName = profile?.fullName || "User";

  if (!user || !kyc) return null;

  const handleCopyNIN = () => {
    if (kyc.identificationNumber) {
      navigator.clipboard.writeText(kyc.identificationNumber);
      toast.success("NIN copied to clipboard");
    }
  };

  const handleApprove = () => {
    onApprove(kyc.id);
  };

  const handleReject = () => {
    onReject(kyc.id, rejectReason);
    setRejectReason("");
  };

  const handleClose = () => {
    setStep("main");
    setRejectReason("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabel="Verification Modal"
      maxWidth="max-w-md"
    >
      <div className="relative p-6 flex flex-col items-center">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <CloseIcon size={24} />
        </button>

        {step === "main" && (
          <>
            <Typography variant="subheading" className="mb-6">
              {fullName}
            </Typography>

            <div className="relative w-32 h-32 mb-4">
              <Image
                src={kyc.selfieImageUrl || "/picture-preview.jpg"}
                alt={fullName}
                fill
                className="rounded-full object-cover border-4 border-gray-100"
              />
            </div>

            <button
              onClick={() => setIsViewerOpen(true)}
              className="text-primary font-medium text-sm mb-8 uppercase tracking-wide hover:underline"
            >
              View Full Image
            </button>

            <div className="text-center mb-8">
              <Typography className="text-gray-500 mb-1">
                Identification Number (NIN)
              </Typography>
              <div className="flex items-center justify-center gap-2">
                <Typography className="text-gray-900 font-medium text-lg">
                  {kyc.identificationNumber || "N/A"}
                </Typography>
                {kyc.identificationNumber && (
                  <button
                    onClick={handleCopyNIN}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <CopyIcon size={20} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex w-full gap-4 mt-4">
              <Button
                variant="primary"
                className="flex-1 bg-red-500 hover:bg-red-600 border-none uppercase"
                onClick={() => setStep("reject")}
              >
                Reject
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-green-600 hover:bg-green-700 border-none uppercase"
                onClick={() => setStep("approve")}
              >
                Approve
              </Button>
            </div>
          </>
        )}

        {step === "approve" && (
          <div className="w-full flex flex-col text-center pt-4">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckIcon className="text-green-600" size={32} />
              </div>
            </div>

            <Typography variant="subheading" className="mb-2">
              Approve {fullName}
            </Typography>
            <Typography className="text-gray-500 mb-8 px-4">
              You have confirmed that {fullName} is authentic & will be verified.
            </Typography>

            <div className="flex w-full gap-4">
              <button
                className="flex-1 py-3 text-gray-900 font-semibold uppercase hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setStep("main")}
              >
                Cancel
              </button>
              <Button
                variant="primary"
                className="flex-1 bg-green-700 hover:bg-green-800 border-none uppercase"
                onClick={handleApprove}
                isLoading={isPending}
              >
                Yes, Approve
              </Button>
            </div>
          </div>
        )}

        {step === "reject" && (
          <div className="w-full pt-2">
            <Typography variant="subheading" className="mb-6">
              Reject {fullName}
            </Typography>

            <div className="w-full mt-4 mb-8">
              <Input 
                as="textarea" 
                id="rejectReason" 
                value={rejectReason} 
                onChange={(e) => setRejectReason(e.target.value)}
                label="Enter a reason for rejecting this user" 
              />
            </div>

            <div className="flex w-full gap-4">
              <button
                className="flex-1 py-3 text-gray-900 font-semibold uppercase hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setStep("main")}
              >
                Cancel
              </button>
              <Button
                variant="primary"
                className="flex-1 bg-red-500 hover:bg-red-600 border-none uppercase"
                onClick={handleReject}
                isLoading={isPending}
                disabled={!rejectReason.trim()}
              >
                Reject
              </Button>
            </div>
          </div>
        )}
      </div>

      <Viewer
        visible={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        images={[{ src: kyc.selfieImageUrl || "/picture-preview.jpg", alt: fullName }]}
        zIndex={1000}
      />
    </Modal>
  );
};

export default VerificationModal;
