/**
 * Created by apple on 2019/7/9.
 */

//异步代码
setTimeout(function () { //属于宏任务
  console.log('hello world2');
}, 0);
new Promise(resolve => { //属于微任务
  console.log('hello world3'); //Promise 对象会立即执行 所以new Promise里面的类似与同步代码
  resolve('hello world4');
}).then(data => {
  console.log(data)
});

//同步代码
function main() {
  console.log('hello world5');
}

console.log('hello world1');

main();

var start = new Date();
var end = 0;
setTimeout(function () {
  console.log(new Date - start);
}, 500);

while (new Date() - start <= 1000) {}

