const express = require('express')
const bcrypt = require('bcrypt')
const session = require('express-session')
const knexSessionStore = require('connect-session-knex')(session)

const db = require('./database/db-config.js')

const Users = require('./users/users-model.js');

const withAuth = require('./auth/middleware.js');

const server = express();

const sessionConfig = {
  name: 'TotalyNotAuthentification',
  secret: process.env.SESSION_SECRET || 'keep it secret, keep it safe',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: true,
  store: new knexSessionStore({
    knex: db,
    tablename: 'knexsessions',
    sidfieldname: 'sessionid',
    createtable: true,
    clearInterval: 1000 * 60 * 30,
  }),
};

server.use(express.json());
server.use(session(sessionConfig));

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
          req.session.user = user
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

  server.get('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(error => {
        if (error) {
          res.status(500).json({message: 'Error whilst logging out',
          });
        } else {
          res.status(200).json({ message: 'You have been logged out' });
        }
      });
    } else {
      res.status(200).json({ message: 'you have to login before you logout, would you like to do that first? seems a bit superfolous' });
    }
  })
    

  
//end endpoints

const port = 8000;
server.listen(port, () => console.log(`\n*** Magic On Port ${port} ***\n`));

//this new branch is just for a pull