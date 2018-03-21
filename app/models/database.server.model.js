const db = require('../../config/db');

exports.reset = function (sql, done) {
    db.get_pool().query(sql, function (err, result) {
        if (err) {
            return done(err);
        } else {
            return done(result);
        }
    });
}

exports.resample = function(sql, done) {
    db.get_pool().query(sql, function (err, result) {
        if (err) {
            return done(err);
        } else {
            return done(result)
        }
    });
}