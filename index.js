const express = require('express')
const bcrypt = require('bcrypt')

const db = require('./database/db-config.js')

const Users = require('./users/users-model.js');

const restricted = require('./auth/middleware.js');

const server = express();

server.use(express.json());

//endpoints

server.get('/', (req, res) => {
    res.send("Sanity check");
});

//end endpoints

const port = 8000;
server.listen(port, () => console.log(`\n*** Magic On Port ${port} ***\n`));