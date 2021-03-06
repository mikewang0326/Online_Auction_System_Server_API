const photo = require('../controllers/photo.server.controller');
const auth = require('../../config/middleware');

module.exports = function (app) {
    app.route('/api/v1/auctions/:auctionId/photos')
        // Get auction photo
        .get(photo.read)
        .post(auth.isAuthenticated, photo.create)
        .delete(auth.isAuthenticated, photo.delete);
};