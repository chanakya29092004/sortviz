import React, { useState } from 'react';
import { Play, Square, RotateCcw, Shuffle, Sun, Moon, Plus, Info, Zap, Settings } from 'lucide-react';
import { SortingAlgorithm } from '../types';
import { algorithmNames } from '../algorithms';
import { validateCustomArrayInput } from '../utils/arrayGenerator';

interface ControlsProps {
  algorithm: SortingAlgorithm;
  onAlgorithmChange: (algorithm: SortingAlgorithm) => void;
  arraySize: number;
  onArraySizeChange: (size: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  isRunning: boolean;
  isCompleted: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onGenerateArray: () => void;
  onCustomArray: (input: string) => boolean;
  onShowAlgorithmInfo: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  algorithm,
  onAlgorithmChange,
  arraySize,
  onArraySizeChange,
  speed,
  onSpeedChange,
  isRunning,
  isCompleted,
  onStart,
  onStop,
  onReset,
  onGenerateArray,
  onCustomArray,
  onShowAlgorithmInfo,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInputError, setCustomInputError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleCustomArraySubmit = () => {
    const error = validateCustomArrayInput(customInput);
    if (error) {
      setCustomInputError(error);
      return;
    }

    const success = onCustomArray(customInput);
    if (success) {
      setCustomInput('');
      setShowCustomInput(false);
      setCustomInputError(null);
    } else {
      setCustomInputError('Failed to parse array. Please check your input.');
    }
  };

  const handleCustomInputChange = (value: string) => {
    setCustomInput(value);
    if (customInputError) {
      setCustomInputError(null);
    }
  };

  const getSpeedLabel = (speed: number) => {
    if (speed <= 20) return 'Lightning';
    if (speed <= 50) return 'Fast';
    if (speed <= 100) return 'Normal';
    if (speed <= 150) return 'Slow';
    return 'Turtle';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 border border-gray-100 dark:border-gray-700">
      {/* Main Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Algorithm Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Algorithm
            </label>
            <button
              onClick={onShowAlgorithmInfo}
              className="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title="Algorithm Information"
            >
              <Info size={16} />
            </button>
          </div>
          <select
            value={algorithm}
            onChange={(e) => onAlgorithmChange(e.target.value as SortingAlgorithm)}
            disabled={isRunning}
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 transition-all duration-200 hover:border-indigo-300"
          >
            {Object.entries(algorithmNames).map(([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Array Size */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Array Size: <span className="text-indigo-600 dark:text-indigo-400 font-mono">{arraySize}</span>
          </label>
          <div className="relative">
            <input
              type="range"
              min="5"
              max="100"
              value={arraySize}
              onChange={(e) => onArraySizeChange(Number(e.target.value))}
              disabled={isRunning}
              className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* Speed */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Speed: <span className="text-indigo-600 dark:text-indigo-400">{getSpeedLabel(speed)}</span>
          </label>
          <div className="relative">
            <input
              type="range"
              min="1"
              max="200"
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              disabled={isRunning}
              className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Fast</span>
              <span>Slow</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Array Input */}
      {showCustomInput && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Custom Array Input
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={customInput}
              onChange={(e) => handleCustomInputChange(e.target.value)}
              placeholder="e.g., 64, 34, 25, 12, 22, 11, 90"
              disabled={isRunning}
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
            />
            <button
              onClick={handleCustomArraySubmit}
              disabled={isRunning || !customInput.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl transition-all duration-200 disabled:cursor-not-allowed font-medium"
            >
              Apply
            </button>
            <button
              onClick={() => {
                setShowCustomInput(false);
                setCustomInput('');
                setCustomInputError(null);
              }}
              disabled={isRunning}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-xl transition-colors duration-200 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
          {customInputError && (
            <p className="mt-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
              {customInputError}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Enter 2-100 numbers separated by commas. Values will be normalized for visualization.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {/* Primary Actions */}
        <button
          onClick={isRunning ? onStop : onStart}
          disabled={isCompleted && !isRunning}
          className={`flex items-center gap-2 px-6 py-3 ${
            isRunning 
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
          } disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl transition-all duration-200 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:scale-105`}
        >
          {isRunning ? <Square size={18} /> : <Play size={18} />}
          {isRunning ? 'Stop' : 'Start Sorting'}
        </button>

        <button
          onClick={onReset}
          disabled={isRunning}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl transition-all duration-200 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <RotateCcw size={18} />
          Reset
        </button>

        {/* Secondary Actions */}
        <button
          onClick={onGenerateArray}
          disabled={isRunning}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl transition-all duration-200 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Shuffle size={18} />
          Random Array
        </button>

        <button
          onClick={() => setShowCustomInput(!showCustomInput)}
          disabled={isRunning}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl transition-all duration-200 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus size={18} />
          Custom Array
        </button>

        {/* Utility Actions */}
        <div className="ml-auto flex gap-3">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors duration-200"
          >
            <Settings size={18} />
          </button>

          <button
            onClick={onToggleDarkMode}
            className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-colors duration-200"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Zap size={16} />
            Advanced Settings
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Animation Frame Rate:</span>
              <span className="font-mono text-gray-900 dark:text-white">60 FPS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Rendering Mode:</span>
              <span className="font-mono text-gray-900 dark:text-white">Hardware Accelerated</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Memory Usage:</span>
              <span className="font-mono text-gray-900 dark:text-white">Optimized</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Color Scheme:</span>
              <span className="font-mono text-gray-900 dark:text-white">{isDarkMode ? 'Dark' : 'Light'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Controls;