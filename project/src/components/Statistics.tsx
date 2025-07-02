import React from 'react';
import { Clock, BarChart, Shuffle, CheckCircle } from 'lucide-react';

interface StatisticsProps {
  comparisons: number;
  swaps: number;
  timeElapsed: number;
  isCompleted: boolean;
  arraySize: number;
}

const Statistics: React.FC<StatisticsProps> = ({
  comparisons,
  swaps,
  timeElapsed,
  isCompleted,
  arraySize
}) => {
  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const stats = [
    {
      label: 'Comparisons',
      value: comparisons.toLocaleString(),
      icon: BarChart,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      label: 'Swaps',
      value: swaps.toLocaleString(),
      icon: Shuffle,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      label: 'Time Elapsed',
      value: formatTime(timeElapsed),
      icon: Clock,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      label: 'Array Size',
      value: arraySize.toString(),
      icon: CheckCircle,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <BarChart size={20} />
        Statistics
        {isCompleted && (
          <span className="ml-auto text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
            Completed
          </span>
        )}
      </h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} rounded-lg p-4 transition-all duration-300 hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={20} className={stat.color} />
              <span className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistics;