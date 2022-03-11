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

const TURN_TIME = 90;
const MAX_ROUNDS = 4;

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
    socket.on('disconnect', () => onPlayerLeave(socket));
    socket.on('chat', msg => onReceiveChat(socket, msg));
    socket.on('draw', coords => onDraw(socket, coords));
    socket.on('clear', () => onClearCanvas());
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

  // Game starting condition
  if (canStartGame()) startGame();

  // Send to client the cached drawing,word,round
  socket.emit('join', {drawingCache, word, round});

  // Update client player list when a player join
  gIo.emit('player', players);
};

const onPlayerLeave = socket => {
  // Get player that left
  const player = players.find(p => p.id === socket.id);

  // show to all players in chat who joined
  gIo.emit('chat', {
    from: 'Host',
    msg: `${player?.userName} left`,
    color: 'red',
  });

  // Remove player for players
  players = players.filter(player => {
    return player.id !== socket.id;
  });

  currDrawerIndex--;

  shouldGameReset() ? resetGame() : nextTurn();

  // // Update client with current players in the game
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
  if (isGameStarted && msg.toLowerCase() === word.toLowerCase()) {
    // Add score and update players
    addScore(socket.id, 50);
    gIo.emit('player', players);

    // Send in chat player guessed
    gIo.emit('chat', {
      from: 'Host',
      msg: `${player.userName} guessed the correct word!`,
      color: 'gold',
    });

    // update client
    socket.emit('correctGuess');
    playersGuessed.push(player.id);

    // Support more then 1 players guessing
    if (playersGuessed.length >= players.length - 1) {
      nextTurn();
    }

    // Only 1 player guessing
    // nextTurn();

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
  nextRound();

  // set which player is the drawer
  const player = players[currDrawerIndex];

  // set word to draw
  word = getRandomWord();

  gIo.emit('player', players);
  gIo.emit('startGame', {
    id: player.id,
    word,
  });

  // Send to all players who is drawing
  gIo.emit('chat', {
    from: 'Host',
    msg: `${player?.userName} is now drawing`,
    color: 'blue',
  });

  startTimer();
};

// Got through all rounds
const finishGame = () => {
  const leaderboardPlayers = [...players].sort((p1, p2) => (p1.score < p2.score ? 1 : -1));
  gIo.emit('leaderboard', leaderboardPlayers);

  resetGame();

  setTimeout(() => {
    canStartGame() && startGame();
  }, 15 * 1000); // 15 seconds
};

// When not enough players
const resetGame = () => {
  clearInterval(timer);

  // Reset scores
  players = players.map(player => ({
    ...player,
    score: 0,
  }));

  // Reset globals
  isGameStarted = false;
  word = '';
  round = 0;
  playersGuessed = [];

  // Reset canvas
  onClearCanvas();

  // Update client to reset game
  gIo.emit('resetGame');
};

const nextTurn = () => {
  if (!nextRound()) return;

  clearInterval(timer);
  // Reset guesses
  playersGuessed = [];

  currDrawerIndex++; // by order of joining the room
  if (currDrawerIndex > players.length - 1) {
    currDrawerIndex = 0;
  }
  onClearCanvas();
  const player = players[currDrawerIndex]; // set which player is the drawer
  word = getRandomWord(); // set word to draw

  // Update client to start next turn
  gIo.emit('nextTurn', {
    id: player?.id,
    word,
  });

  // Send to all players who is drawing
  gIo.emit('chat', {
    from: 'Host',
    msg: `${player?.userName} is now drawing`,
    color: 'blue',
  });

  startTimer();
};

const shouldGameReset = () => {
  return players.length < 2;
};

const startTimer = () => {
  counter = TURN_TIME;
  gIo.emit('tick', counter);

  timer = setInterval(() => {
    counter--;

    // Player is out of time switch drawing turns
    if (counter < 0) {
      // Send to all players the right word
      gIo.emit('chat', {
        from: 'Host',
        msg: `The correct answer was ${word}`,
        color: 'brown',
      });

      nextTurn();
      return;
    }

    // Update client
    gIo.emit('tick', counter);
  }, 1000);
};

const nextRound = () => {
  // Finished all round
  round++;
  if (round > MAX_ROUNDS) {
    finishGame();
    return false;
  }

  gIo.emit('nextRound');
  return true;
};

// Gameplay LOGIC //

const getRandomWord = () => {
  return wordlist({exactly: 1})[0];
};

const addScore = (id, amount) => {
  players.forEach(player => {
    if (player.id === id) player.score += amount;
  });
};

module.exports = {
  connectSockets,
};
