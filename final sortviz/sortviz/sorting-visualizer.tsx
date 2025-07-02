"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Play, RotateCcw, Pause } from "lucide-react"

interface ArrayElement {
  value: number
  isComparing?: boolean
  isSwapping?: boolean
  isSorted?: boolean
}

type SortingAlgorithm = "bubble" | "selection" | "insertion" | "merge" | "quick" | "heap"

export default function SortingVisualizer() {
  const [array, setArray] = useState<ArrayElement[]>([])
  const [inputValue, setInputValue] = useState("64, 34, 25, 12, 22, 11, 90")
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SortingAlgorithm>("bubble")
  const [isVisualizing, setIsVisualizing] = useState(false)
  const [speed, setSpeed] = useState(100)
  const [statistics, setStatistics] = useState({
    comparisons: 0,
    swaps: 0,
    timeElapsed: 0,
    startTime: 0,
  })

  const algorithms = {
    bubble: "Bubble Sort",
    selection: "Selection Sort",
    insertion: "Insertion Sort",
    merge: "Merge Sort",
    quick: "Quick Sort",
    heap: "Heap Sort",
  }

  // Initialize array from input
  const initializeArray = useCallback(() => {
    try {
      const values = inputValue
        .split(",")
        .map((val) => Number.parseInt(val.trim()))
        .filter((val) => !isNaN(val))
      if (values.length === 0) return

      const newArray = values.map((value) => ({ value, isComparing: false, isSwapping: false, isSorted: false }))
      setArray(newArray)
    } catch (error) {
      console.error("Invalid input")
    }
  }, [inputValue])

  useEffect(() => {
    initializeArray()
  }, [initializeArray])

  // Animation helper
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const resetStatistics = () => {
    setStatistics({
      comparisons: 0,
      swaps: 0,
      timeElapsed: 0,
      startTime: Date.now(),
    })
  }

  const updateStatistics = (type: "comparison" | "swap") => {
    setStatistics((prev) => ({
      ...prev,
      [type === "comparison" ? "comparisons" : "swaps"]: prev[type === "comparison" ? "comparisons" : "swaps"] + 1,
      timeElapsed: Date.now() - prev.startTime,
    }))
  }

  // Update array with animation states
  const updateArray = (newArray: ArrayElement[]) => {
    setArray([...newArray])
  }

  // Bubble Sort Implementation
  const bubbleSort = async () => {
    const arr = [...array]
    const n = arr.length

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Highlight comparing elements
        arr[j].isComparing = true
        arr[j + 1].isComparing = true
        updateStatistics("comparison")
        updateArray(arr)
        await sleep(speed)

        if (arr[j].value > arr[j + 1].value) {
          // Highlight swapping elements
          arr[j].isSwapping = true
          arr[j + 1].isSwapping = true
          updateArray(arr)
          await sleep(speed)

          // Swap
          const temp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = temp
          updateStatistics("swap")
          updateArray(arr)
          await sleep(speed)

          arr[j].isSwapping = false
          arr[j + 1].isSwapping = false
        }

        arr[j].isComparing = false
        arr[j + 1].isComparing = false
      }
      arr[n - 1 - i].isSorted = true
    }
    arr[0].isSorted = true
    updateArray(arr)
  }

  // Selection Sort Implementation
  const selectionSort = async () => {
    const arr = [...array]
    const n = arr.length

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i
      arr[i].isComparing = true

      for (let j = i + 1; j < n; j++) {
        arr[j].isComparing = true
        updateStatistics("comparison")
        updateArray(arr)
        await sleep(speed)

        if (arr[j].value < arr[minIdx].value) {
          if (minIdx !== i) arr[minIdx].isComparing = false
          minIdx = j
        } else {
          arr[j].isComparing = false
        }
      }

      if (minIdx !== i) {
        arr[i].isSwapping = true
        arr[minIdx].isSwapping = true
        updateArray(arr)
        await sleep(speed)

        const temp = arr[i]
        arr[i] = arr[minIdx]
        arr[minIdx] = temp
        updateStatistics("swap")
        updateArray(arr)
        await sleep(speed)

        arr[i].isSwapping = false
        arr[minIdx].isSwapping = false
      }

      arr[i].isComparing = false
      arr[i].isSorted = true
      if (minIdx < n) arr[minIdx].isComparing = false
    }
    arr[n - 1].isSorted = true
    updateArray(arr)
  }

  // Insertion Sort Implementation
  const insertionSort = async () => {
    const arr = [...array]
    arr[0].isSorted = true

    for (let i = 1; i < arr.length; i++) {
      const key = arr[i]
      let j = i - 1

      key.isComparing = true
      updateStatistics("comparison")
      updateArray(arr)
      await sleep(speed)

      while (j >= 0 && arr[j].value > key.value) {
        arr[j].isComparing = true
        updateStatistics("comparison")
        updateArray(arr)
        await sleep(speed)

        arr[j + 1] = arr[j]
        arr[j].isComparing = false
        updateArray(arr)
        await sleep(speed)

        j--
      }

      arr[j + 1] = key
      key.isComparing = false
      key.isSorted = true
      updateArray(arr)
      await sleep(speed)
    }
  }

  // Merge Sort Implementation
  const mergeSort = async () => {
    const arr = [...array]

    const merge = async (left: number, mid: number, right: number) => {
      const leftArr = arr.slice(left, mid + 1)
      const rightArr = arr.slice(mid + 1, right + 1)

      let i = 0,
        j = 0,
        k = left

      while (i < leftArr.length && j < rightArr.length) {
        arr[k].isComparing = true
        updateStatistics("comparison")
        updateArray(arr)
        await sleep(speed)

        if (leftArr[i].value <= rightArr[j].value) {
          arr[k] = leftArr[i]
          i++
        } else {
          arr[k] = rightArr[j]
          j++
        }
        arr[k].isComparing = false
        k++
        updateArray(arr)
        await sleep(speed)
      }

      while (i < leftArr.length) {
        arr[k] = leftArr[i]
        i++
        k++
      }

      while (j < rightArr.length) {
        arr[k] = rightArr[j]
        j++
        k++
      }
    }

    const mergeSortHelper = async (left: number, right: number) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2)
        await mergeSortHelper(left, mid)
        await mergeSortHelper(mid + 1, right)
        await merge(left, mid, right)
      }
    }

    await mergeSortHelper(0, arr.length - 1)
    arr.forEach((el) => (el.isSorted = true))
    updateArray(arr)
  }

  // Quick Sort Implementation
  const quickSort = async () => {
    const arr = [...array]

    const partition = async (low: number, high: number) => {
      const pivot = arr[high]
      pivot.isComparing = true
      let i = low - 1

      for (let j = low; j < high; j++) {
        arr[j].isComparing = true
        updateStatistics("comparison")
        updateArray(arr)
        await sleep(speed)

        if (arr[j].value < pivot.value) {
          i++
          if (i !== j) {
            arr[i].isSwapping = true
            arr[j].isSwapping = true
            updateArray(arr)
            await sleep(speed)

            const temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
            updateStatistics("swap")

            arr[i].isSwapping = false
            arr[j].isSwapping = false
          }
        }
        arr[j].isComparing = false
      }

      arr[i + 1].isSwapping = true
      arr[high].isSwapping = true
      updateArray(arr)
      await sleep(speed)

      const temp = arr[i + 1]
      arr[i + 1] = arr[high]
      arr[high] = temp
      updateStatistics("swap")

      arr[i + 1].isSwapping = false
      arr[high].isSwapping = false
      pivot.isComparing = false
      updateArray(arr)

      return i + 1
    }

    const quickSortHelper = async (low: number, high: number) => {
      if (low < high) {
        const pi = await partition(low, high)
        await quickSortHelper(low, pi - 1)
        await quickSortHelper(pi + 1, high)
      }
    }

    await quickSortHelper(0, arr.length - 1)
    arr.forEach((el) => (el.isSorted = true))
    updateArray(arr)
  }

  // Heap Sort Implementation
  const heapSort = async () => {
    const arr = [...array]
    const n = arr.length

    const heapify = async (n: number, i: number) => {
      let largest = i
      const left = 2 * i + 1
      const right = 2 * i + 2

      if (left < n) {
        arr[left].isComparing = true
        arr[largest].isComparing = true
        updateStatistics("comparison")
        updateArray(arr)
        await sleep(speed)

        if (arr[left].value > arr[largest].value) {
          largest = left
        }
        arr[left].isComparing = false
        arr[i].isComparing = false
      }

      if (right < n) {
        arr[right].isComparing = true
        arr[largest].isComparing = true
        updateStatistics("comparison")
        updateArray(arr)
        await sleep(speed)

        if (arr[right].value > arr[largest].value) {
          largest = right
        }
        arr[right].isComparing = false
        arr[largest === i ? i : largest].isComparing = false
      }

      if (largest !== i) {
        arr[i].isSwapping = true
        arr[largest].isSwapping = true
        updateArray(arr)
        await sleep(speed)

        const temp = arr[i]
        arr[i] = arr[largest]
        arr[largest] = temp
        updateStatistics("swap")

        arr[i].isSwapping = false
        arr[largest].isSwapping = false
        updateArray(arr)

        await heapify(n, largest)
      }
    }

    // Build heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(n, i)
    }

    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
      arr[0].isSwapping = true
      arr[i].isSwapping = true
      updateArray(arr)
      await sleep(speed)

      const temp = arr[0]
      arr[0] = arr[i]
      arr[i] = temp
      updateStatistics("swap")

      arr[0].isSwapping = false
      arr[i].isSwapping = false
      arr[i].isSorted = true
      updateArray(arr)

      await heapify(i, 0)
    }
    arr[0].isSorted = true
    updateArray(arr)
  }

  const startVisualization = async () => {
    if (isVisualizing) return

    setIsVisualizing(true)
    resetStatistics()

    // Reset all states
    const resetArray = array.map((el) => ({
      ...el,
      isComparing: false,
      isSwapping: false,
      isSorted: false,
    }))
    setArray(resetArray)

    try {
      switch (selectedAlgorithm) {
        case "bubble":
          await bubbleSort()
          break
        case "selection":
          await selectionSort()
          break
        case "insertion":
          await insertionSort()
          break
        case "merge":
          await mergeSort()
          break
        case "quick":
          await quickSort()
          break
        case "heap":
          await heapSort()
          break
      }
    } catch (error) {
      console.error("Sorting interrupted")
    }

    setIsVisualizing(false)
  }

  const resetVisualization = () => {
    setIsVisualizing(false)
    initializeArray()
  }

  const maxValue = Math.max(...array.map((el) => el.value))

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">
            Sorting Visualizer
          </h1>
          <p className="text-gray-400 text-lg">Watch sorting algorithms come to life with animated visualizations</p>
        </div>

        {/* Controls */}
        <Card className="bg-gray-900 border-gray-800 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Array Input</label>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g., 64, 34, 25, 12, 22, 11, 90"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                disabled={isVisualizing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Algorithm</label>
              <Select
                value={selectedAlgorithm}
                onValueChange={(value: SortingAlgorithm) => setSelectedAlgorithm(value)}
                disabled={isVisualizing}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {Object.entries(algorithms).map(([key, name]) => (
                    <SelectItem key={key} value={key} className="text-white hover:bg-gray-700">
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Speed (ms)</label>
              <Input
                type="number"
                value={speed}
                onChange={(e) => setSpeed(Number.parseInt(e.target.value) || 100)}
                min="10"
                max="1000"
                step="10"
                className="bg-gray-800 border-gray-700 text-white"
                disabled={isVisualizing}
              />
            </div>

            <div className="flex items-end gap-2">
              <Button
                onClick={startVisualization}
                disabled={isVisualizing || array.length === 0}
                className="bg-green-600 hover:bg-green-700 text-white flex-1"
              >
                {isVisualizing ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Sorting...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Visualize
                  </>
                )}
              </Button>
              <Button
                onClick={resetVisualization}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
                disabled={isVisualizing}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <Card className="bg-gray-900 border-gray-800 p-6 mb-8">
          <h3 className="text-xl font-bold text-green-400 mb-4">Real-time Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{statistics.comparisons}</div>
              <div className="text-gray-400">Comparisons</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">{statistics.swaps}</div>
              <div className="text-gray-400">Swaps</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{(statistics.timeElapsed / 1000).toFixed(2)}s</div>
              <div className="text-gray-400">Time Elapsed</div>
            </div>
          </div>
        </Card>

        {/* Visualization Area */}
        <Card className="bg-gray-900 border-gray-800 p-6">
          <div className="flex items-end justify-center gap-1 md:gap-2 h-96 overflow-x-auto">
            {array.map((element, index) => {
              const height = (element.value / maxValue) * 300
              let barColor = "bg-gray-600"

              if (element.isSorted) {
                barColor = "bg-green-500"
              } else if (element.isSwapping) {
                barColor = "bg-red-500"
              } else if (element.isComparing) {
                barColor = "bg-yellow-500"
              }

              return (
                <div
                  key={index}
                  className={`${barColor} transition-all duration-300 rounded-t-lg flex items-end justify-center text-xs font-bold text-white min-w-8 md:min-w-12`}
                  style={{
                    height: `${height}px`,
                    width: `${Math.max(32, 400 / array.length)}px`,
                  }}
                >
                  <span className="mb-1 text-shadow">{element.value}</span>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
              <span className="text-gray-300">Unsorted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-gray-300">Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-gray-300">Swapping</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-300">Sorted</span>
            </div>
          </div>
        </Card>

        {/* Algorithm Info */}
        <Card className="bg-gray-900 border-gray-800 p-6 mt-8">
          <h3 className="text-xl font-bold text-green-400 mb-4">{algorithms[selectedAlgorithm]}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
            {selectedAlgorithm === "bubble" && (
              <>
                <div>
                  <strong>Time Complexity:</strong> O(n²)
                </div>
                <div>
                  <strong>Space Complexity:</strong> O(1)
                </div>
                <div>
                  <strong>Stable:</strong> Yes
                </div>
              </>
            )}
            {selectedAlgorithm === "selection" && (
              <>
                <div>
                  <strong>Time Complexity:</strong> O(n²)
                </div>
                <div>
                  <strong>Space Complexity:</strong> O(1)
                </div>
                <div>
                  <strong>Stable:</strong> No
                </div>
              </>
            )}
            {selectedAlgorithm === "insertion" && (
              <>
                <div>
                  <strong>Time Complexity:</strong> O(n²)
                </div>
                <div>
                  <strong>Space Complexity:</strong> O(1)
                </div>
                <div>
                  <strong>Stable:</strong> Yes
                </div>
              </>
            )}
            {selectedAlgorithm === "merge" && (
              <>
                <div>
                  <strong>Time Complexity:</strong> O(n log n)
                </div>
                <div>
                  <strong>Space Complexity:</strong> O(n)
                </div>
                <div>
                  <strong>Stable:</strong> Yes
                </div>
              </>
            )}
            {selectedAlgorithm === "quick" && (
              <>
                <div>
                  <strong>Time Complexity:</strong> O(n log n)
                </div>
                <div>
                  <strong>Space Complexity:</strong> O(log n)
                </div>
                <div>
                  <strong>Stable:</strong> No
                </div>
              </>
            )}
            {selectedAlgorithm === "heap" && (
              <>
                <div>
                  <strong>Time Complexity:</strong> O(n log n)
                </div>
                <div>
                  <strong>Space Complexity:</strong> O(1)
                </div>
                <div>
                  <strong>Stable:</strong> No
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
