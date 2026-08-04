"use client";

import { ModalProps } from "@/types";
import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Modal = ({
  isOpen,
  onClose,
  children,
  ariaLabel,
  maxWidth = "max-w-md",
  maxHeight = "max-h-[70vh]",
  bottomRight = false,
  closeOnOverlayClick = true,
  className = "",
}: ModalProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className={`fixed inset-0 ${className.includes('z-') ? '' : 'z-[100]'} flex ${
        bottomRight
          ? "items-end justify-end p-0 pb-6 md:p-6"
          : "items-center justify-center"
      } cursor-pointer bg-appBlack/40 backdrop-blur-sm ${className}`}
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
    </div>,
    document.body
  );
};

export default Modal;
