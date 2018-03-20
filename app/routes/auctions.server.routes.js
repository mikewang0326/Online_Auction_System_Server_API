const auction = require('../controllers/auction.server.controller')
const auth = require('../../config/middleware');

module.exports = function (app) {

    app.route('/api/v1/auctions')
         // View auctions, sorted from most recent to least recent
        .get(auction.list)

        // Create auction
        .post(auth.isAuthenticated, auction.create);


    app.route('/api/v1/auctions/:auctionId')
        // View auction details
        .get(auction.read)

        // Change some selected information for an Auction
        .patch(auth.isAuthenticated, auction.update);


    app.route('/api/v1/auctions/:auctionId/bids')
        // View bid historys
        .get(auction.getBidHistory)

        // Make bid on auction
        .post(auth.isAuthenticated, auction.makeBid);

    //TODO 参数校验
};