import { ArrayElement, SortingStep } from '../types';

export const heapSort = (array: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const arr = array.map((el, index) => ({ ...el, id: `element-${index}` })); // Ensure consistent IDs
  const n = arr.length;

  const heapify = (n: number, i: number) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      steps.push({
        array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
        comparing: [left, largest],
      });

      if (arr[left].value > arr[largest].value) {
        largest = left;
      }
    }

    if (right < n) {
      steps.push({
        array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
        comparing: [right, largest],
      });

      if (arr[right].value > arr[largest].value) {
        largest = right;
      }
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      steps.push({
        array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
        swapping: [i, largest],
      });

      heapify(n, largest);
    }
  };

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    steps.push({
      array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
      swapping: [0, i],
    });

    steps.push({
      array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
      sorted: [i],
    });

    heapify(i, 0);
  }

  // Mark all elements as sorted
  steps.push({
    array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
    sorted: Array.from({ length: n }, (_, i) => i),
  });

  return steps;
};