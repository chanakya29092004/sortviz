import React from 'react';
import { X, Clock, Zap, TrendingUp } from 'lucide-react';
import { SortingAlgorithm } from '../types';

interface AlgorithmInfoProps {
  algorithm: SortingAlgorithm;
  isOpen: boolean;
  onClose: () => void;
}

const algorithmDetails = {
  bubble: {
    name: 'Bubble Sort',
    description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    stability: 'Stable',
    bestCase: 'O(n)',
    worstCase: 'O(n²)',
    color: 'from-blue-500 to-cyan-500',
    pros: ['Simple to understand', 'In-place sorting', 'Stable algorithm'],
    cons: ['Very inefficient for large datasets', 'O(n²) time complexity']
  },
  selection: {
    name: 'Selection Sort',
    description: 'Finds the minimum element and places it at the beginning, then repeats for the remaining unsorted portion.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    stability: 'Unstable',
    bestCase: 'O(n²)',
    worstCase: 'O(n²)',
    color: 'from-green-500 to-emerald-500',
    pros: ['Simple implementation', 'In-place sorting', 'Performs well on small lists'],
    cons: ['Inefficient for large datasets', 'Not stable', 'Always O(n²)']
  },
  insertion: {
    name: 'Insertion Sort',
    description: 'Builds the final sorted array one item at a time, inserting each element into its correct position.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    stability: 'Stable',
    bestCase: 'O(n)',
    worstCase: 'O(n²)',
    color: 'from-purple-500 to-pink-500',
    pros: ['Efficient for small datasets', 'Adaptive algorithm', 'Stable and in-place'],
    cons: ['Inefficient for large datasets', 'O(n²) average case']
  },
  merge: {
    name: 'Merge Sort',
    description: 'Divides the array into halves, sorts them separately, then merges the sorted halves back together.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    stability: 'Stable',
    bestCase: 'O(n log n)',
    worstCase: 'O(n log n)',
    color: 'from-orange-500 to-red-500',
    pros: ['Consistent O(n log n) performance', 'Stable algorithm', 'Predictable performance'],
    cons: ['Requires additional memory', 'Not in-place', 'Slower for small arrays']
  },
  quick: {
    name: 'Quick Sort',
    description: 'Selects a pivot element and partitions the array around it, then recursively sorts the sub-arrays.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    stability: 'Unstable',
    bestCase: 'O(n log n)',
    worstCase: 'O(n²)',
    color: 'from-yellow-500 to-orange-500',
    pros: ['Very fast average case', 'In-place sorting', 'Cache-efficient'],
    cons: ['Worst case O(n²)', 'Not stable', 'Performance depends on pivot selection']
  },
  heap: {
    name: 'Heap Sort',
    description: 'Builds a max heap from the array, then repeatedly extracts the maximum element to build the sorted array.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    stability: 'Unstable',
    bestCase: 'O(n log n)',
    worstCase: 'O(n log n)',
    color: 'from-indigo-500 to-purple-500',
    pros: ['Consistent O(n log n) performance', 'In-place sorting', 'Good worst-case performance'],
    cons: ['Not stable', 'Complex implementation', 'Poor cache performance']
  }
};

const AlgorithmInfo: React.FC<AlgorithmInfoProps> = ({ algorithm, isOpen, onClose }) => {
  if (!isOpen) return null;

  const info = algorithmDetails[algorithm];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`bg-gradient-to-r ${info.color} p-6 rounded-t-2xl text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
          
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">{info.name}</h2>
              <p className="text-white/90 text-lg">{info.description}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Complexity Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
              <Clock className="mx-auto mb-2 text-blue-500" size={24} />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Time Complexity</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{info.timeComplexity}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
              <Zap className="mx-auto mb-2 text-green-500" size={24} />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Space Complexity</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{info.spaceComplexity}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
              <TrendingUp className="mx-auto mb-2 text-purple-500" size={24} />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Stability</h3>
              <p className={`text-2xl font-bold ${info.stability === 'Stable' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {info.stability}
              </p>
            </div>
          </div>

          {/* Performance Details */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Performance Analysis</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Best Case:</span>
                <span className="ml-2 font-mono font-semibold text-green-600 dark:text-green-400">{info.bestCase}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Worst Case:</span>
                <span className="ml-2 font-mono font-semibold text-red-600 dark:text-red-400">{info.worstCase}</span>
              </div>
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Advantages
              </h3>
              <ul className="space-y-2">
                {info.pros.map((pro, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300 text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                Disadvantages
              </h3>
              <ul className="space-y-2">
                {info.cons.map((con, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300 text-sm flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmInfo;