const auctionUsers = require('../controllers/auction_user.server.controller');
const auth = require('../../config/middleware');

module.exports = function (app) {
    app.route('/api/v1/users')
        // Create user
        .post(auctionUsers.create);

    app.route('/api/v1/users/login')
        // Log in user by username or email
        .post(auctionUsers.login);

    app.route('/api/v1/users/logout')
        // Log out user session given by auth token in head
        .post(auctionUsers.logout);

    app.route('/api/v1/users/:userId')
        // Get user by user id
        .get(auctionUsers.read)
        // Change some selected information for a user
        .post(auctionUsers.update);
};