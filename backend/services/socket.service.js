// Socket global
var gIo = null;

// Game globals
let players = [];
let playersGuessed = [];
let drawingCache = [];
let hasGameStarted = false;
let currDrawerIndex = 0;
let round = 0;
let word = '';

function connectSockets(http) {
  gIo = require('socket.io')(http, {
    cors: {
      origin: '*',
    },
  });
  gIo.on('connection', socket => {
    console.log('New socket', socket.id);

    socket.on('disconnect', () => {
      console.log('Socket disconnected', socket.id);
    });

    socket.on('join', userName => onPlayerJoin(socket, userName));

    // socket.on('chat topic', topic => {
    //   if (socket.myTopic === topic) return;
    //   if (socket.myTopic) {
    //     socket.leave(socket.myTopic);
    //   }
    //   socket.join(topic);
    //   socket.myTopic = topic;
    // });

    // socket.on('chat newMsg', msg => {
    //   console.log('Emitting Chat msg', msg);
    //   // emits to all sockets:
    //   // gIo.emit('chat addMsg', msg)
    //   // emits only to sockets in the same room
    //   gIo.to(socket.myTopic).emit('chat addMsg', msg);
    // });

    // socket.on('user-watch', userId => {
    //   socket.join('watching:' + userId);
    // });

    // socket.on('set-user-socket', userId => {
    //   socket.userId = userId;
    // });

    // socket.on('unset-user-socket', () => {
    //   delete socket.userId;
    // });
  });
}

// CALLBACK FUNCTIONS //

const onPlayerJoin = (socket, userName) => {
  players.push({
    id: socket.id,
    userName,
    score: 0,
  });

  // gIo.emit('chat', {
  //   from: 'Host',
  //   msg: `${userName} joined`,
  //   color: 'green',
  // });

  // if(canStartGame()) startGame()
};

// GAME MANAGEMENT FUNCTIONS //

// const canStartGame = () => {
// 	return players.length > 1 && !hasGameStarted
// }

// const startGame = () => {
// 	hasGameStarted = true
// 	currDrawerIndex = 0

// 	clearCanvas()
// 	nextRound()

// 	const player = players[currDrawerIndex]
// 	word = getRandomWord()

// 	io.emit('player', players)
// 	io.emit('startGame', {
// 		id: player.id,
// 		word
// 	})
// 	emitDrawer(player.username)

// 	startTimer()
// }

// function emitTo({type, data, label}) {
//   if (label) gIo.to('watching:' + label).emit(type, data);
//   else gIo.emit(type, data);
// }

// async function emitToUser({type, data, userId}) {
//   const socket = await _getUserSocket(userId);
//   if (socket) socket.emit(type, data);
//   else {
//     console.log('User socket not found');
//     _printSockets();
//   }
// }

// // Send to all sockets BUT not the current socket
// async function broadcast({type, data, room = null, userId}) {
//   console.log('BROADCASTING', JSON.stringify(arguments));
//   const excludedSocket = await _getUserSocket(userId);
//   if (!excludedSocket) {
//     return;
//   }
//   if (room) {
//     excludedSocket.broadcast.to(room).emit(type, data);
//   } else {
//     excludedSocket.broadcast.emit(type, data);
//   }
// }

// async function _getUserSocket(userId) {
//   const sockets = await _getAllSockets();
//   const socket = sockets.find(s => s.userId == userId);
//   return socket;
// }
// async function _getAllSockets() {
//   // return all Socket instances
//   const sockets = await gIo.fetchSockets();
//   return sockets;
// }

// async function _printSockets() {
//   const sockets = await _getAllSockets();
//   console.log(`Sockets: (count: ${sockets.length}):`);
//   sockets.forEach(_printSocket);
// }
// function _printSocket(socket) {
//   console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`);
// }

module.exports = {
  connectSockets,
  // emitTo,
  // emitToUser,
  // broadcast,
};
