"""
Sorting Algorithms Implementation in Python
Complete implementations with statistics tracking
"""

import time
from typing import List, Tuple, Dict

class SortingStatistics:
    def __init__(self):
        self.comparisons = 0
        self.swaps = 0
        self.start_time = 0
    
    def reset(self):
        self.comparisons = 0
        self.swaps = 0
        self.start_time = time.time()
    
    def compare(self) -> None:
        self.comparisons += 1
    
    def swap(self) -> None:
        self.swaps += 1
    
    def get_elapsed_time(self) -> float:
        return time.time() - self.start_time

class PythonSortingAlgorithms:
    def __init__(self):
        self.stats = SortingStatistics()
    
    def bubble_sort(self, arr: List[int]) -> Tuple[List[int], Dict]:
        """Bubble Sort Implementation"""
        self.stats.reset()
        arr = arr.copy()
        n = len(arr)
        
        for i in range(n - 1):
            for j in range(n - i - 1):
                self.stats.compare()
                if arr[j] > arr[j + 1]:
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
                    self.stats.swap()
        
        return arr, {
            'comparisons': self.stats.comparisons,
            'swaps': self.stats.swaps,
            'time': self.stats.get_elapsed_time()
        }
    
    def selection_sort(self, arr: List[int]) -> Tuple[List[int], Dict]:
        """Selection Sort Implementation"""
        self.stats.reset()
        arr = arr.copy()
        n = len(arr)
        
        for i in range(n - 1):
            min_idx = i
            for j in range(i + 1, n):
                self.stats.compare()
                if arr[j] < arr[min_idx]:
                    min_idx = j
            
            if min_idx != i:
                arr[i], arr[min_idx] = arr[min_idx], arr[i]
                self.stats.swap()
        
        return arr, {
            'comparisons': self.stats.comparisons,
            'swaps': self.stats.swaps,
            'time': self.stats.get_elapsed_time()
        }
    
    def insertion_sort(self, arr: List[int]) -> Tuple[List[int], Dict]:
        """Insertion Sort Implementation"""
        self.stats.reset()
        arr = arr.copy()
        
        for i in range(1, len(arr)):
            key = arr[i]
            j = i - 1
            
            while j >= 0:
                self.stats.compare()
                if arr[j] > key:
                    arr[j + 1] = arr[j]
                    self.stats.swap()
                    j -= 1
                else:
                    break
            
            arr[j + 1] = key
        
        return arr, {
            'comparisons': self.stats.comparisons,
            'swaps': self.stats.swaps,
            'time': self.stats.get_elapsed_time()
        }
    
    def merge_sort(self, arr: List[int]) -> Tuple[List[int], Dict]:
        """Merge Sort Implementation"""
        self.stats.reset()
        arr = arr.copy()
        
        def merge(left_arr, right_arr):
            result = []
            i = j = 0
            
            while i < len(left_arr) and j < len(right_arr):
                self.stats.compare()
                if left_arr[i] <= right_arr[j]:
                    result.append(left_arr[i])
                    i += 1
                else:
                    result.append(right_arr[j])
                    j += 1
                self.stats.swap()
            
            result.extend(left_arr[i:])
            result.extend(right_arr[j:])
            return result
        
        def merge_sort_helper(arr):
            if len(arr) <= 1:
                return arr
            
            mid = len(arr) // 2
            left = merge_sort_helper(arr[:mid])
            right = merge_sort_helper(arr[mid:])
            return merge(left, right)
        
        sorted_arr = merge_sort_helper(arr)
        
        return sorted_arr, {
            'comparisons': self.stats.comparisons,
            'swaps': self.stats.swaps,
            'time': self.stats.get_elapsed_time()
        }
    
    def quick_sort(self, arr: List[int]) -> Tuple[List[int], Dict]:
        """Quick Sort Implementation"""
        self.stats.reset()
        arr = arr.copy()
        
        def partition(low, high):
            pivot = arr[high]
            i = low - 1
            
            for j in range(low, high):
                self.stats.compare()
                if arr[j] < pivot:
                    i += 1
                    arr[i], arr[j] = arr[j], arr[i]
                    self.stats.swap()
            
            arr[i + 1], arr[high] = arr[high], arr[i + 1]
            self.stats.swap()
            return i + 1
        
        def quick_sort_helper(low, high):
            if low < high:
                pi = partition(low, high)
                quick_sort_helper(low, pi - 1)
                quick_sort_helper(pi + 1, high)
        
        quick_sort_helper(0, len(arr) - 1)
        
        return arr, {
            'comparisons': self.stats.comparisons,
            'swaps': self.stats.swaps,
            'time': self.stats.get_elapsed_time()
        }

# Test the algorithms
if __name__ == "__main__":
    sorter = PythonSortingAlgorithms()
    test_array = [64, 34, 25, 12, 22, 11, 90]
    
    print("Original array:", test_array)
    print("\n" + "="*50)
    
    # Test all algorithms
    algorithms = [
        ("Bubble Sort", sorter.bubble_sort),
        ("Selection Sort", sorter.selection_sort),
        ("Insertion Sort", sorter.insertion_sort),
        ("Merge Sort", sorter.merge_sort),
        ("Quick Sort", sorter.quick_sort)
    ]
    
    for name, algorithm in algorithms:
        sorted_arr, stats = algorithm(test_array)
        print(f"\n{name}:")
        print(f"Sorted array: {sorted_arr}")
        print(f"Comparisons: {stats['comparisons']}")
        print(f"Swaps: {stats['swaps']}")
        print(f"Time: {stats['time']:.6f} seconds")
