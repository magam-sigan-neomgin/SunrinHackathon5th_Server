const mysql = require('mysql');
const bcyrpt = require('bcrypt');

var exports = module.exports = {};

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'good_night',
  password: 'good_night',
  database: 'good_night'
});

module.exports.findId = (id, cb) => {
  pool.query('SELECT id FROM user WHERE id=?', [id], (error, results, fields) => {
    // sql error
    if (error) {
      cb(error, null);
      return;
    }
    // id incorrect
    if (!results[0]) {
      cb(null, false);
      return;
    }
    const length = Object.keys(results[0]).length;
    if (length == 1) {
      // id correct
      cb(null, true)
    }
    else {
      // id incorrect
      cb(null, false)
    }
  });
};

module.exports.findPw = (id, pw, cb) => {
  pool.query('SELECT * FROM user WHERE id=?', [id], (error, results, fields) => {
    // sql error
    if (error) cb(error, null);
    const user = results[0];
    bcyrpt.compare(pw, user['pw'], (err, same) => {
      if (same == true) {
        cb(true, user);
      }
      else {
        cb(false, null);
      }
    });
  });
};

module.exports.signUp = (id, pw, userName, cb) => {
  pool.query('INSERT INTO user VALUES (?, ?, ?)', [id, pw, userName], (error, results, fields) => {
    // sql error
    if (error) throw error;
    cb();
  });
};

module.exports.idCheck = (id, cb) => {
  pool.query('SELECT id FROM user WHERE id=?', [id], (error, results, fields) => {
    // sql error
    if (error) throw error;
    const length = results.length;
    if (length == 1) {
      // id exists
      return cb(true);
    }
    else {
      // id non-exists
      return cb(false);
    }
  });
}

module.exports.getLastBoardNo = (cb) => {
  pool.query('SELECT id FROM board ORDER BY id DESC LIMIT 1', (error, results, fields) => {
    // sql error
    if (error) throw error;
    const length = results.length;
    if (length > 0) {
      cb(results[0]['id'] + 1);
    }
    else {
      cb(1);
    }
  });
}

module.exports.getUser = (id, cb) => {
  pool.query('SELECT username FROM user WHERE id = ?', [id], (error, results, fields) => {
    // sql error
    if (error) throw error;
    cb(results[0]);
  });
}

module.exports.findIdById = (id, cb) => {
  pool.query('SELECT id FROM user WHERE id = ?', [id], (error, results, fields) => {
    if (error) throw error;
    cb(results);
  })
};
module.exports.findIdByUserName = (userName, cb) => {
  pool.query('SELECT id FROM user WHERE username = ?', [userName], (error, results, fields) => {
    if (error) throw error;
    cb(results);
  })
};

module.exports.getBoard = (cb) => {
  pool.query('SELECT * FROM board', (error, results, fields) => {
    if (error) throw error;
    cb(results);
  });
}
module.exports.addBoard = (id, title, content, photo, emotion, author) => {
  pool.query('INSERT INTO board VALUES (?, ?, ?, ?, ?, ?, FALSE)', [id, title, content, photo, emotion, author], (error, results, fields) => {
    if (error) throw error;
  });
}
module.exports.addLike = (id, userId) => {
  pool.query('INSERT INTO board_like VALUES (?, ?)', [id, userId], (error, results, fields) => {
    if (error) throw error;
  });
};
module.exports.getLike = (id) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM board_like where id = ?', [id], (error, results, fields) => {
      if (error) throw error;
      resolve(results);
    });
  });
};
module.exports.getBoardById = (author)  => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM board WHERE author = ?', [author], (error, results, fields) => {
      if (error) throw error;
      resolve(results);
    })
  });
}
module.exports.updateShare = (id) => {
  pool.query('UPDATE board SET is_shared = 1 WHERE id = ?', [id]);
}
module.exports.addComment = (id, comment, author) => {
  pool.query('INSERT INTO board_comment VALUES (?, ?, ?)', [id, comment, author]);
}
module.exports.getComment = (id) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM board_comment WHERE id = ?', [id], (error, results, fields) => {
      if (error) throw error;
      resolve(results);
    });
  });
}