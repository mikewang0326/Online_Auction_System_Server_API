let crypto = require('crypto');

exports.createUserSalt = function () {
    return 'usersalt';
}

exports.createCryptoPassword = function (orginalPassord, salt) {
    let cryptoPassword = ''.concat(orginalPassord).concat(salt);
    return cryptoPassword;
}

exports.createUserToken = function (id) {
    let md5 = crypto.createHash('md5');
    let token = md5.update(id.toString()).digest('hex');
    console.log('createUserToken token : ' + token);
    return token;
}



