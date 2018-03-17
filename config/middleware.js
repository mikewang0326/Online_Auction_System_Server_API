const auctionUser = require('../app/models/auction_user.server.model')

const isAuthenticated = (req, res, next) => {
    let token = req.get("authToken");
    auctionUser.getUserIdByToken(token, function (result) {
        if (result != null && result != undefined && result.length > 0 && result[0]['user_id'] != "") {
            next();
        } else {
            res.sendStatus(401);
        }

    })
}

module.exports = {
    isAuthenticated:isAuthenticated
}