import React from "react";

export default function StepBreakdown({ step, stepNum }: { step: any; stepNum: number }) {
  if (!step) return null;
  return (
    <div className="mt-2 p-2 bg-gray-50 rounded">
      <div>Step: {stepNum}</div>
      <div>
        {step.swapped
          ? "Swapped elements"
          : step.highlight
          ? "Comparing elements"
          : ""}
        {step.highlight && <span>: {step.highlight.join(", ")}</span>}
      </div>
    </div>
  );
}
