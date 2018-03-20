const db = require('../../config/db');
const sqlHelper = require('../utils/sql.helper');

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

const loadSampleSql = "INSERT INTO auction (\n" +
    "auction_title,\n" +
    "auction_categoryid,\n" +
    "auction_description,\n" +
    "auction_reserveprice,\n" +
    "auction_startingprice,\n" +
    "auction_creationdate,\n" +
    "auction_startingdate,\n" +
    "auction_endingdate,\n" +
    "auction_userid)\n" +
    "VALUES\n" +
    "('Super cape', '1', 'One slightly used cape', '10.00', '0.01', '2018-02-14 00:00:00', '2018-02-15 00:00:00', '2018-03-14 00:00:00', '2'),\n" +
    "('Broken pyramid', '4', 'One very broken pyramid. No longer wanted. Buyer collect', '1000000.00', '1.00', '2018-02-14 00:00:00', '2018-02-15 00:00:00', '2018-02-28 00:00:00', '9'),\n" +
    "('One boot', '1', 'One boot. Lost the other in a battle with the Joker', '10.00', '0.50', '2018-02-14 00:00:00', '2018-02-15 00:00:00', '2018-03-14 00:00:00', '3'),\n" +
    "('Intrinsic Field Subtractor', '5', 'Hard to write about, but basically it changed me. A lot. ', '100.00', '1.00', '2018-02-14 00:00:00', '2018-02-15 00:00:00', '2018-06-30 00:00:00', '7'),\n" +
    "('A cache of vibranium', '5', 'A cache of vibranium stolen from Wakanda. ', '500000.00', '10000.00', '2018-02-14 00:00:00', '2018-02-15 00:00:00', '2018-06-30 00:00:00', '10')\n" +
    ";\n";

exports.getList = function (conditions, done) {
    db.get_pool().query('SELECT * FROM auction_WHERE ' + conditions, function (err, rows) {
        if (err) {
            return done(err);
        } else {
            done(rows);
        }
    });
    return null;
}

exports.getListBySql = function (sql, done) {
    db.get_pool().query(sql, function (err, rows) {
        if (err) {
            return done(err);
        } else {
            done(rows);
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

exports.alter = function (auctionId, userId, fields, fieldsValues, done) {
    let sqlSetString = sqlHelper.getUpdateSetStringByFieldsAndValues(fields, fieldsValues);

    console.log("sqlSetString is :" + sqlSetString);

    let values = [
        [auctionId],
        [userId]
    ];

    db.get_pool().query('UPDATE auction SET ' + sqlSetString + ' where auction_id = ? AND auction_userid = ?', values, function (err, result) {
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
            return loadSampleData(done);
        }
    });
}

function loadSampleData(done) {
    db.get_pool().query(loadSampleSql, function (err, result) {
        if (err) {
            return done(err);
        } else {
            return done(result)
        }
    });
}