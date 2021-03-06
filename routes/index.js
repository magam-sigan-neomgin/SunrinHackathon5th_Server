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

router.post('/register', upload.single('photo'), (req, res) => {
  Users.findIdById(req.body['id'], (results) => {
    if (results.length == 0) {
      let photoName = req.body['id'] + '.' + req.file.originalname.split('.').pop();
      S3.upload(photoName, req.file['buffer']);
      bcyrpt.hash(req.body['pw'], bcryptSettings.saltRounds, (err, hash) => {
        Users.signUp(req.body['id'], hash, req.body['username'], photoName, () => {
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
  let promiseArr1 = [];
  let promiseArr2 = [];
  let promiseArr3 = [];
  Users.getBoard((results) => {
    results = results.filter((value) => {
      return value['is_shared'];
    })
    results.map((value) => {
      promiseArr1.push(Users.getLike(value['id']));
      promiseArr2.push(Youtube.getVideoByEmotion(value['emotion']));
      promiseArr3.push(Users.getComment(value['id']));
      return value;
    });
    Promise.all(promiseArr1).then((values) => {
      values.forEach((value, index) => {
        results[index]['likes'] = value;
      });
      Promise.all(promiseArr2).then((values2) => {
        values2.forEach((value2, index2) => {
          results[index2]['suggest'] = value2;
        });
        Promise.all(promiseArr3).then((values3) => {
          values3.forEach((value3, index3) => {
            results[index3]['comments'] = value3;
          });
          res.json({'status': true, 'board': results});
        });
      });
    });
  });
});
router.get('/board/my', (req, res) => {
  if (req.isAuthenticated()) {
    let promiseArr1 = [];
    let promiseArr2 = [];
    let promiseArr3 = [];
    Users.getBoardById(req.user.id).then((results) => {
      results.map((value) => {
        promiseArr1.push(Users.getLike(value['id']));
        promiseArr2.push(Youtube.getVideoByEmotion(value['emotion']));
        promiseArr3.push(Users.getComment(value['id']));
        return value;
      });
      Promise.all(promiseArr1).then((values) => {
        values.forEach((value, index) => {
          results[index]['likes'] = value;
        });
        Promise.all(promiseArr2).then((values2) => {
          values2.forEach((value2, index2) => {
            results[index2]['suggest'] = value2;
          });
          Promise.all(promiseArr3).then((values3) => {
            values3.forEach((value3, index3) => {
              results[index3]['comments'] = value3;
            });
            res.json({'status': true, 'board': results});
          });
        });
      });
    })
  }
  else {
    res.json({'status': false, 'message': 'Authenticated failed'});
  }
});

router.post('/board/add', upload.single('photo'), (req, res) => {
  if (req.isAuthenticated()) {
    Users.getLastBoardNo((id) => {
      let photoName = id + '.' + req.file.originalname.split('.').pop();
      S3.uploadBoardPhoto(photoName, req.file['buffer']);
      let date = new Date();
      date.setHours(date.getHours() + 9);
      date = date.toISOString().slice(0, 19).replace('T', ' ');
      Users.addBoard(id, req.body['title'], req.body['content'], photoName, req.body['emotion'], req.user.id, date);
      res.json({'status': true});
    });
  }
  else {
    res.json({'status': false, 'message': 'Authenticated failed'});
  }
});

router.post('/board/like', (req, res) => {
  if (req.isAuthenticated()) {
    Users.addLike(req.body['id'], req.user.id);
    res.json({'status': true});
  }
  else {
    res.json({'status': false, 'message': 'Authenticated failed'});
  }
});
router.post('/board/share', (req, res) => {
  Users.updateShare(req.body['id']);
  res.json({'status': true});
});
router.post('/board/comment', (req, res) => {
  if (req.isAuthenticated()) {
    Users.addComment(req.body['id'], req.body['comment'], req.user.id);
    res.json({'status': true});
  }
  else {
    res.json({'status': false, 'message': 'Authenticated failed'});
  }
});
router.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    Users.getUserById(req.user.id, ((result) => {
      res.json({'status': true, 'profile': result});
    }));
  }
  else {
    res.json({'status': false, 'message': 'Authenticated failed'});
  }
});
router.get('/board/unlike', (req, res) => {
  if (req.isAuthenticated()) {
    Users.addUnlike(req.query['id'], req.user.id);
    res.json({'status': true});
  }
  else {
    res.json({'status': false, 'message': 'Authenticated failed'});
  }
});
router.get('/id/to/username', (req, res) => {
  Users.idToUsername(req.query['id'], ((result) => {
    res.json({'status': true, 'username': result});
  }));
});

module.exports = router;
