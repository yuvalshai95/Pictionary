const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const path = require('path');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'public')));
} else {
  const corsOptions = {
    origin: '*',
    credentials: true,
  };
  app.use(cors(corsOptions));
}

app.use(express.static(path.resolve(__dirname, 'public')));

const {connectSockets} = require('./services/socket.service');
connectSockets(http);

app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 3030;
http.listen(port, () => {
  console.log(`Server is open on port ${port}`);
});
