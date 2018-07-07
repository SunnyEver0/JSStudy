/*!
 *
 * network模块 React Native module
 * 主要提供网络请求相关操作
 *
 */

let timer;

/*
 带timeout的fetch promise
 */
const _fetch = (service, args) => {
    //如果没有设置timeout 默认10秒超时
    const timeout = args.timeout ? args.timeout : 10 * 1000;
    var abort_fn = null;
    //这是一个可以被reject的promise
    var abort_promise = new Promise((resolve, reject) => {
        abort_fn = () => reject('timeout')
    });
    var fetch_promise = fetch(service, args);
    //这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
    var abortable_promise = Promise.race([
        fetch_promise,
        abort_promise
    ]);
    timer = setTimeout(abort_fn, timeout);
    return abortable_promise;
};

export default {

    /*
     带timeout的网络请求封装
     @params service: url
     @params args: 网络请求参数
     @params successCallBack 请求成功回调    
     @params errCallBack 请求失败回调
     */
    async timeoutFetch(service, args, successCallBack, errCallBack) {
        try {
            let response = await _fetch(service, args);
            let responseRes;
            console.log(response);
            if (args.type === 'text') {
                responseRes = await response.text();
            } else {
                responseRes = await response.json();
            }
            //清除计时器避免出现程序拥堵
            clearTimeout(timer);
            if (responseRes) {
                if (successCallBack) {
                    successCallBack(responseRes);
                }
                return responseRes;
            } else {
                return Promise.reject("responseRes is undefined");
            }
        } catch (err) {
            clearTimeout(timer);
            if (errCallBack) {
                errCallBack(err);
            }
            return Promise.reject(err);
        }
    },
    /*
     一个可取消的promise 用于清除耗时较长的网络请求
     */
    cancelablePromise(promise) {
        let _hasCanceled = false;
        const wrappedPromise = new Promise((resolve, reject) => {
            promise.then((val) => {
                _hasCanceled ? reject({isCanceled: true}) : resolve(val)
            });
            promise.catch((err) => {
                _hasCanceled ? reject({isCanceled: true}) : reject(err)
            });
        });
        return {
            promise: wrappedPromise,
            cancel() {
                _hasCanceled = true
            }
        }
    },
};