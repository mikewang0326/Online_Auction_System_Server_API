const photo = require('../models/photo.server.model');
const keyMapping = require('../../config/keymapping')
const sqlHelper = require('../utils/sql.helper');
const validator = require('validator');
const middleware = require('../../config/middleware');
const promise = require('promise');
const fs = require('fs');

exports.list = function (req, res) {
    photo.getAll(function (result) {
        res.json(result);
    })
}

exports.create = function (req, res) {
    console.log("create photo ");

    let auctionId = parseInt(req.params.auctionId);

    let dir1 = './download/';
    let dir2 = './download/' + auctionId +  '/';

    if (fs.existsSync(dir1)) {
        console.log("exist dir :" + dir1)
    } else {
        console.log("do not exist dir :" + dir1)
        fs.mkdirSync(dir1);
        fs.mkdirSync(dir2);

        console.log('dir has created');
    }

    let fileDir = dir2 + auctionId;
    req.pipe(fs.createWriteStream(fileDir));

    let fields = new Array();
    let values = new Array();


    let username = req.body.username.toString();
    let givenName = req.body.givenName.toString();
    let familyName = req.body.familyName.toString();
    let email = req.body.email.toString();
    let password = req.body.password.toString();

    if (username != "" && username != undefined) {
        fields.push(keyMapping.requestKeyToMysqlKey("username"));
        values.push(username.toString());
    } else {
        res.json({"error":"parameter empry"})
        return;
    }

    if (givenName != "" && givenName != undefined) {
        fields.push(keyMapping.requestKeyToMysqlKey("givenName"));
        values.push(username);
    } else {
        res.json({"error":"parameter empry"})
        return;
    }

    if (familyName != "" && familyName != undefined) {
        fields.push(keyMapping.requestKeyToMysqlKey("familyName"));
        values.push(familyName);
    } else {
        res.json({"error":"parameter empry"})
        return;
    }

    if (email != "" && email != undefined) {
        fields.push(keyMapping.requestKeyToMysqlKey("email"));
        values.push(email);
    } else {
        res.json({"error":"parameter empry"})
        return;
    }


    if (password != "" && password != undefined) {
        fields.push(keyMapping.requestKeyToMysqlKey("password"));
        values.push(password);
    } else {
        res.json({"error":"parameter empry"})
        return;
    }

    let data = [
        [fields.toString()],
        [values]
    ];

    photo.insert(data, function (result) {
        let ret = handleCreateResult(result);
        res.status(parseInt(ret['code']));
        res.json(ret['data']);
    })
}

exports.read = function (req, res) {
    let userId = req.params.userId;
    console.log("reading... userId : " + userId);
    photo.getOne(userId, function (result) {
        let ret = handleReadResult(result)
        res.status(parseInt(ret['code']));
        res.json(ret['data']);
    });

}

exports.update = function (req, res) {
    let userId = parseInt(req.params.userId);

    let fields = new Array();
    let values = new Array();


    let username = req.body.username.toString();
    let givenName = req.body.givenName.toString();
    let familyName = req.body.familyName.toString();
    let email = req.body.email.toString();
    let password = req.body.password.toString();

    if (username != "" && username != undefined) {
        fields.push(keyMapping.requestKeyToMysqlKey("username"));
        values.push(username);
    } else {
        res.json({"error":"parameter empry"})
        return;
    }

    if (givenName != "" && givenName != undefined) {
        fields.push(keyMapping.requestKeyToMysqlKey("givenName"));
        values.push(username);
    } else {
        res.json({"error":"parameter empry"})
        return;
    }

    if (familyName != "" && familyName != undefined) {
        fields.push(keyMapping.requestKeyToMysqlKey("familyName"));
        values.push(familyName);
    } else {
        res.json({"error":"parameter empry"})
        return;
    }

    if (email != "" && email != undefined) {
        fields.push(keyMapping.requestKeyToMysqlKey("email"));
        values.push(email);
    } else {
        res.json({"error":"parameter empry"})
        return;
    }


    if (password != "" && password != undefined) {
        fields.push(keyMapping.requestKeyToMysqlKey("password"));
        values.push(password);
    } else {
        res.json({"error":"parameter empry"})
        return;
    }

    photo.alter(userId, fields, values, function (result) {
        let ret = handleUpdateResult(result);
        res.status(ret['code']);
        res.send(ret['data']);
    });
}

exports.delete = function (req, res) {
    let userId = req.params.userId;
    console.log("delete... userId : " + userId);
    photo.remove(userId, function (result) {
        res.json(result);
    });
}

exports.userById = function (req, res) {
    return null;
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
function handleUpdateResult(result) {
    let ret = {
        code: 201,
        data: {}
    };

    if (!sqlHelper.isSqlResultOk(result) || sqlHelper.isSqlResultEmpty(result)) {
        ret.code = 401;
        ret.data = 'Unauthorized';
    } else {
        ret.code = 201;
        ret.data = 'ok'
    }

    return ret;
}



