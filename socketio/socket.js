var exports = module.exports = {};

function chatSocket(ns) {
  ns.on('connection', (socket) => {
    ns.emit('msg', "User " + socket.id + " Connected Room");
    socket.on('msg', (msg) => {
      let str = socket.id + ': ' + msg;
      ns.emit('msg', str);
    });
    socket.on('disconnect', () => {
      let str = "User " + socket.id + " Disconnected Room"
      ns.emit('msg', str);
    });
  });
}

module.exports.on = (io) => {
  const namespace1 = io.of('/namespace1');
  const namespace2 = io.of('/namespace2');
  chatSocket(namespace1);
  chatSocket(namespace2);
}