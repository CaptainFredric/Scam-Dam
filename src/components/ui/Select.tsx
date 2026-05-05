import { cn } from "@/lib/utils";
import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export default function Select({ label, error, options, className, id, ...props }: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-sm text-slate-300">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          "bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent",
          error && "border-red-500",
          className
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  );
}
