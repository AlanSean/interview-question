interface Array<T> {
  newMap<U>(this: Array<T>, callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
}
