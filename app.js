const express = require('express');
const cors = require('cors');
const { getUsers } = require('./controllers/getUsers');

// const { v4: uuidv4} = require('uuid');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('Hello world!');
});

app.get('/users', getUsers);

module.exports = app;