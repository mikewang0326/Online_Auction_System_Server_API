const db = require('../../config/db')

const initSql = "CREATE TABLE category (\n" +
    "  category_id int(10) NOT NULL AUTO_INCREMENT,\n" +
    "  category_title varchar(50) NOT NULL,\n" +
    "  category_description varchar(256) DEFAULT NULL,\n" +
    "  PRIMARY KEY (category_id),\n" +
    "  UNIQUE KEY category_id (category_id)\n" +
    ") ENGINE=InnoDB DEFAULT CHARSET=latin1;";

const loadSampleSql = "INSERT INTO category (category_title, category_description)\n" +
    "VALUES\n" +
    "('apparel', 'Clothing, for example capes, masks, belts, boots, gloves etc'),\n" +
    "('equipment', 'Rings of power, hammers from the gods, grappling hooks, lassos of truth, and such like'),\n" +
    "('vehicles', 'Various forms of transportation, such as surf boards, tanks, jetpacks, etc'),\n" +
    "('property', 'For examples: planets, orbiting space stations, ice palaces at the North Pole.'),\n" +
    "('other', 'Other oddities.')\n" +
    ";";

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
            return loadSampleData(done)
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