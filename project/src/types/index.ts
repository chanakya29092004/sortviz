export type SortingAlgorithm = 
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'merge'
  | 'quick'
  | 'heap';

export interface ArrayElement {
  value: number;
  id: string;
  originalValue?: number; // Store original value for custom arrays
  isComparing?: boolean;
  isSwapping?: boolean;
  isSorted?: boolean;
}

export interface SortingStep {
  array: ArrayElement[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
}

export interface SortingState {
  array: ArrayElement[];
  isRunning: boolean;
  isCompleted: boolean;
  currentStep: number;
  steps: SortingStep[];
}