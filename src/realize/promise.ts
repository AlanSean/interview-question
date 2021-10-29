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
class Promise1<T> {
  private state: State = State.FULFILLED;
  private onFulfilledFn: ZeroFunction[] = [];
  private onRejectedFn: ZeroFunction[] = [];
  private value: T | undefined = undefined;
  private reason: any | undefined = undefined;

  constructor(executor: Executor<T>) {
    if (typeof executor === 'function') {
      let called = false;

      const onResolve = (x: T | PromiseLike1<T>) => {
        if (called) return;
        called = true;
        resovePromise(this, x, this.onResolve.bind(this), this.onResolve.bind(this));
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
    const promise2 = new Promise1<fullResult | catchResult>((resolve, reject) => {
      const resHandler = () => {
        const _onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v: T) => v;
        setTimeout(() => {
          try {
            const v = _onFulfilled(this.value);
            resovePromise(promise2, v, resolve, reject);
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
  catch<catchResult>(onRejected: onRejected<catchResult>): Promise1<T | catchResult> {
    return this.then(null, onRejected);
  }
  // finally(onFinally?: (() => void) | null): Promise1<T>;
}

new Promise1<number>(resolve => {
  resolve(1);
})
  .then(a => {
    console.log(a);
  })
  .then(a => {
    console.log(a);
  });
