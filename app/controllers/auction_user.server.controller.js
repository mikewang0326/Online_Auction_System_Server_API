const User = require('../models/auction_user.server.model');
const keyMapping = require('../../config/keymapping')
const sqlHelper = require('../utils/sql.helper');
const validator = require('validator');
const middleware = require('../../config/middleware')
const promise = require('promise')

exports.list = function (req, res) {
    User.getAll(function (result) {
        res.json(result);
    })
}

exports.create = function (req, res) {

    console.log("create auction user ");

    let fields = new Array();
    let values = new Array();

    let username = req.body.username;
    let givenName = req.body.givenName;
    let familyName = req.body.familyName;
    let email = req.body.email;
    let password = req.body.password;

    /*
     * parameter check
     *
     * 1, username
     *
     * 2, email can not be empty and valid email
     *
     * 4, familyname empty
     *
     * 5, givenname empty
     *
     * 6, password empty
     *
     */

    if (username != undefined && !validator.isEmpty(username.toString())) {
        fields.push(keyMapping.requestKeyToMysqlKey("username"));
        values.push(username.toString());
    } else {
        return res.sendStatus(400);
    }

    if (givenName != undefined && !validator.isEmpty(givenName.toString())) {
        fields.push(keyMapping.requestKeyToMysqlKey("givenName"));
        values.push(givenName.toString());
    } else {
        return res.sendStatus(400);
    }

    if (familyName != undefined && !validator.isEmpty(familyName.toString())) {
        fields.push(keyMapping.requestKeyToMysqlKey("familyName"));
        values.push(familyName.toString());
    }else {
        return res.sendStatus(400);
    }

    if (email != undefined && !validator.isEmpty(email.toString()) && validator.isEmail(email)) {
        fields.push(keyMapping.requestKeyToMysqlKey("email"));
        values.push(email.toString());
    }else {
        return res.sendStatus(400);
    }


    if (password != undefined && !validator.isEmpty(password)) {
        fields.push(keyMapping.requestKeyToMysqlKey("password"));
        values.push(password);
    }else {
        return res.sendStatus(400);
    }


    let data = [
        [fields.toString()],
        [values]
    ];

    User.insert(data, function (result) {

        if (sqlHelper.isSqlResultValid(result)) {
              res.status(201);
              return res.json({'id':result['insertId']})
        } else {
            handleInvalidCreateResult(res, result);
        }
    })
}

exports.read = function (req, res) {
    let userId = req.params.userId;
    console.log("reading... userId : " + userId);

    User.getOne(userId, function (result) {
        let ret = handleReadResult(result)
        res.status(parseInt(ret['code']));
        res.json(ret['data']);
    });

}

exports.update = function (req, res) {
    let userId = parseInt(req.params.userId);

    let fields = new Array();
    let values = new Array();


    let username = req.body.username;
    let givenName = req.body.givenName;
    let familyName = req.body.familyName;
    let email = req.body.email;
    let password = req.body.password;

    /*
     * parameter check
     *
     * 1, username
     *
     * 2, email can not be empty and valid email
     *
     * 4, familyname empty
     *
     * 5, givenname empty
     *
     * 6, password empty
     *
     */

    if (username != undefined && !validator.isEmpty(username.toString())) {
        fields.push(keyMapping.requestKeyToMysqlKey("username"));
        values.push(username.toString());
    }

    if (givenName != undefined && !validator.isEmpty(givenName.toString())) {
        fields.push(keyMapping.requestKeyToMysqlKey("givenName"));
        values.push(givenName.toString());
    }

    if (familyName != undefined && !validator.isEmpty(familyName.toString())) {
        fields.push(keyMapping.requestKeyToMysqlKey("familyName"));
        values.push(familyName.toString());
    }

    if (email != undefined && !validator.isEmpty(email.toString()) && validator.isEmail(email)) {
        fields.push(keyMapping.requestKeyToMysqlKey("email"));
        values.push(email.toString());
    }


    if (password != undefined && !validator.isEmpty(password)) {
        fields.push(keyMapping.requestKeyToMysqlKey("password"));
        values.push(password);
    }

    if (fields.length == 0) {
        return res.sendStatus(400);
    }

    User.alter(userId, fields, values, function (result) {
        if (sqlHelper.isSqlResultValid(result)) {
            return res.sendStatus(201)
        } else {
            handleInvalidUpdateResult(res, result)
        }
    });
}

