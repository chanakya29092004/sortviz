import { ArrayElement, SortingStep } from '../types';

export const insertionSort = (array: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const arr = array.map((el, index) => ({ ...el, id: `element-${index}` })); // Ensure consistent IDs
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    // Comparing step
    steps.push({
      array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
      comparing: [i],
    });

    while (j >= 0 && arr[j].value > key.value) {
      // Show comparison
      steps.push({
        array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
        comparing: [j, j + 1],
      });

      // Move element
      arr[j + 1] = arr[j];
      steps.push({
        array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
        swapping: [j, j + 1],
      });

      j--;
    }

    arr[j + 1] = key;
    
    // Mark sorted portion
    steps.push({
      array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
      sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
    });
  }

  // Mark all elements as sorted
  steps.push({
    array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
    sorted: Array.from({ length: n }, (_, i) => i),
  });

  return steps;
};