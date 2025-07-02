import java.util.*;
import java.util.concurrent.TimeUnit;

class SortingStatistics {
    private int comparisons;
    private int swaps;
    private long startTime;
    
    public SortingStatistics() {
        reset();
    }
    
    public void reset() {
        this.comparisons = 0;
        this.swaps = 0;
        this.startTime = System.nanoTime();
    }
    
    public void incrementComparisons() {
        this.comparisons++;
    }
    
    public void incrementSwaps() {
        this.swaps++;
    }
    
    public int getComparisons() { return comparisons; }
    public int getSwaps() { return swaps; }
    
    public double getElapsedTimeSeconds() {
        return (System.nanoTime() - startTime) / 1_000_000_000.0;
    }
    
    @Override
    public String toString() {
        return String.format("Comparisons: %d, Swaps: %d, Time: %.6f seconds", 
                           comparisons, swaps, getElapsedTimeSeconds());
    }
}

public class JavaSortingAlgorithms {
    private SortingStatistics stats;
    
    public JavaSortingAlgorithms() {
        this.stats = new SortingStatistics();
    }
    
    public int[] bubbleSort(int[] arr) {
        stats.reset();
        int[] result = arr.clone();
        int n = result.length;
        
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                stats.incrementComparisons();
                if (result[j] > result[j + 1]) {
                    // Swap elements
                    int temp = result[j];
                    result[j] = result[j + 1];
                    result[j + 1] = temp;
                    stats.incrementSwaps();
                }
            }
        }
        
        return result;
    }
    
    public int[] selectionSort(int[] arr) {
        stats.reset();
        int[] result = arr.clone();
        int n = result.length;
        
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                stats.incrementComparisons();
                if (result[j] < result[minIdx]) {
                    minIdx = j;
                }
            }
            
            if (minIdx != i) {
                int temp = result[i];
                result[i] = result[minIdx];
                result[minIdx] = temp;
                stats.incrementSwaps();
            }
        }
        
        return result;
    }
    
    public int[] insertionSort(int[] arr) {
        stats.reset();
        int[] result = arr.clone();
        
        for (int i = 1; i < result.length; i++) {
            int key = result[i];
            int j = i - 1;
            
            while (j >= 0) {
                stats.incrementComparisons();
                if (result[j] > key) {
                    result[j + 1] = result[j];
                    stats.incrementSwaps();
                    j--;
                } else {
                    break;
                }
            }
            result[j + 1] = key;
        }
        
        return result;
    }
    
    public int[] mergeSort(int[] arr) {
        stats.reset();
        int[] result = arr.clone();
        mergeSortHelper(result, 0, result.length - 1);
        return result;
    }
    
    private void mergeSortHelper(int[] arr, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            
            mergeSortHelper(arr, left, mid);
            mergeSortHelper(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }
    
    private void merge(int[] arr, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;
        
        int[] leftArr = new int[n1];
        int[] rightArr = new int[n2];
        
        System.arraycopy(arr, left, leftArr, 0, n1);
        System.arraycopy(arr, mid + 1, rightArr, 0, n2);
        
        int i = 0, j = 0, k = left;
        
        while (i < n1 && j < n2) {
            stats.incrementComparisons();
            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                i++;
            } else {
                arr[k] = rightArr[j];
                j++;
            }
            stats.incrementSwaps();
            k++;
        }
        
        while (i < n1) {
            arr[k] = leftArr[i];
            i++;
            k++;
        }
        
        while (j < n2) {
            arr[k] = rightArr[j];
            j++;
            k++;
        }
    }
    
    public int[] quickSort(int[] arr) {
        stats.reset();
        int[] result = arr.clone();
        quickSortHelper(result, 0, result.length - 1);
        return result;
    }
    
    private void quickSortHelper(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSortHelper(arr, low, pi - 1);
            quickSortHelper(arr, pi + 1, high);
        }
    }
    
    private int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        
        for (int j = low; j < high; j++) {
            stats.incrementComparisons();
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                stats.incrementSwaps();
            }
        }
        
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        stats.incrementSwaps();
        
        return i + 1;
    }
    
    public SortingStatistics getStatistics() {
        return stats;
    }
    
    public static void main(String[] args) {
        JavaSortingAlgorithms sorter = new JavaSortingAlgorithms();
        int[] testArray = {64, 34, 25, 12, 22, 11, 90};
        
        System.out.println("Original array: " + Arrays.toString(testArray));
        System.out.println("=" + "=".repeat(50));
        
        // Test Bubble Sort
        int[] bubbleSorted = sorter.bubbleSort(testArray);
        System.out.println("\nBubble Sort:");
        System.out.println("Sorted array: " + Arrays.toString(bubbleSorted));
        System.out.println(sorter.getStatistics());
        
        // Test Selection Sort
        int[] selectionSorted = sorter.selectionSort(testArray);
        System.out.println("\nSelection Sort:");
        System.out.println("Sorted array: " + Arrays.toString(selectionSorted));
        System.out.println(sorter.getStatistics());
        
        // Test Insertion Sort
        int[] insertionSorted = sorter.insertionSort(testArray);
        System.out.println("\nInsertion Sort:");
        System.out.println("Sorted array: " + Arrays.toString(insertionSorted));
        System.out.println(sorter.getStatistics());
        
        // Test Merge Sort
        int[] mergeSorted = sorter.mergeSort(testArray);
        System.out.println("\nMerge Sort:");
        System.out.println("Sorted array: " + Arrays.toString(mergeSorted));
        System.out.println(sorter.getStatistics());
        
        // Test Quick Sort
        int[] quickSorted = sorter.quickSort(testArray);
        System.out.println("\nQuick Sort:");
        System.out.println("Sorted array: " + Arrays.toString(quickSorted));
        System.out.println(sorter.getStatistics());
    }
}
