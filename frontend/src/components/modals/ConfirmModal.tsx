"use client";

import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import DangerButton from "../buttons/DangerButton";
import SecondaryButton from "../buttons/SecondaryButton";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  variant?: "danger" | "warning";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  variant = "danger",
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      closeOnOverlayClick={!loading}
    >
      <div className="flex flex-col items-center text-center">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full ${
            variant === "danger" ? "bg-red-50" : "bg-amber-50"
          }`}
        >
          <AlertTriangle
            className={`h-7 w-7 ${
              variant === "danger" ? "text-red-600" : "text-amber-600"
            }`}
          />
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-6 flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <SecondaryButton
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </SecondaryButton>

          <DangerButton
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </DangerButton>
        </div>
      </div>
    </Modal>
  );
}