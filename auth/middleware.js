// const bcrypt = require('bcrypt');

// const Users = require('../users/users-model.js');

// module.exports = (req, res, next) => {
//   let { username, password } = req.headers;

//   Users.findBy({ username })
//     .first()
//     .then(user => {
//       if (user && bcrypt.compareSync(password, user.password)) {
//         next();
//       } else {
//         res.status(401).json({ message: 'You cannot pass!' });
//       }
//     })
//     .catch(error => {
//       res.status(500).json(error);
//     });
// };

module.exports = (req, res, next) => {
  if (req.session && req.session.user) {
    next()
  } else {
    res.status(401).json({message: 'You must be logged in for this'})
  }
}