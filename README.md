# socket.io-koalogger

```
npm i --save socket.io-koalogger
```

## Usage

```js
// assuming you have your IO instance already setup
// var io = new socketIO(server, ...);

var logger = require('socket.io-koalogger');

io.use(logger({
  onRequest: function (id, details) {}, // optional
  onResponse: function (id, details) {}, // optional
}));
```

## Limitations

Currently it logs only Socket.io events with a defined callback. So, no logs while emitting and broadcasting.
