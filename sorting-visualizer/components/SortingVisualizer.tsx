import React, { useState, useRef } from "react";
import Controls from "./Controls";
import PerformanceAnalytics from "./PerformanceAnalytics";
import ComplexityAnalysis from "./ComplexityAnalysis";
import StepBreakdown from "./StepBreakdown";

const ARRAY_CONFIGS = 100;

type Step = {
  array: number[];
  highlight: number[];
  swapped?: boolean;
};

function generateArray(config: number = 0, size: number = 50): number[] {
  switch (config % 5) {
    case 0:
      return Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    case 1:
      return Array.from({ length: size }, (_, i) => i + 1);
    case 2:
      return Array.from({ length: size }, (_, i) => size - i);
    case 3:
      return Array.from({ length: size }, (_, i) => (i % 2 === 0 ? i : size - i));
    default:
      return Array.from({ length: size }, () => Math.floor(Math.random() * 100));
  }
}

export default function SortingVisualizer() {
  const [array, setArray] = useState<number[]>(generateArray());
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(100);
  const [config, setConfig] = useState<number>(0);
  const [analytics, setAnalytics] = useState<{ comparisons?: number; swaps?: number; time?: number }>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  function bubbleSort(arr: number[]): Step[] {
    const steps: Step[] = [];
    let a = [...arr];
    let n = a.length;
    let comparisons = 0,
      swaps = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        comparisons++;
        steps.push({ array: [...a], highlight: [j, j + 1] });
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          swaps++;
          steps.push({ array: [...a], highlight: [j, j + 1], swapped: true });
        }
      }
    }
    setAnalytics({ comparisons, swaps, time: 0 });
    return steps;
  }

  function startSort() {
    const sortSteps = bubbleSort(array);
    setSteps(sortSteps);
    setCurrentStep(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < sortSteps.length - 1) return prev + 1;
        if (intervalRef.current) clearInterval(intervalRef.current);
        return prev;
      });
    }, speed);
  }

  function handleSpeedChange(val: number) {
    setSpeed(val);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      startSort();
    }
  }

  function handleConfigChange(idx: number) {
    setConfig(idx);
    setArray(generateArray(idx));
    setSteps([]);
    setCurrentStep(0);
  }

  return (
    <div className="p-4">
      <Controls
        onStart={startSort}
        speed={speed}
        onSpeedChange={handleSpeedChange}
        config={config}
        onConfigChange={handleConfigChange}
        maxConfig={ARRAY_CONFIGS}
      />
      <div className="flex items-end h-64 bg-gray-100 rounded my-4">
        {steps.length > 0
          ? steps[currentStep].array.map((val: number, idx: number) => (
              <div
                key={idx}
                className={`mx-0.5 w-2 bg-blue-500 transition-all duration-75 ${
                  steps[currentStep].highlight?.includes(idx)
                    ? "bg-red-500"
                    : ""
                }`}
                style={{ height: `${val * 2}px` }}
              />
            ))
          : array.map((val: number, idx: number) => (
              <div
                key={idx}
                className="mx-0.5 w-2 bg-blue-500"
                style={{ height: `${val * 2}px` }}
              />
            ))}
      </div>
      <StepBreakdown step={steps[currentStep]} stepNum={currentStep} />
      <PerformanceAnalytics analytics={analytics} />
      <ComplexityAnalysis algorithm="Bubble Sort" />
    </div>
  );
}
