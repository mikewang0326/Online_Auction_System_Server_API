const db = require('./config/db');
const express = require('./config/express');

const app = express();

// Connect to Mysql on start
db.connect(function (err) {
    if (err) {
        console.log('Unable to connect to MYSQL');
        process.exit(1);
    } else {
        app.listen(3000, function () {
            console.log('Listening on port: ' + 3000);
        })
    }
})
