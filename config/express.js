const express = require('express');
const bodyParser = require('body-parser');

module.exports = function () {
    const app = express();

    app.use(bodyParser.json());

    require('../app/routes/auction_users.server.routes.js')(app);

    require('../app/routes/auctions.server.routes.js')(app);

    require('../app/routes/database.server.routes.js')(app);

    require('../app/routes/photos.server.routes.js')(app);

    return app;
}

