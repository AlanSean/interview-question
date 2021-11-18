function create(ctor, ...params) {
  //先判断是不是function
  //进行原型链连接
  //绑定函数调用的this
  if (typeof ctor !== 'function') {
    throw '应该传入一个函数';
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const obj = Object.create(ctor.prototype);
  const result = ctor.apply(obj, params);

  if (
    result != null &&
    (typeof result === 'object' || typeof result === 'function')
  ) {
    return result;
  } else {
    return obj;
  }
}


function myBind(self,fn,...args){
  return function(...args1){
    self.apply(fn,args.concat(args1));
  };
}

function a(a,b){
  console.log(this)
  console.log(a,b);
}
function c(a,b){
  console.log(b);
}
const b = myBind(a,c,1,2);
b();
