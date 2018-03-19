const Auction = require('../models/auction.server.model');
const sqlHelper = require('../utils/sql.helper');

exports.list = function (req, res) {
    let sql = sqlHelper.getAuctionSearchSqlFromRequest(req);

    new Promise(function(resolve, reject) {

        Auction.getListBySql(sql, function (result) {
            if (sqlHelper.isSqlResultValid(result)) {
                return resolve(result);
            } else {
                handleInvalidResult(res, result);
                reject();
            }

        })

    }).then(function(result) {
        // get currentBid select bid_id, bid_datetime from bid where bid_auctionid = 3 order by bid_datetime desc limit 1;

        // 1, get all auctionid

        // 2, search latest bid

        // 3, combine data

        let data = Array();

        let length = result.length;

        for (let i=0; i< length; i++) {
            let item = {
                'id':result[i]['auction_id'],
                'categoryTitle':result[i]['auction_title'],
                'categoryId':result[i]['auction_categoryid'],
                'title':result[i]['auction_description'],
                'reservePrice':result[i]['auction_reserveprice'],
                'startDateTime':result[i]['auction_startingdate'],
                'endDateTime':result[i]['auction_endingdate'],
                'currentBid':'3'
            }

            data.push(item);
        }

        res.status(200);
        res.json(data);

        }).catch(function (err) {
        // 200 ok
        // 400 bad request
        // 404 not found
        // 500 inner error
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
    Auction.getOne(auctionId, function (result) {
        res.status(200).json(result);
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


