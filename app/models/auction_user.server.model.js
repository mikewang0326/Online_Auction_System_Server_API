const db = require('../../config/db')
const sqlHelper = require('../utils/sql.helper');
const cryptoHelper = require('../utils/crypto.helper');

const createTableSql = "CREATE TABLE auction_user (\n" +
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

const loadSampleSql = "INSERT INTO auction_user (user_username, user_givenname, user_familyname, user_email, user_password, user_accountbalance, user_reputation)\n" +
    "VALUES\n" +
    "('black.panther', 'T', 'Challa', 'black.panther@super.heroes', 'Wakanda', '0.00' , '500'),\n" +
    "('superman', 'Clark', 'Kent', 'superman@super.heroes', 'kryptonite', '0.00', '900'),\n" +
    "('batman', 'Bruce', 'Wayne', 'dark.knight@super.heroes', 'frankmiller', '0.00', '850'),\n" +
    "('spiderman', 'Peter', 'Parker', 'spiderman@super.heroes', 'arachnid', '0.00', '500'),\n" +
    "('ironman', 'Tony', 'Stark', 'ironman@super.heroes', 'robertdowney', '0.00', '700'),\n" +
    "('captain.america', 'Steve', 'Rogers', 'captain.america@super.heroes', 'donaldtrump', '0.00', '300'),\n" +
    "('dr.manhatten', 'Jonathan', 'Osterman', 'dr.manhatten@super.heroes', 'hydrogen', '0.00', '1000'),\n" +
    "('vampire.slayer', 'Buffy', 'Summers', 'vampire.slayer@super.heroes', 'sarahgellar', '0.00' , '600'),\n" +
    "('Ozymandias', 'Adrian', 'Veidt', 'Ozymandias@super.villains', 'shelley', '0.00' , '200'),\n" +
    "('Rorschach', 'Walter', 'Kovacs', 'Rorschach@super.villains', 'Joseph', '0.00' , '200'),\n" +
    "('power.woman', 'Jessica', 'Jones', 'power.woman@super.heroes', 'lukecage', '0.00' , '200')\n" +
    ";";

exports.insert = function (values, done) {
    db.get_pool().query('INSERT INTO auction_user (' + values[0] + ') VALUES (?)', values[1], function (err, result) {
        if (err) {
            return done(err);
        } else {
            return done(result)
        }
    });

    return null;
}

exports.getOne = function (userId, done) {
    db.get_pool().query('SELECT * FROM auction_user WHERE user_id = ?', userId, function (err, rows) {
        if (err) {
            return done(err);
        } else {
            done(rows);
        }
    });
    return null;
}

exports.getList = function (conditions, done) {
    db.get_pool().query('SELECT * FROM auction_user WHERE ' + conditions, function (err, rows) {
        if (err) {
            return done(err);
        } else {
            done(rows);
        }
    });
    return null;
}

exports.alter = function (userId, fields, fieldsValues, done) {
    let sqlSetString = sqlHelper.getUpdateSetStringByFieldsAndValues(fields, fieldsValues);

    let values = [
        [userId]
    ];

    db.get_pool().query('UPDATE auction_user SET ' + sqlSetString + ' where user_id = ?', values, function (err, result) {
        if (err) {
            return done(err);
        } else {
            return done(result)
        }
    });
    return null;
}

exports.writeLoginAuthToken = function (userId, done) {
    let token = cryptoHelper.createUserToken(userId).toString();

    let values = [
        [userId]
    ];

    let sql = "UPDATE auction_user SET user_token = \'" + token + "\' where user_id = " + parseInt(userId);

    db.get_pool().query(sql, values, function (err, result) {
        if (err) {
            return done(err);
        } else {
            return done(result, userId, token)
        }
    });
    return null;
}

exports.clearLoginAuthToken = function (userId, done) {

    let values = [
        [userId]
    ];

    db.get_pool().query('UPDATE auction_user SET ' + "user_token = \'\'" + ' where user_id = ?', values, function (err, result) {
        if (err) {
            return done(err);
        } else {
            return done(result)
        }
    });
    return null;
}

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
    db.get_pool().query(createTableSql, function (err, result) {
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

exports.getUserIdByToken = function (token, done) {
    let values = [
        [token]
    ];
    db.get_pool().query("SELECT user_id FROM auction_user where user_token = ?", values, function (err, result) {
        if (err) {
            return done(err);
        } else {
            return done(result);
        }
    });
}

