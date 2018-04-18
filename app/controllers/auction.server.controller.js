const Auction = require('../models/auction.server.model');
const bid = require('../models/bid.server.model');
const auctionUser = require('../models/auction_user.server.model')
const response = require('../response/auctions.response');
const sqlHelper = require('../utils/sql.helper');
const timeHelper = require('../utils/time.helper');
const nodeDate = require('node-datetime');
const validator = require('validator');

exports.list = function (req, res) {
    let seller = req.query.seller;
    let bidder = req.query.bidder;
    // let winner = req.query.winner;

    let startIndex = req.query.startIndex;
    let limit = req.query.count;

    if (undefined != seller &&  !validator.isNumeric(seller)) {
        return res.sendStatus(400);
    }

    if (undefined != bidder &&  !validator.isNumeric(bidder)) {
        return res.sendStatus(400);
    }

    if (undefined != startIndex &&  !validator.isNumeric(startIndex)) {
        return res.sendStatus(400);
    }

    if (undefined != limit &&  !validator.isNumeric(limit)) {
        return res.sendStatus(400);
    }


    let sql = sqlHelper.getAuctionSearchSqlFromRequest(req);

    new Promise(function (resolve, reject) {

        Auction.getListBySql(sql, function (result) {
            if (sqlHelper.isSqlResultValid(result)) {
                return resolve(result);
            } else if (sqlHelper.isSqlResultEmpty(result)){
                res.status(200);
                res.json([]);
            } else {
                return  res.status(500).send();
            }

        })

    }).then(function (result) {
        res.status(200);
        res.json(response.createListData(result));
    }).catch(function (err) {
        return res.status(500).send();
    })
}


exports.create = function (req, res) {

    let token = req.header("X-Authorization");

    let promise = new Promise(function(resolve, reject) {

        auctionUser.getUserIdByToken(token, function (result) {

            if (sqlHelper.isSqlResultOk(result) && !sqlHelper.isSqlResultEmpty(result)) {
                let userId = result[0]['user_id'];
                resolve(userId);
            } else {
                handleInvalidResult(res, null);
                return reject();
            }
        })

    }).then(function(userId) {
        let formattedCreationDate = timeHelper.convertMillsecondsToFormattedTime(new Date().getTime());

        let startDateTime = parseInt(req.body.startDateTime);
        let formattedStartDateTime = timeHelper.convertMillsecondsToFormattedTime(startDateTime);

        let endDateTime = parseInt(req.body.endDateTime);
        let formattedEndingDate = timeHelper.convertMillsecondsToFormattedTime(endDateTime);

        // let auction_userid = req.body.userId;
        // let auction_title = req.body.title;
        // let auction_categoryid = req.body.categoryId;
        // let auction_description = req.body.description;
        // let auction_reserveprice = req.body.reservePrice;
        //
        // if (undefined  == auction_userid || validator.isEmpty(auction_userid.toString())) {
        //     return res.sendStatus(401);
        // }
        //
        // if (undefined  == auction_title || validator.isEmpty(auction_title.toString())) {
        //     return res.sendStatus(401);
        // }
        //
        // if (undefined  == auction_categoryid || !validator.isNumeric(auction_categoryid)) {
        //     return res.sendStatus(401);
        // }
        //
        // if (undefined  == auction_description || validator.isEmpty(auction_description.toString())) {
        //     return res.sendStatus(401);
        // }
        //
        // if (undefined == auction_reserveprice || !validator.isNumeric(parseFloat(auction_reserveprice))) {
        //     return res.sendStatus(401);
        // }

        let auction_data = {
            'auction_userid':userId,
            'auction_title':req.body.title,
            'auction_categoryid':req.body.categoryId,

            'auction_description':req.body.description,
            'auction_creationdate':formattedCreationDate,
            'auction_startingdate':formattedStartDateTime,

            'auction_endingdate':formattedEndingDate,
            'auction_reserveprice':req.body.reservePrice,
        };

        let values = [
            auction_data['auction_userid'],
            auction_data['auction_title'],
            auction_data['auction_categoryid'],

            auction_data['auction_description'],
            auction_data['auction_creationdate'],
            auction_data['auction_startingdate'],

            auction_data['auction_endingdate'],
            auction_data['auction_reserveprice']
        ];

        Auction.insert(values, function (result) {
            if (sqlHelper.isSqlResultValid(result)) {
                res.status(201);
                return res.json({'id': result['insertId']});
            } else {
                return res.sendStatus(500);
            }

        })

    }).catch(function (err) {
        res.status(400);
        res.send('Bad request');
    })

}

exports.read = function (req, res) {
    let auctionId = req.params.auctionId;
    console.log("reading... auctionId : " + auctionId);

    // if (undefined != auctionId && !validator.isNumeric(auctionId)) {
    //     return res.sendStatus(400);
    // }

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
        handleInvalidResult(res, null);
    })
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
                return res;
            } else if (sqlHelper.isSqlResultEmpty(result)) {
                res.status(200);
                res.json([]);
                return res;
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

exports.update = function (req, res) {
    let auctionId = req.params.auctionId;
    let token = req.header("X-Authorization");

    let promise = new Promise(function(resolve, reject) {

        auctionUser.getUserIdByToken(token, function (result) {

            if (sqlHelper.isSqlResultOk(result) && !sqlHelper.isSqlResultEmpty(result)) {
                let userId = result[0]['user_id'];
                resolve(userId);
            } else {
                handleInvalidResult(res, null);
                return reject();
            }
        })

    }).then(function(userId) {
        // according to auction_id and auction_
        let auction_title = req.body.title.toString();
        let auction_categoryid = parseInt(req.body.categoryId);
        let auction_description = req.body.description.toString();
        let auction_startingdate = req.body.startDateTime.toString();
        let auction_endingdate = req.body.endDateTime.toString();
        let auction_reserveprice = parseFloat(req.body.reservePrice);

        let fields = new Array();
        let values = new Array();



        if (auction_title != "" && auction_title != undefined) {
            fields.push('auction_title');
            values.push(auction_title);
        }

        if (auction_categoryid != "" && auction_categoryid != undefined) {
            fields.push('auction_categoryid');
            values.push(auction_categoryid);
        }

        if (auction_description != "" && auction_description != undefined) {
            fields.push('auction_description');
            values.push(auction_description);
        }

        if (auction_startingdate != "" && auction_startingdate != undefined) {
            fields.push('auction_startingdate');
            values.push(auction_startingdate);
        }

        if (auction_endingdate != "" && auction_endingdate != undefined) {
            fields.push('auction_endingdate');
            values.push(auction_endingdate);
        }

        if (auction_reserveprice != "" && auction_reserveprice != undefined) {
            fields.push('auction_reserveprice');
            values.push(auction_reserveprice);
        }


        Auction.alter(auctionId, userId, fields, values, function (result) {
            if (sqlHelper.isSqlResultValid(result)) {
                res.status(201);
                res.send('');
            } else {
                handleInvalidResult(res, result);
            }
        });

    }).catch(function (err) {
        res.status(400);
        res.send('Bad request');
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
                            // handleInvalidResult(res, null);
                            return res.sendStatus(401);
                            // reject();
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
        return res.status(500).send('Internal server error');
    } else if (sqlHelper.isSqlResultEmpty(result)) {
        return res.status(404).send('Not found');
    } else {
        return res.status(500).send('Internal server error');
    }
}



