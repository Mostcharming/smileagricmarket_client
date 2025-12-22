"use client";

import { ModalProps } from "@/types";
import { useRef, useEffect } from "react";

const Modal = ({
  isOpen,
  onClose,
  children,
  ariaLabel,
  maxWidth = "max-w-md",
  maxHeight = "max-h-[70vh]",
  bottomRight = false,
  closeOnOverlayClick = true,
}: ModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const focusableEls = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableEls.length) focusableEls[0].focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-50 flex ${
        bottomRight
          ? "items-end justify-end p-0 pb-6 md:p-6"
          : "items-center justify-center"
      } cursor-pointer bg-appBlack/40 backdrop-blur-sm`}
      aria-modal="true"
      role="dialog"
      aria-label={ariaLabel || "Modal"}
      onClick={(e) => {
        if (e.target === overlayRef.current && closeOnOverlayClick) onClose();
      }}
    >
      <div
        ref={modalRef}
        className={`bg-appWhite rounded-xl shadow-xl p-0 w-[95%] relative cursor-default! focus:outline-none ${maxWidth} ${maxHeight} max-md:mx-auto overflow-y-auto`}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
