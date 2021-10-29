type OnFulflled<T, R> = ((v: T) => R | PromiseLike1<R>) | null | undefined;
type onRejected<T> = ((reason: any) => T | PromiseLike1<T>) | null | undefined;

interface ZeroFunction {
  (): void;
}
interface UnaryFunction<T, R> {
  (x0: T): R;
}

interface Executor<T> {
  (resolve: UnaryFunction<T | PromiseLike1<T>, void>, reject: UnaryFunction<any, void>): void;
}
enum State {
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected'
}
interface PromiseLike1<T> {
  then<fullResult = T, catchResult = never>(
    onFulfilled?: OnFulflled<T, fullResult>,
    onRejected?: onRejected<catchResult>
  ): Promise1<fullResult | catchResult>;
}
class Promise1<T> {
  private state: State = State.FULFILLED;
  private onFulfilledFn: ZeroFunction[] = [];
  private onRejectedFn: ZeroFunction[] = [];
  private value: T | undefined = undefined;
  private reason: any | undefined = undefined;

  private of<R>(promise: Promise1<R>, v: R | PromiseLike1<R>, resolve: (value: R) => void, reject: (reason?: any) => void) {
    if (promise === v) {
      return;
    }
    if (v && (typeof v === 'object' || typeof v === 'function')) {
      // const then = v.constructor && v.then;
      resolve;
      reject;
    }
  }

  constructor(executor?: Executor<T>) {
    if (typeof executor === 'function') {
      let called = false;

      const onResolve = (res: T | PromiseLike1<T>) => {
        if (called) return;
        called = true;
        // this.onResolve(res);
        this.of(this, res, this.onResolve.bind(this), this.onResolve.bind(this));
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
    if (this.state === State.PENDING) return;

    this.state = State.FULFILLED;
    this.value = res;
    this.onFulfilledFn.forEach(fn => fn());
  }

  private onReject(reason: any) {
    if (this.state === State.PENDING) return;

    this.state = State.REJECTED;
    this.reason = reason;
    this.onRejectedFn.forEach(fn => fn());
  }

  public then<fullResult = T, catchResult = never>(
    onFulfilled?: OnFulflled<T, fullResult>,
    onRejected?: onRejected<catchResult>
  ): Promise1<fullResult | catchResult> {
    const promise = new Promise1<fullResult | catchResult>((resolve, reject) => {
      const resHandler = () => {
        const _onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v: T) => v;
        setTimeout(() => {
          try {
            _onFulfilled;
            // const v = _onFulfilled(this.value);
            // this.of<fullResult | catchResult>(promise, v, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };
      const rejHandler = () => {
        const _onRejected = typeof onRejected === 'function' ? onRejected : (v: T) => v;
        setTimeout(() => {
          try {
            _onRejected;
            // const v = _onRejected(this.value);
            // this.of<fullResult | catchResult>(promise, v, resolve, reject);
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
    return promise;
  }
  catch<catchResult>(onRejected: onRejected<catchResult>): Promise1<T | catchResult> {
    return this.then(null, onRejected);
  }
  // finally(onFinally?: (() => void) | null): Promise1<T>;
}

// new Promise1<number>((resolve) => {
//   resolve(1);
// })
//   .then((a) => {
//     console.log(a);
//     return new Promise1();
//   })
//   .then((a) => {
//     console.log(a);
//   });
