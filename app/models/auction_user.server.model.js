const db = require('../../config/db')

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

