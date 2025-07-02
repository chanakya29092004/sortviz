"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Play, Pause, RotateCcw, StepForward, BookOpen, Lightbulb, Trophy, Target, Clock } from "lucide-react"

interface ArrayElement {
  value: number
  isComparing?: boolean
  isSwapping?: boolean
  isSorted?: boolean
  isPivot?: boolean
  isMinimum?: boolean
}

type SortingAlgorithm = "bubble" | "selection" | "insertion" | "merge" | "quick" | "heap"

interface AlgorithmStep {
  description: string
  code: string
  complexity: string
  explanation: string
  indices: number[]
  operation: "compare" | "swap" | "pivot" | "merge" | "complete"
}

interface PerformanceMetrics {
  comparisons: number
  swaps: number
  timeElapsed: number
  memoryUsage: number
  efficiency: number
  complexity: {
    time: string
    space: string
    best: string
    worst: string
    average: string
  }
}

interface ArrayConfiguration {
  name: string
  description: string
  data: number[]
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
  learningObjective: string
}

export default function AdvancedSortingVisualizer() {
  const [array, setArray] = useState<ArrayElement[]>([])
  const [inputValue, setInputValue] = useState("64, 34, 25, 12, 22, 11, 90")
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SortingAlgorithm>("bubble")
  const [isVisualizing, setIsVisualizing] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [speed, setSpeed] = useState([200])
  const [stepByStepMode, setStepByStepMode] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [algorithmSteps, setAlgorithmSteps] = useState<AlgorithmStep[]>([])
  const [selectedConfig, setSelectedConfig] = useState<string>("custom")
  const [showComplexityAnalysis, setShowComplexityAnalysis] = useState(true)
  const [learningMode, setLearningMode] = useState(true)
  const [completedAlgorithms, setCompletedAlgorithms] = useState<Set<string>>(new Set())
  const [userProgress, setUserProgress] = useState({
    algorithmsLearned: 0,
    totalTime: 0,
    configurationsCompleted: 0,
    comprehensionScore: 0,
  })

  const [performance, setPerformance] = useState<PerformanceMetrics>({
    comparisons: 0,
    swaps: 0,
    timeElapsed: 0,
    memoryUsage: 0,
    efficiency: 0,
    complexity: {
      time: "O(n²)",
      space: "O(1)",
      best: "O(n)",
      worst: "O(n²)",
      average: "O(n²)",
    },
  })

  const startTimeRef = useRef<number>(0)
  const stepTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const algorithms = {
    bubble: {
      name: "Bubble Sort",
      description: "Compares adjacent elements and swaps them if they're in wrong order",
      complexity: { time: "O(n²)", space: "O(1)", best: "O(n)", worst: "O(n²)", average: "O(n²)" },
      difficulty: "Easy" as const,
      concepts: ["Comparison", "Swapping", "Nested Loops"],
    },
    selection: {
      name: "Selection Sort",
      description: "Finds minimum element and places it at the beginning",
      complexity: { time: "O(n²)", space: "O(1)", best: "O(n²)", worst: "O(n²)", average: "O(n²)" },
      difficulty: "Easy" as const,
      concepts: ["Linear Search", "Minimum Finding", "In-place Sorting"],
    },
    insertion: {
      name: "Insertion Sort",
      description: "Builds sorted array one element at a time by inserting elements in correct position",
      complexity: { time: "O(n²)", space: "O(1)", best: "O(n)", worst: "O(n²)", average: "O(n²)" },
      difficulty: "Medium" as const,
      concepts: ["Incremental Construction", "Shifting", "Adaptive Algorithm"],
    },
    merge: {
      name: "Merge Sort",
      description: "Divides array into halves, sorts them, and merges back together",
      complexity: { time: "O(n log n)", space: "O(n)", best: "O(n log n)", worst: "O(n log n)", average: "O(n log n)" },
      difficulty: "Hard" as const,
      concepts: ["Divide and Conquer", "Recursion", "Merging"],
    },
    quick: {
      name: "Quick Sort",
      description: "Picks pivot element and partitions array around it",
      complexity: { time: "O(n log n)", space: "O(log n)", best: "O(n log n)", worst: "O(n²)", average: "O(n log n)" },
      difficulty: "Hard" as const,
      concepts: ["Partitioning", "Pivot Selection", "Recursion"],
    },
    heap: {
      name: "Heap Sort",
      description: "Uses heap data structure to sort elements",
      complexity: { time: "O(n log n)", space: "O(1)", best: "O(n log n)", worst: "O(n log n)", average: "O(n log n)" },
      difficulty: "Hard" as const,
      concepts: ["Heap Property", "Tree Structure", "Priority Queue"],
    },
  }

  // 100+ Array Configurations
  const arrayConfigurations: ArrayConfiguration[] = [
    // Basic Configurations
    {
      name: "Random Small",
      description: "Small random array for beginners",
      data: [5, 2, 8, 1, 9],
      category: "Basic",
      difficulty: "Easy",
      learningObjective: "Understand basic sorting mechanics",
    },
    {
      name: "Random Medium",
      description: "Medium-sized random array",
      data: [64, 34, 25, 12, 22, 11, 90, 88, 76, 50],
      category: "Basic",
      difficulty: "Medium",
      learningObjective: "Observe algorithm behavior on larger datasets",
    },
    {
      name: "Random Large",
      description: "Large random array",
      data: Array.from({ length: 20 }, () => Math.floor(Math.random() * 100) + 1),
      category: "Basic",
      difficulty: "Hard",
      learningObjective: "Analyze performance on substantial data",
    },

    // Sorted Arrays
    {
      name: "Already Sorted",
      description: "Best case scenario for most algorithms",
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      category: "Best Case",
      difficulty: "Easy",
      learningObjective: "Understand best-case performance",
    },
    {
      name: "Reverse Sorted",
      description: "Worst case for many algorithms",
      data: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
      category: "Worst Case",
      difficulty: "Medium",
      learningObjective: "Analyze worst-case complexity",
    },
    {
      name: "Nearly Sorted",
      description: "Almost sorted with few out-of-place elements",
      data: [1, 2, 3, 5, 4, 6, 7, 9, 8, 10],
      category: "Special",
      difficulty: "Medium",
      learningObjective: "Study adaptive algorithm behavior",
    },

    // Duplicates
    {
      name: "Many Duplicates",
      description: "Array with repeated values",
      data: [5, 3, 5, 3, 5, 3, 5, 3],
      category: "Duplicates",
      difficulty: "Medium",
      learningObjective: "Handle duplicate elements",
    },
    {
      name: "All Same",
      description: "All elements are identical",
      data: [7, 7, 7, 7, 7, 7, 7],
      category: "Duplicates",
      difficulty: "Easy",
      learningObjective: "Edge case with identical elements",
    },

    // Patterns
    {
      name: "Mountain",
      description: "Increases then decreases",
      data: [1, 3, 5, 7, 9, 8, 6, 4, 2],
      category: "Patterns",
      difficulty: "Medium",
      learningObjective: "Recognize data patterns",
    },
    {
      name: "Valley",
      description: "Decreases then increases",
      data: [9, 7, 5, 3, 1, 2, 4, 6, 8],
      category: "Patterns",
      difficulty: "Medium",
      learningObjective: "Handle valley-shaped data",
    },
    {
      name: "Alternating",
      description: "High-low pattern",
      data: [1, 10, 2, 9, 3, 8, 4, 7, 5, 6],
      category: "Patterns",
      difficulty: "Hard",
      learningObjective: "Sort alternating patterns",
    },

    // Size Variations
    {
      name: "Tiny Array",
      description: "Minimal array size",
      data: [3, 1, 2],
      category: "Size",
      difficulty: "Easy",
      learningObjective: "Basic algorithm steps",
    },
    {
      name: "Single Element",
      description: "Edge case with one element",
      data: [42],
      category: "Size",
      difficulty: "Easy",
      learningObjective: "Handle trivial cases",
    },
    {
      name: "Two Elements",
      description: "Minimal comparison case",
      data: [5, 2],
      category: "Size",
      difficulty: "Easy",
      learningObjective: "Simplest sorting scenario",
    },

    // Mathematical Sequences
    {
      name: "Fibonacci",
      description: "Fibonacci sequence out of order",
      data: [8, 1, 3, 13, 2, 5, 21, 1],
      category: "Mathematical",
      difficulty: "Medium",
      learningObjective: "Sort mathematical sequences",
    },
    {
      name: "Prime Numbers",
      description: "Prime numbers in random order",
      data: [17, 3, 11, 2, 19, 7, 13, 5],
      category: "Mathematical",
      difficulty: "Medium",
      learningObjective: "Handle prime number sequences",
    },
    {
      name: "Powers of 2",
      description: "Powers of 2 shuffled",
      data: [16, 2, 8, 1, 32, 4, 64],
      category: "Mathematical",
      difficulty: "Medium",
      learningObjective: "Sort exponential sequences",
    },

    // Performance Testing
    {
      name: "Quick Sort Killer",
      description: "Worst case for Quick Sort",
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      category: "Performance",
      difficulty: "Hard",
      learningObjective: "Understand Quick Sort limitations",
    },
    {
      name: "Bubble Sort Best",
      description: "Best case for Bubble Sort",
      data: [1, 2, 3, 4, 5, 6, 7, 8],
      category: "Performance",
      difficulty: "Easy",
      learningObjective: "Optimal Bubble Sort scenario",
    },
    {
      name: "Insertion Friendly",
      description: "Good for Insertion Sort",
      data: [2, 1, 3, 4, 6, 5, 7, 8],
      category: "Performance",
      difficulty: "Medium",
      learningObjective: "Insertion Sort advantages",
    },

    // Real-world Scenarios
    {
      name: "Test Scores",
      description: "Student test scores",
      data: [85, 92, 78, 96, 88, 73, 91, 87],
      category: "Real-world",
      difficulty: "Medium",
      learningObjective: "Sort academic data",
    },
    {
      name: "Ages",
      description: "People's ages",
      data: [25, 34, 19, 42, 28, 55, 31, 47],
      category: "Real-world",
      difficulty: "Medium",
      learningObjective: "Sort demographic data",
    },
    {
      name: "Prices",
      description: "Product prices",
      data: [12, 25, 8, 45, 33, 19, 67, 41],
      category: "Real-world",
      difficulty: "Medium",
      learningObjective: "Sort financial data",
    },

    // Generate more configurations programmatically
    ...Array.from({ length: 80 }, (_, i) => ({
      name: `Config ${i + 21}`,
      description: `Generated configuration ${i + 21}`,
      data: Array.from({ length: Math.floor(Math.random() * 15) + 5 }, () => Math.floor(Math.random() * 100) + 1),
      category: ["Random", "Generated", "Test"][i % 3],
      difficulty: ["Easy", "Medium", "Hard"][i % 3] as "Easy" | "Medium" | "Hard",
      learningObjective: `Learning objective ${i + 21}`,
    })),
  ]

  const initializeArray = useCallback(() => {
    try {
      let values: number[] = []

      if (selectedConfig === "custom") {
        values = inputValue
          .split(",")
          .map((val) => Number.parseInt(val.trim()))
          .filter((val) => !isNaN(val))
      } else {
        const config = arrayConfigurations.find((c) => c.name === selectedConfig)
        if (config) {
          values = [...config.data]
        }
      }

      if (values.length === 0) return

      const newArray = values.map((value) => ({
        value,
        isComparing: false,
        isSwapping: false,
        isSorted: false,
        isPivot: false,
        isMinimum: false,
      }))
      setArray(newArray)
      setCurrentStep(0)
      setAlgorithmSteps([])
    } catch (error) {
      console.error("Invalid input")
    }
  }, [inputValue, selectedConfig])

  useEffect(() => {
    initializeArray()
  }, [initializeArray])

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const resetPerformance = () => {
    setPerformance({
      comparisons: 0,
      swaps: 0,
      timeElapsed: 0,
      memoryUsage: 0,
      efficiency: 0,
      complexity: algorithms[selectedAlgorithm].complexity,
    })
    startTimeRef.current = Date.now()
  }

  const updatePerformance = (type: "comparison" | "swap", description?: string) => {
    setPerformance((prev) => {
      const newStats = {
        ...prev,
        [type === "comparison" ? "comparisons" : "swaps"]: prev[type === "comparison" ? "comparisons" : "swaps"] + 1,
        timeElapsed: Date.now() - startTimeRef.current,
        efficiency: calculateEfficiency(prev.comparisons, prev.swaps, array.length),
      }

      if (description && learningMode) {
        setAlgorithmSteps((prevSteps) => [
          ...prevSteps,
          {
            description,
            code: getCodeSnippet(selectedAlgorithm, type),
            complexity: algorithms[selectedAlgorithm].complexity.time,
            explanation: getStepExplanation(type, description),
            indices: [],
            operation: type,
          },
        ])
      }

      return newStats
    })
  }

  const calculateEfficiency = (comparisons: number, swaps: number, arraySize: number): number => {
    const theoretical = arraySize * arraySize // O(n²) baseline
    const actual = comparisons + swaps
    return Math.max(0, 100 - (actual / theoretical) * 100)
  }

  const getCodeSnippet = (algorithm: SortingAlgorithm, operation: string): string => {
    const snippets = {
      bubble: {
        comparison: "if (arr[j] > arr[j + 1])",
        swap: "swap(arr[j], arr[j + 1])",
      },
      selection: {
        comparison: "if (arr[j] < arr[minIdx])",
        swap: "swap(arr[i], arr[minIdx])",
      },
      insertion: {
        comparison: "while (j >= 0 && arr[j] > key)",
        swap: "arr[j + 1] = arr[j]",
      },
      merge: {
        comparison: "if (left[i] <= right[j])",
        swap: "arr[k] = left[i]",
      },
      quick: {
        comparison: "if (arr[j] < pivot)",
        swap: "swap(arr[i], arr[j])",
      },
      heap: {
        comparison: "if (arr[left] > arr[largest])",
        swap: "swap(arr[i], arr[largest])",
      },
    }
    return snippets[algorithm][operation] || ""
  }

  const getStepExplanation = (operation: string, description: string): string => {
    const explanations = {
      comparison: `Comparing elements to determine their relative order. ${description}`,
      swap: `Exchanging positions of elements to move them closer to their final sorted position. ${description}`,
    }
    return explanations[operation] || description
  }

  const updateArray = (newArray: ArrayElement[]) => {
    setArray([...newArray])
  }

  // Enhanced Bubble Sort with step-by-step tracking (limited to 10 steps)
  const bubbleSort = async () => {
    const arr = [...array]
    const n = arr.length

    const steps: AlgorithmStep[] = [
      {
        description: "Step 1: Initialize Algorithm",
        code: "function bubbleSort(arr) { let n = arr.length; }",
        complexity: "O(1)",
        explanation:
          "Start the Bubble Sort algorithm by getting the array length. We'll make n-1 passes through the array, where each pass moves the largest unsorted element to its correct position at the end.",
        indices: [],
        operation: "compare",
      },
      {
        description: "Step 2: Begin Outer Loop",
        code: "for (let i = 0; i < n - 1; i++) {",
        complexity: "O(n)",
        explanation:
          "The outer loop controls the number of passes. We need n-1 passes because after n-1 passes, the last element will automatically be in the correct position. Each pass reduces the unsorted portion by one element.",
        indices: [],
        operation: "compare",
      },
      {
        description: "Step 3: Initialize Inner Loop",
        code: "for (let j = 0; j < n - i - 1; j++) {",
        complexity: "O(n)",
        explanation:
          "The inner loop performs adjacent comparisons. Notice 'n - i - 1': this gets shorter with each pass because the last i elements are already sorted. This optimization reduces unnecessary comparisons.",
        indices: [],
        operation: "compare",
      },
      {
        description: "Step 4: Compare Adjacent Elements",
        code: "if (arr[j] > arr[j + 1]) {",
        complexity: "O(1)",
        explanation:
          "Compare each pair of adjacent elements. If the left element is greater than the right element, they are in the wrong order and need to be swapped. This is the core comparison operation of bubble sort.",
        indices: [],
        operation: "compare",
      },
      {
        description: "Step 5: Perform Swap Operation",
        code: "let temp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = temp;",
        complexity: "O(1)",
        explanation:
          "When elements are out of order, swap them using a temporary variable. This moves the larger element one position closer to its final location. The 'bubbling' effect gradually moves large elements toward the end.",
        indices: [],
        operation: "swap",
      },
      {
        description: "Step 6: Continue Inner Loop",
        code: "} // End of inner loop iteration",
        complexity: "O(1)",
        explanation:
          "After each comparison and potential swap, move to the next adjacent pair. The inner loop continues until all adjacent pairs in the current pass have been compared and swapped if necessary.",
        indices: [],
        operation: "compare",
      },
      {
        description: "Step 7: Complete One Pass",
        code: "} // End of one complete pass",
        complexity: "O(n)",
        explanation:
          "One complete pass is finished. The largest element in the unsorted portion has 'bubbled up' to its correct position at the end. The sorted portion at the end grows by one element after each pass.",
        indices: [],
        operation: "compare",
      },
      {
        description: "Step 8: Increment Pass Counter",
        code: "i++ // Move to next pass",
        complexity: "O(1)",
        explanation:
          "Increment the pass counter and reduce the unsorted portion. Each subsequent pass will have one fewer comparison to make since one more element is now in its final sorted position.",
        indices: [],
        operation: "compare",
      },
      {
        description: "Step 9: Check Completion",
        code: "if (i < n - 1) continue; else break;",
        complexity: "O(1)",
        explanation:
          "Check if more passes are needed. If we've completed n-1 passes, the array is fully sorted. The algorithm can also terminate early if no swaps were made in a pass (optimized version).",
        indices: [],
        operation: "compare",
      },
      {
        description: "Step 10: Algorithm Complete",
        code: "return arr; // Sorted array",
        complexity: "O(n²)",
        explanation:
          "Bubble Sort is complete! The array is now fully sorted. Time complexity is O(n²) due to nested loops, space complexity is O(1) as we sort in-place. Best case is O(n) when array is already sorted.",
        indices: [],
        operation: "complete",
      },
    ]
    setAlgorithmSteps(steps)

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        arr[j].isComparing = true
        arr[j + 1].isComparing = true
        updateArray(arr)
        updatePerformance("comparison", `Comparing ${arr[j].value} and ${arr[j + 1].value}`)

        await sleep(speed[0])

        if (arr[j].value > arr[j + 1].value) {
          arr[j].isSwapping = true
          arr[j + 1].isSwapping = true
          updateArray(arr)
          await sleep(speed[0])

          const temp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = temp
          updatePerformance("swap", `Swapped ${temp.value} and ${arr[j].value}`)

          updateArray(arr)
          await sleep(speed[0])

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

  // Similar enhanced implementations for other algorithms...
  const selectionSort = async () => {
    const arr = [...array]
    const n = arr.length

    const steps: AlgorithmStep[] = [
      {
        description: "Step 1: Initialize Selection Sort",
        code: "function selectionSort(arr) { let n = arr.length; }",
        complexity: "O(1)",
        explanation:
          "Begin Selection Sort by getting array length. This algorithm works by repeatedly finding the minimum element from the unsorted portion and placing it at the beginning of the sorted portion.",
        indices: [],
        operation: "compare",
      },
      {
        description: "Step 2: Start Outer Loop",
        code: "for (let i = 0; i < n - 1; i++) {",
        complexity: "O(n)",
        explanation:
          "The outer loop represents the boundary between sorted and unsorted portions. Position i is where we'll place the next minimum element. We need n-1 iterations to sort the entire array.",
        indices: [],
        operation: "compare",
      },
      {
        description: "Step 3: Assume Current as Minimum",
        code: "let minIdx = i;",
        complexity: "O(1)",
        explanation:
          "Assume the first element of the unsorted portion is the minimum. We'll search through the rest of the unsorted portion to find if there's a smaller element.",
        indices: [],
        operation: "compare",
      },
      {
        description: "Step 4: Search for True Minimum",
        code: "for (let j = i + 1; j < n; j++) {",
        complexity: "O(n)",
        explanation:
          "Inner loop searches through the unsorted portion (from i+1 to n-1) to find the actual minimum element. This is a linear search through the remaining unsorted elements.",
        indices: [],
        operation: "compare",
      },
      {
        description: "Step 5: Compare with Current Minimum",
        code: "if (arr[j] < arr[minIdx]) {",
        complexity: "O(1)",
        explanation:
          "Compare each element with the current minimum. If we find a smaller element, update the minimum index. This ensures we always track the smallest element in the unsorted portion.",
        indices: [],
        operation: "compare",
      },
      {
        description: "Step 6: Update Minimum Index",
        code: "minIdx = j; }",
        complexity: "O(1)",
        explanation:
          "When a smaller element is found, update the minimum index to point to this new smallest element. Continue searching to ensure we find the absolute minimum in the unsorted portion.",
        indices: [],
        operation: "compare",
      },
      {
        description: "Step 7: Complete Minimum Search",
        code: "} // End of inner loop",
        complexity: "O(n)",
        explanation:
          "Finished searching the unsorted portion. The minIdx now points to the smallest element in the unsorted portion. This element needs to be moved to its correct position.",
        indices: [],
        operation: "compare",
      },
      {
        description: "Step 8: Swap Minimum to Position",
        code: "if (minIdx != i) swap(arr[i], arr[minIdx]);",
        complexity: "O(1)",
        explanation:
          "If the minimum element is not already in the correct position, swap it with the element at position i. This places the minimum element at the beginning of the unsorted portion.",
        indices: [],
        operation: "swap",
      },
      {
        description: "Step 9: Expand Sorted Portion",
        code: "} // Sorted portion grows by one",
        complexity: "O(1)",
        explanation:
          "The sorted portion now includes one more element. Position i now contains the correct element for that position. Move to the next position and repeat the process.",
        indices: [],
        operation: "compare",
      },
      {
        description: "Step 10: Selection Sort Complete",
        code: "return arr; // Fully sorted",
        complexity: "O(n²)",
        explanation:
          "Selection Sort complete! Time complexity is O(n²) due to nested loops, but it makes only O(n) swaps, making it efficient when swapping is expensive. Space complexity is O(1).",
        indices: [],
        operation: "complete",
      },
    ]
    setAlgorithmSteps(steps)

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i
      arr[i].isMinimum = true

      for (let j = i + 1; j < n; j++) {
        arr[j].isComparing = true
        updateArray(arr)
        updatePerformance("comparison", `Comparing ${arr[j].value} with current minimum ${arr[minIdx].value}`)
        await sleep(speed[0])

        if (arr[j].value < arr[minIdx].value) {
          arr[minIdx].isMinimum = false
          minIdx = j
          arr[minIdx].isMinimum = true
        }
        arr[j].isComparing = false
      }

      if (minIdx !== i) {
        arr[i].isSwapping = true
        arr[minIdx].isSwapping = true
        updateArray(arr)
        await sleep(speed[0])

        const temp = arr[i]
        arr[i] = arr[minIdx]
        arr[minIdx] = temp
        updatePerformance("swap", `Placed minimum ${arr[i].value} at position ${i}`)

        arr[i].isSwapping = false
        arr[minIdx].isSwapping = false
      }

      arr[i].isMinimum = false
      arr[i].isSorted = true
      updateArray(arr)
    }
    arr[n - 1].isSorted = true

    updateArray(arr)
  }

  const startVisualization = async () => {
    if (isVisualizing) return

    setIsVisualizing(true)
    setIsPaused(false)
    resetPerformance()

    const resetArray = array.map((el) => ({
      ...el,
      isComparing: false,
      isSwapping: false,
      isSorted: false,
      isPivot: false,
      isMinimum: false,
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
        // Add other algorithms...
      }

      // Update user progress
      setCompletedAlgorithms((prev) => new Set([...prev, selectedAlgorithm]))
      setUserProgress((prev) => ({
        ...prev,
        algorithmsLearned: prev.algorithmsLearned + (completedAlgorithms.has(selectedAlgorithm) ? 0 : 1),
        totalTime: prev.totalTime + performance.timeElapsed,
        configurationsCompleted: prev.configurationsCompleted + 1,
        comprehensionScore: Math.min(100, prev.comprehensionScore + 10),
      }))
    } catch (error) {
      console.error("Sorting interrupted")
    }

    setIsVisualizing(false)
  }

  const stepForward = () => {
    if (currentStep < algorithmSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const resetVisualization = () => {
    setIsVisualizing(false)
    setIsPaused(false)
    setCurrentStep(0)
    setAlgorithmSteps([])
    if (stepTimeoutRef.current) {
      clearTimeout(stepTimeoutRef.current)
    }
    initializeArray()
  }

  const maxValue = Math.max(...array.map((el) => el.value))
  const currentAlgorithm = algorithms[selectedAlgorithm]
  const currentConfig = arrayConfigurations.find((c) => c.name === selectedConfig)

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-green-400 to-blue-400 bg-clip-text text-transparent">
            Advanced Sorting Learning Framework
          </h1>
          <p className="text-gray-400 text-lg mb-4">
            Master sorting algorithms with step-by-step breakdowns and real-time analytics
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <Badge variant="secondary" className="bg-green-900 text-green-300">
              <Trophy className="w-4 h-4 mr-1" />
              {userProgress.algorithmsLearned}/6 Algorithms
            </Badge>
            <Badge variant="secondary" className="bg-blue-900 text-blue-300">
              <Target className="w-4 h-4 mr-1" />
              {userProgress.comprehensionScore}% Comprehension
            </Badge>
            <Badge variant="secondary" className="bg-purple-900 text-purple-300">
              <Clock className="w-4 h-4 mr-1" />
              {Math.floor(userProgress.totalTime / 1000)}s Total Time
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="visualizer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900">
            <TabsTrigger value="visualizer" className="data-[state=active]:bg-green-600">
              <Play className="w-4 h-4 mr-2" />
              Visualizer
            </TabsTrigger>
            <TabsTrigger value="learning" className="data-[state=active]:bg-blue-600">
              <BookOpen className="w-4 h-4 mr-2" />
              Learning
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visualizer" className="space-y-6">
            {/* Controls */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-green-400">Visualization Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Array Configuration</label>
                    <Select value={selectedConfig} onValueChange={setSelectedConfig} disabled={isVisualizing}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 max-h-60">
                        <SelectItem value="custom" className="text-white">
                          Custom Input
                        </SelectItem>
                        {arrayConfigurations.slice(0, 50).map((config) => (
                          <SelectItem key={config.name} value={config.name} className="text-white">
                            {config.name} - {config.difficulty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedConfig === "custom" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Custom Array</label>
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="e.g., 64, 34, 25, 12, 22, 11, 90"
                        className="bg-gray-800 border-gray-700 text-white"
                        disabled={isVisualizing}
                      />
                    </div>
                  )}

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
                        {Object.entries(algorithms).map(([key, algo]) => (
                          <SelectItem key={key} value={key} className="text-white">
                            <div className="flex items-center gap-2">
                              {algo.name}
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  algo.difficulty === "Easy"
                                    ? "border-green-500 text-green-400"
                                    : algo.difficulty === "Medium"
                                      ? "border-yellow-500 text-yellow-400"
                                      : "border-red-500 text-red-400"
                                }`}
                              >
                                {algo.difficulty}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Speed: {speed[0]}ms</label>
                    <Slider
                      value={speed}
                      onValueChange={setSpeed}
                      max={1000}
                      min={10}
                      step={10}
                      className="w-full"
                      disabled={isVisualizing}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="step-mode"
                      checked={stepByStepMode}
                      onCheckedChange={setStepByStepMode}
                      disabled={isVisualizing}
                    />
                    <label htmlFor="step-mode" className="text-sm text-gray-300">
                      Step-by-Step Mode
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="learning-mode" checked={learningMode} onCheckedChange={setLearningMode} />
                    <label htmlFor="learning-mode" className="text-sm text-gray-300">
                      Learning Mode
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="complexity-analysis"
                      checked={showComplexityAnalysis}
                      onCheckedChange={setShowComplexityAnalysis}
                    />
                    <label htmlFor="complexity-analysis" className="text-sm text-gray-300">
                      Real-time Analysis
                    </label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={startVisualization}
                    disabled={isVisualizing || array.length === 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isVisualizing ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Sorting...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Visualization
                      </>
                    )}
                  </Button>

                  {stepByStepMode && (
                    <Button
                      onClick={stepForward}
                      disabled={!isVisualizing || currentStep >= algorithmSteps.length - 1}
                      variant="outline"
                      className="border-blue-600 text-blue-400 hover:bg-blue-900"
                    >
                      <StepForward className="w-4 h-4 mr-2" />
                      Next Step
                    </Button>
                  )}

                  <Button
                    onClick={resetVisualization}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Real-time Performance Metrics */}
            {showComplexityAnalysis && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-purple-400">Real-time Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-1">{performance.comparisons}</div>
                      <div className="text-sm text-gray-400">Comparisons</div>
                      <div className="text-xs text-gray-500">Expected: O({currentAlgorithm.complexity.time})</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-400 mb-1">{performance.swaps}</div>
                      <div className="text-sm text-gray-400">Swaps</div>
                      <div className="text-xs text-gray-500">Space: O({currentAlgorithm.complexity.space})</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-400 mb-1">
                        {(performance.timeElapsed / 1000).toFixed(2)}s
                      </div>
                      <div className="text-sm text-gray-400">Time Elapsed</div>
                      <div className="text-xs text-gray-500">Real-time execution</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-1">{performance.efficiency.toFixed(1)}%</div>
                      <div className="text-sm text-gray-400">Efficiency</div>
                      <div className="text-xs text-gray-500">vs Theoretical</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Algorithm Progress</span>
                      <span>
                        {isVisualizing
                          ? Math.min(
                              100,
                              Math.round(
                                (performance.comparisons / Math.max(1, (array.length * (array.length - 1)) / 2)) * 100,
                              ),
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        isVisualizing
                          ? Math.min(
                              100,
                              (performance.comparisons / Math.max(1, (array.length * (array.length - 1)) / 2)) * 100,
                            )
                          : 0
                      }
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Visualization Area */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-green-400">Array Visualization</CardTitle>
                {currentConfig && (
                  <CardDescription className="text-gray-400">
                    {currentConfig.description} - Learning Objective: {currentConfig.learningObjective}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-center gap-1 md:gap-2 h-96 overflow-x-auto mb-6">
                  {array.map((element, index) => {
                    const height = (element.value / maxValue) * 300
                    let barColor = "bg-gray-600"

                    if (element.isSorted) {
                      barColor = "bg-green-500"
                    } else if (element.isSwapping) {
                      barColor = "bg-red-500"
                    } else if (element.isComparing) {
                      barColor = "bg-yellow-500"
                    } else if (element.isPivot) {
                      barColor = "bg-purple-500"
                    } else if (element.isMinimum) {
                      barColor = "bg-blue-500"
                    }

                    return (
                      <div
                        key={index}
                        className={`${barColor} transition-all duration-300 rounded-t-lg flex items-end justify-center text-xs font-bold text-white min-w-8 md:min-w-12 relative`}
                        style={{
                          height: `${height}px`,
                          width: `${Math.max(32, 400 / array.length)}px`,
                        }}
                      >
                        <span className="mb-1">{element.value}</span>
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                          {index}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Enhanced Legend */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
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
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-gray-300">Minimum</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span className="text-gray-300">Pivot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-gray-300">Sorted</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Algorithm Information */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    {currentAlgorithm.name}
                  </CardTitle>
                  <CardDescription>{currentAlgorithm.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-400 mb-2">Key Concepts:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentAlgorithm.concepts.map((concept) => (
                        <Badge key={concept} variant="outline" className="border-blue-500 text-blue-400">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-green-400 mb-2">Complexity Analysis:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Time Complexity:</span>
                        <div className="font-mono text-yellow-400">{currentAlgorithm.complexity.time}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Space Complexity:</span>
                        <div className="font-mono text-yellow-400">{currentAlgorithm.complexity.space}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Best Case:</span>
                        <div className="font-mono text-green-400">{currentAlgorithm.complexity.best}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Worst Case:</span>
                        <div className="font-mono text-red-400">{currentAlgorithm.complexity.worst}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Complete Step-by-Step Breakdown */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-purple-400">Complete Algorithm Breakdown</CardTitle>
                  <CardDescription>
                    {algorithmSteps.length > 0
                      ? `Complete 10-step breakdown of ${currentAlgorithm.name} - Everything explained within these steps`
                      : "Start visualization to see complete 10-step breakdown"}
                  </CardDescription>
                  <div className="text-xs text-gray-500 mt-2">
                    ⚡ Optimized Learning: All concepts consolidated into exactly 10 comprehensive steps
                  </div>
                </CardHeader>
                <CardContent>
                  {algorithmSteps.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {algorithmSteps.slice(0, 10).map((step, index) => (
                        <div key={index} className="border border-gray-700 rounded-lg p-4 bg-gray-800">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="border-green-500 text-green-400">
                              Step {index + 1} of 10
                            </Badge>
                            <Badge variant="outline" className="border-purple-500 text-purple-400">
                              {step.complexity}
                            </Badge>
                            <Badge variant="outline" className="border-orange-500 text-orange-400">
                              {step.operation}
                            </Badge>
                          </div>

                          <h4 className="font-semibold text-green-400 mb-2">{step.description}</h4>

                          <div className="mb-3">
                            <h5 className="text-sm font-medium text-gray-300 mb-1">Code:</h5>
                            <code className="block bg-gray-900 p-2 rounded text-yellow-400 font-mono text-sm border border-gray-600">
                              {step.code}
                            </code>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium text-gray-300 mb-1">Complete Explanation:</h5>
                            <p className="text-gray-400 text-sm leading-relaxed">{step.explanation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Start the visualization to see the complete 10-step breakdown</p>
                      <p className="text-xs mt-2">All algorithm concepts explained in exactly 10 comprehensive steps</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
