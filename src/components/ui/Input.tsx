import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ className, id, label, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label className="flex w-full flex-col gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
      <span>{label}</span>
      <input
        id={inputId}
        className={clsx(
          "rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white",
          className,
        )}
        {...props}
      />
    </label>
  );
}
