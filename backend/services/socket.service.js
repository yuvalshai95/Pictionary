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
    socket.on('clear', () => onClearCanvas());
    socket.on('chat', msg => onReceiveChat(socket, msg));
  });
}

// CALLBACK FUNCTIONS //

const onPlayerJoin = (socket, userName) => {
  players.push({
    id: socket.id,
    userName,
    score: 0,
  });

  // Send to client the cached drawing
  socket.emit('join', drawingCache);

  // Update client player list when a player join
  gIo.emit('player', players);

  // Update client player list when a player leave
  socket.on('disconnect', () => {
    players = players.filter(player => {
      return player.id !== socket.id;
    });

    gIo.emit('player', players);

    // Clear cache when room is empty
    if (players.length === 0) {
      drawingCache = [];
    }
  });
};

const onDraw = (socket, coords) => {
  socket.broadcast.emit('draw', coords);
  drawingCache.push(coords);
};

const onClearCanvas = () => {
  drawingCache = [];
  gIo.emit('clear');
};

const onReceiveChat = (socket, msg) => {
  const from = players.find(player => player.id === socket.id).userName;
  socket.broadcast.emit('chat', {
    from,
    msg,
  });

  // Send to all
  // gIo.emit('chat', {
  //   from,
  //   msg,
  // });
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
