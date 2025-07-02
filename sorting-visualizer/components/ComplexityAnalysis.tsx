import React from "react";

const complexities: Record<string, any> = {
  "Bubble Sort": {
    time: "O(n²)",
    space: "O(1)",
    description: "Simple comparison-based sort. Inefficient for large arrays.",
  },
  // Add more algorithms as needed
};

export default function ComplexityAnalysis({ algorithm }: { algorithm: string }) {
  const info = complexities[algorithm] || {};
  return (
    <div className="mt-4 p-2 bg-white rounded shadow">
      <div>
        <strong>{algorithm}</strong>
      </div>
      <div>Time Complexity: {info.time}</div>
      <div>Space Complexity: {info.space}</div>
      <div className="text-xs text-gray-500">{info.description}</div>
    </div>
  );
}
