import { ArrayElement, SortingStep } from '../types';

export const bubbleSort = (array: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const arr = array.map((el, index) => ({ ...el, id: `element-${index}` })); // Ensure consistent IDs
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      // Comparing step
      steps.push({
        array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
        comparing: [j, j + 1],
      });

      if (arr[j].value > arr[j + 1].value) {
        // Swapping step
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({
          array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
          swapping: [j, j + 1],
        });
        swapped = true;
      }
    }

    // Mark the last element as sorted
    steps.push({
      array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
      sorted: [n - i - 1],
    });

    if (!swapped) break;
  }

  // Mark all elements as sorted
  steps.push({
    array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
    sorted: Array.from({ length: n }, (_, i) => i),
  });

  return steps;
};