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
    socket.on('draw', coords => onDraw(socket, coords));
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

const onDraw = (socket, coords) => {
  socket.broadcast.emit('draw', coords);
  drawingCache.push(coords);
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
