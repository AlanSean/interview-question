Array.prototype.newMap = function (callbackfn, thisArg) {
  const self = thisArg || this;

  return this.reduce((pre, next, currentIndex) => {
    pre[currentIndex] = callbackfn.call(self, next, currentIndex, this);
    return pre;
  }, []);
};
