const Auction = require('../models/auction.server.model');
const bid = require('../models/bid.server.model');
const auctionUser = require('../models/auction_user.server.model')
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
    let auctionId = req.params.auctionId;
    let amount = req.query.amount;

    let token = req.header("X-Authorization");

    let promise = new Promise(function(resolve, reject) {

        auctionUser.getUserIdByToken(token, function (result) {

            if (sqlHelper.isSqlResultOk(result) && !sqlHelper.isSqlResultEmpty(result)) {
                let userId = result[0]['user_id'];
                let sql = sqlHelper.getAuctionInfoForOneBid(auctionId);
                Auction.getListBySql(sql, function (result) {
                    if (sqlHelper.isSqlResultValid(result)) {
                        if (isBidderNotSeller(userId, result) && isAmountNotAboveMax(amount,result) && isAuctionContinueded(result)) {
                            resolve(userId)
                        } else {
                            handleInvalidResult(res, null);
                            reject();
                        }
                    }

                })

            } else {
                handleInvalidResult(res, null);
                return reject();
            }
        })

    }).then(function(userId) {
        let bidData = {
            'bid_auctionid':parseInt(auctionId),
            'bid_userid': userId,
            'bid_amount':parseFloat(req.query.amount),
            'bid_datetime':new Date().toISOString(),
        };

        let values = [
            bidData['bid_auctionid'],
            bidData['bid_userid'],
            bidData['bid_amount'],
            bidData['bid_datetime']
        ];

        bid.insert(values, function (result) {
            if (sqlHelper.isSqlResultValid(result)) {
                res.status(201);
                res.json({'id': result['insertId']});
            } else {
                handleInvalidResult(result)
            }

        })


    }).catch(function (err) {
        res.status(400);
        res.send('Bad request');
    })
}


function isAuctionContinueded(result) {
    let ret = false;
    try {
        let endDateTime = new Date(result[0]['auction_endingdate']).getTime();
        let currentDateTime = new Date().getTime();

        if (endDateTime > currentDateTime) {
            ret = true;
        }
    } catch (error) {
        ret = false;
    }

    return ret;
}

function isAmountNotAboveMax(amount, result) {
    let ret = false;
    try {
        let currentMaxAmount = result[0]['Max(b.bid_amount)'];
        if (amount > currentMaxAmount) {
            ret = true;
        }
    } catch (error) {
        ret = false;
    }
    return ret;
}

function isBidderNotSeller(userId, result) {
    let ret = false;
    try {
        let seller = result[0]['auction_userid'];
       if (userId != seller) {
           ret = true;
       }
    } catch (error) {
        ret = false;
    }

    return ret;
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


