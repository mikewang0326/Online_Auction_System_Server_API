const db = require('../../config/db')

const initSql = "CREATE TABLE category (\n" +
    "  category_id int(10) NOT NULL AUTO_INCREMENT,\n" +
    "  category_title varchar(50) NOT NULL,\n" +
    "  category_description varchar(256) DEFAULT NULL,\n" +
    "  PRIMARY KEY (category_id),\n" +
    "  UNIQUE KEY category_id (category_id)\n" +
    ") ENGINE=InnoDB DEFAULT CHARSET=latin1;";

exports.drop = function (done) {
    db.get_pool().query('DROP TABLE IF EXISTS category', function (err, result) {
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