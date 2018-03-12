const db = require('../../config/db')

exports.getAll = function (done) {
    db.get_pool().query('SELECT * FROM lab2_users', function (err, rows) {
        if (err) {
            console.log(err.message)
            return done({"ERROR":"Error selecting"})
        } else {
            return done(rows);
        }
    });
    return null;
}

exports.getOne = function (userId, done) {
    db.get_pool().query('SELECT * FROM lab2_users WHERE user_id = ?', userId, function (err, rows) {
        if (err) {
            return done(err);
        } else {
            done(rows);
        }
    });
    return null;
}

exports.insert = function (username, done) {
    let values = [username];

    db.get_pool().query('INSERT INTO lab2_users (username) VALUES ?', values, function (err, result) {
        if (err) {
            return done(err);
        } else {
            return done(result)
        }
    });

    return null;
}

exports.alter = function (userId, username, done) {
    let values = [
        [username],
        [userId]
    ];

    db.get_pool().query('UPDATE lab2_users SET username = ? where user_id = ?', values, function (err, result) {
        if (err) {
            return done(err);
        } else {
            return done(result)
        }
    });
    return null;
}

exports.remove = function (userId, done) {
    let values = [userId];

    db.get_pool().query('DELETE FROM lab2_users where user_id = ?', values, function (err, result) {
        if (err) {
            return done(err);
        } else {
            return done(result)
        }
    });
}