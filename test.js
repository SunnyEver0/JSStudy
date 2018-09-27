const EventEmitter = require('./EventEmitter');

// const eventEmitter = new EventEmitter();

EventEmitter.on('娱乐', (info) => {
  console.log(info);
});

EventEmitter.emit('娱乐', '这是一条娱乐新闻');
