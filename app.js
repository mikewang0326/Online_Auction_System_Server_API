const db = require('./config/db');
const express = require('./config/express');;

const app = express();

// Connect to Mysql on start
db.connect(function (err) {
    if (err) {
        console.log('Unable to connect to MYSQL');
        process.exit(1);
    } else {
        // 4941 3000
        app.listen(4941, function () {
            console.log('Listening on port: ' + 4941);
        })
    }
})
