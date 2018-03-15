const db = require('../../config/db')

const initSql = "CREATE TABLE auction_user (\n" +
    "  user_id int(10) NOT NULL AUTO_INCREMENT,\n" +
    "  user_username varchar(50) NOT NULL,\n" +
    "  user_givenname varchar(50) NOT NULL,\n" +
    "  user_familyname varchar(50) NOT NULL,\n" +
    "  user_email varchar(320) NOT NULL,\n" +
    "  user_password varchar(512) NOT NULL,\n" +
    "  user_salt varchar(128) DEFAULT NULL,\n" +
    "  user_token varchar(32) DEFAULT NULL,\n" +
    "  user_accountbalance decimal(10,2) NOT NULL DEFAULT '0',\n" +
    "  user_reputation int(10) NOT NULL DEFAULT '0',\n" +
    "  PRIMARY KEY (user_id),\n" +
    "  UNIQUE KEY user_id (user_id),\n" +
    "  UNIQUE KEY user_email (user_email),\n" +
    "  UNIQUE KEY user_token (user_token),\n" +
    "  UNIQUE KEY user_username (user_username)\n" +
    ") ENGINE=InnoDB DEFAULT CHARSET=latin1;"

exports.drop = function (done) {
    db.get_pool().query('DROP TABLE IF EXISTS auction_user', function (err, result) {
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