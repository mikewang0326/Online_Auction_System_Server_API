const User = require('../models/auction_user.server.model');
const keyMapping = require('../../config/keymapping')

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
        let ret = handleResult(result);
        res.status(parseInt(ret['code']));
        res.json(ret['data']);
    })
}

exports.read = function (req, res) {
    let userId = req.params.userId;
    console.log("reading... userId : " + userId);
    User.getOne(userId, function (result) {
        res.json(result);
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
        res.json(result);
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
function handleResult(result) {
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


