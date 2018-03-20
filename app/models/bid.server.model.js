const db = require('../../config/db')

const initSql = "CREATE TABLE bid (\n" +
    "  bid_id int(10) NOT NULL AUTO_INCREMENT,\n" +
    "  bid_userid int(10) NOT NULL,\n" +
    "  bid_auctionid int(10) NOT NULL,\n" +
    "  bid_amount decimal(10,2) NOT NULL,\n" +
    "  bid_datetime datetime NOT NULL,\n" +
    "  PRIMARY KEY (bid_id),\n" +
    "  KEY fk_bid_userid (bid_userid),\n" +
    "  KEY fk_auctionid (bid_auctionid),\n" +
    "  CONSTRAINT fk_auctionid FOREIGN KEY (bid_auctionid) REFERENCES auction (auction_id),\n" +
    "  CONSTRAINT fk_bid_userid FOREIGN KEY (bid_userid) REFERENCES auction_user (user_id)\n" +
    ") ENGINE=InnoDB DEFAULT CHARSET=latin1;";

const loadSampleSql = "INSERT INTO bid (\n" +
    "  bid_userid,\n" +
    "  bid_auctionid,\n" +
    "  bid_amount,\n" +
    "  bid_datetime)\n" +
    "values\n" +
    "('1', '1', '10.00', '2018-02-20 00:01:00'),\n" +
    "('9', '3', '100.00', '2018-02-20 00:10:00'),\n" +
    "('7', '3', '150.00', '2018-02-20 00:20:00'),\n" +
    "('9', '3', '200.00', '2018-02-20 00:30:00'),\n" +
    "('9', '3', '250.00', '2018-02-20 00:40:00'),\n" +
    "('7', '3', '350.00', '2018-02-20 00:50:00'),\n" +
    "('9', '3', '400.00', '2018-02-20 01:00:00'),\n" +
    "('7', '4', '1000.00', '2018-02-20 01:00:00')\n" +
    ";";

exports.drop = function (done) {
    db.get_pool().query('DROP TABLE IF EXISTS bid', function (err, result) {
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
            return loadSampleData(done)
        }
    });
}

exports.getOne = function (userId, done) {
    db.get_pool().query('SELECT * FROM bid WHERE bid_id = ?', userId, function (err, rows) {
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

    db.get_pool().query('INSERT INTO bid (bid_auctionid, bid_userid, bid_amount, bid_datetime) VALUES (?)', values, function (err, result) {
        if (err) {
            return done(err);
        } else {
            return done(result)
        }
    });

    return null;
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