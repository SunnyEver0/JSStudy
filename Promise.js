function getMsg() {
  return new Promise(function(resolve) {
    //异步请求
    http.get(url,function(msg){
      resolve(msg);
    })
  })
}

getMsg()
  .then(function (res) {
    console.log(res);
  });

// 关键tip
// 1: promise里面的then函数仅仅是注册了后续需要执行的代码，真正的执行是在resolve方法里面执行的
// 2: 支持then方法的链式调用
// 3: 如果在then方法注册回调之前，resolve函数就执行了，怎么办？ 加入延时机制
// 4: 如果Promise异步操作已经成功，所有在异步操作成功之前注册的回调都会执行，
//    但是我们想要的是在Promise异步操作成功这之后注册的回调就再也不会执行了  加入状态机制

function Promise(fn) {
  var state = 'pending',
    value = null,
    callbacks = []; //callbacks为数组，因为可能同时有很多个回调

  this.then = function (onFulfilled) {
    if (state === 'pending') {
      callbacks.push(onFulfilled);
      //ask 为什么要return this？
      return this;
    }
    //假如state已经切换至其他状态，直接执行回调
    onFulfilled(value);
    return this;
  };

  function resolve(newValue) {

    state = 'fulfilled';
    value = newValue;

    setTimeout(function () {
      callbacks.forEach(function (callback) {
        callback(newValue);
      });
    }, 0);
  }

  fn(resolve);
}

// 目前缺少的
// 1.链式Promise的支持
// 2.rejected状态的处理
