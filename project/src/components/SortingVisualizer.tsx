import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SortingAlgorithm, ArrayElement, SortingStep, SortingState } from '../types';
import { generateRandomArray, parseCustomArray } from '../utils/arrayGenerator';
import { algorithmMap } from '../algorithms';
import Header from './Header';
import Controls from './Controls';
import ArrayBar from './ArrayBar';
import Statistics from './Statistics';
import AlgorithmInfo from './AlgorithmInfo';

const SortingVisualizer: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>('bubble');
  const [arraySize, setArraySize] = useState<number>(50);
  const [speed, setSpeed] = useState<number>(50);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showAlgorithmInfo, setShowAlgorithmInfo] = useState<boolean>(false);
  const [showGeneralInfo, setShowGeneralInfo] = useState<boolean>(false);
  const [statistics, setStatistics] = useState({
    comparisons: 0,
    swaps: 0,
    timeElapsed: 0,
    startTime: 0
  });
  
  const [sortingState, setSortingState] = useState<SortingState>({
    array: generateRandomArray(50),
    isRunning: false,
    isCompleted: false,
    currentStep: 0,
    steps: [],
  });

  const animationRef = useRef<number>();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Timer for statistics
  useEffect(() => {
    if (sortingState.isRunning) {
      setStatistics(prev => ({ ...prev, startTime: Date.now() }));
      intervalRef.current = setInterval(() => {
        setStatistics(prev => ({
          ...prev,
          timeElapsed: Date.now() - prev.startTime
        }));
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sortingState.isRunning]);

  const generateNewArray = useCallback(() => {
    if (sortingState.isRunning) return;
    
    const newArray = generateRandomArray(arraySize);
    setSortingState({
      array: newArray,
      isRunning: false,
      isCompleted: false,
      currentStep: 0,
      steps: [],
    });
    
    setStatistics({
      comparisons: 0,
      swaps: 0,
      timeElapsed: 0,
      startTime: 0
    });
  }, [arraySize, sortingState.isRunning]);

  const handleCustomArray = useCallback((input: string): boolean => {
    if (sortingState.isRunning) return false;
    
    const customArray = parseCustomArray(input);
    if (!customArray) return false;
    
    setSortingState({
      array: customArray,
      isRunning: false,
      isCompleted: false,
      currentStep: 0,
      steps: [],
    });
    
    setArraySize(customArray.length);
    setStatistics({
      comparisons: 0,
      swaps: 0,
      timeElapsed: 0,
      startTime: 0
    });
    
    return true;
  }, [sortingState.isRunning]);

  const resetSort = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setSortingState(prev => ({
      ...prev,
      isRunning: false,
      isCompleted: false,
      currentStep: 0,
      array: prev.steps.length > 0 ? prev.steps[0].array : prev.array,
    }));
    
    setStatistics({
      comparisons: 0,
      swaps: 0,
      timeElapsed: 0,
      startTime: 0
    });
  }, []);

  const startSorting = useCallback(() => {
    if (sortingState.isRunning || sortingState.isCompleted) return;

    const steps = algorithmMap[algorithm](sortingState.array);
    setSortingState(prev => ({
      ...prev,
      steps,
      isRunning: true,
      currentStep: 0,
    }));

    let currentStepIndex = 0;
    let comparisons = 0;
    let swaps = 0;

    const animate = () => {
      if (currentStepIndex >= steps.length) {
        setSortingState(prev => ({
          ...prev,
          isRunning: false,
          isCompleted: true,
        }));
        return;
      }

      const currentStep = steps[currentStepIndex];
      
      // Count operations for statistics
      if (currentStep.comparing) comparisons++;
      if (currentStep.swapping) swaps++;
      
      setStatistics(prev => ({
        ...prev,
        comparisons,
        swaps
      }));

      setSortingState(prev => ({
        ...prev,
        array: currentStep.array,
        currentStep: currentStepIndex,
      }));

      currentStepIndex++;

      timeoutRef.current = setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate);
      }, speed);
    };

    animate();
  }, [algorithm, sortingState.array, sortingState.isRunning, sortingState.isCompleted, speed]);

  const stopSorting = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setSortingState(prev => ({
      ...prev,
      isRunning: false,
    }));
  }, []);

  const handleArraySizeChange = (size: number) => {
    if (sortingState.isRunning) return;
    
    setArraySize(size);
    const newArray = generateRandomArray(size);
    setSortingState({
      array: newArray,
      isRunning: false,
      isCompleted: false,
      currentStep: 0,
      steps: [],
    });
    
    setStatistics({
      comparisons: 0,
      swaps: 0,
      timeElapsed: 0,
      startTime: 0
    });
  };

  // Get current step data for highlighting
  const getCurrentStepData = () => {
    if (sortingState.steps.length === 0 || sortingState.currentStep >= sortingState.steps.length) {
      return { comparing: [], swapping: [], sorted: [] };
    }

    const step = sortingState.steps[sortingState.currentStep];
    return {
      comparing: step.comparing || [],
      swapping: step.swapping || [],
      sorted: step.sorted || [],
    };
  };

  const { comparing, swapping, sorted } = getCurrentStepData();
  const maxValue = Math.max(...sortingState.array.map(el => el.value));

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <Header 
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onShowInfo={() => setShowGeneralInfo(true)}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Statistics */}
        <Statistics
          comparisons={statistics.comparisons}
          swaps={statistics.swaps}
          timeElapsed={statistics.timeElapsed}
          isCompleted={sortingState.isCompleted}
          arraySize={arraySize}
        />

        {/* Controls */}
        <Controls
          algorithm={algorithm}
          onAlgorithmChange={setAlgorithm}
          arraySize={arraySize}
          onArraySizeChange={handleArraySizeChange}
          speed={speed}
          onSpeedChange={setSpeed}
          isRunning={sortingState.isRunning}
          isCompleted={sortingState.isCompleted}
          onStart={startSorting}
          onStop={stopSorting}
          onReset={resetSort}
          onGenerateArray={generateNewArray}
          onCustomArray={handleCustomArray}
          onShowAlgorithmInfo={() => setShowAlgorithmInfo(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />

        {/* Visualization Area */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <div className="h-96 flex items-end justify-center gap-1 overflow-hidden bg-gradient-to-t from-gray-50 to-transparent dark:from-gray-900/50 dark:to-transparent rounded-xl p-4">
            {sortingState.array.map((element, index) => (
              <ArrayBar
                key={element.id}
                element={element}
                index={index}
                maxValue={maxValue}
                isComparing={comparing.includes(index)}
                isSwapping={swapping.includes(index)}
                isSorted={sorted.includes(index) || sortingState.isCompleted}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-8 mt-8 text-sm">
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-full">
              <div className="w-4 h-4 bg-gradient-to-t from-indigo-400 to-indigo-500 rounded-sm shadow-sm"></div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Unsorted</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-full">
              <div className="w-4 h-4 bg-gradient-to-t from-amber-400 to-amber-500 rounded-sm shadow-sm"></div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Comparing</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-full">
              <div className="w-4 h-4 bg-gradient-to-t from-red-400 to-red-500 rounded-sm shadow-sm"></div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Swapping</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-full">
              <div className="w-4 h-4 bg-gradient-to-t from-emerald-400 to-emerald-500 rounded-sm shadow-sm"></div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Sorted</span>
            </div>
          </div>

          {/* Status */}
          <div className="text-center mt-6">
            {sortingState.isRunning && (
              <div className="inline-flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-6 py-3 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <p className="font-medium">
                  Sorting in progress... Step {sortingState.currentStep + 1} of {sortingState.steps.length}
                </p>
              </div>
            )}

            {sortingState.isCompleted && (
              <div className="inline-flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-6 py-3 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <p className="font-semibold">
                  Sorting completed! Array is now perfectly sorted.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Algorithm Info Modal */}
      <AlgorithmInfo
        algorithm={algorithm}
        isOpen={showAlgorithmInfo}
        onClose={() => setShowAlgorithmInfo(false)}
      />

      {/* General Info Modal */}
      {showGeneralInfo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">About SortViz</h2>
                <button
                  onClick={() => setShowGeneralInfo(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                SortViz is an interactive sorting algorithm visualizer designed to help you understand how different sorting algorithms work through beautiful animations and real-time statistics.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Features:</h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                    <li>6 different sorting algorithms with detailed information</li>
                    <li>Real-time statistics tracking (comparisons, swaps, time)</li>
                    <li>Custom array input for testing specific scenarios</li>
                    <li>Adjustable speed and array size controls</li>
                    <li>Beautiful dark/light mode themes</li>
                    <li>Responsive design for all devices</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Perfect for:</h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Computer Science students learning algorithms</li>
                    <li>Educators teaching sorting concepts</li>
                    <li>Developers preparing for technical interviews</li>
                    <li>Anyone curious about how sorting works</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortingVisualizer;