/**
 * Created by apple on 2019/7/9.
 */
//1. callback
// function load(url, callback) {
//   //something
//   setTimeout(callback, 3000);//假设某个异步任务处理需要3s 3s后执行回调
// }
//
// load('xxx', function () {
//   //do something
//   console.log('hello world')
// });

//2. Promise
let promise = new Promise((resolve, reject) => {
  //Promise对象接受一个函数
  try {
    //模拟某异步操作 , 若操作成功返回数据 
    setTimeout(() => {
      //resolve() 使pending状态变为 fulfilled,需要注意resolve()函数最多只能接收1个参数，若要传多个参数，需要写成数组，或对象，比如resolve([1,2,2,2])或resolve({data,error})
      resolve('hello world');
      reject(); //状态已变为fulfilled 故下面这个reject()不执行
    }, 1000);
  } catch (e) {
    reject(e); //操作失败 返回Error对象 reject() 使pending状态变为rejected
  }
});

promise.then((data) => {
  console.log(data);   //resolve()函数里面传的值
}, (err) => {
  console.log(err); //reject()函数里传的值
});


// 3. async await

//封装一个定时器，返回一个Promise对象
const timer = time => new Promise((resolve, reject) => {
  setTimeout(() => resolve('hello world'), time)
});


async function main() {//async函数
  let start = Date.now();
  // 可以把await理解为 async wait 即异步等待(虽然是yield的变体)，
  // 当Promise对象有值的时候将值返回，即Promise对象里resolve(data)里面的data，作为await表达式的结果
  let data = await timer(1000);
  //将会输出 hello world time =  1002 ms
  console.log(data, 'time = ', Date.now() - start, 'ms')
}
main();
