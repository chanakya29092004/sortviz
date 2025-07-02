import React from "react";

export default function Controls({
  onStart,
  speed,
  onSpeedChange,
  config,
  onConfigChange,
  maxConfig,
}: {
  onStart: () => void;
  speed: number;
  onSpeedChange: (val: number) => void;
  config: number;
  onConfigChange: (idx: number) => void;
  maxConfig: number;
}) {
  return (
    <div className="flex gap-4 items-center">
      <button className="btn btn-primary" onClick={onStart}>
        Start
      </button>
      <label>
        Speed:
        <input
          type="range"
          min="10"
          max="1000"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="mx-2"
        />
        {speed}ms
      </label>
      <label>
        Array Config:
        <input
          type="number"
          min="0"
          max={maxConfig - 1}
          value={config}
          onChange={(e) => onConfigChange(Number(e.target.value))}
          className="mx-2 w-16"
        />
      </label>
    </div>
  );
}
