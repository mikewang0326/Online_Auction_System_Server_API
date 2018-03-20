const sqlHelper = require('../utils/sql.helper');
exports.createListData = function (result) {
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

    return data
}


exports.creatOneAuctionData = function (result1, result2) {
    let data = exports.createOneBasicAuctionData(result1);

    if (sqlHelper.isSqlResultValid(result2)) {
        let bids = exports.createAuctionBidsData(result2);
        data['bids'] = bids;
        data['startingBid'] = result2[bids.length - 1]['bid_id'];
        data['currentBid'] = result2[0]['bid_id'];
    }

    return data;
}

exports.createOneBasicAuctionData = function (result) {
    let item = {
        'categoryId': result[0]['auction_categoryid'],
        'categoryTitle': result[0]['auction_title'],
        'title': result[0]['auction_description'],
        'reservePrice': result[0]['auction_reserveprice'],
        'startDateTime': result[0]['auction_startingdate'],
        'endDateTime': result[0]['auction_endingdate'],
        'description': result[0]['auction_description'],
        'creationDateTime': result[0]['auction_creationdate'],
        'startingBid': 0,
        'currentBid': 1,
        'seller': {
            'id': result[0]['auction_userid'],
            'username': result[0]['user_username']
        },
        'bids': []
    }
    return item;
}

exports.createAuctionBidsData = function (result) {
    let data = Array();
    let length = result.length;
    for (let i=0; i< length; i++) {
        let item = {
            'amount':result[i]['bid_amount'],
            'datetime':result[i]['bid_datetime'],
            'buyerId':result[i]['bid_userid'],
            'buyerUsername':result[i]['user_username'],
        }

        data.push(item);
    }

    return data
}