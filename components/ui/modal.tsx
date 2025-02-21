"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useClickAway } from "@/hooks/useClickAway";
import { FocusScope } from "@/hooks/useFocusScope";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
  preventScroll?: boolean;
}

const modalSizes = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[95vw]",
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = "md",
  showCloseButton = true,
  closeOnEscape = true,
  closeOnClickOutside = true,
  preventScroll = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useClickAway(contentRef, () => {
    if (closeOnClickOutside && isOpen) {
      onClose();
    }
  });

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeOnEscape, isOpen, onClose]);

  // Handle scroll lock
  useEffect(() => {
    if (preventScroll) {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, preventScroll]);

  // Animation variants
  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  const modalVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      y: -10,
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 400,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <FocusScope>
          <div
            ref={modalRef}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6 sm:px-6 sm:py-8"
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true"
          >
            {/* Backdrop */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Modal Panel */}
            <motion.div
              ref={contentRef}
              initial="closed"
              animate="open"
              exit="closed"
              variants={modalVariants}
              className={cn(
                "relative w-full rounded-2xl bg-white shadow-2xl",
                "ring-1 ring-black/5",
                modalSizes[size],
                className
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-gray-900 tracking-tight"
                >
                  {title}
                </h2>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="px-6 py-4">{children}</div>
            </motion.div>
          </div>
        </FocusScope>
      )}
    </AnimatePresence>
  );
}
