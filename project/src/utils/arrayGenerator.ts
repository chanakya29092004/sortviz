import { ArrayElement } from '../types';

export const generateRandomArray = (size: number): ArrayElement[] => {
  const array: ArrayElement[] = [];
  const maxValue = 400; // Maximum height for visualization
  const minValue = 20;  // Minimum height for visibility
  
  for (let i = 0; i < size; i++) {
    array.push({
      value: Math.floor(Math.random() * (maxValue - minValue) + minValue),
      id: `element-${i}`, // Use consistent ID based on index only
    });
  }
  
  return array;
};

export const createArrayElement = (value: number, index: number): ArrayElement => ({
  value,
  id: `element-${index}`, // Use consistent ID based on index only
});

export const parseCustomArray = (input: string): ArrayElement[] | null => {
  try {
    // Remove whitespace and split by comma
    const values = input.trim().split(',').map(val => val.trim());
    
    // Validate that all values are numbers
    const numbers = values.map(val => {
      const num = parseFloat(val);
      if (isNaN(num)) {
        throw new Error(`"${val}" is not a valid number`);
      }
      return num;
    });
    
    // Check array size limits
    if (numbers.length < 2) {
      throw new Error('Array must contain at least 2 elements');
    }
    
    if (numbers.length > 100) {
      throw new Error('Array cannot contain more than 100 elements');
    }
    
    // Normalize values to fit visualization (20-400 range)
    const minVal = Math.min(...numbers);
    const maxVal = Math.max(...numbers);
    const range = maxVal - minVal;
    
    return numbers.map((num, index) => ({
      value: range === 0 ? 200 : Math.floor(((num - minVal) / range) * 380 + 20),
      id: `element-${index}`, // Use consistent ID based on index only
      originalValue: num, // Store original value for display
    }));
  } catch (error) {
    return null;
  }
};

export const validateCustomArrayInput = (input: string): string | null => {
  if (!input.trim()) {
    return 'Please enter array values';
  }
  
  const values = input.trim().split(',').map(val => val.trim());
  
  if (values.length < 2) {
    return 'Array must contain at least 2 elements';
  }
  
  if (values.length > 100) {
    return 'Array cannot contain more than 100 elements';
  }
  
  for (const val of values) {
    if (val === '') {
      return 'Empty values are not allowed';
    }
    
    const num = parseFloat(val);
    if (isNaN(num)) {
      return `"${val}" is not a valid number`;
    }
  }
  
  return null; // No errors
};