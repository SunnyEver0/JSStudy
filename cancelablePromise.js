
function wrapThenRejectHandler(rejectHandler) {
  return function(e) {
    if (e instanceof Error && e.message === 'break' || typeof rejectHandler === 'undefined') {
      return Promise.reject(e);
    } else {
      return rejectHandler(e);
    }
  };
}
function wrapCatchRejectHandler(rejectHandler) {
  return function (e) {
    if (!(e instanceof Error && e.message === 'break') && rejectHandler) {
      rejectHandler(e);
    } else {
      return false;
    }
  }
}
Object.defineProperty(Promise, 'break', {
  get: function(){
    throw new Error('break');
  },
});

let oldThen = Promise.prototype.then;
let oldCatch = Promise.prototype.catch;
Promise.prototype._then = function (resolveHandler, rejectHandler) {
  return oldThen.bind(this)(resolveHandler, wrapThenRejectHandler(rejectHandler));
};
Promise.prototype._catch = function (rejectHandler) {
  return oldCatch.bind(this)(wrapCatchRejectHandler(rejectHandler));
};
function start() {
  return new Promise(function (resolve, reject) {
    resolve('start');
  });
}
start()
  ._then(function () {
    console.log('1');
  })
  ._then(function () {
    console.log('2');
    Promise.break();
  })
  ._then(function () {
    console.log('3');
  }, function () {
    console.log('3,error')
  })
  ._catch(function (ex) {
    console.log('ex: ', ex);
  });
