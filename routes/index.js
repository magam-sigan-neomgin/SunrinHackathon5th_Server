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

router.post('/register', upload.single('profileimage'), (req, res) => {
  Users.findIdById(req.body['id'], (results) => {
    if (results.length == 0) {
      let photoName = req.body['id'] + '.' + req.file.originalname.split('.').pop();
      S3.upload(photoName, req.file['buffer']);
      bcyrpt.hash(req.body['pw'], bcryptSettings.saltRounds, (err, hash) => {
        Users.signUp(req.body['id'], hash, req.body['username'], () => {
          res.json({'status': true});
        });
      });
    }
    else {
      res.json({'status': false, 'message': 'Id duplicated'});
    }
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

router.get('/board', (req, res) => {
  Users.getBoard((results) => {
    res.json({'status': true, 'board': results});
  });
});

router.post('/board/add', (req, res) => {
  if (req.isAuthenticated()) {
    Users.getLastBoardNo((id) => {
      Users.addBoard(id, req.body['content'], req.body['photo'], req.body['like']);
      res.json({'status': true});
    });
  }
  else {
    res.json({'status': false, 'message': 'Authenticated failed'});
  }
});

module.exports = router;
