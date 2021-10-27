type callbackFn = (relove: Promise1['relove'], reject: Promise1['reject']) => void;

export class Promise1<T = any> {
  private thenCb: ((res: T) => T) | undefined = undefined;
  private rejectCb: ((res: any) => void) | undefined = undefined;
  private relove(res: T): T | undefined {
    return this.thenCb && this.thenCb(res);
  }
  private reject(res: any) {
    this.rejectCb && this.rejectCb(res);
  }
  constructor(cb: callbackFn) {
    try {
      cb.call(this, this.relove.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }
  then(thenCb: (res: T) => T) {
    this.thenCb = thenCb;
    return this;
  }
  catch(rejectCb: (res: any) => void) {
    this.rejectCb = rejectCb;
  }
}

describe('Promise1', function () {
  it('arr.newMap should work fine.', function () {
    new Promise1((relove, reject) => {
      try {
        setTimeout(() => {
          relove(1);
        }, 1000);
      } catch (error) {
        reject(error);
      }
    })
      .then(res => {
        console.log('res', res);
        expect(res).toStrictEqual(1);
      })
      .catch(err => {
        console.log(err);
      });
  });
});
