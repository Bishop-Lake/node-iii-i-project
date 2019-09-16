const express = require('express')
const bcrypt = require('bcrypt')

const db = require('./database/db-config.js')

const Users = require('./users/users-model.js');

const withAuth = require('./auth/middleware.js');

const server = express();

server.use(express.json());

//endpoints

server.get('/', (req, res) => {
    res.send("Sanity check");
});

server.post('/api/register', (req, res) => {
    let { username, password } = req.body;
  
    const hash = bcrypt.hashSync(password, 12);
  
    Users.add({ username, password: hash })
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });
  
  server.post('/api/login', (req, res) => {
    let { username, password } = req.body;
  
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          res.status(200).json({ message: `Welcome ${user.username}!` });
        } else {
          res.status(401).json({ message: 'You cannot pass!' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });
  
  server.get('/api/users', withAuth, (req, res) => {
    Users.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });
  
//end endpoints

const port = 8000;
server.listen(port, () => console.log(`\n*** Magic On Port ${port} ***\n`));

//this new branch is just for a pull