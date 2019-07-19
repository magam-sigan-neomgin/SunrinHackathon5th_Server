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
  let promiseArr = [];
  Users.getBoard((results) => {
    results.map((value) => {
      promiseArr.push(Users.getLike(value['id']));
      return value;
    });
    Promise.all(promiseArr).then((values) => {
      values.forEach((value, index) => {
        results[index]['likes'] = value;
      });
      res.json({'status': true, 'board': results});
    });
  });
});

router.post('/board/add', upload.single('photo'), (req, res) => {
  if (req.isAuthenticated()) {
    Users.getLastBoardNo((id) => {
      let photoName = id + '.' + req.file.originalname.split('.').pop();
      S3.uploadBoardPhoto(photoName, req.file['buffer']);
      Users.addBoard(id, req.body['title'], req.body['content'], photoName, 0);
      res.json({'status': true});
    });
  }
  else {
    res.json({'status': false, 'message': 'Authenticated failed'});
  }
});

router.post('/board/like', (req, res) => {
  if (req.isAuthenticated()) {
    Users.addLike(req.body['id'], req.user.username);
    res.json({'status': true});
  }
  else {
    res.json({'status': false, 'message': 'Authenticated failed'});
  }
});

module.exports = router;
