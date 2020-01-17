require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const { setupWebSocket } = require('./websocket');
const routes = require('./routes');

const app = express();
const server = http.Server(app);

setupWebSocket(server);

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use(cors({ origin: process.env.FRONT_END }));
app.use(express.json());
app.use(routes);

server.listen(3333);

console.log('> Starting server...');