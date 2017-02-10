var chalk = require('chalk');
var toArray = function (a) { return Array.prototype.slice.call(a); };

module.exports = function (options) {
  return function logger (socket, next) {
    if (!socket.__onevent) {
      // as there is no way to get the event name from socket.ack
      // we store our own events map w/ name & time
      socket.__evMap = {};

      // socket.onevent is called when a custom event is received
      // we store original onevent reference
      // and provide an enhanced implementation w/ log
      socket.__onevent = socket.onevent;
      socket.onevent = function (packet) {
        var ev = { name: packet.data[0], start: Date.now() };
        console.log('  ' + chalk.gray('<--')
          + ' ' + chalk.bold('SOCKET')
          + ' ' + chalk.gray('%s'),
          ev.name);
        socket.__evMap[packet.id] = ev;
        if (options.onRequest) {
          options.onRequest(packet.id, ev);
        }
        return socket.__onevent(packet);
      };

      // socket.ack is called to create a custom event callback
      // we store original ack reference
      // and provide an enhanced implementation w/ log
      socket.__ack = socket.ack;
      socket.ack = function () {
        var args = toArray(arguments);
        var _ack = socket.__ack.apply(this, args);
        return function () {
          var cbArgs = toArray(arguments);
          var ev = socket.__evMap[args[0]];
          if (ev) {
            console.log('  ' + chalk.gray('-->')
              + ' ' + chalk.bold('SOCKET')
              + ' ' + chalk.gray('%s')
              + ' ' + chalk.green('200')
              + ' ' + chalk.gray('%s'),
              ev.name,
              Date.now() - ev.start + 'ms');

            if (options.onResponse) {
              options.onResponse(args[0], ev);
            }
            delete socket.__evMap[args[0]];
          }
          _ack.apply(null, cbArgs);
        };
      };
    }

    if (next) {
      next();
    }
  };
};
