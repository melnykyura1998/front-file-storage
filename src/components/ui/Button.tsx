import clsx from "clsx";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-700 focus-visible:outline-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200",
  secondary:
    "bg-slate-200 text-slate-900 hover:bg-slate-300 focus-visible:outline-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-400 dark:text-slate-200 dark:hover:bg-slate-800",
  danger:
    "bg-rose-600 text-white hover:bg-rose-500 focus-visible:outline-rose-500",
};

export function Button({
  children,
  className,
  fullWidth = false,
  type = "button",
  variant = "primary",
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
