type OnFulflled<T, fullResult> = ((v: T) => fullResult | PromiseLike1<fullResult>) | null | undefined;
type onRejected<catchResult> = ((reason: any) => catchResult | PromiseLike1<catchResult>) | null | undefined;

interface ZeroFunction {
  (): void;
}
interface UnaryFunction<T, R> {
  (x0: T): R;
}

interface Executor<T> {
  (resolve: UnaryFunction<T | PromiseLike1<T>, void>, reject: UnaryFunction<any, void>): void;
}

interface PromiseLike1<T> {
  then<fullResult = T, catchResult = never>(
    onFulfilled?: OnFulflled<T, fullResult>,
    onRejected?: onRejected<catchResult>
  ): Promise1<fullResult | catchResult>;
}

function resovePromise<T>(promise2: Promise1<T>, v: T | PromiseLike1<T>, resolve: (value: T) => void, reject: (reason?: any) => void) {
  if (promise2 === v) {
    return;
  }
  if (v != null && (typeof v === 'object' || typeof v === 'function') && 'then' in v) {
    // const then = v.constructor && v.then;
    try {
      v.then.call(
        v,
        y => {
          resovePromise(promise2, y, resolve, reject);
        },
        r => {
          reject(r);
        }
      );
    } catch (error) {
      reject(error);
    }
  } else {
    resolve(v);
  }
}

enum State {
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected'
}
export class Promise1<T> {
  private state: State = State.PENDING;
  private onFulfilledFn: ZeroFunction[] = [];
  private onRejectedFn: ZeroFunction[] = [];
  private value!: T;
  private reason: any = undefined;

  constructor(executor: Executor<T>) {
    if (typeof executor === 'function') {
      let called = false;

      const onResolve = (x: T | PromiseLike1<T>) => {
        if (called) return;
        called = true;
        resovePromise(this, x, this.onResolve.bind(this), this.onReject.bind(this));
      };

      const onReject = (reason: any) => {
        if (called) return;
        called = true;
        this.onReject(reason);
      };

      this.state = State.PENDING;

      try {
        executor(onResolve, onReject);
      } catch (error) {
        onReject(error);
      }
    }
  }
  private onResolve(res: T) {
    if (this.state !== State.PENDING) return;
    this.state = State.FULFILLED;
    this.value = res;
    this.onFulfilledFn.forEach(fn => fn());
  }

  private onReject(reason: any) {
    if (this.state !== State.PENDING) return;

    this.state = State.REJECTED;
    this.reason = reason;
    this.onRejectedFn.forEach(fn => fn());
  }
  public then<fullResult = T, catchResult = never>(
    onFulfilled?: OnFulflled<T, fullResult>,
    onRejected?: onRejected<catchResult>
  ): Promise1<fullResult | catchResult> {
    const promise2 = new Promise1<fullResult | catchResult>((resolve, reject) => {
      const resHandler = () => {
        const _onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v: T) => v;

        setTimeout(() => {
          try {
            const v = _onFulfilled(this.value) as fullResult | catchResult;

            resovePromise<fullResult | catchResult>(promise2, v, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };
      const rejHandler = () => {
        const _onRejected =
          typeof onRejected === 'function'
            ? onRejected
            : (reason: any) => {
                throw reason;
              };

        setTimeout(() => {
          try {
            const v = _onRejected(this.reason);
            resovePromise(promise2, v, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };
      if (this.state === State.FULFILLED) resHandler();
      if (this.state === State.REJECTED) rejHandler();
      if (this.state === State.PENDING) {
        this.onFulfilledFn.push(resHandler);
        this.onRejectedFn.push(rejHandler);
      }
    });
    return promise2;
  }

  catch<catchResult>(onRejected?: onRejected<catchResult>): Promise1<T | catchResult> {
    return this.then(null, onRejected);
  }

  finally(onFinally?: (() => void) | null): Promise1<T> {
    const _onFinally = typeof onFinally === 'function' ? onFinally : () => {};
    return this.then(
      v => Promise1.resolve(_onFinally()).then(() => v),
      reason => Promise1.resolve(_onFinally()).then(() => reason)
    );
  }

  static resolve(): Promise1<void>;
  static resolve<T>(v: T | PromiseLike1<T>): Promise1<T>;
  static resolve<T>(v?: T | PromiseLike1<T>): Promise1<T | void> {
    if (v instanceof Promise1) return v;
    if (v === undefined) {
      return new Promise1(reslove => {
        reslove(undefined);
      });
    } else {
      return new Promise1(reslove => reslove(v));
    }
  }

  static reject<T = never>(reason?: any): Promise1<T> {
    return new Promise1<T>((_, reject) => reject(reason));
  }

  static race<T>(list: readonly T[]): Promise1<T> {
    return new Promise1<T>((resolve, reject) => {
      for (const p of list) {
        if (typeof p === 'object' && 'then' in p) {
          this.resolve(p).then(
            v => {
              resolve(v);
            },
            reason => {
              reject(reason);
            }
          );
        }
      }
    });
  }

  static all<T>(list: readonly (T | PromiseLike1<T>)[]): Promise1<T[]> {
    return new Promise1<T[]>((resolve, reject) => {
      const values: T[] = [];

      for (const p of list) {
        if (typeof p === 'object' && 'then' in p) {
          this.resolve(p).then(
            v => {
              values[values.length] = v;
              if (values.length === list.length) resolve(values);
            },
            reason => {
              reject(reason);
            }
          );
        }
      }
    });
  }
}

// async function async1() {
//   console.log('A');
//   await async2();
//   console.log('B');
// }
// async function async2() {
//   console.log('C');
// }
// console.log('D');
// setTimeout(function() {
//   console.log('E');
// });
// async1();
// new Promise(function(resolve) {
//   console.log('F');
//   resolve(1);
// }).then(function() {
//   console.log('G');
// });
// console.log('H');
