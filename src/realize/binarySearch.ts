export function binarySearch<T>(arr: T[], target: T): number {
  let left = 0,
    right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (target == arr[mid]) return mid;
    target > arr[mid] ? (left = mid + 1) : (right = mid - 1);
  }
  return -1;
}

export function QSort<T>(arr: T[]): T[] {
  console.log(arr);
  if (arr.length <= 1) return arr;
  const pivotIndex = Math.floor(Math.random() * arr.length);
  const pivot = arr[pivotIndex];
  const left = [],
    right = [];
  for (let i = 0; i < arr.length; i++) {
    if (i === pivotIndex) {
      continue;
    }
    if (arr[i] > pivot) {
      right.push(arr[i]);
    }
    if (arr[i] < pivot) {
      left.push(arr[i]);
    }
  }

  return [...QSort(left), pivot, ...QSort(right)];
}

// QSort([11,2,3,56232,123,0]);
