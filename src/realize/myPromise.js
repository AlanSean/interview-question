

function isObj(v){
  return typeof v === 'object' || typeof v === 'function';
}

function isIterator(obj){
  return obj !=null && typeof obj[Symbol.iterator] === 'function';
}

class MyPromise{
  constructor(executor){
    let called = true;

    if(typeof executor !== 'function') return;
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.fulfilledFn = [];
    this.rejectedFn = [];

    const _resolve = (res) => {
      if(!called) return;
      called = false;
      // this.resolve(res);
      this._reolvePromise(
        this,
        res,
        this.resolve.bind(this),
        this.reject.bind(this)
      );
    };

    const _reject = (reason) => {
      if(!called) return;
      called = false;
      this.reject(reason);
    };

    try {
      executor(_resolve.bind(this),_reject.bind(this));
    } catch (error) {
      _reject(error);
    }

  }
  _reolvePromise(
    promise2,
    v,
    resolve,
    reject
  ){
    if(promise2 === v) {
      throw '值不应该是同一个Promise';
    }

    if(v!=null && isObj(v) && typeof v.then === 'function'){
      const then = v.then;

      then.call(
        v,
        (v1) => {
          this._reolvePromise(promise2, v1, resolve, reject);
        },
        reason => {
          reject(reason);
        }
      );

    } else {
      resolve(v);
    }
  }

  resolve(res){
    if(this.state !== 'pending') return;
    this.state = 'fulfilled';
    this.value = res;
    this.fulfilledFn.forEach( fn => fn(res));
  }

  reject(reason){
    if(this.state !== 'pending') return;
    this.state = 'rejected';
    this.reason = reason;
    console.log(reason);
    if(this.rejectedFn.length === 0){
      throw reason;
    } else {
      this.rejectedFn.forEach( fn => fn(reason));
    }
  }

  then(
    fulfilled,
    rejected
  ){
    const promise2 = new MyPromise((resolve,reject) => {

      const fulHeandle = () => {
        setTimeout(() => {
          const _fulfilled = typeof fulfilled === 'function' ? fulfilled : v => v;
          try {
            const value = _fulfilled(this.value);
            this._reolvePromise(promise2,value,resolve,reject);
          } catch (error) {
            reject(error);
          }
        });
      };

      const rejectHeandle = () => {
        const _rejected = typeof rejected === 'function' ? rejected : function (reason) { 
          throw reason;
        };
        setTimeout(() => {
          // try {
          const reason = _rejected(this.reason);
          this._reolvePromise(promise2,reason,resolve,reject);
          // } catch (error) {
          //   reject(error);
          // }
        });
      };
      
      if(this.state  === 'fulfilled')fulHeandle();
      if(this.state === 'rejected') rejectHeandle();
      if(this.state === 'pending'){
        this.fulfilledFn.push(fulHeandle);
        this.rejectedFn.push(rejectHeandle);
      }
    });

    return promise2;
  }

  catch(onRejected){
    return this.then(undefined,onRejected);
  }

  finally(onFinally){
    const _onFinally = typeof onFinally === 'function' ? onFinally : () => {};
    this.then(
      v => MyPromise.resolve( _onFinally() ).then( () => v),
      reason => MyPromise.resolve( _onFinally()).then(() => reason),
    );
  }
}

MyPromise.resolve =  function (v){
  if(v!=null && isObj(v) && v.then) return v;
  return new MyPromise( reolve => reolve(v) );
};

MyPromise.reject =  function (reason){
  return new MyPromise((_,reject) => reject(reason));
};

MyPromise.race = function (arr) {
  if(!isIterator(arr)) {
    return MyPromise.reject('值不是一个可迭代的内容');
  }
  return new MyPromise( (resolve,reject) => {

    for(const p of arr){
      this.resolve(p).then( (res) => {
        resolve(res);
      },reason => {
        reject(reason);
      });
    }
  });
};

MyPromise.all = function(arr){
  if(!isIterator(arr)) {
    return MyPromise.reject('值不是一个可迭代的内容');
  }
  const values = [];

  return new MyPromise( (resolve,reject) => {
      for(const p of arr){
        this.resolve(p).then( v=> {
          console.log(v);
          values.push(v);
          if(values.length === arr.length) resolve(values);
        },r=> {
          reject(r);
        });
      }
  });
};

const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const a = MyPromise.all(([p1,p2,Promise.resolve(2)])).then( r => {
  console.log(r);
});