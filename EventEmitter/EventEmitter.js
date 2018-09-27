let _events = {
  newListener: []
};

let EventEmitter = function () {
};

EventEmitter.on =
  EventEmitter.addListener = function (type, listener, flag) {
    //保证存在实例属性
    // if (!this._events) this._events = Object.create(null);

    if (_events[type]) {

      console.log('EventEmitter.maxListeners:' + EventEmitter.maxListeners);
      if (_events[type].length >= EventEmitter.maxListeners) {
        return;
      }

      if (flag) {//从头部插入
        _events[type].unshift(listener);
      } else {
        _events[type].push(listener);
      }

    } else {
      _events[type] = [listener];
    }
    //绑定事件，触发newListener
    if (type !== 'newListener') {
      this.emit('newListener', type);
    }
  };

EventEmitter.emit = function (type, ...args) {
  if (_events[type]) {
    _events[type].forEach((fn) => fn.call(this, ...args));
  }
};

EventEmitter.off =
  EventEmitter.removeEventListener = function (type, listener) {
    if (_events[type]) {
      _events[type].filter((fn) => {
        return listener.toString() !== fn.toString();
      })
    }
  };


//默认最大监听数
EventEmitter.defaultMaxListeners = 10;

EventEmitter.maxListeners = EventEmitter.defaultMaxListeners;

module.exports = EventEmitter;
