// Socket global
var gIo = null;

// Game globals
let players = [];
let playersGuessed = [];
let drawingCache = [];
let isGameStarted = false;
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

  // Game starting condition
  if (!isGameStarted && players.length > 1) {
    // gIo.emit('startGame');
    gIo.emit('nextTurn', players[currDrawerIndex].id);
    isGameStarted = true;
  }

  // Send to client the cached drawing
  socket.emit('join', drawingCache);

  // Update client player list when a player join
  gIo.emit('player', players);

  // Update client player list when a player leave
  socket.on('disconnect', () => {
    players = players.filter(player => {
      return player.id !== socket.id;
    });

    // Game ending condition
    if (players.length < 2) {
      gIo.emit('endGame');
      isGameStarted = false;
    }

    gIo.emit('player', players);

    // Clear cache when room is empty
    if (players.length === 0) {
      drawingCache = [];
    }
  });

  // Drawer timer run out or game word guess is right
  socket.on('nextTurn', () => {
    currDrawerIndex++;

    if (currDrawerIndex > players.length - 1) currDrawerIndex = 0;

    gIo.emit('nextTurn', players[currDrawerIndex].id);
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
  const player = players.find(player => player.id === socket.id);
  socket.broadcast.emit('chat', {
    from: player.userName,
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
