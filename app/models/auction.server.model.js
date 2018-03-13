const db = require('../../config/db')

exports.getAll = function (done) {
    db.get_pool().query('SELECT * FROM auction', function (err, rows) {
        if (err) {
            console.log(err.message)
            return done({"ERROR":"Error selecting"})
        } else {
            return done(rows);
        }
    });
    return null;
}

exports.getOne = function (auctionId, done) {
    db.get_pool().query('SELECT * FROM auction WHERE auction_id = ?', auctionId, function (err, rows) {
        if (err) {
            return done(err);
        } else {
            done(rows);
        }
    });
    return null;
}

exports.insert = function (params, done) {
    let values = [params];

    db.get_pool().query('INSERT INTO auction (auction_userid, auction_title, auction_categoryid, auction_description, ' +
        'auction_startingdate, auction_endingdate, auction_reserveprice) VALUES (?)', values, function (err, result) {
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

    db.get_pool().query('UPDATE auction SET username = ? where user_id = ?', values, function (err, result) {
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

    db.get_pool().query('DELETE FROM auction where auction_id = ?', values, function (err, result) {
        if (err) {
            return done(err);
        } else {
            return done(result)
        }
    });
}