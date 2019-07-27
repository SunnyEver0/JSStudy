var pipe = (function () {
  return function (value) {
    var funcStack = [];
    var oproxy = new Proxy({}, {
      get: function (pipeObject, fnName) {
        if (fnName === 'get') {
          return funcStack.reduce(function (val, fn) {
            return fn(val);
          }, value);
        }
        funcStack.push(funcs[fnName]);
        return oproxy;
      }
    });

    return oproxy;
  }
}());

var funcs = { //代替window
  double: n => n * 2,
  pow: n => n * n,
  reverseInt: n => n.toString().split("").reverse().join("") | 0
};

const a = pipe(3).double.pow.reverseInt.get; // 63
console.log(a, 'a')
