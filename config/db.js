const mysql = require('mysql')

let state = {
  pool:null  
};

exports.connect = function (done) {
    state.pool = mysql.createPool({
        host:'mysql3.csse.canterbury.ac.nz',
        user:'xwa118',
        password:'54890169',
        database:'xwa118'
    });
    done();
}

exports.get_pool = function () {
    return state.pool;
}
