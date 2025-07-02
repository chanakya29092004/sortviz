class SortingStatistics {
  constructor() {
    this.reset()
  }

  reset() {
    this.comparisons = 0
    this.swaps = 0
    this.startTime = performance.now()
  }

  incrementComparisons() {
    this.comparisons++
  }

  incrementSwaps() {
    this.swaps++
  }

  getElapsedTime() {
    return (performance.now() - this.startTime) / 1000 // Convert to seconds
  }

  getStats() {
    return {
      comparisons: this.comparisons,
      swaps: this.swaps,
      time: this.getElapsedTime(),
    }
  }
}

class JavaScriptSortingAlgorithms {
  constructor() {
    this.stats = new SortingStatistics()
  }

  bubbleSort(arr) {
    this.stats.reset()
    const result = [...arr]
    const n = result.length

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        this.stats.incrementComparisons()
        if (result[j] > result[j + 1]) {
          ;[result[j], result[j + 1]] = [result[j + 1], result[j]]
          this.stats.incrementSwaps()
        }
      }
    }

    return { sorted: result, stats: this.stats.getStats() }
  }

  selectionSort(arr) {
    this.stats.reset()
    const result = [...arr]
    const n = result.length

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i
      for (let j = i + 1; j < n; j++) {
        this.stats.incrementComparisons()
        if (result[j] < result[minIdx]) {
          minIdx = j
        }
      }

      if (minIdx !== i) {
        ;[result[i], result[minIdx]] = [result[minIdx], result[i]]
        this.stats.incrementSwaps()
      }
    }

    return { sorted: result, stats: this.stats.getStats() }
  }

  insertionSort(arr) {
    this.stats.reset()
    const result = [...arr]

    for (let i = 1; i < result.length; i++) {
      const key = result[i]
      let j = i - 1

      while (j >= 0) {
        this.stats.incrementComparisons()
        if (result[j] > key) {
          result[j + 1] = result[j]
          this.stats.incrementSwaps()
          j--
        } else {
          break
        }
      }
      result[j + 1] = key
    }

    return { sorted: result, stats: this.stats.getStats() }
  }

  mergeSort(arr) {
    this.stats.reset()
    const result = [...arr]

    const merge = (left, right) => {
      const merged = []
      let i = 0,
        j = 0

      while (i < left.length && j < right.length) {
        this.stats.incrementComparisons()
        if (left[i] <= right[j]) {
          merged.push(left[i])
          i++
        } else {
          merged.push(right[j])
          j++
        }
        this.stats.incrementSwaps()
      }

      return merged.concat(left.slice(i)).concat(right.slice(j))
    }

    const mergeSortHelper = (arr) => {
      if (arr.length <= 1) return arr

      const mid = Math.floor(arr.length / 2)
      const left = mergeSortHelper(arr.slice(0, mid))
      const right = mergeSortHelper(arr.slice(mid))

      return merge(left, right)
    }

    const sorted = mergeSortHelper(result)
    return { sorted, stats: this.stats.getStats() }
  }

  quickSort(arr) {
    this.stats.reset()
    const result = [...arr]

    const partition = (low, high) => {
      const pivot = result[high]
      let i = low - 1

      for (let j = low; j < high; j++) {
        this.stats.incrementComparisons()
        if (result[j] < pivot) {
          i++
          ;[result[i], result[j]] = [result[j], result[i]]
          this.stats.incrementSwaps()
        }
      }
      ;[result[i + 1], result[high]] = [result[high], result[i + 1]]
      this.stats.incrementSwaps()
      return i + 1
    }

    const quickSortHelper = (low, high) => {
      if (low < high) {
        const pi = partition(low, high)
        quickSortHelper(low, pi - 1)
        quickSortHelper(pi + 1, high)
      }
    }

    quickSortHelper(0, result.length - 1)
    return { sorted: result, stats: this.stats.getStats() }
  }

  heapSort(arr) {
    this.stats.reset()
    const result = [...arr]
    const n = result.length

    const heapify = (n, i) => {
      let largest = i
      const left = 2 * i + 1
      const right = 2 * i + 2

      if (left < n) {
        this.stats.incrementComparisons()
        if (result[left] > result[largest]) {
          largest = left
        }
      }

      if (right < n) {
        this.stats.incrementComparisons()
        if (result[right] > result[largest]) {
          largest = right
        }
      }

      if (largest !== i) {
        ;[result[i], result[largest]] = [result[largest], result[i]]
        this.stats.incrementSwaps()
        heapify(n, largest)
      }
    }

    // Build heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i)
    }

    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
      ;[result[0], result[i]] = [result[i], result[0]]
      this.stats.incrementSwaps()
      heapify(i, 0)
    }

    return { sorted: result, stats: this.stats.getStats() }
  }
}

// Test the algorithms
const sorter = new JavaScriptSortingAlgorithms()
const testArray = [64, 34, 25, 12, 22, 11, 90]

console.log("Original array:", testArray)
console.log("=".repeat(50))

const algorithms = [
  { name: "Bubble Sort", method: sorter.bubbleSort.bind(sorter) },
  { name: "Selection Sort", method: sorter.selectionSort.bind(sorter) },
  { name: "Insertion Sort", method: sorter.insertionSort.bind(sorter) },
  { name: "Merge Sort", method: sorter.mergeSort.bind(sorter) },
  { name: "Quick Sort", method: sorter.quickSort.bind(sorter) },
  { name: "Heap Sort", method: sorter.heapSort.bind(sorter) },
]

algorithms.forEach(({ name, method }) => {
  const { sorted, stats } = method(testArray)
  console.log(`\n${name}:`)
  console.log(`Sorted array: [${sorted.join(", ")}]`)
  console.log(`Comparisons: ${stats.comparisons}`)
  console.log(`Swaps: ${stats.swaps}`)
  console.log(`Time: ${stats.time.toFixed(6)} seconds`)
})

// Performance comparison
console.log("\n" + "=".repeat(50))
console.log("PERFORMANCE COMPARISON")
console.log("=".repeat(50))

const performanceResults = algorithms.map(({ name, method }) => {
  const { stats } = method(testArray)
  return { name, ...stats }
})

performanceResults.sort((a, b) => a.time - b.time)

console.log("\nRanked by Speed (fastest first):")
performanceResults.forEach((result, index) => {
  console.log(
    `${index + 1}. ${result.name}: ${result.time.toFixed(6)}s (${result.comparisons} comparisons, ${result.swaps} swaps)`,
  )
})
