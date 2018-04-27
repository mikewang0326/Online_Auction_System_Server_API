const auctionUsers = require('../controllers/auction_user.server.controller');
const auth = require('../../config/middleware');

module.exports = function (app) {

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
        next();

    });

    app.route('/api/v1/users')
        // Get all users
        .get(auctionUsers.getAll)
        // Create user
        .post(auctionUsers.create);

    app.route('/api/v1/users/login')
        // Log in user by username or email
        .post(auctionUsers.login);

    app.route('/api/v1/users/logout')
        // Log out user session given by auth token in head
        .post(auth.isAuthenticated, auctionUsers.logout);

    app.route('/api/v1/users/:userId')
        // Get user by user id
        .get(auth.isAuthenticated, auctionUsers.read)
        // Change some selected information for a user
        .patch(auth.isAuthenticated, auctionUsers.update)
        // Delete one
        .delete(auctionUsers.delete);

};