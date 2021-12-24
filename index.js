const io = require('socket.io')(5000);
const fs = require('fs');
const users = {};
const child_process = require('child_process');
io.on('connection', socket => {
  socket.on('new-user', name => {
    //console.log("username:"+name);
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name)
  })

  socket.on('onMessage', message => {
    // socket.broadcast.emit('recived', { message: message, name: users[socket.id] });

    var workerProcess = child_process.spawn('google-chrome', [message]);
    workerProcess.stdout.on('data', function (data) {
      socket.broadcast.emit('recived', { message: data.toString()});

     console.log('stdout: ' + data);
    });
    workerProcess.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });
    workerProcess.on('close', function (code) {
      console.log('child process exited with code ' + code);
    });
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('sender', users[socket.id]);
    delete users[socket.id];
  })
})