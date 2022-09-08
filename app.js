const express = require('express');
const cors = require('cors');
const { getUsers } = require('./controllers/getUsers');
const { removeUserById } = require('./controllers/removeUserById')
const { postUsers } = require('./controllers/postUsers');
const { getUserById } = require('./controllers/getUserById');
const { customErrors } = require('./error-handling');
const { postLogin } = require('./controllers/postLogin');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('Hello world!');
});

app.get('/users', getUsers);

app.post('/users', postUsers);

app.delete('/users/:user_id', removeUserById)

app.get('/users/:userId', getUserById);

app.post('/users/login', postLogin)

// EHMFs

app.use(customErrors);

app.all('*', (req, res) => {
    res.status(404).send({msg: 'bad path'})
});

module.exports = app;