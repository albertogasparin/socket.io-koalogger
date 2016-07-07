# socket.io-koalogger

```
npm i --save socket.io-koalogger
```

## Usage

```js
// assuming you have your IO instance already setup
// var io = new socketIO(server, ...);

var logger = require('socket.io-koalogger');

io.use(logger());
```

