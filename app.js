const express = require('express');
const cors = require('cors');
const { getUsers } = require('./controllers/getUsers');
const { removeUserById } = require('./controllers/removeUserById')
const { postUsers } = require('./controllers/postUsers');
const { getUserById } = require('./controllers/getUserById');
const { customErrors } = require('./error-handling');
const { postLogin } = require('./controllers/postLogin');
const { patchUser } = require('./controllers/patchUser');
const { patchUserConnections } = require('./controllers/patchUserConnections');
const { removeUserConnection } = require('./controllers/removeUserConnection');
const { patchUserProfiles } = require('./controllers/patchUserProfiles');
const { removeUserProfiles } = require('./controllers/removeUserProfiles');
const { getPresents } = require('./controllers/getPresents');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('Hello world!');
});

app.get('/users', getUsers);
app.post('/users', postUsers);

app.get('/users/:userId', getUserById);
app.patch('/users/:userId', patchUser);
app.delete('/users/:user_id', removeUserById);

app.post('/users/login', postLogin);

app.patch('/users/:userId/connections', patchUserConnections);
app.delete('/users/:userId/connections', removeUserConnection);

app.patch('/users/:userId/profiles', patchUserProfiles);
app.delete('/users/:userId/profiles', removeUserProfiles);

app.get('/presents/:category', getPresents);

// EHMFs

app.use(customErrors);

app.all('*', (req, res) => {
    res.status(404).send({msg: 'bad path'})
});

module.exports = app;