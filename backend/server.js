const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');

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
