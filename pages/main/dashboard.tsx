'use client'

import { useState } from "react";
import KycModal from "../../components/modal/kycModal";
import { Button } from "../../components/ui";
import { useSubmitKyc } from "@/mutation";
import { SelectOptions } from "@/types";
import { toast } from "sonner";

const Dashboard = () => {
  const [verificationStatus, setVerificationStatus] = useState<"not_verified" | "in_progress" | "verified">("not_verified");
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  
  // KycModal state
  const [number, setNumber] = useState("");
  const [identification, setIdentification] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const { mutate, isPending } = useSubmitKyc();

  const identificationOptions: SelectOptions[] = [
    { label: "National ID Card", value: "national_id" },
    { label: "International Passport", value: "passport" },
    { label: "Driver's License", value: "driver_license" },
    { label: "Taxpayer Identification Number", value: "tin" },
    { label: "Permanent Voter's Card", value: "voter_card" },
  ];

  const handleKycDone = () => {
    if (!photo) {
        toast.error("Please upload a photo");
        return;
    }
    
    const formData = new FormData();
    formData.append("identificationType", identification);
    formData.append("identificationNumber", number);
    formData.append("selfie", photo);

    mutate(formData, {
        onSuccess: () => {
            toast.success("KYC submitted successfully");
            setIsKycModalOpen(false);
            setVerificationStatus("in_progress");
            setNumber("");
            setIdentification("");
            setPhoto(null);
        },
        onError: (error) => {
            toast.error(error?.message || "Failed to submit KYC");
        }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-20 px-4">
      {verificationStatus === "not_verified" && (
        <div className="w-full max-w-4xl bg-[#F3F4F6] p-4 rounded-md flex flex-col sm:flex-row items-center justify-between gap-4 mb-20">
          <div className="flex items-center gap-3">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V12" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16H12.01" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-gray-700 text-sm sm:text-base">You are not verified yet. Please proceed to verify your profile to list your farms.</span>
          </div>
          <Button 
            variant="primary" 
            className="whitespace-nowrap"
            onClick={() => setIsKycModalOpen(true)}
          >
            VERIFY YOUR PROFILE
          </Button>
        </div>
      )}

      {verificationStatus === "in_progress" && (
        <div className="w-full max-w-4xl bg-[#F3F4F6] p-4 rounded-md flex items-center gap-3 mb-20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8V12" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16H12.01" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          <span className="text-gray-700">Your verification is in progress</span>
        </div>
      )}

      <h1 className="text-2xl sm:text-3xl font-semibold text-black text-center">THIS IS THE FARMER DASHBOARD</h1>

      <KycModal
        isOpen={isKycModalOpen}
        onClose={() => setIsKycModalOpen(false)}
        number={number}
        setNumber={setNumber}
        identification={identification}
        setIdentification={setIdentification}
        identificationOptions={identificationOptions}
        photo={photo}
        setPhoto={setPhoto}
        isPending={isPending}
        onDone={handleKycDone}
      />
    </div>
  );
};

export default Dashboard;
