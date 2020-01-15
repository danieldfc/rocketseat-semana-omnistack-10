require('dotenv').config();

const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use(cors({ origin: process.env.FRONT_END }));
app.use(express.json());
app.use(routes);

app.listen(3333);

console.log('> Starting server...');