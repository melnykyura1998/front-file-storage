import type { PropsWithChildren } from "react";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

export function Modal({
  children,
  isOpen,
  onClose,
  title,
}: PropsWithChildren<ModalProps>) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
            aria-label={`Close ${title}`}
          >
            Close
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