exports.delete = function (req, res) {
    let userId = req.params.userId;
    console.log("delete... userId : " + userId);
    User.remove(userId, function (result) {
        res.json(result);
    });
}

exports.userById = function (req, res) {
    return null;
}

exports.login = function (req, res) {
    let username = req.query.username;
    let email = req.query.email;
    let password = req.query.password;

    // parameter check
    if ((undefined == username || validator.isEmpty(username.toString())) && (undefined == email || validator.isEmpty(email.toString()) || !validator.isEmail(email.toString()))) {
        return res.sendStatus(400);
    } else if (undefined == password || validator.isEmpty(password)) {
        return res.sendStatus(400);

    }

    let conditions = "";
    if (username != undefined && !validator.isEmpty(username.toString())) {
        conditions = keyMapping.requestKeyToMysqlKey('username').concat(" = \'").concat(username)
            .concat("\' AND ").concat(keyMapping.requestKeyToMysqlKey('password')).concat(" = \'").concat(password)
            .concat("\'");


    } else {
        conditions = keyMapping.requestKeyToMysqlKey('email').concat(" = \'").concat(email)
            .concat("\' AND ").concat(keyMapping.requestKeyToMysqlKey('password')).concat(" = \'").concat(password)
            .concat("\'");
    }

    let promise = new Promise(function(resolve, reject) {

        User.getList(conditions, function (result) {
            if (sqlHelper.isSqlResultOk(result) && !sqlHelper.isSqlResultEmpty(result)) {
                return resolve(result[0]['user_id']);
            } else {
                handleInvalidLoginResult(res, result);
            }

        });

    }).then(function(userId) {
        User.writeLoginAuthToken(userId, function (result, userId, token) {
            if (sqlHelper.isSqlResultOk(result) && !sqlHelper.isSqlResultEmpty(result)) {
                res.status(200);
                return res.json({
                    "id":userId,
                    "token":token
                });
            } else {

            }
        });

    }).catch(function (err) {
        return res.status(500).send("Internal server error");
    })

}

exports.logout = function (req, res) {
    let token = req.header("X-Authorization");

    let promise = new Promise(function(resolve, reject) {

        User.getUserIdByToken(token, function (result) {

            if (sqlHelper.isSqlResultOk(result) && !sqlHelper.isSqlResultEmpty(result)) {
                return resolve(result[0]['user_id']);
            } else {
                return res.sendStatus(401);
            }
        })

    }).then(function(userId) {
        User.clearLoginAuthToken(userId, function (result) {
             if (!sqlHelper.isSqlResultEmpty(result)) {
                 return res.status(200).send("OK")
             } else {
                 return res.sendStatus(500);
             }

        });

    }).catch(function (err) {
           return res.sendStatus(500);
    })

}

/**
 *
 * Handle the mysql return result
 *
 * 1, success, not empty   201
 *
 * 2, success empty        400
 *
 *
 * success sql return infomation:
 *
 * {
 *  "fieldCount": 0,
 *   "affectedRows": 1,
 *   "insertId": 32,
 *   "serverStatus": 2,
 *   "warningCount": 0,
 *   "message": "",
 *   "protocol41": true,
 *   "changedRows": 0
 * }
 *
 *
 *  return value:
 *  1, code
 *  2, data
 *
 */
