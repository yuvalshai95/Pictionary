var wordlist = require('random-words');

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
let timer;
let counter;

const TURN_TIME = 60;

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
    socket.on('disconnect', () => onPlayerLeave(socket));
  });
}

// CALLBACK FUNCTIONS //

const onPlayerJoin = (socket, userName) => {
  players.push({
    id: socket.id,
    userName,
    score: 0,
  });

  // show to all players in chat who joined
  gIo.emit('chat', {
    from: 'Host',
    msg: `${userName} Joined`,
    color: 'green',
  });

  if (canStartGame()) startGame();

  // Game starting condition
  // if (!isGameStarted && players.length > 1) {
  //   // gIo.emit('startGame');
  //   gIo.emit('nextTurn', players[currDrawerIndex]);
  //   isGameStarted = true;
  // }

  // Send to client the cached drawing
  socket.emit('join', drawingCache);

  // Update client player list when a player join
  gIo.emit('player', players);

  // Drawer timer run out or game word guess is right
  // socket.on('nextTurn', () => {
  //   currDrawerIndex++;

  //   if (currDrawerIndex > players.length - 1) currDrawerIndex = 0;

  //   gIo.emit('nextTurn', players[currDrawerIndex]);
  // });
};

// Update client player list when a player leave
const onPlayerLeave = socket => {
  // Get player that left
  const player = players.find(p => p.id === socket.id);

  // show to all players in chat who joined
  gIo.emit('chat', {
    from: 'Host',
    msg: `${player?.userName} left`,
    color: 'red',
  });

  currDrawerIndex--;

  // Remove player for players
  players = players.filter(player => {
    return player.id !== socket.id;
  });

  players.length === 0 || shouldEndGame() ? endGame() : nextTurn();

  // Update client with current players in the game
  gIo.emit('player', players);

  // Clear cache when room is empty
  if (players.length === 0) {
    drawingCache = [];
  }
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

  // Check if player guessed right
  if (isGameStarted && msg === word) {
    // Send in chat player guessed
    gIo.emit('chat', {
      from: 'Host',
      msg: `${player.userName} guessed the word!`,
      color: 'gold',
    });

    // update client
    socket.emit('correctGuess');
    playersGuessed.push(player.id);

    nextTurn();

    // if (playersGuessed.length >= players.length - 1) {
    //   nextTurn();
    // }

    return;
  }

  gIo.emit('chat', {
    from: player.userName,
    msg,
  });
};

// GAME MANAGEMENT FUNCTIONS //

const canStartGame = () => {
  return players.length > 1 && !isGameStarted;
};

const startGame = () => {
  isGameStarted = true;
  currDrawerIndex = 0; // first player in the room

  onClearCanvas();

  // set which player is the drawer
  const player = players[currDrawerIndex];

  // set word to draw
  word = getRandomWord();

  gIo.emit('startGame', {
    id: player.id,
    word,
  });
  startTimer();

  // clearCanvas()
  // nextRound()

  // const player = players[currDrawerIndex]
  // word = getRandomWord()

  // io.emit('player', players)
  // io.emit('startGame', {
  // 	id: player.id,
  // 	word
  // })
  // emitDrawer(player.username)

  // startTimer()
};

const endGame = () => {
  isGameStarted = false;
  clearInterval(timer);
  onClearCanvas();
  gIo.emit('endGame');
};

const nextTurn = () => {
  clearInterval(timer);

  currDrawerIndex++;

  if (currDrawerIndex > players.length - 1) currDrawerIndex = 0;

  onClearCanvas();

  // set which player is the drawer
  const player = players[currDrawerIndex];

  // set word to draw
  word = getRandomWord();

  gIo.emit('nextTurn', {
    id: player?.id,
    word,
  });

  startTimer();
};

const shouldEndGame = () => {
  return players.length < 2 && isGameStarted;
};

const startTimer = () => {
  counter = TURN_TIME;
  gIo.emit('tick', counter);

  timer = setInterval(() => {
    counter--;

    // Player is out of time switch drawing turns
    if (counter < 0) {
      nextTurn();
      return;
    }
    gIo.emit('tick', counter);
  }, 1000);
};

// Gameplay LOGIC //

const getRandomWord = () => {
  return wordlist({exactly: 1})[0];
};

module.exports = {
  connectSockets,
};
