const express = require('express');
const passport = require('passport');
const path = require('path');
const bcyrpt = require('bcrypt');
const multer  = require('multer')
const Users = require('../passport/user.js')
const S3 = require('../s3/s3.js');
const Youtube = require('../google/youtube.js')
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
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
    res.status(res.statusCode).json({'isAuthenticated': req.isAuthenticated(), 'id': req.user['id']});
  }
  else {
    res.sendFile('signIn.html', { root: path.join(__dirname, '../public/html') })
  }
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/status',
  failureRedirect: '/status'
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

router.get('/register', (req, res) => {
   res.sendFile('signUp.html', { root: path.join(__dirname, '../public/html') });
});

router.post('/register', (req, res) => {
  bcyrpt.hash(req.body['pw'], bcryptSettings.saltRounds, (err, hash) => {
    Users.signUp(req.body['id'], hash, req.body['username'], () => {
      res.json({'status': true});
    });
  });
});

router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    Users.getUser(req.user['id'], (results) => {
      res.json({'status': req.isAuthenticated(), 'id': req.user['id'], 'username': results['username']});
    });
  }
  else {
    res.json({'status': req.isAuthenticated(), 'message': "Authenticated failed"})
  }
});

module.exports = router;
