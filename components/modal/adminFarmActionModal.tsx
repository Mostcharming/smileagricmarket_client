"use client"

import { useState } from "react";
import { CloseIcon, CheckIcon } from "../icons";
import Modal from "./modal";
import { Button, Input, Typography } from "../ui";

type ApproveHandler = () => void;
type RejectHandler = (note: string) => void;

export default function AdminFarmActionModal({
  isOpen,
  onClose,
  farmName,
  onApprove,
  onReject,
  isPending,
  initialStep,
}: {
  isOpen: boolean;
  onClose: () => void;
  farmName?: string;
  onApprove: ApproveHandler;
  onReject: RejectHandler;
  isPending?: boolean;
  initialStep?: "approve" | "reject";
}) {
  const step = initialStep || "approve";
  const [note, setNote] = useState("");

  const handleClose = () => {
    setNote("");
    onClose();
  };

  // note is initialized empty; modal resets on close via `handleClose`

  return (
    <Modal isOpen={isOpen} onClose={handleClose} ariaLabel="Admin farm action modal" maxWidth="max-w-md">
      <div className="relative p-6 flex flex-col items-center">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <CloseIcon size={24} />
        </button>

        {/* modal opens directly into approve or reject based on `initialStep` prop */}

        {step === "approve" && (
          <div className="w-full flex flex-col text-center pt-4">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckIcon className="text-green-600" size={32} />
              </div>
            </div>

            <Typography variant="subheading" className="mb-2">Approve {farmName}</Typography>
            <Typography className="text-gray-500 mb-8 px-4">Approving {farmName} indicates you have reviewed their documents & certified they can be listed on the investment marketplace.</Typography>

            <div className="flex w-full gap-4">
              <button className="flex-1 py-3 text-gray-900 font-semibold uppercase hover:bg-gray-50 rounded-lg transition-colors" onClick={handleClose}>CANCEL</button>
              <Button variant="primary" className="flex-1 bg-green-700 hover:bg-green-800 border-none uppercase" onClick={() => onApprove()} isLoading={isPending}>YES, APPROVE</Button>
            </div>
          </div>
        )}

        {step === "reject" && (
          <div className="w-full pt-2">
            <Typography variant="subheading" className="mb-4">Reject {farmName}</Typography>

            <div className="w-full mt-4 mb-6">
              <Input as="textarea" id="rejectNote" value={note} onChange={(e) => setNote(e.target.value)} label="Enter reasons for rejecting this farm" />
            </div>

            <div className="flex w-full gap-4">
              <button className="flex-1 py-3 text-gray-900 font-semibold uppercase hover:bg-gray-50 rounded-lg transition-colors" onClick={handleClose}>CANCEL</button>
              <Button variant="primary" className="flex-1 bg-red-500 hover:bg-red-600 border-none uppercase" onClick={() => onReject(note)} isLoading={isPending} disabled={!note.trim()}>REJECT</Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
