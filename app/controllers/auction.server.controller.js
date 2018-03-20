const Auction = require('../models/auction.server.model');
const response = require('../response/auctions.response');
const sqlHelper = require('../utils/sql.helper');

exports.list = function (req, res) {
    let sql = sqlHelper.getAuctionSearchSqlFromRequest(req);

    new Promise(function (resolve, reject) {

        Auction.getListBySql(sql, function (result) {
            if (sqlHelper.isSqlResultValid(result)) {
                return resolve(result);
            } else {
                handleInvalidResult(res, result);
                reject();
            }

        })

    }).then(function (result) {
        res.status(200);
        res.json(response.createListData(result));

    }).catch(function (err) {

        if (err == undefined || err.code != 404 || err.code != 500) {
            res.status(400);
            res.send(err.message);
        } else {
            res.status(err.code);
            res.send(err.message);
        }
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
        if (sqlHelper.isSqlResultValid(result)) {
            res.status(201);
            res.json({'id': result['insertId']});
        } else {
            handleInvalidResult(result)
        }

    })
}

exports.read = function (req, res) {
    let auctionId = req.params.auctionId;
    console.log("reading... auctionId : " + auctionId);

    let sql = sqlHelper.getOneAuctionSql(auctionId);
    new Promise(function (resolve, reject) {

        Auction.getListBySql(sql, function (result) {
            if (sqlHelper.isSqlResultValid(result)) {
                return resolve(result);
            } else {
                handleInvalidResult(res, result);
                reject();
            }

        })

    }).then(function (firstResult) {
        let auctionId = firstResult[0]['auction_id'];
        let sql = sqlHelper.getSearchBidsFromAuctionIdSql(auctionId);
        Auction.getListBySql(sql, function (secondResult) {
            res.status(200);
            res.json(response.creatOneAuctionData(firstResult, secondResult));
        })


    }).catch(function (err) {

        if (err == undefined || err.code != 404 || err.code != 500) {
            res.status(400);
            res.send(err.message);
        } else {
            res.status(err.code);
            res.send(err.message);
        }
    })
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
    let auctionId = req.params.auctionId;
    let sql = sqlHelper.getSearchBidsFromAuctionIdSql(auctionId);
    new Promise(function (resolve, reject) {

        Auction.getListBySql(sql, function (result) {
            if (sqlHelper.isSqlResultValid(result)) {
                res.status(200);
                res.json(response.createAuctionBidsData(result));
            } else {
                handleInvalidResult(res, result);
                reject();
            }

        })

    }).catch(function (err) {

        if (err == undefined || err.code != 404 || err.code != 500) {
            res.status(400);
            res.send(err.message);
        } else {
            res.status(err.code);
            res.send(err.message);
        }
    })

}

exports.makeBid = function (req, res) {
    let userId = req.params.userId;
    console.log("reading... userId : " + userId);
    Auction.getOne(userId, function (result) {
        res.json(result);
    });
}

function handleInvalidResult(res, result) {
    if (!sqlHelper.isSqlResultOk(result)) {
        res.status(500);
        res.send('Internal server error');
    } else if (sqlHelper.isSqlResultEmpty(result)) {
        res.status(404);
        res.send('Not found');
    } else {
        res.status(400);
        res.send('Bad request');
    }
}


