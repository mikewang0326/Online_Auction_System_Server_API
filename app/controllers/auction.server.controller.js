const Auction = require('../models/auction.server.model');

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


