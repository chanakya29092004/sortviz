import { ArrayElement, SortingStep } from '../types';

export const mergeSort = (array: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const arr = array.map((el, index) => ({ ...el, id: `element-${index}` })); // Ensure consistent IDs

  const merge = (left: number, mid: number, right: number) => {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      // Comparing step
      steps.push({
        array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
        comparing: [left + i, mid + 1 + j],
      });

      if (leftArr[i].value <= rightArr[j].value) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }

      steps.push({
        array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
        swapping: [k],
      });

      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      steps.push({
        array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
        swapping: [k],
      });
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      steps.push({
        array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
        swapping: [k],
      });
      j++;
      k++;
    }
  };

  const mergeSortHelper = (left: number, right: number) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      mergeSortHelper(left, mid);
      mergeSortHelper(mid + 1, right);
      merge(left, mid, right);
    }
  };

  mergeSortHelper(0, arr.length - 1);

  // Mark all elements as sorted
  steps.push({
    array: arr.map((el, index) => ({ ...el, id: `element-${index}` })),
    sorted: Array.from({ length: arr.length }, (_, i) => i),
  });

  return steps;
};