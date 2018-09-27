// function getMsg() {
//   return new RPromise(function(resolve) {
//     //异步请求
//     http.get(url,function(msg){
//       resolve(msg);
//     })
//   })
// }
//
// getMsg()
//   .then(function (res) {
//     console.log(res);
//   });

// 关键tip-1
// 1: promise里面的then函数仅仅是注册了后续需要执行的代码，真正的执行是在resolve方法里面执行的
// 2: 支持then方法的链式调用
// 3: 如果在then方法注册回调之前，resolve函数就执行了，怎么办？ 加入延时机制
// 4: 如果Promise异步操作已经成功，所有在异步操作成功之前注册的回调都会执行，
//    但是我们想要的是在Promise异步操作成功这之后注册的回调就再也不会执行了  加入状态机制
// this.then = function (onFulfilled) {
//   if (state === 'pending') {
//     callbacks.push(onFulfilled);
//     //ask 为什么要return this？
//     return this;
//   }
//   //假如state已经切换至其他状态，直接执行回调
//     setTimeout(function () {
//         onFulfilled(value);
//     }, 0);
//
//   return this;
// };
// 关键tip-2
// 1: 链式promise之间有一个桥梁promise，可称之为bridge promise，用于衔接两个promise，包装在在then函数中
// 2: 当前一个promise resolve之后，bridge promise负责传递之前promise的值
// 3: 将当前promise的值和bridge promise的resolve方法传给下一个promise之后，在下一个promise resolve的时候，执行bridge promise的resolve方法，再执行本身后注册的then函数中的promise resolve
// 4: 执行完四个promise（promise 1 - getUserId， promise 2 - getUserId bridge， promise 3 - getUserInfoById， promise 4 - getUserInfoById bridge）之后，继续执行后面的then函数


// Promises/A+规范明确要求回调需要通过异步方式执行，用以保证一致可靠的执行顺序
// 保证then函数的回调都已注册完毕
// 比如promise内部的函数是同步函数
// function getUserId() {
//     return new Promise(function (resolve) {
//         resolve(9876);
//     });
// }
// getUserId().then(function (id) {
//     // 一些处理
// });

function RPromise(fn) {
  var state = 'pending',
    value = null,
    callbacks = []; //callbacks为数组，因为可能同时有很多个回调


  this.then = function (onFulfilled) {
    return new RPromise(function (resolve) {
      handle({
        onFulfilled: onFulfilled || null,
        resolve: resolve
      });
    });
  };

  function handle(callback) {
    if (state === 'pending') {
      callbacks.push(callback);
      return;
    }
    //如果then中没有传递任何东西
    if (!callback.onFulfilled) {
      callback.resolve(value);
      return;
    }

    var ret = callback.onFulfilled(value);
    callback.resolve(ret);
  }

  function resolve(newValue) {

    state = 'fulfilled';
    value = newValue;

    if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
      var then = newValue.then;
      if (typeof then === 'function') {
        then.call(newValue, resolve);
        return;
      }
    }
    state = 'fulfilled';
    value = newValue;
    // console.log('value' + value);
    setTimeout(function () {
      callbacks.forEach(function (callback) {
        handle(callback);
      });
    }, 0);
  }

  fn(resolve);
}

var testAsyncFunc1 = function () {
  return new RPromise(function (resolve) {
    // resolve(123);
    setTimeout(function () {
      resolve(123)
    }, 100)
  })
};

var testAsyncFunc2 = function (res) {
  return new RPromise(function (resolve) {
    setTimeout(function () {
      resolve(res + 456)
    }, 100);
  })
};

testAsyncFunc1()
  .then(testAsyncFunc2)
  .then(function (res) {
    console.log(res);
  });

console.log(456);


// 目前缺少的
// 1.链式Promise的支持 （done）
// 2.rejected状态的处理

