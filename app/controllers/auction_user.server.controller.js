const User = require('../models/auction_user.server.model');
const keyMapping = require('../../config/keymapping')
const sqlCreator = require('../utils/sql.creator');

exports.list = function (req, res) {
    User.getAll(function (result) {
        res.json(result);
    })
}

exports.create = function (req, res) {

    console.log("create auction user ");

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

    User.insert(data, function (result) {
        let ret = handleCreateResult(result);
        res.status(parseInt(ret['code']));
        res.json(ret['data']);
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

    User.alter(userId, fields, values, function (result) {
        let ret = handleUpdateResult(result);
        res.status(ret['code']);
        res.send(ret['data']);
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
    let userId = req.params.userId;
    console.log("reading... userId : " + userId);
    User.getOne(userId, function (result) {
        res.json(result);
    });

}

exports.logout = function (req, res) {
    let userId = req.params.userId;
    console.log("reading... userId : " + userId);
    User.getOne(userId, function (result) {
        res.json(result);
    });

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

    if (!sqlCreator.isSqlResultOk(result) || sqlCreator.isSqlResultEmpty(result)) {
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

function handleUpdateResult(result) {
    let ret = {
        code: 201,
        data: {}
    };

    if (!sqlCreator.isSqlResultOk(result) || sqlCreator.isSqlResultEmpty(result)) {
        ret.code = 401;
        ret.data = 'Unauthorized';
    } else {
        ret.code = 201;
        ret.data = 'ok'
    }

    return ret;

}


