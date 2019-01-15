const mysql = require('mysql');

var exports = module.exports = {};

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'test',
  password: 'test',
  database: 'test'
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
    if (user['pw'] == pw) {
      // pw correct
      cb(true, user);
    }
    else {
      // pw incorrect
      cb(false, null);
    }
  });
};

module.exports.signUp = (id, pw) => {
  pool.query('INSERT INTO user VALUES (?, ?)', [id, pw], (error, results, fields) => {
    // sql error
    if (error) throw error;
  });
};

module.exports.idCheck = (id, cb) => {
  pool.query('SELECT id FROM user WHERE id=?', [id], (error, results, fields) => {
    console.log(JSON.stringify(results));
    console.log(id);
    //sql error
    if (error) throw error;
    if (!results[0]) {
      return cb(false);
    }
    const length = Object.keys(results[0]).length;
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