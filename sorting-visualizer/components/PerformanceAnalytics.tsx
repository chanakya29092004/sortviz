import React from "react";

export default function PerformanceAnalytics({ analytics }: { analytics: any }) {
  return (
    <div className="mt-4 p-2 bg-white rounded shadow">
      <div>Comparisons: {analytics.comparisons ?? 0}</div>
      <div>Swaps: {analytics.swaps ?? 0}</div>
      <div>Time: {analytics.time ?? 0} ms</div>
    </div>
  );
}
