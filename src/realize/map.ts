export class MyArray<T> extends Array<T> {
  constructor() {
    super();
  }
  newMap<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[] {
    const self = thisArg || this;

    return this.reduce<U[]>((pre, next, currentIndex) => {
      pre[currentIndex] = callbackfn.call(self, next, currentIndex, this);
      return pre;
    }, []);
  }
}
