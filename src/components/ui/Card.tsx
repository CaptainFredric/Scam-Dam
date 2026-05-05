import { cn } from "@/lib/utils";
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "bg-slate-800 border border-slate-700 rounded-xl p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
