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
            return done(result)
        }
    });
}