const express = require('express');
const passport = require('passport');
const path = require('path');
const bcyrpt = require('bcrypt');
const Users = require('../passport/user.js')

const router = express.Router();
const bcryptSettings = {
  saltRounds: 10
};

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/signin', (req, res) => {
  if (req.isAuthenticated()) {
    res.send("You are already logged in<br>" + JSON.stringify(req.user));
  }
  else {
    res.sendFile('signIn.html', { root: path.join(__dirname, '../public/html') })
  }
});

router.post('/signin', passport.authenticate('local', {
  successRedirect: '/succeeded',
  failureRedirect: '/failed'
}));

router.get('/signout', (req, res) => {
  req.logout();
  res.redirect('/signin');
});

router.post('/idcheck', (req, res) => {
  Users.idCheck(req.body['id'], (result) => {
    if (result == true) {
      res.status(res.statusCode).json({ idCheck: true });
    }
    else {
      res.status(res.statusCode).json({ idCheck: false });
    }
  });
});

router.get('/signup', (req, res) => {
   res.sendFile('signUp.html', { root: path.join(__dirname, '../public/html') });
});

router.post('/signup', (req, res) => {
  bcyrpt.hash(req.body['pw'], bcryptSettings.saltRounds, (err, hash) => {
    // id: req.body['id'], pw(hashed): hash
    Users.signUp(req.body['id'], hash);
  });
});

router.get('/succeeded', (req, res) => {
  res.send("SUCCEEDED");
});

router.get('/failed', (req, res) => {
  res.send("FAILED");
});

module.exports = router;
