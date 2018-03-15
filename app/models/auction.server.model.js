const db = require('../../config/db')

const initSql = "CREATE TABLE auction (\n" +
    "  auction_id int(10) NOT NULL AUTO_INCREMENT,\n" +
    "  auction_title varchar(128) NOT NULL,\n" +
    "  auction_categoryid int(10) NOT NULL,\n" +
    "  auction_description varchar(512) DEFAULT NULL,\n" +
    "  auction_reserveprice decimal(10,2) DEFAULT NULL,\n" +
    "  auction_startingprice decimal(10,2) NOT NULL,\n" +
    "  auction_creationdate datetime NOT NULL,\n" +
    "  auction_startingdate datetime NOT NULL,\n" +
    "  auction_endingdate datetime NOT NULL,\n" +
    "  auction_userid int(10) NOT NULL,\n" +
    "  auction_primaryphoto_URI varchar(128) DEFAULT NULL,\n" +
    "  auction_deactivated tinyint(1) DEFAULT NULL,\n" +
    "  PRIMARY KEY (auction_id),\n" +
    "  KEY fk_auction_category_id (auction_categoryid),\n" +
    "  KEY fk_auction_userid (auction_userid),\n" +
    "  CONSTRAINT fk_auction_userid FOREIGN KEY (auction_userid) REFERENCES auction_user (user_id),\n" +
    "  CONSTRAINT fk_auction_category_id FOREIGN KEY (auction_categoryid) REFERENCES category (category_id)\n" +
    ") ENGINE=InnoDB DEFAULT CHARSET=latin1;";

exports.getList = function (req, done) {

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

exports.drop = function (done) {
    db.get_pool().query('DROP TABLE IF EXISTS auction', function (err, result) {
        if (err) {
            return done(err);
        } else {
            return done(result)
        }
    });
}

exports.init = function (done) {
    db.get_pool().query(initSql, function (err, result) {
        if (err) {
            return done(err);
        } else {
            return done(result)
        }
    });
}