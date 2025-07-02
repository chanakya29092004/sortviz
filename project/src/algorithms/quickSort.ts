import { ArrayElement, SortingStep } from '../types';

export const quickSort = (array: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const arr = array.map((el, index) => ({ ...el, id: `element-${index}` })); // Ensure consistent IDs

  const partition = (low: number, high: number): number => {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      // Comparing with pivot
      steps.push({
        array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
        comparing: [j, high],
      });

      if (arr[j].value < pivot.value) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push({
            array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
            swapping: [i, j],
          });
        }
      }
    }

    // Place pivot in correct position
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({
      array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
      swapping: [i + 1, high],
    });

    return i + 1;
  };

  const quickSortHelper = (low: number, high: number) => {
    if (low < high) {
      const pivotIndex = partition(low, high);
      
      steps.push({
        array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
        sorted: [pivotIndex],
      });

      quickSortHelper(low, pivotIndex - 1);
      quickSortHelper(pivotIndex + 1, high);
    }
  };

  quickSortHelper(0, arr.length - 1);

  // Mark all elements as sorted
  steps.push({
    array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
    sorted: Array.from({ length: arr.length }, (_, i) => i),
  });

  return steps;
};