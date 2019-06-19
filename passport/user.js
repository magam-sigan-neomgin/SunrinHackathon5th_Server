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
  pool.query('SELECT no FROM board ORDER BY no DESC LIMIT 1', (error, results, fields) => {
    // sql error
    if (error) throw error;
    const length = results.length;
    if (length > 0) {
      cb(results[0]['no'] + 1);
    }
    else {
      cb(1);
    }
  });
}

module.exports.insertBoard = (no, id, title, date, bodyText, photo) => {
  pool.query('INSERT INTO board VALUES (?, ?, ?, ?, ?, ?)', [no, id, title, date, bodyText, photo]);
};

module.exports.getBoards = (cb) => {
  pool.query('SELECT * FROM board ORDER BY no DESC', (error, results, fields) => {
    // sql error
    if (error) throw error;
    cb(results);
  });
}

module.exports.getLike = (no) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT id FROM board_like WHERE no = ?', [no], (error, results, fields) => {
      // sql error
      if (error) throw error;
      resolve(results);
    });
  });
}

module.exports.clickLike = (no, id) => {
  pool.query('INSERT INTO board_like VALUES (?, ?)', [no, id]);
}

module.exports.unClickLike = (no, id) => {
  pool.query('DELETE FROM board_like WHERE no = ? AND id = ?', [no, id]);
}