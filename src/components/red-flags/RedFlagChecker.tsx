"use client";

import { useState } from "react";
import type { Case } from "@/types/database";
import { redFlags, getFlagsForScamType } from "@/data/redFlags";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface RedFlagCheckerProps {
  caseData: Case;
}

export default function RedFlagChecker({ caseData }: RedFlagCheckerProps) {
  const relevant = getFlagsForScamType(caseData.scam_type);
  const others = redFlags.filter(
    (f) => !f.scam_types.includes(caseData.scam_type)
  );

  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const checkedCount = checked.size;

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h2 className="font-semibold text-white">Red Flags Identified</h2>
        </div>
        <p className="text-slate-400 text-sm mb-4">
          Check every red flag that applies to your case. This strengthens your report by demonstrating a known scam pattern.
        </p>
        <div className="bg-red-500/10 border border-red-500/30 rounded-md px-4 py-2 text-red-400 text-sm font-semibold">
          {checkedCount} of {redFlags.length} red flags identified in your case
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
        <h3 className="font-semibold text-white mb-4">
          Common for {caseData.scam_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        </h3>
        <div className="space-y-3">
          {relevant.map((flag) => (
            <label
              key={flag.id}
              className="flex items-start gap-3 cursor-pointer group"
            >
              <div className="flex-shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={checked.has(flag.id)}
                  onChange={() => toggle(flag.id)}
                  className="sr-only"
                />
                <div
                  className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                    checked.has(flag.id)
                      ? "bg-red-600 border-red-600"
                      : "border-slate-600 group-hover:border-slate-500"
                  }`}
                >
                  {checked.has(flag.id) && (
                    <CheckCircle className="h-3.5 w-3.5 text-white" />
                  )}
                </div>
              </div>
              <div>
                <p className={`text-sm font-medium ${checked.has(flag.id) ? "text-red-400" : "text-slate-300"}`}>
                  {flag.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{flag.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {others.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-4">Other Red Flags (Cross-Scam)</h3>
          <div className="space-y-3">
            {others.map((flag) => (
              <label
                key={flag.id}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={checked.has(flag.id)}
                    onChange={() => toggle(flag.id)}
                    className="sr-only"
                  />
                  <div
                    className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                      checked.has(flag.id)
                        ? "bg-red-600 border-red-600"
                        : "border-slate-600 group-hover:border-slate-500"
                    }`}
                  >
                    {checked.has(flag.id) && (
                      <CheckCircle className="h-3.5 w-3.5 text-white" />
                    )}
                  </div>
                </div>
                <div>
                  <p className={`text-sm font-medium ${checked.has(flag.id) ? "text-red-400" : "text-slate-300"}`}>
                    {flag.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{flag.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
