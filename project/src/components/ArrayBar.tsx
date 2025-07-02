import React from 'react';
import { ArrayElement } from '../types';

interface ArrayBarProps {
  element: ArrayElement;
  index: number;
  maxValue: number;
  isComparing: boolean;
  isSwapping: boolean;
  isSorted: boolean;
}

const ArrayBar: React.FC<ArrayBarProps> = ({
  element,
  index,
  maxValue,
  isComparing,
  isSwapping,
  isSorted,
}) => {
  const height = (element.value / maxValue) * 100;
  
  let colorClass = 'bg-gradient-to-t from-gray-400 to-gray-500 dark:from-gray-500 dark:to-gray-400';
  let shadowClass = 'shadow-sm';
  
  if (isSorted) {
    colorClass = 'bg-gradient-to-t from-emerald-400 to-emerald-500 dark:from-emerald-400 dark:to-emerald-300';
    shadowClass = 'shadow-lg shadow-emerald-500/30';
  } else if (isSwapping) {
    colorClass = 'bg-gradient-to-t from-red-400 to-red-500 dark:from-red-400 dark:to-red-300';
    shadowClass = 'shadow-lg shadow-red-500/30 pulse-glow';
  } else if (isComparing) {
    colorClass = 'bg-gradient-to-t from-amber-400 to-amber-500 dark:from-amber-400 dark:to-amber-300';
    shadowClass = 'shadow-lg shadow-amber-500/30';
  } else {
    colorClass = 'bg-gradient-to-t from-indigo-400 to-indigo-500 dark:from-indigo-400 dark:to-indigo-300';
    shadowClass = 'shadow-md shadow-indigo-500/20';
  }

  // Display original value if available, otherwise display normalized value
  const displayValue = element.originalValue !== undefined ? element.originalValue : element.value;

  return (
    <div
      className={`transition-all duration-300 ease-out rounded-t-lg ${colorClass} ${shadowClass} hover:scale-105 cursor-pointer relative group`}
      style={{
        height: `${Math.max(height, 8)}%`,
        width: '100%',
      }}
      title={`Value: ${displayValue}, Index: ${index}`}
    >
      {/* Hover tooltip */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        {displayValue}
      </div>
      
      {/* Subtle highlight effect */}
      <div className="absolute inset-0 bg-white/20 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      
      {/* Status indicator for sorted elements */}
      {isSorted && (
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
      )}
    </div>
  );
};

export default ArrayBar;