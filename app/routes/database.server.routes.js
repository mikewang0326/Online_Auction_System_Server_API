const database = require('../controllers/database.server.controller')

module.exports = function (app) {

    app.route('/api/v1/reset')
         // Force reset of database to original structure
        .post(database.reset);


    app.route('/api/v1/resample')
        // Reload sample of data into reset database
        .post(database.resample);





};