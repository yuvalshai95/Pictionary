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

module.exports = {
  connectSockets,
};