function handleCreateResult(result) {
    let ret = {
        code:201,
        data:{'id':0}
    };

    let errno = result['errno'];

    if (errno != "" && errno != undefined) {
        ret.code = 401
        ret.data = 'Malformed request'.toString();
    } else {
        ret.code = 201
        let insertId = result['insertId'];
        ret.data = {'id': insertId};
    }

    return ret;

}


function handleReadResult(result) {
    let ret = {
        code:200,
        data:{'id':0}
    };

    if (!sqlHelper.isSqlResultOk(result) || sqlHelper.isSqlResultEmpty(result)) {
        ret.code = 404;
        ret.data = 'Not Found'.toString();
    } else {
        ret.code = 200;
        ret.data = {
            'username': result[0][keyMapping.requestKeyToMysqlKey("username")],
            'givenName': result[0][keyMapping.requestKeyToMysqlKey("givenName")],
            'familyName': result[0][keyMapping.requestKeyToMysqlKey("familyName")],
            'email': result[0][keyMapping.requestKeyToMysqlKey("email")],
            'accountBalance': result[0][keyMapping.requestKeyToMysqlKey("accountBalance")],
        };
    }

    return ret;

}

/**
 *
 [
 {
     "user_id": 2,
     "user_username": "superman",
     "user_givenname": "Clark",
     "user_familyname": "Kent",
     "user_email": "superman@super.heroes",
     "user_password": "kryptonite",
     "user_salt": null,
     "user_token": "test",
     "user_accountbalance": 0,
     "user_reputation": 900
 }
 ]
 */
function handleInvalidUpdateResult(res, result) {
    if (sqlHelper.isSqlResultEmpty(result)) {
        return res.sendStatus(401)
    } else {
        return res.sendStatus(500);
    }

}

/**
 *
 * Login
 *
 * 1, get user_id by username + password or email + password
 *
 *
[
    {
        "user_id": 2,
        "user_username": "superman",
        "user_givenname": "Clark",
        "user_familyname": "Kent",
        "user_email": "superman@super.heroes",
        "user_password": "kryptonite",
        "user_salt": null,
        "user_token": null,
        "user_accountbalance": 0,
        "user_reputation": 900
    }
]
 */
function handleLoginResult(result) {
    let ret = {
        code: 200,
        data: {
            "id":0,
            "token":"token"
        }
    };

    if (!sqlHelper.isSqlResultOk(result) || sqlHelper.isSqlResultEmpty(result)) {
        ret.code = 400;
        ret.data = 'Invalid username/email/password supplied';
    } else {
        ret = authLogin(result[0]['user_id'])
    }

    return ret;
}

function authLogin(userId) {
    User.writeLoginAuthToken(userId, function (result) {
        let ret = handleInvalidUpdateResult(result);

        if (ret['code'] == 201) {
            ret.code = 200;
            ret.data = {
                "id": ret[0]['user_id'],
                "token":ret[0]['user_token']
            }
        } else {
            ret.code = 400;
            ret.data = 'Invalid username/email/password supplied';
        }

        return ret;
    });
}


function handleInvalidResult(res, result) {
    if (!sqlHelper.isSqlResultOk(result)) {
        return res.status(500).send('Internal server error');
    } else if (sqlHelper.isSqlResultEmpty(result)) {
        return res.sendStatus(500);
    } else {
        return res.sendStatus(500);
    }
}

function handleInvalidCreateResult(res, result) {
    if (!sqlHelper.isSqlResultOk(result)) {
        return res.status(400).send('Invalid username/email/password supplied');
    } else if (sqlHelper.isSqlResultEmpty(result)) {
        return res.sendStatus(500);
    } else {
        return res.sendStatus(500);
    }
}

function handleInvalidLoginResult(res, result) {
    if (sqlHelper.isSqlResultEmpty(result)) {
        return res.status(400).send('Invalid username/email/password supplied');
    }  else {
        return res.sendStatus(500);
    }
}




