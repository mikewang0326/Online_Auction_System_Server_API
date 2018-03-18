const db = require('../../config/db')
const sqlHelper = require('../utils/sql.helper');

const initSql = "CREATE TABLE photo (\n" +
    "  photo_id int(10) NOT NULL AUTO_INCREMENT,\n" +
    "  photo_auctionid int(10) NOT NULL,\n" +
    "  photo_image_URI varchar(128) NOT NULL,\n" +
    "  photo_displayorder int NULL,\n" +
    "  PRIMARY KEY (photo_id),\n" +
    "  KEY fk_photo_auctionid (photo_auctionid),\n" +
    "  CONSTRAINT fk_photo_auctionid FOREIGN KEY (photo_auctionid) REFERENCES auction (auction_id)\n" +
    ") ENGINE=InnoDB DEFAULT CHARSET=latin1;";

const KEY_MAPPING_LIST = {
    auctionId:'photo_auctionid',
    photoImageUri:'photo_image_URI'
}

exports.keyMapping = function (key, done) {
       return done(KEY_MAPPING_LIST.key);
}

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

exports.insert = function (values, done) {
    db.get_pool().query('INSERT INTO photo (' + values[0] + ') VALUES (?)', values[1], function (err, result) {
        if (err) {
            return done(err);
        } else {
            return done(result)
        }
    });

    return null;
}

exports.alter = function (photoId, fields, fieldsValues, done) {
    let sqlSetString = sqlHelper.getUpdateSetStringByFieldsAndValues(fields, fieldsValues);

    console.log("sqlSetString is :" + sqlSetString);

    let values = [
        [photoId]
    ];

    db.get_pool().query('UPDATE photo SET ' + sqlSetString + ' where photo_id = ?', values, function (err, result) {
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