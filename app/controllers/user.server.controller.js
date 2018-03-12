const User = require('../models/user.server.model');

exports.list = function (req, res) {
    User.getAll(function (result) {
        res.json(result);
    })
}

exports.create = function (req, res) {
    let user_data = {
        'username':req.body.username

    };

    let user = user_data['username'].toString();

    let values = [
        [user]
    ];

    User.insert(values, function (result) {
        res.json(result);
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
    let userId = req.params.userId;
    let username = req.body.username.toString();
    console.log("update... userId : " + userId);
    User.alter(userId, username, function (result) {
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


