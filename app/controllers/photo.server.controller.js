const photo = require('../models/photo.server.model');
const keyMapping = require('../../config/keymapping')
const sqlHelper = require('../utils/sql.helper');
const fileHelper = require('../utils/file.helper');
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
    /*
     *  save photo to local dir steps:
     *
     *  1, create dir, insert photo in db, get photo_id
     *  2, create filename by auction_id and photo_id
     *  3, save file to specific dir
     *
     *  error:
     *        1, db error
     *        2, save error: clean db
     *
     */


    let fields = new Array();
    let values = new Array();


    fields.push('photo_auctionid');
    values.push(auctionId);

    let data = [
        [fields.toString()],
        [values]
    ];

    new Promise(function(resolve, reject) {

        photo.insert(data, function (result) {
            if (sqlHelper.isSqlResultValid(result)) {
                return resolve(result['insertId']);
            } else {
                handleInvalidResult(res, result);
                reject();
            }
        });

    }).then(function(photoId) {

        return new Promise(function(resolve, reject) {
            fileHelper.savePhoto(req, auctionId, photoId, function (result, auctionId, photoId) {
                if (result) {
                    resolve([auctionId, photoId]);
                } else {
                    handleInvalidResult(res, null);
                    reject();
                }
            });
        });

    }).then(function (ids) {

        let auctionId = ids[0];
        let photoId = ids[1];

        let fields = new Array();
        let values = new Array();

        fields.push('photo_image_URI'.toString());
        values.push(fileHelper.getPhotoDownloadFile(auctionId, photoId).toString());


        photo.alter(photoId, fields, values, function (result) {
            if (sqlHelper.isSqlResultValid(result)) {
                res.status(201);
                res.send('ok');
            } else {
                handleInvalidResult(result)
            }
        });

    }).catch(function (err) {
        // 201 ok
        // 400 bad request
        // 404 not found
        // 405 inner error
        if (err.code != 404 || err.code != 500) {
            res.status(400);
            res.send(err.message);
        } else {
            res.status(err.code);
            res.send(err.message);
        }
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
    if (sqlHelper.isSqlResultOk(result)) {
        let error = new Error('Internal server error');
        error.code = 500;
        throw error;
    }

    if (sqlHelper.isSqlResultEmpty(result)) {
        let error =  new Error('Not found');
        error.code = 404;
        throw error;
    }

    let ret = {
        code: 201,
        data: {}
    };

    if (sqlHelper.isSqlResultOk(result) || !sqlHelper.isSqlResultEmpty(result)) {
        ret.code = 201;
        ret.data = 'ok';
    } else if (!sqlHelper.isSqlResultOk(result)) {
        ret.code = 500;
        ret.data = 'Internal server error';
    } else if (sqlHelper.isSqlResultEmpty(result)) {
        ret.code = 404;
        ret.data = 'Not found';
    } else {
        ret.code = 400;
        ret.data = 'Bad request';
    }

    return ret;
}



function handleInvalidResult(res, result) {

    if (sqlHelper.isSqlResultOk(result)) {
        res.status(500);
        res.send('Internal server error');
    } else if (sqlHelper.isSqlResultEmpty(result)) {
        res.status(404);
        res.send('Not found');
    } else {
        res.status(404);
        res.send('Not found');
    }

}


