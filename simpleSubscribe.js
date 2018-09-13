// simple DeviceEmitter
var DeviceEmitter = {
  subscribers: {
    'any': []
  },

  subscribe: function (type = 'any', fn) {
    if (!this.subscribers[type]) {
      this.subscribers[type] = [];
    }

    this.subscribers[type].push(fn);
  },

  unsubscribe: function (type = 'any', fn) {
    this.subscribers[type] = this.subscribers[type].filter((action) => {
      return action !== fn;
    });

  },

  publish: function (type = 'any', ...args) {
    this.subscribers[type].forEach((fn) => {
      fn(...args);
    });
  }
};


var listenerCallback = (info) => {
  console.log(info);
};

DeviceEmitter.subscribe('娱乐', listenerCallback);
DeviceEmitter.subscribe('体育', listenerCallback);

//Tom 退订娱乐新闻：
DeviceEmitter.unsubscribe('娱乐', listenerCallback);

// //发布新报纸：
DeviceEmitter.publish('娱乐', 'S.H.E演唱会惊喜登台');
DeviceEmitter.publish('体育', '欧国联-意大利0-1客负葡萄牙');






