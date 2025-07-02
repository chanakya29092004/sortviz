import { ArrayElement, SortingStep } from '../types';

export const selectionSort = (array: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const arr = array.map((el, index) => ({ ...el, id: `element-${index}` })); // Ensure consistent IDs
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      // Comparing step
      steps.push({
        array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
        comparing: [minIdx, j],
      });

      if (arr[j].value < arr[minIdx].value) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      // Swapping step
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      steps.push({
        array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
        swapping: [i, minIdx],
      });
    }

    // Mark current element as sorted
    steps.push({
      array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
      sorted: [i],
    });
  }

  // Mark all elements as sorted
  steps.push({
    array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
    sorted: Array.from({ length: n }, (_, i) => i),
  });

  return steps;
};