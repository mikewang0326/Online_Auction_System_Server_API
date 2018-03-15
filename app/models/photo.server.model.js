const db = require('../../config/db')

const initSql = "CREATE TABLE photo (\n" +
    "  photo_id int(10) NOT NULL AUTO_INCREMENT,\n" +
    "  photo_auctionid int(10) NOT NULL,\n" +
    "  photo_image_URI varchar(128) NOT NULL,\n" +
    "  photo_displayorder int NULL,\n" +
    "  PRIMARY KEY (photo_id),\n" +
    "  KEY fk_photo_auctionid (photo_auctionid),\n" +
    "  CONSTRAINT fk_photo_auctionid FOREIGN KEY (photo_auctionid) REFERENCES auction (auction_id)\n" +
    ") ENGINE=InnoDB DEFAULT CHARSET=latin1;";


const loadSampleSql = "";
exports.drop = function (done) {
    db.get_pool().query('DROP TABLE IF EXISTS photo', function (err, result) {
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
            return done(result);
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