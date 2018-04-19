const Bid = require('../models/bid.server.model');
const Photo = require('../models/photo.server.model');
const Auction = require('../models/auction.server.model');
const Category = require('../models/category.server.model');
const AuctionUser = require('../models/auction_user.server.model');
const db = require('../models/database.server.model');
const fs = require('fs');
const sqlHelper = require('../utils/sql.helper');

exports.list = function (req, res) {
    Auction.getList(req, function (result) {
        res.json(result);
    })
}


exports.create = function (req, res) {
    let auction_data = {
        'auction_userid':req.body.userId,
        'auction_title':req.body.title,
        'auction_categoryid':req.body.categoryId,
        'auction_description':req.body.description,
        'auction_startingdate':req.body.startDateTime,
        'auction_endingdate':req.body.endDateTime,
        'auction_reserveprice':req.body.reservePrice,

    };


    let values = [
        auction_data['auction_userid'],
        auction_data['auction_title'],
        auction_data['auction_categoryid'],
        auction_data['auction_description'],
        auction_data['auction_startingdate'],
        auction_data['auction_endingdate'],
        auction_data['auction_reserveprice']
    ];

    Auction.insert(values, function (result) {
        res.json(result);
    })
}

exports.read = function (req, res) {
    let auctionId = req.params.auctionId;
    console.log("reading... auctionId : " + auctionId);
    Auction.getOne(auctionId, function (result) {
        return res.status(200).json(result);
    });

}

exports.update = function (req, res) {
    let userId = req.params.userId;
    let username = req.body.username.toString();
    console.log("update... userId : " + userId);
    Auction.alter(userId, username, function (result) {
        res.json(result);
    });
}

exports.delete = function (req, res) {
    let userId = req.params.userId;
    console.log("delete... userId : " + userId);
    Auction.remove(userId, function (result) {
        res.json(result);
    });
}

exports.userById = function (req, res) {
    return null;
}

exports.getBidHistory = function (req, res) {
    let userId = req.params.userId;
    console.log("reading... userId : " + userId);
    Auction.getOne(userId, function (result) {
        res.json(result);
    });

}

exports.makeBid = function (req, res) {
    let userId = req.params.userId;
    console.log("reading... userId : " + userId);
    Auction.getOne(userId, function (result) {
        res.json(result);
    });

}

/**
 *
 * Reset should follow the specific table order:
 *
 * bid --> photo --> auction --> category --> auction_user
 *
 */

exports.reset = function (req, res) {
    let sql = fs.readFileSync('./config/reset.sql').toString();

    db.reset(sql.toString(), function (result) {
        if (sqlHelper.isSqlResultValid(result)) {
            return res.sendStatus(200);
        } else {
            handleInvalidResult(res, result);
        }
    })

}

/**
 *
 * Resample should follow the specific table order:
 *
 * auction_user --> category --> auction --> photo --> bid
 *
 */
exports.resample = function (req, res) {
    let sql = fs.readFileSync('./config/resample.sql').toString();

    db.resample(sql.toString(), function (result) {
        if (sqlHelper.isSqlResultValid(result)) {
            return res.sendStatus(201);
        } else {
            handleInvalidResult(res, result);
        }
    })
}

function handleInvalidResult(res, result) {
    if (!sqlHelper.isSqlResultOk(result)) {
        return res.sendStatus(500);
    } else if (sqlHelper.isSqlResultEmpty(result)) {
        return res.sendStatus(400);
    } else {
        return res.sendStatus(400);
    }
}


